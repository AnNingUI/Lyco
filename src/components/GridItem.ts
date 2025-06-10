import { html, TemplateResult } from "lit";
import { renderFn, renderFnType, WithHtml } from "./core";

export function GridItem(props?: { span?: number }): WithHtml<renderFnType>;

export function GridItem(
	props?: { span?: number },
	children?: renderFnType
): TemplateResult<1>;

export function GridItem(
	props?: { span?: number },
	children?: renderFnType
): TemplateResult<1> | WithHtml<renderFnType> {
	if (children === undefined) {
		const _ = (children?: renderFnType) => GridItem(props, children ?? html``);
		_.html = (strings: TemplateStringsArray, ...values: unknown[]) =>
			GridItem(props, html(strings, ...values));
		return _;
	}
	return html`
		<div style="${props?.span ? `grid-column: span ${props.span};` : ""}">
			${renderFn(children)}
		</div>
	`;
}
