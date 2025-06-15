import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import {
	Virtualizer,
	VirtualizerConfig,
} from "../src/components/Virtualizer.labs";

interface MyDataItem {
	id: number;
	text: string;
}

@customElement("virtualizer-example")
export class VirtualizerExample extends LitElement {
	@property({ type: Array })
	items: MyDataItem[] = [];

	@property({ type: Number })
	pageSize: number = 50;

	private _renderMyItem = (item: MyDataItem, index: number) => html`
		<div class="my-virtual-item">
			<strong>Item ${item.id}</strong>: ${item.text} - Visible Index: ${index}
		</div>
	`;

	override render() {
		const virtualizerConfig: VirtualizerConfig<MyDataItem> = {
			items: this.items ?? [],
			itemSize: 60,
			layout: "vertical",
			padding: 10,
			preloadCount: 5, // 减少预加载数量
			cacheSize: 200, // 减少缓存大小
			pageSize: this.pageSize,
			fetchMoreThreshold: 0.8,
			renderItem: this._renderMyItem,
		};

		return html`
			<style>
				:host {
					display: block;
					height: 80vh; /* Give the app a height */
					width: 80%;
					font-family: sans-serif;
					box-sizing: border-box;
					border: 2px solid #333;
					margin: 20px;
					padding: 10px;
					overflow: hidden; /* Prevent MyApp from scrolling */
				}
				.virtualizer-wrapper {
					height: 600px; /* Give the virtualizer a specific height to scroll within */
					width: 100%;
					border: 1px solid #ccc;
					box-sizing: border-box;
					margin-top: 10px;
				}
				.my-virtual-item {
					padding: 10px;
					border-bottom: 1px solid #eee;
					background-color: #f9f9f9;
					box-sizing: border-box; /* Ensure padding doesn't affect total height */
					min-height: 60px; /* Match itemSize, or be slightly less if padding adds up */
					display: flex;
					align-items: center;
				}
				.my-virtual-item:nth-child(even) {
					background-color: #f3f3f3;
				}
				.loading-tip {
					text-align: center;
					padding: 20px;
					color: #666;
				}
			</style>

			<h2>Virtualized List Demo</h2>
			<p>已加载 ${this.items.length} 条数据</p>

			<div class="virtualizer-wrapper">
				${this.items.length === 0
					? html`<div class="loading-tip">Loading...</div>`
					: Virtualizer(virtualizerConfig)}
			</div>
		`;
	}
}
