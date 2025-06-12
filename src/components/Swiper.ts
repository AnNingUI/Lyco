import { html, TemplateResult } from "lit";
import { getRandomClassName } from "./core";

type ScrollDirection = "x" | "y" | "both";
type ScrollBehavior = "auto" | "smooth";
type Alignment = "start" | "center" | "end" | "none";
type NavigationButtonPosition = "inside" | "outside" | "none";
type PaginationType = "dots" | "bullets" | "fraction" | "progressbar" | "none";

export interface SwiperProps {
	gap?: string | number;
	snapType?: "mandatory" | "proximity";
	height?: string;
	width?: string;
	className?: string;
	direction?: ScrollDirection;
	scrollBehavior?: ScrollBehavior;
	align?: Alignment;
	showNavigation?: boolean;
	navigationPosition?: NavigationButtonPosition;
	showPagination?: boolean;
	paginationType?: PaginationType;
	autoPlay?: boolean;
	interval?: number;
	loop?: boolean;
	touchEnabled?: boolean;
	mouseWheel?: boolean;
	onSlideChange?: (index: number) => void;
}

// 支持柯里化调用
export function Swiper(
	props?: SwiperProps
): (
	slides?: TemplateResult<1>[] | (() => TemplateResult<1>[])
) => TemplateResult<1>;

export function Swiper(
	props?: SwiperProps,
	slides?: TemplateResult<1>[] | (() => TemplateResult<1>[])
): TemplateResult<1>;

