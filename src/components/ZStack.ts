import { html } from "lit";
import { renderFn, renderFnType, renderFnOrArrayType, renderFnOrArray } from "./core";

export function ZStack(
	props?: {
		width?: string;
		height?: string;
		background?: string;
		align?:
			| "top-left"
			| "top-right"
			| "center"
			| "bottom-left"
			| "bottom-right";
	},
	children?: renderFnOrArrayType
) {
	const w = props?.width ? `width: ${props.width};` : "";
	const h = props?.height ? `height: ${props.height};` : "";
	const bg = props?.background ? `background: ${props.background};` : "";

	let justify = "flex-start";
	let alignItems = "flex-start";
	switch (props?.align) {
		case "top-right":
			justify = "flex-end";
			alignItems = "flex-start";
			break;
		case "center":
			justify = "center";
			alignItems = "center";
			break;
		case "bottom-left":
			justify = "flex-start";
			alignItems = "flex-end";
			break;
		case "bottom-right":
			justify = "flex-end";
			alignItems = "flex-end";
			break;
		default:
			// "top-left"
			justify = "flex-start";
			alignItems = "flex-start";
	}

	return html`
		<div
			style="
      position: relative;
      display: flex;
      justify-content: ${justify};
      align-items: ${alignItems};
      ${w} ${h} ${bg}
    "
		>
			${renderFnOrArray(children)}
		</div>
	`;
}