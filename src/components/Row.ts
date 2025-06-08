import { html } from "lit";
import { renderFnOrArray, renderFnOrArrayType } from "./core";

export function Row(
	props?: { space?: string | number },
	children?: renderFnOrArrayType
) {
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
