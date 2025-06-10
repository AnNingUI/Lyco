import { html, TemplateResult } from "lit";
import { renderFn, renderFnType, WithHtml } from "./core";

export function Center(props?: {
	width?: string;
	height?: string;
	background?: string;
}): WithHtml<renderFnType>;

export function Center(
	props?: { width?: string; height?: string; background?: string },
	children?: renderFnType
): TemplateResult<1>;

export function Center(
	props?: { width?: string; height?: string; background?: string },
	children?: renderFnType
): TemplateResult<1> | WithHtml<renderFnType> {
	if (children === undefined) {
		const _ = (children?: renderFnType) => Center(props, children ?? html``);
		_.html = (strings: TemplateStringsArray, ...values: unknown[]) =>
			Center(props, html(strings, ...values));
		return _;
	}
	const w = props?.width ? `width: ${props.width};` : "";
	const h = props?.height ? `height: ${props.height};` : "";
	const bg = props?.background ? `background: ${props.background};` : "";

	return html`
		<div
			style="
      display: flex;
      justify-content: center;
      align-items: center;
      ${w} ${h} ${bg}
    "
		>
			${renderFn(children)}
		</div>
	`;
}
