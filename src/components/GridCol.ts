import { html } from "lit";
import { renderFn, renderFnType } from "./core";

export function GridCol(
	props?: { gap?: string | number },
	children?: renderFnType
) {
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
