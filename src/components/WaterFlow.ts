import { html, TemplateResult } from "lit";
import { ref } from "lit/directives/ref.js";
import {
	createEventBinder,
	getComponentCount,
	getRandomClassName,
	LycoComponent,
	OnEvent,
	renderFn,
	renderFnType,
	WithHtml,
} from "./core";

export interface WaterFlowProps {
	columnCount?: number;
	gap?: string | number;
	on?: OnEvent;
}

export function WaterFlow(props?: WaterFlowProps): WithHtml<renderFnType>;

export function WaterFlow(
	props?: WaterFlowProps,
	children?: renderFnType
): TemplateResult<1>;

export function WaterFlow(
	props?: WaterFlowProps,
	children?: renderFnType
): TemplateResult<1> | WithHtml<renderFnType> {
	// 如果只传了 props，不传 children，则返回一个接收 children 的函数
	if (children === undefined) {
		const _ = (children?: renderFnType) =>
			WaterFlow(props, children ?? html``) as TemplateResult<1>;
		_.html = (strings: TemplateStringsArray, ...values: unknown[]) =>
			WaterFlow(props, html(strings, ...values)) as TemplateResult<1>;
		return _;
	}

	// 解构 props，并设置默认值
	const count = props?.columnCount ?? 3;
	const gapValue = props?.gap ?? "16px";
	const now = getComponentCount("WaterFlow");
	// 生成一个随机 className，方便后续扩展样式或避免样式冲突
	const _className =
		getRandomClassName("WaterFlow::waterflow") + `-lyco-now-${now}`;

	const css = `
	/* 使用 CSS 类来控制多列布局 */
	.${_className} {
		column-count: ${count};
		column-gap: ${typeof gapValue === "number" ? `${gapValue}px` : gapValue};
	}
	/* 子元素如果是块级元素，需要让它们适应多列流式布局 */
	.${_className} > * {
		display: inline-block;
		width: 100%;
	}
	`;

	const binder = createEventBinder(props?.on ?? {});

	return LycoComponent(
		"WaterFlow",
		html`
			<style>
				${css}
			</style>

			<div
				${ref((el) => {
					if (el) {
						binder.bind(el);
					} else {
						binder.unbindAll();
					}
				})}
				class="${_className}"
			>
				${renderFn(children)}
			</div>
		`
	);
}
