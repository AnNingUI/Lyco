import { html } from "lit";
import { renderFn, renderFnType } from "./core";

export function Sticky(
	props?: {
		top?: string;
		bottom?: string;
		zIndex?: number;
	},
	children?: renderFnType
) {
	const top = props?.top ? `top: ${props.top};` : "";
	const bottom = props?.bottom ? `bottom: ${props.bottom};` : "";
	const z =
		typeof props?.zIndex === "number" ? `z-index: ${props.zIndex};` : "";

	return html`
		<div
			style="
      position: sticky;
      ${top} ${bottom}
      ${z}
    "
		>
			${renderFn(children)}
		</div>
	`;
}
