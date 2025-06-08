import { html } from "lit";
import { renderFn, renderFnType } from "./core";

export function Grid(
	props?: { columns?: number; gap?: string | number },
	children?: renderFnType
) {
	const cols = props?.columns ?? 1;
	return html`
		<div
			style="
      display: grid;
      grid-template-columns: repeat(${cols}, 1fr);
      ${props?.gap ? `gap: ${props.gap};` : ""}
    "
		>
			${renderFn(children)}
		</div>
	`;
}
