import { html } from "lit";
import { renderFn, renderFnType } from "./core";

export function WaterFlow(
	props?: { columnCount?: number; gap?: string | number },
	children?: renderFnType
) {
	const count = props?.columnCount ?? 3;
	const gap = props?.gap ?? "16px";
	return html`
		<div
			style="
      column-count: ${count};
      column-gap: ${gap};
    "
		>
			${renderFn(children)}
		</div>
	`;
}
