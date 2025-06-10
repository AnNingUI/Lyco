import { html, TemplateResult } from "lit";
import { renderFnOrArray, renderFnOrArrayType } from "./core";

export function Column(props?: {
	space?: string | number;
}): (children?: renderFnOrArrayType) => TemplateResult<1>;

export function Column(
	props?: { space?: string | number },
	children?: renderFnOrArrayType
): TemplateResult<1>;

export function Column(
	props?: { space?: string | number },
	children?: renderFnOrArrayType
): TemplateResult<1> | ((children?: renderFnOrArrayType) => TemplateResult<1>) {
	if (children === undefined) {
		return (children) => Column(props, children ?? [html``]);
	}
	return html`
		<div
			style="
      display: flex;
      flex-direction: column;
      ${props?.space ? `gap: ${props.space};` : ""}
    "
		>
			${renderFnOrArray(children)}
		</div>
	`;
}
