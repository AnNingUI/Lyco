import { html } from "lit";
import { renderFn, renderFnType } from "./core";

export function FlowItem(_props?: unknown, children?: renderFnType) {
	return html`
		<div style="break-inside: avoid; margin-bottom: 16px;">
			${renderFn(children)}
		</div>
	`;
}
