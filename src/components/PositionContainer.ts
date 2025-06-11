import { html, TemplateResult } from "lit";
import { renderFn, renderFnType, WithHtml } from "./core";

export function PositionContainer(props?: {
	width?: string;
	height?: string;
	background?: string;
}): WithHtml<renderFnType>;

export function PositionContainer(
	props?: { width?: string; height?: string; background?: string },
	children?: renderFnType
): TemplateResult<1>;

export function PositionContainer(
	props?: { width?: string; height?: string; background?: string },
	children?: renderFnType
): TemplateResult<1> | WithHtml<renderFnType> {
	if (children === undefined) {
		const _ = (children?: renderFnType) =>
			PositionContainer(props, children ?? html``);
		_.html = (strings: TemplateStringsArray, ...values: unknown[]) =>
			PositionContainer(props, html(strings, ...values));
		return _;
	}

	const w = props?.width ? `width: ${props.width};` : "";
	const h = props?.height ? `height: ${props.height};` : "";
	const bg = props?.background ? `background: ${props.background};` : "";

	return html`
		<div
			style="
      position: relative;
      ${w} ${h} ${bg}
      overflow: hidden;
    "
		>
			${renderFn(children)}
		</div>
	`;
}
