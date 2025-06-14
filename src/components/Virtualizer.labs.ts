import {
	html,
	nothing,
	ReactiveController,
	ReactiveControllerHost,
	TemplateResult,
} from "lit";
import { createRef, ref, Ref } from "lit/directives/ref.js";
import { styleMap } from "lit/directives/style-map.js";

// Add style type definition
type StyleInfo = { [key: string]: string | number | null | undefined };

// Type assertion for SSR
const isSSR = typeof window === "undefined";

// 修改生成器类型定义，确保类型兼容性
export type ItemsSource<T> = T[];

export interface VirtualizerConfig<T> {
	items: ItemsSource<T>;
	keyFunction?: (index: number) => string | number;
	itemSize?: number | ((index: number) => number);
	layout?: "vertical" | "horizontal";
	padding?: number;
	preloadCount?: number;
	cacheSize?: number;
	renderItem?: (item: T, index: number) => TemplateResult<1>;
	pageSize?: number;
	fetchMoreThreshold?: number;
	onLoadMore?: () => Promise<void>; // 添加分页加载回调
}

const BLOCK_SIZE = 100;

interface BlockMetrics {
	start: number;
	end: number;
	total: number;
}

class CircularBuffer<T> {
	private buffer: Array<T | undefined>;
	private readonly _capacity: number;

	constructor(capacity: number) {
		this._capacity = capacity;
		this.buffer = new Array(capacity);
	}

	set(index: number, value: T): void {
		this.buffer[index % this._capacity] = value;
	}

	get(index: number): T | undefined {
		return this.buffer[index % this._capacity];
	}

	clear(): void {
		this.buffer.fill(undefined);
	}

	get capacity(): number {
		return this._capacity;
	}
}

class BlockStore {
	data: Float64Array = new Float64Array();

	set(index: number, metrics: BlockMetrics) {
		const i = index * 3;
		this.data[i] = metrics.start;
		this.data[i + 1] = metrics.end;
		this.data[i + 2] = metrics.total;
	}

	get(index: number): BlockMetrics {
		const i = index * 3;
		if (i < 0 || i + 2 >= this.data.length) {
			return { start: 0, end: 0, total: 0 };
		}
		return {
			start: this.data[i],
			end: this.data[i + 1],
			total: this.data[i + 2],
		};
	}

	initialize(length: number) {
		this.data = new Float64Array(Math.ceil(length / BLOCK_SIZE) * 3);
		this.data.fill(0);
	}
}

// --- VirtualizerController ---
export class VirtualizerController<T> implements ReactiveController {
	host: ReactiveControllerHost;

	private _items: T[] = [];
	private _itemSize: number | ((index: number) => number) = 50;
	private _layout: "vertical" | "horizontal" = "vertical";
	private _preloadCount: number = 5;
	private _cacheSize: number = 200;
	private _renderItem: (item: T, index: number) => TemplateResult<1> = () =>
		html``;

	private _containerRef: Ref<HTMLElement> = createRef();

	private _firstVisible: number = 0;
	private _lastVisible: number = 0;

	private _positionCache: Float64Array = new Float64Array();
	private _sizeCache: Float32Array = new Float32Array();
	private _cacheInitialized: boolean = false;
	private _totalContentSize: number = 0;

	private _templateBuffer: CircularBuffer<TemplateResult>;
	private _blockStore: BlockStore = new BlockStore();

	private _recycledNodes: HTMLElement[] = [];
	private readonly RECYCLE_POOL_SIZE = 20;
	private _intersectionObserver?: IntersectionObserver;
	private _mutationObserver?: MutationObserver;
	private _idleCallbackId?: number;
	private _preRenderChunkSize = 5;

	private readonly CHUNK_SIZE = 1000; // 每个分块的大小
	private _chunks: Map<number, T[]> = new Map();
	private _resizeObserver?: ResizeObserver;
	private _visibleChunkIndexes: Set<number> = new Set();
	private _loadedChunks: Set<number> = new Set();
	private _estimatedItemHeight: number = 0;

	private _isLoading = false;
	private _hasMore = false;

	private _pageSize: number = 50;
	private _fetchMoreThreshold: number = 0.8;

	private _onLoadMore?: () => Promise<void>;

