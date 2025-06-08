import { html } from "lit";
import { renderFnOrArray, renderFnOrArrayType } from "./core";

export function Column(
	props?: { space?: string | number },
	children?: renderFnOrArrayType
) {
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
