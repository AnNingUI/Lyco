import { html, TemplateResult } from "lit";
import { renderFn, renderFnType, WithHtml } from "./core";

export function GridCol(props?: {
	gap?: string | number;
}): WithHtml<renderFnType>;

export function GridCol(
	props?: { gap?: string | number },
	children?: renderFnType
): TemplateResult<1>;

export function GridCol(
	props?: { gap?: string | number },
	children?: renderFnType
) {
	if (children === undefined) {
		const _ = (children?: renderFnType) => GridCol(props, children ?? html``);
		_.html = (strings: TemplateStringsArray, ...values: unknown[]) =>
			GridCol(props, html(strings, ...values));
		return _;
	}
	return html`
		<div
			style="
      display: grid;
      grid-auto-flow: column;
      ${props?.gap ? `column-gap: ${props.gap};` : ""}
    "
		>
			${renderFn(children)}
		</div>
	`;
}
