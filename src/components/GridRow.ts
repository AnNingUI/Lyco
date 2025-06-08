import { html } from "lit";
import { renderFn, renderFnType } from "./core";

export function GridRow(
	props?: { gap?: string | number },
	children?: renderFnType
) {
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
