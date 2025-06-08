import { html } from "lit";
import { renderFn, renderFnType } from "./core";

export function ScrollBar(
	props?: {
		direction?: "vertical" | "horizontal";
		height?: string;
		width?: string;
		customCss?: string;
	},
	children?: renderFnType
) {
	const dir = props?.direction ?? "vertical";
	const h = props?.height ?? "100%";
	const w = props?.width ?? "100%";
	const extraCss = props?.customCss ?? "";

	const overflowStyle =
		dir === "horizontal"
			? "overflow-x: auto; overflow-y: hidden"
			: "overflow-y: auto; overflow-x: hidden";

	return html`
		<style>
			.scrollbar-container {
			  ${overflowStyle};
			  width: ${w};
			  height: ${h};
			}
			.scrollbar-container::-webkit-scrollbar {
			  width: 8px;
			  height: 8px;
			}
			.scrollbar-container::-webkit-scrollbar-thumb {
			  background-color: rgba(0, 0, 0, 0.2);
			  border-radius: 4px;
			}
			.scrollbar-container::-webkit-scrollbar-track {
			  background: rgba(0, 0, 0, 0.05);
			}
			${extraCss}
		</style>
		<div class="scrollbar-container">${renderFn(children)}</div>
	`;
}
