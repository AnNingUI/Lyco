import { html } from "lit";
import { renderFn, renderFnType } from "./core";

export function AutoFitGrid(
	props: {
		minItemWidth: string;
		gap?: string | number;
	},
	children?: renderFnType
) {
	const gap = props?.gap ?? "16px";
	return html`
		<div
			style="
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(${props.minItemWidth}, 1fr));
      gap: ${gap};
    "
		>
			${renderFn(children)}
		</div>
	`;
}
