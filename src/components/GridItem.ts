import { html } from "lit";
import { renderFn, renderFnType } from "./core";

export function GridItem(props?: { span?: number }, children?: renderFnType) {
	return html`
		<div style="${props?.span ? `grid-column: span ${props.span};` : ""}">
			${renderFn(children)}
		</div>
	`;
}
