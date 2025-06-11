import { html, TemplateResult } from "lit";
import { renderFnOrArray, renderFnOrArrayType } from "./core";

export function Row(props?: {
	space?: string | number;
}): (children?: renderFnOrArrayType) => TemplateResult<1>;

export function Row(
	props?: { space?: string | number },
	children?: renderFnOrArrayType
): TemplateResult<1>;

export function Row(
	props?: { space?: string | number },
	children?: renderFnOrArrayType
): TemplateResult<1> | ((children?: renderFnOrArrayType) => TemplateResult<1>) {
	if (children === undefined) {
		return (children?: renderFnOrArrayType) => Row(props, children ?? [html``]);
	}
	return html`
		<div
			style="
      display: flex;
      flex-direction: row;
      ${props?.space ? `gap: ${props.space};` : ""}
    "
		>
			${renderFnOrArray(children)}
		</div>
	`;
}
