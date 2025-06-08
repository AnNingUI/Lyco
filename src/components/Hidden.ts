// Hidden.ts
import { html } from "lit";
import { renderFn, renderFnType } from "./core";

export function Hidden(
	props?: { breakpoint?: string; mode?: "hide" | "show" },
	children?: renderFnType
) {
	const bp = props?.breakpoint ?? "(max-width: 600px)";
	const mode = props?.mode ?? "hide";
	const styleContent =
		mode === "hide"
			? `@media ${bp} { .hidden-container { display: none !important; } }`
			: `@media ${bp} { .hidden-container { display: block !important; } }
       @media not ${bp} { .hidden-container { display: none !important; } }`;
	return html`
		<style>
			.hidden-container {
			  display: block;
			}
			${styleContent}
		</style>
		<div class="hidden-container">${renderFn(children)}</div>
	`;
}
