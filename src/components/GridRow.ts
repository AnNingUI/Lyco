import { html, TemplateResult } from "lit";
import { renderFn, renderFnType, WithHtml } from "./core";

export function GridRow(props?: {
	gap?: string | number;
}): WithHtml<renderFnType>;

export function GridRow(
	props?: { gap?: string | number },
	children?: renderFnType
): TemplateResult<1>;

export function GridRow(
	props?: { gap?: string | number },
	children?: renderFnType
) {
	if (children === undefined) {
		const _ = (children?: renderFnType) => GridRow(props, children ?? html``);
		_.html = (strings: TemplateStringsArray, ...values: unknown[]) =>
			GridRow(props, html(strings, ...values));
		return _;
	}

	return html`
		<div
			style="
      display: grid;
      grid-auto-flow: row;
      ${props?.gap ? `row-gap: ${props.gap};` : ""}
    "
		>
			${renderFn(children)}
		</div>
	`;
}
