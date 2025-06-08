import { html } from "lit";
import { renderFn, renderFnType } from "./core";

export function Row(
	props?: { space?: string | number },
	children?: renderFnType
) {
	return html`
		<div
			style="
      display: flex;
      flex-direction: row;
      ${props?.space ? `gap: ${props.space};` : ""}
    "
		>
			${renderFn(children)}
		</div>
	`;
}