	constructor(
		host: ReactiveControllerHost,
		initialConfig: VirtualizerConfig<T>,
		initialRenderItem: (item: T, index: number) => TemplateResult<1>
	) {
		this.host = host;
		host.addController(this);

		this.updateConfig(initialConfig, initialRenderItem);
		this._templateBuffer = new CircularBuffer(this._cacheSize);

		this._pageSize = initialConfig.pageSize ?? 50;
		this._fetchMoreThreshold = initialConfig.fetchMoreThreshold ?? 0.8;

		if (!isSSR) {
			this._setupObservers();
			this._setupResizeObserver();
			this._initializeChunks();
		}
	}

	private _initializeItems(items: ItemsSource<T>): void {
		this._items = [...items];
		this._calculateMetrics();
		this._initializeChunks();
		this.host.requestUpdate();
	}

	private _updateMetricsForRange(start: number, end: number): void {
		// 扩展数组缓存如果需要
		if (end > this._positionCache.length) {
			const newPositionCache = new Float64Array(Math.max(end * 1.5, 1000));
			newPositionCache.set(this._positionCache);
			this._positionCache = newPositionCache;

			const newSizeCache = new Float32Array(Math.max(end * 1.5, 1000));
			newSizeCache.set(this._sizeCache);
			this._sizeCache = newSizeCache;
		}

		let offset =
			start === 0
				? 0
				: this._positionCache[start - 1] + this._sizeCache[start - 1];
		for (let i = start; i < end; i++) {
			const size = this._getItemSize(i);
			this._positionCache[i] = offset;
			this._sizeCache[i] = size;
			offset += size;
		}

		this._totalContentSize = offset;
		this._updateChunkMetrics();
	}

