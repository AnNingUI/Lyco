// Hidden.ts
import { html, TemplateResult } from "lit";
import { randomClassName, renderFn, renderFnType, WithHtml } from "./core";

export type HiddenProps = {
	breakpoint?: string;
	mode?: "hide" | "show";
	className?: string;
};

export function Hidden(props?: HiddenProps): WithHtml<renderFnType>;

export function Hidden(
	props?: HiddenProps,
	children?: renderFnType
): TemplateResult<1>;

export function Hidden(
	props?: HiddenProps,
	children?: renderFnType
): TemplateResult<1> | WithHtml<renderFnType> {
	if (children === undefined) {
		const _ = (children?: renderFnType) => Hidden(props, children ?? html``);
		_.html = (strings: TemplateStringsArray, ...values: unknown[]) =>
			Hidden(props, html(strings, ...values));
		return _;
	}
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
