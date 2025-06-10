import { html, TemplateResult } from "lit";
import { renderFn, renderFnType, WithHtml } from "./core";

export function AutoFitGrid(props: {
	minItemWidth: string;
	gap?: string | number;
}): WithHtml<renderFnType>;

export function AutoFitGrid(
	props: {
		minItemWidth: string;
		gap?: string | number;
	},
	children?: renderFnType
): TemplateResult<1>;

export function AutoFitGrid(
	props: {
		minItemWidth: string;
		gap?: string | number;
	},
	children?: renderFnType
): TemplateResult<1> | WithHtml<renderFnType> {
	if (children === undefined) {
		const _ = (children?: renderFnType) => AutoFitGrid(props, children);
		_.html = (strings: TemplateStringsArray, ...values: unknown[]) =>
			AutoFitGrid(props, html(strings, ...values));
		return _;
	}
	const gap = props?.gap ?? "16px";
	return html`
		<div
			style="
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(${props.minItemWidth}, 1fr));
      gap: ${gap};
    "
		>
			${renderFn(children)}
		</div>
	`;
}
