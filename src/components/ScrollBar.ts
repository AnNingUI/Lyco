import { html } from "lit";
import { randomClassName, renderFn, renderFnType } from "./core";

export function ScrollBar(
	props?: {
		direction?: "vertical" | "horizontal";
		height?: string;
		width?: string;
		customCss?: string;
		className?: string;
	},
	children?: renderFnType
) {
	const dir = props?.direction ?? "vertical";
	const h = props?.height ?? "100%";
	const w = props?.width ?? "100%";
	const extraCss = props?.customCss ?? "";
	const _className = props?.className ?? randomClassName("scrollbar-container");
	const overflowStyle =
		dir === "horizontal"
			? "overflow-x: auto; overflow-y: hidden"
			: "overflow-y: auto; overflow-x: hidden";

	return html`
		<style>
			.${_className} {
			  ${overflowStyle};
			  width: ${w};
			  height: ${h};
			}
			.${_className}::-webkit-scrollbar {
			  width: 8px;
			  height: 8px;
			}
			.${_className}::-webkit-scrollbar-thumb {
			  background-color: rgba(0, 0, 0, 0.2);
			  border-radius: 4px;
			}
			.${_className}::-webkit-scrollbar-track {
			  background: rgba(0, 0, 0, 0.05);
			}
			${extraCss}
		</style>
		<div class="${_className}">${renderFn(children)}</div>
	`;
}
