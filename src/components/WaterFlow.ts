import { html, TemplateResult } from "lit";
import { getRandomClassName, renderFn, renderFnType, WithHtml } from "./core";

export interface WaterFlowProps {
	columnCount?: number;
	gap?: string | number;
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

	// 生成一个随机 className，方便后续扩展样式或避免样式冲突
	const _className = getRandomClassName("WaterFlow::waterflow");

	return html`
		<style>
			/* 使用 CSS 类来控制多列布局 */
			.${_className} {
				column-count: ${count};
				column-gap: ${typeof gapValue === "number"
					? `${gapValue}px`
					: gapValue};
			}
			/* 子元素如果是块级元素，需要让它们适应多列流式布局 */
			.${_className} > * {
				display: inline-block;
				width: 100%;
			}
		</style>

		<div class="${_className}">${renderFn(children)}</div>
	`;
}

WaterFlow().html`
<div>
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
  <div>5</div>
  <div>6</div>
  <div>7</div>
  <div>8</div>
  <div>9</div>
  <div>10</div>
</div>
`;
