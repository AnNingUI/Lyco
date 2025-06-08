import { html } from "lit";
import { renderFn, renderFnType } from "./core";

export function Card(
	props?: {
		padding?: string;
		borderRadius?: string;
		shadow?: string;
		background?: string;
	},
	children?: renderFnType
) {
	const pd = props?.padding ?? "16px";
	const br = props?.borderRadius ?? "8px";
	const sd = props?.shadow ?? "0 2px 8px rgba(0,0,0,0.1)";
	const bg = props?.background ?? "#fff";
	return html`
		<div
			style="
      background: ${bg};
      border-radius: ${br};
      box-shadow: ${sd};
      padding: ${pd};
      box-sizing: border-box;
    "
		>
			${renderFn(children)}
		</div>
	`;
}
