import { html } from "lit";
import { renderFn, renderFnType } from "./core";

export function Column(
	props?: { space?: string | number },
	children?: renderFnType
) {
	return html`
		<div
			style="
      display: flex;
      flex-direction: column;
      ${props?.space ? `gap: ${props.space};` : ""}
    "
		>
			${renderFn(children)}
		</div>
	`;
}
