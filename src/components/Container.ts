import { html } from "lit";
import { renderFnOrArray, renderFnOrArrayType } from "./core";

export function Container(
	props?: {
		maxWidth?: string;
		padding?: string;
		background?: string;
		fullHeight?: boolean;
	},
	children?: renderFnOrArrayType
) {
	const mw = props?.maxWidth ?? "1024px";
	const pad = props?.padding ?? "0 16px";
	const bg = props?.background ? `background: ${props.background};` : "";
	const h = props?.fullHeight ? "height: 100%;" : "";

	return html`
		<div
			style="
      width: 100%;
      max-width: ${mw};
      margin-left: auto;
      margin-right: auto;
      padding: ${pad};
      ${bg}
      ${h}
      box-sizing: border-box;
    "
		>
			${renderFnOrArray(children)}
		</div>
	`;
}
