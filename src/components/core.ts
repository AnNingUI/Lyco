import { html, TemplateResult } from "lit";

export type renderFnType = TemplateResult | (() => TemplateResult);

export type renderFnOrArrayType =
	| renderFnType
	| Array<TemplateResult>
	| (() => TemplateResult[]);

export function renderFn(fn?: renderFnType): TemplateResult {
	return fn ? (typeof fn === "function" ? fn() : fn) : html``;
}

export function renderFnOrArray(
	fnOrArray?: renderFnOrArrayType,
	injectBox?: (box: TemplateResult, idx?: number) => TemplateResult
): TemplateResult | TemplateResult[] {
	let _injectBox = injectBox ?? ((box) => box);
	if (fnOrArray === undefined) {
		return html``;
	}
	if (Array.isArray(fnOrArray)) {
		return fnOrArray.map((htmlTemp, idx) =>
			_injectBox(renderFn(htmlTemp), idx)
		);
	} else if (typeof fnOrArray !== "function") {
		return _injectBox(fnOrArray);
	}

	const result = fnOrArray();
	if (Array.isArray(result)) {
		return result.map((htmlTemp, idx) => _injectBox(renderFn(htmlTemp), idx));
	} else {
		return _injectBox(renderFn(result));
	}
}