	private _setupObservers(): void {
		// 监视可见性变化
		this._intersectionObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						this._preRenderChunk();
					}
				});
			},
			{ rootMargin: "50%" }
		);

		// 监视DOM变化以回收节点
		this._mutationObserver = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				mutation.removedNodes.forEach((node) => {
					if (
						node instanceof HTMLElement &&
						this._recycledNodes.length < this.RECYCLE_POOL_SIZE
					) {
						this._recycledNodes.push(node);
					}
				});
			});
		});
	}

	private _setupResizeObserver(): void {
		this._resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				if (entry.target instanceof HTMLElement) {
					const height = entry.contentRect.height;
					if (height > 0) {
						this._estimatedItemHeight = height;
						this._updateChunkMetrics();
					}
				}
			}
		});
	}

	private _initializeChunks(): void {
		this._chunks.clear();
		const totalChunks = Math.ceil(this._items.length / this.CHUNK_SIZE);

		// 只初始化元数据，不实际加载数据
		for (let i = 0; i < totalChunks; i++) {
			const start = i * this.CHUNK_SIZE;
			const end = Math.min(start + this.CHUNK_SIZE, this._items.length);
			this._chunks.set(i, this._items.slice(start, end));
		}
	}

	private _updateChunkMetrics(): void {
		if (!this._containerRef.value) return;

		const viewportHeight = this._containerRef.value.clientHeight;
		const estimatedTotalHeight = this._items.length * this._estimatedItemHeight;

		// 更新块的位置信息
		this._blockStore.initialize(
			Math.ceil(this._items.length / this.CHUNK_SIZE)
		);

		let offset = 0;
		for (let i = 0; i < this._chunks.size; i++) {
			const chunkSize = Math.min(
				this.CHUNK_SIZE,
				this._items.length - i * this.CHUNK_SIZE
			);
			const chunkHeight = chunkSize * this._estimatedItemHeight;

			this._blockStore.set(i, {
				start: offset,
				end: offset + chunkHeight,
				total: chunkHeight,
			});

			offset += chunkHeight;
		}

		this._totalContentSize = estimatedTotalHeight;
		this._calculateVisibleChunks();
	}

	private _calculateVisibleChunks(): void {
		if (!this._containerRef.value) return;

		const scrollTop = this._containerRef.value.scrollTop;
		const viewportHeight = this._containerRef.value.clientHeight;

		// 计算可见块的索引范围
		const startChunkIndex = Math.floor(
			scrollTop / (this.CHUNK_SIZE * this._estimatedItemHeight)
		);
		const endChunkIndex = Math.ceil(
			(scrollTop + viewportHeight) /
				(this.CHUNK_SIZE * this._estimatedItemHeight)
		);

		// 更新可见块集合
		this._visibleChunkIndexes.clear();
		for (let i = startChunkIndex; i <= endChunkIndex; i++) {
			if (this._chunks.has(i)) {
				this._visibleChunkIndexes.add(i);
			}
		}

		// 预加载相邻块
		this._preloadAdjacentChunks(startChunkIndex - 1, endChunkIndex + 1);
	}

	private _preloadAdjacentChunks(start: number, end: number): void {
		for (let i = start; i <= end; i++) {
			if (i >= 0 && i < this._chunks.size && !this._loadedChunks.has(i)) {
				requestIdleCallback(() => {
					this._loadChunk(i);
				});
			}
		}
	}

	private _loadChunk(index: number): void {
		if (this._loadedChunks.has(index)) return;

		const start = index * this.CHUNK_SIZE;
		const end = Math.min(start + this.CHUNK_SIZE, this._items.length);
		const items = this._items.slice(start, end);

		this._chunks.set(index, items);
		this._loadedChunks.add(index);
		this._calculateMetricsForChunk(index);
	}

	private _calculateMetricsForChunk(chunkIndex: number): void {
		const start = chunkIndex * this.CHUNK_SIZE;
		const items = this._chunks.get(chunkIndex) || [];

		let offset = start * this._estimatedItemHeight;
		for (let i = 0; i < items.length; i++) {
			const index = start + i;
			this._positionCache[index] = offset;
			this._sizeCache[index] = this._estimatedItemHeight;
			offset += this._estimatedItemHeight;
		}
	}

	private _preRenderChunk(): void {
		if (this._idleCallbackId) {
			cancelIdleCallback(this._idleCallbackId);
		}

		this._idleCallbackId = requestIdleCallback((deadline) => {
			let index = this._lastVisible + 1;
			let count = 0;

			while (
				deadline.timeRemaining() > 0 &&
				count < this._preRenderChunkSize &&
				index < this._items.length
			) {
				this._prerenderItem(index);
				index++;
				count++;
			}

			if (index < this._items.length) {
				this._preRenderChunk();
			}
		});
	}

	private _prerenderItem(index: number): void {
		const cacheKey = index % this._cacheSize;
		if (!this._templateBuffer.get(cacheKey)) {
			const itemOffset = this._positionCache[index];
			const itemHeightWidth = this._sizeCache[index];

			if (itemOffset !== undefined && itemHeightWidth !== undefined) {
				const style: StyleInfo = this._getItemStyle(
					itemOffset,
					itemHeightWidth
				);
				const result = this._createItemTemplate(
					this._items[index],
					index,
					style
				);
				this._templateBuffer.set(cacheKey, result);
			}
		}
	}

	private _getItemStyle(offset: number, size: number): StyleInfo {
		const isVertical = this._layout === "vertical";
		return {
			position: "absolute",
			[isVertical ? "top" : "left"]: `${offset}px`,
			[isVertical ? "height" : "width"]: `${size}px`,
			width: isVertical ? "100%" : "auto",
			height: isVertical ? "auto" : "100%",
			willChange: "transform",
			contain: "content",
			backfaceVisibility: "hidden",
			WebkitFontSmoothing: "subpixel-antialiased",
		};
	}

	private _createItemTemplate(
		item: T,
		index: number,
		style: StyleInfo
	): TemplateResult<1> {
		let recycledNode = this._recycledNodes.pop();
		const key = `item-${index}`;

		return html`
			${recycledNode
				? html`<div
						.key=${key}
						style=${styleMap(style)}
						data-index=${index}
						.recycled=${recycledNode}
				  >
						${this._renderItem(item, index)}
				  </div>`
				: html`<div .key=${key} style=${styleMap(style)} data-index=${index}>
						${this._renderItem(item, index)}
				  </div>`}
		`;
	}

	hostConnected() {
		if (!isSSR) {
			this.host.updateComplete.then(() => {
				if (this._containerRef.value) {
					this._containerRef.value.addEventListener(
						"scroll",
						this._scheduleUpdate
					);
					this._calculateMetrics();
					this._updateVisibleRange();
					this.host.requestUpdate();
				}
			});
		}

		if (!isSSR && this._containerRef.value) {
			this._intersectionObserver?.observe(this._containerRef.value);
			this._mutationObserver?.observe(this._containerRef.value, {
				childList: true,
				subtree: true,
				attributes: true,
			});
			this._resizeObserver?.observe(this._containerRef.value);
		}
	}

	hostDisconnected() {
		if (!isSSR && this._containerRef.value) {
			this._containerRef.value.removeEventListener(
				"scroll",
				this._scheduleUpdate
			);
		}

		this._intersectionObserver?.disconnect();
		this._mutationObserver?.disconnect();
		this._resizeObserver?.disconnect();
		if (this._idleCallbackId) {
			cancelIdleCallback(this._idleCallbackId);
		}
	}

	hostUpdated() {
		if (
			!isSSR &&
			!this._cacheInitialized &&
			this._containerRef.value &&
			this._items.length > 0
		) {
			this._calculateMetrics();
			this._updateVisibleRange();
			this.host.requestUpdate();
		}
	}

	public async updateConfig(
		newConfig: VirtualizerConfig<T>,
		newRenderItem: (item: T, index: number) => TemplateResult<1>
	): Promise<void> {
		const oldItemSize = this._itemSize;
		const oldCacheSize = this._cacheSize;

		this._itemSize = newConfig.itemSize ?? 50;
		this._layout = newConfig.layout ?? "vertical";
		this._preloadCount = newConfig.preloadCount ?? 5;
		this._cacheSize = newConfig.cacheSize ?? 200;
		this._renderItem = newRenderItem;
		this._onLoadMore = newConfig.onLoadMore;

		// 处理 items 的更新
		if ("items" in newConfig) {
			this._initializeItems(newConfig.items);
		}

		this._pageSize = newConfig.pageSize ?? this._pageSize;
		this._fetchMoreThreshold =
			newConfig.fetchMoreThreshold ?? this._fetchMoreThreshold;

		if (oldCacheSize !== this._cacheSize) {
			this._templateBuffer = new CircularBuffer(this._cacheSize);
		}

		if (oldItemSize !== this._itemSize) {
			this._calculateMetrics();
			this._initializeChunks();
		}

		if (!isSSR) {
			this._updateVisibleRange();
		}
		this.host.requestUpdate();
	}

	private async _checkAndLoadMore(): Promise<void> {
		if (!this._onLoadMore || this._isLoading || !this._containerRef.value)
			return;

		// 获取最后一个可见元素的索引
		const lastVisibleIndex = this._lastVisible;

		// 计算页大小
		const pageSize = this._pageSize || 1000;

		// 检查最后一个可见元素是否是当前页的最后一个元素
		// 使用Math.floor确保在页的边界上正确触发
		const isLastItemOfPage = (lastVisibleIndex + 1) % pageSize === 0;

		if (isLastItemOfPage) {
			console.log("Reached end of page, loading more...", {
				lastVisibleIndex,
				pageSize,
				totalItems: this._items.length,
			});

			this._isLoading = true;
			try {
				await this._onLoadMore();
			} finally {
				this._isLoading = false;
			}
		}
	}

	private _getItemSize = (index: number): number => {
		return typeof this._itemSize === "function"
			? this._itemSize(index)
			: this._itemSize;
	};

	private _calculateMetrics = (): void => {
		if (this._items.length === 0) {
			this._positionCache = new Float64Array();
			this._sizeCache = new Float32Array();
			this._blockStore.initialize(0);
			this._totalContentSize = 0;
			this._cacheInitialized = true;
			this._templateBuffer.clear();
			return;
		}

		this._positionCache = new Float64Array(this._items.length);
		this._sizeCache = new Float32Array(this._items.length);
		this._blockStore.initialize(this._items.length);

		let offset = 0;
		let currentBlockStart = 0;
		let currentBlockTotal = 0;

		for (let i = 0; i < this._items.length; i++) {
			const size = this._getItemSize(i);
			this._positionCache[i] = offset;
			this._sizeCache[i] = size;

			currentBlockTotal += size;

			if ((i + 1) % BLOCK_SIZE === 0 || i === this._items.length - 1) {
				const blockIndex = Math.floor(i / BLOCK_SIZE);
				this._blockStore.set(blockIndex, {
					start: currentBlockStart,
					end: offset + size,
					total: currentBlockTotal,
				});
				currentBlockStart = offset + size;
				currentBlockTotal = 0;
			}

			offset += size;
		}
		this._totalContentSize = offset;
		this._cacheInitialized = true;
		this._templateBuffer.clear();
	};

	private _findItemIndexByOffset = (offset: number): number => {
		if (!this._cacheInitialized || this._items.length === 0) {
			return 0;
		}

		let low = 0;
		let high = this._items.length - 1;
		let resultIndex = 0;

		while (low <= high) {
			const mid = Math.floor((low + high) / 2);
			if (this._positionCache[mid] <= offset) {
				resultIndex = mid;
				low = mid + 1;
			} else {
				high = mid - 1;
			}
		}
		return resultIndex;
	};

	private _updateVisibleRange = (): void => {
		if (!this._containerRef.value) return;

		const isVertical = this._layout === "vertical";
		const scrollPosition = isVertical
			? this._containerRef.value.scrollTop
			: this._containerRef.value.scrollLeft;

		const viewportSize = isVertical
			? this._containerRef.value.clientHeight
			: this._containerRef.value.clientWidth;

		this._firstVisible = Math.floor(scrollPosition / this._estimatedItemHeight);
		this._lastVisible = Math.ceil(
			(scrollPosition + viewportSize) / this._estimatedItemHeight
		);

		// 检查是否需要加载更多数据
		this._checkAndLoadMore();

		this.host.requestUpdate();
	};

	public getRenderedItems(): TemplateResult[] {
		if (!this._renderItem) return [];

		const items: TemplateResult[] = [];
		const renderSet = new Set<number>();

		// 只渲染可见块中的项
		for (const chunkIndex of this._visibleChunkIndexes) {
			const chunk = this._chunks.get(chunkIndex);
			if (!chunk) continue;

			const start = chunkIndex * this.CHUNK_SIZE;
			chunk.forEach((_item, offset) => {
				const index = start + offset;
				if (index >= this._firstVisible && index <= this._lastVisible) {
					renderSet.add(index);
				}
			});
		}

		// 按顺序渲染可见项
		Array.from(renderSet)
			.sort((a, b) => a - b)
			.forEach((index) => {
				const style = this._getItemStyle(
					this._positionCache[index] || index * this._estimatedItemHeight,
					this._sizeCache[index] || this._estimatedItemHeight
				);
				items.push(this._createItemTemplate(this._items[index], index, style));
			});

		return items;
	}

	private _ticking = false;
	private _lastUpdate = 0;
	private readonly FRAME_BUDGET = 16;

	private _scheduleUpdate = async (): Promise<void> => {
		if (this._ticking) return;

		const now = performance.now();
		const timeSinceLastUpdate = now - this._lastUpdate;

		if (timeSinceLastUpdate >= this.FRAME_BUDGET) {
			this._ticking = true;
			requestAnimationFrame(() => {
				this._updateVisibleRange();
				this._ticking = false;
				this._lastUpdate = performance.now();
			});
		}
	};

	public getContainerRef(): Ref<HTMLElement> {
		return this._containerRef;
	}

	public getTotalContentSize(): number {
		return this._totalContentSize;
	}

	public getLayout(): "vertical" | "horizontal" {
		return this._layout;
	}
}

