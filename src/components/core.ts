import { html, TemplateResult } from "lit";

export type renderFnType = TemplateResult | (() => TemplateResult);
export function renderFn(fn?: renderFnType): TemplateResult {
	return fn ? (typeof fn === "function" ? fn() : fn) : html``;
}
