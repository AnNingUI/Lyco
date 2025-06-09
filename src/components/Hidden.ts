// Hidden.ts
import { html } from "lit";
import { randomClassName, renderFn, renderFnType } from "./core";

export function Hidden(
	props?: { breakpoint?: string; mode?: "hide" | "show"; className?: string },
	children?: renderFnType
) {
	const bp = props?.breakpoint ?? "(max-width: 600px)";
	const mode = props?.mode ?? "hide";
	const _className = props?.className ?? randomClassName("hidden-container");
	const styleContent =
		mode === "hide"
			? `@media ${bp} { .${_className} { display: none !important; } }`
			: `@media ${bp} { .${_className} { display: block !important; } }
       @media not ${bp} { .${_className} { display: none !important; } }`;
	return html`
		<style>
			.${_className} {
			  display: block;
			}
			${styleContent}
		</style>
		<div class="${_className}">${renderFn(children)}</div>
	`;
}