// Global WeakMap to store controllers, associated with their host element.
// This is essential for the functional component to retrieve the correct controller.
const virtualizerControllers = new WeakMap<
	ReactiveControllerHost,
	VirtualizerController<any>
>();

// 改进宿主检测机制
const getCurrentHost = (): ReactiveControllerHost | null => {
	if (isSSR) return null;

	try {
		// 尝试从 Lit 内部获取当前渲染上下文
		const renderingElement = document.currentScript as any;
		if (renderingElement && "_$litElement$" in renderingElement) {
			return renderingElement._$litElement$ as ReactiveControllerHost;
		}
		// 尝试从自定义元素获取
		if (customElements && window.customElements) {
			const current = document.querySelector("virtualizer-example");
			if (current && "_$litElement$" in current) {
				return (current as any)._$litElement$ as ReactiveControllerHost;
			}
		}
	} catch (e) {
		console.warn("Failed to get Lit host:", e);
	}
	return null;
};

// 类型保护函数
function isValidHost(
	host: ReactiveControllerHost | null
): host is ReactiveControllerHost {
	return host !== null && typeof host.addController === "function";
}

// --- The Functional Virtualizer Component (with Currying) ---

// Overload 1: For curried usage (Virtualizer(config)(renderItem))
export function Virtualizer<T>(
	config: Omit<VirtualizerConfig<T>, "renderItem">
): (
	renderItem: (item: T, index: number) => TemplateResult<1> // renderItem is required in the second call
) => TemplateResult<1>;