export function Swiper(
	props: SwiperProps = {},
	slides?: TemplateResult<1>[] | (() => TemplateResult<1>[])
):
	| ((
			slides?: TemplateResult<1>[] | (() => TemplateResult<1>[])
	  ) => TemplateResult<1>)
	| TemplateResult {
	// 如果没有传 slides，就返回一个“部分应用”的函数
	if (slides === undefined) {
		return (slides?: TemplateResult<1>[] | (() => TemplateResult<1>[])) =>
			Swiper(props, slides ?? [html``]);
	}

	// 解构 props，并设置默认值
	const {
		gap = "8px",
		snapType = "mandatory",
		height = "auto",
		width = "100%",
		className = getRandomClassName("Swiper::swiper"),
		direction = "x",
		scrollBehavior = "smooth",
		align = "start",
		showNavigation = true,
		navigationPosition = "inside",
		showPagination = true,
		paginationType = "dots",
		autoPlay = false,
		interval = 3000,
		loop = false,
		touchEnabled = true,
		mouseWheel = false,
		onSlideChange,
	} = props;

	const _className = className;
	const _containerClassName = _className + "-container";
	const _slideClassName = _className + "-slide";
	const _navigationClassName = _className + "-navigation";
	const _paginationClassName = _className + "-pagination";

	// 将 slides 规范成数组
	let _slides: TemplateResult<1>[];
	if (!slides) _slides = [];
	else if (typeof slides === "function") _slides = slides();
	else _slides = slides;

	const slideCount = _slides.length;

	// 内部状态：当前索引
	const [currentSlide, setCurrentSlide] = (() => {
		const state = { value: 0 };
		return [
			() => state.value,
			(index: number) => {
				const newIndex = Math.max(0, Math.min(index, slideCount - 1));
				if (state.value !== newIndex) {
					state.value = newIndex;
					onSlideChange?.(newIndex);
				}
			},
		];
	})();

	// 滚动到指定 slide
	const scrollToSlide = (index: number) => {
		const container =
			typeof document !== "undefined"
				? (document.querySelector(
						`.${_containerClassName}`
				  ) as HTMLElement | null)
				: null;
		if (!container) return;

		const slides = container.querySelectorAll(`.${_slideClassName}`);
		if (index < 0 || index >= slides.length) return;

		const slide = slides[index] as HTMLElement;
		const slideRect = slide.getBoundingClientRect();
		const containerRect = container.getBoundingClientRect();

		let scrollOffset: number;
		if (direction === "x") {
			scrollOffset = slide.offsetLeft - container.offsetLeft;
			if (align === "center") {
				scrollOffset -= (containerRect.width - slideRect.width) / 2;
			} else if (align === "end") {
				scrollOffset -= containerRect.width - slideRect.width;
			}
			container.scrollTo({ left: scrollOffset, behavior: scrollBehavior });
		} else {
			scrollOffset = slide.offsetTop - container.offsetTop;
			if (align === "center") {
				scrollOffset -= (containerRect.height - slideRect.height) / 2;
			} else if (align === "end") {
				scrollOffset -= containerRect.height - slideRect.height;
			}
			container.scrollTo({ top: scrollOffset, behavior: scrollBehavior });
		}

		setCurrentSlide(index);
	};

	// 下一页／上一页
	const nextSlide = () => {
		const nextIndex =
			currentSlide() + 1 >= slideCount
				? loop
					? 0
					: currentSlide()
				: currentSlide() + 1;
		scrollToSlide(nextIndex);
	};
	const prevSlide = () => {
		const prevIndex =
			currentSlide() - 1 < 0
				? loop
					? slideCount - 1
					: currentSlide()
				: currentSlide() - 1;
		scrollToSlide(prevIndex);
	};

	// 监听滚动：找出最接近中心的 slide
	const handleScroll = () => {
		const container =
			typeof document !== "undefined"
				? (document.querySelector(
						`.${_containerClassName}`
				  ) as HTMLElement | null)
				: null;
		if (!container) return;

		const slides = container.querySelectorAll(`.${_slideClassName}`);
		let closestIndex = 0;
		let minDistance = Infinity;

		slides.forEach((slide, index) => {
			const slideRect = slide.getBoundingClientRect();
			const containerRect = container.getBoundingClientRect();

			let distance: number;
			if (direction === "x") {
				const centerOffset =
					slideRect.left +
					slideRect.width / 2 -
					(containerRect.left + containerRect.width / 2);
				distance = Math.abs(centerOffset);
			} else {
				const centerOffset =
					slideRect.top +
					slideRect.height / 2 -
					(containerRect.top + containerRect.height / 2);
				distance = Math.abs(centerOffset);
			}

			if (distance < minDistance) {
				minDistance = distance;
				closestIndex = index;
			}
		});

		setCurrentSlide(closestIndex);
	};

	// Touch 事件
	const handleTouchStart = (e: TouchEvent) => {
		if (!touchEnabled) return;
		const touch = e.touches[0];
		const container = e.currentTarget as HTMLElement;
		container.dataset.touchStartX = touch.clientX.toString();
		container.dataset.touchStartY = touch.clientY.toString();
	};

	const handleTouchMove = (e: TouchEvent) => {
		if (!touchEnabled) return;
		const touch = e.touches[0];
		const container = e.currentTarget as HTMLElement;
		const startX = parseFloat(container.dataset.touchStartX || "0");
		const startY = parseFloat(container.dataset.touchStartY || "0");
		const diffX = touch.clientX - startX;
		const diffY = touch.clientY - startY;

		if (Math.abs(diffX) > Math.abs(diffY) || direction === "x") {
			e.preventDefault();
		}
	};

	const handleTouchEnd = (e: TouchEvent) => {
		if (!touchEnabled) return;
		const container = e.currentTarget as HTMLElement;
		const startX = parseFloat(container.dataset.touchStartX || "0");
		const startY = parseFloat(container.dataset.touchStartY || "0");
		if (!startX && !startY) return;

		const touch = e.changedTouches[0];
		const diffX = touch.clientX - startX;
		const diffY = touch.clientY - startY;

		const isSwipe = Math.max(Math.abs(diffX), Math.abs(diffY)) > 30;
		if (isSwipe) {
			if (direction === "x") {
				diffX > 0 ? prevSlide() : nextSlide();
			} else {
				diffY > 0 ? prevSlide() : nextSlide();
			}
		}

		delete container.dataset.touchStartX;
		delete container.dataset.touchStartY;
	};

	// 鼠标滚轮
	const handleWheel = (e: WheelEvent) => {
		if (!mouseWheel) return;
		e.preventDefault();
		e.deltaY > 0 ? nextSlide() : prevSlide();
	};

	// 自动播放
	const setupAutoPlay = (container: HTMLElement | null) => {
		if (!autoPlay || !container) return;

		let autoplayInterval: ReturnType<typeof setInterval>;

		const startAutoPlay = () => {
			autoplayInterval = setInterval(nextSlide, interval);
		};
		const stopAutoPlay = () => {
			clearInterval(autoplayInterval);
		};

		container.addEventListener("mouseenter", stopAutoPlay);
		container.addEventListener("mouseleave", startAutoPlay);

		startAutoPlay();

		return () => {
			clearInterval(autoplayInterval);
			container.removeEventListener("mouseenter", stopAutoPlay);
			container.removeEventListener("mouseleave", startAutoPlay);
		};
	};

	// 只在客户端执行副作用：绑定各类事件、启动自动播放、初始化滚动
	const runSideEffects = () => {
		const container =
			typeof document !== "undefined"
				? (document.querySelector(
						`.${_containerClassName}`
				  ) as HTMLElement | null)
				: null;
		if (!container) return;

		const cleanupFns: (() => void)[] = [];

		container.addEventListener("scroll", handleScroll);
		cleanupFns.push(() =>
			container.removeEventListener("scroll", handleScroll)
		);

		if (touchEnabled) {
			container.addEventListener("touchstart", handleTouchStart);
			container.addEventListener("touchmove", handleTouchMove, {
				passive: false,
			});
			container.addEventListener("touchend", handleTouchEnd);
			cleanupFns.push(() =>
				container.removeEventListener("touchstart", handleTouchStart)
			);
			cleanupFns.push(() =>
				container.removeEventListener("touchmove", handleTouchMove)
			);
			cleanupFns.push(() =>
				container.removeEventListener("touchend", handleTouchEnd)
			);
		}

		if (mouseWheel) {
			container.addEventListener("wheel", handleWheel, { passive: false });
			cleanupFns.push(() =>
				container.removeEventListener("wheel", handleWheel)
			);
		}

		const cleanupAutoPlay = setupAutoPlay(container);
		if (cleanupAutoPlay) cleanupFns.push(cleanupAutoPlay);

		scrollToSlide(0);

		// 如果你想在未来某个时机清理所有事件，可以调用：
		// cleanupFns.forEach(fn => fn());
		return () => cleanupFns.forEach((fn) => fn());
	};

	// **SSR 优化**：只有在浏览器环境下才调度 runSideEffects
	if (typeof window !== "undefined" && typeof document !== "undefined") {
		setTimeout(runSideEffects, 0);
	}

	// 生成分页 dots
	const paginationDots = html`
		<div class="${_paginationClassName}">
			${Array.from(
				{ length: slideCount },
				(_, i) => html`
					<button
						class="${i === currentSlide() ? "active" : ""}"
						@click=${() => scrollToSlide(i)}
					></button>
				`
			)}
		</div>
	`;

	// 生成分页 fraction
	const paginationFraction = html`
		<div class="${_paginationClassName} fraction">
			<span class="current">${currentSlide() + 1}</span>
			<span class="separator">/</span>
			<span class="total">${slideCount}</span>
		</div>
	`;

	// 生成分页 progressbar
	const paginationProgress = html`
		<div class="${_paginationClassName} progressbar">
			<div
				class="progress"
				style="width: ${slideCount > 1
					? (currentSlide() / (slideCount - 1)) * 100
					: 0}%"
			></div>
		</div>
	`;

	// 生成导航按钮
	const navigationButtons = html`
		<div class="${_navigationClassName}">
			<button class="prev" @click=${prevSlide}>◀</button>
			<button class="next" @click=${nextSlide}>▶</button>
		</div>
	`;

	// 最终返回的模板
	return html`
		<style>
			.${_className} {
				position: relative;
				overflow: hidden;
				width: ${width};
				height: ${height};
			}

			.${_containerClassName} {
				width: 100%;
				height: 100%;
				overflow: auto;
				scroll-snap-type: ${direction + " " + snapType};
				-webkit-overflow-scrolling: touch;
				scroll-behavior: ${scrollBehavior};
				gap: ${gap};
				display: flex;
				flex-direction: ${direction === "x" ? "row" : "column"};
			}

			.${_slideClassName} {
				scroll-snap-align: ${align};
				flex-shrink: 0;
			}

			.${_navigationClassName} {
				position: absolute;
				top: 50%;
				left: 0;
				right: 0;
				transform: translateY(-50%);
				display: flex;
				justify-content: space-between;
				pointer-events: none;
				padding: ${navigationPosition === "outside" ? "0 1rem" : "0 0.5rem"};
			}

			.${_navigationClassName} button {
				width: 2.5rem;
				height: 2.5rem;
				border-radius: 50%;
				background-color: rgba(0, 0, 0, 0.5);
				color: white;
				border: none;
				display: flex;
				align-items: center;
				justify-content: center;
				cursor: pointer;
				pointer-events: auto;
				transition: background-color 0.3s;
			}

			.${_navigationClassName} button:hover {
				background-color: rgba(0, 0, 0, 0.8);
			}

			.${_paginationClassName} {
				position: absolute;
				bottom: 1rem;
				left: 0;
				right: 0;
				display: flex;
				justify-content: center;
				gap: 0.5rem;
				align-items: center;
			}
			.${_paginationClassName} button {
				width: 0.75rem;
				height: 0.75rem;
				border-radius: 50%;
				background-color: rgba(255, 255, 255, 0.5);
				border: none;
				cursor: pointer;
				transition: background-color 0.3s, transform 0.3s;
			}
			.${_paginationClassName} button.active {
				background-color: white;
				transform: scale(1.2);
			}

			.${_paginationClassName}.fraction {
				position: absolute;
				bottom: 1rem;
				left: 50%;
				transform: translateX(-50%);
				color: white;
				font-size: 1rem;
				display: flex;
				align-items: center;
				gap: 0.25rem;
			}

			.${_paginationClassName}.progressbar {
				position: absolute;
				bottom: 0.5rem;
				left: 0;
				right: 0;
				height: 0.25rem;
				background-color: rgba(255, 255, 255, 0.2);
			}
			.${_paginationClassName}.progressbar .progress {
				height: 100%;
				background-color: white;
				transition: width 0.3s;
			}
		</style>

		<div class="${_className}">
			<div class="${_containerClassName}">
				${_slides.map(
					(slide, index) => html`
						<div class="${_slideClassName} --slide-${index}" key=${index}>
							${slide}
						</div>
					`
				)}
			</div>

			${showNavigation ? navigationButtons : null}
			${showPagination && paginationType === "dots" ? paginationDots : null}
			${showPagination && paginationType === "fraction"
				? paginationFraction
				: null}
			${showPagination && paginationType === "progressbar"
				? paginationProgress
				: null}
		</div>
	`;
}