export function Virtualizer<T>(config: VirtualizerConfig<T>): TemplateResult<1>;

// Overload 2: For direct usage (Virtualizer(config, renderItem))
export function Virtualizer<T>(
	config: VirtualizerConfig<T>,
	renderItem: (item: T, index: number) => TemplateResult<1>
): TemplateResult<1>;

// Implementation of the overloaded function
export function Virtualizer<T>(
	config: VirtualizerConfig<T>,
	renderItemOrUndefined?: (item: T, index: number) => TemplateResult<1>
):
	| TemplateResult<1>
	| ((
			renderItem: (item: T, index: number) => TemplateResult<1>
	  ) => TemplateResult<1>) {
	// 获取宿主并验证
	const host = getCurrentHost() as ReactiveControllerHost;

	// 修改降级渲染模式的实现
	if (!isValidHost(host)) {
		console.warn("Virtualizer: Running in fallback mode");
		const actualRenderItem =
			renderItemOrUndefined ||
			config.renderItem ||
			((item: T) => html`${String(item)}`);

		const items = config.items;

		// 降级渲染模板
		return html`
			<div style="overflow: auto; height: 100%; position: relative;">
				<div style="position: relative;">
					${items.map((item: T, index: number) =>
						actualRenderItem(item, index)
					)}
				</div>
			</div>
		`;
	}

	// 获取或创建控制器
	let controller = virtualizerControllers.get(host);
	if (!controller) {
		const initialRenderItem =
			renderItemOrUndefined ||
			config.renderItem ||
			((item: T) => html`${item}`);
		controller = new VirtualizerController(host, config, initialRenderItem);
		virtualizerControllers.set(host, controller);
	}

	// This is the function that will actually render the virtualizer template
	const renderVirtualizerTemplate = (
		actualRenderItem: (item: T, index: number) => TemplateResult<1>
	): TemplateResult<1> => {
		// Update controller's config with the latest values (including the passed renderItem)
		controller.updateConfig(config, actualRenderItem);

		const containerStyle: StyleInfo = {
			position: "relative",
			overflow: isSSR ? "visible" : "auto",
			[controller.getLayout() === "vertical" ? "height" : "width"]: "100%",
			[controller.getLayout() === "vertical" ? "minHeight" : "minWidth"]: "1px",
		};

		const contentStyle: StyleInfo = {
			position: "relative",
			[controller.getLayout() === "vertical"
				? "height"
				: "width"]: `${controller.getTotalContentSize()}px`,
			transform:
				controller.getLayout() === "vertical"
					? "translateY(0)"
					: "translateX(0)",
		};

		return html`
			<div
				${ref(controller.getContainerRef())}
				style=${styleMap(containerStyle)}
				@scroll=${isSSR ? nothing : () => controller.host.requestUpdate()}
			>
				<div style=${styleMap(contentStyle)}>
					${controller.getRenderedItems()}
				</div>
			</div>
		`;
	};

	// --- Handle the two overloaded function signatures ---
	if (renderItemOrUndefined === undefined) {
		if ("renderItem" in config) {
			return renderVirtualizerTemplate(config.renderItem as any);
		} else {
			return (renderItem: (item: T, index: number) => TemplateResult<1>) => {
				return renderVirtualizerTemplate(renderItem);
			};
		}
	} else {
		return renderVirtualizerTemplate(renderItemOrUndefined);
	}
}
