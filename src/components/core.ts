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
	injectBox?: (
		box: TemplateResult,
		idx?: number,
		isArray?: boolean,
		isFunc?: boolean
	) => TemplateResult
): TemplateResult | TemplateResult[] {
	let _injectBox = injectBox ?? ((box) => box);
	if (fnOrArray === undefined) {
		return html``;
	}
	if (Array.isArray(fnOrArray)) {
		return fnOrArray.map((htmlTemp, idx) =>
			_injectBox(renderFn(htmlTemp), idx, true, false)
		);
	} else if (typeof fnOrArray !== "function") {
		return _injectBox(renderFn(fnOrArray), undefined, false, false);
	}

	const result = fnOrArray();
	if (Array.isArray(result)) {
		return result.map((htmlTemp, idx) =>
			_injectBox(renderFn(htmlTemp), idx, true, false)
		);
	} else {
		return _injectBox(renderFn(result), undefined, false, true);
	}
}

export function randomClassName(prefix?: string): string {
	const random = Math.random().toString(36).substring(2, 15);
	return prefix ? `lyco-${prefix}-${random}` : `lyco-${random}`;
}

export function renderFnOrCurry(
	fn?: renderFnType,
	injectBox?: (box: TemplateResult) => TemplateResult
): TemplateResult | ((fn?: renderFnType) => TemplateResult) {
	const _injectBox = injectBox ?? ((box) => box);
	if (fn) {
		return _injectBox(renderFn(fn));
	} else {
		return (fn?: renderFnType) => _injectBox(renderFn(fn));
	}
}

export function renderFnOrArrayOrCurry(
	fnOrArray?: renderFnOrArrayType,
	injectBox?: (
		box: TemplateResult | TemplateResult[]
	) => TemplateResult | TemplateResult[],
	injectBox2?: (
		box: TemplateResult,
		idx?: number,
		isArray?: boolean,
		isFunc?: boolean
	) => TemplateResult
):
	| TemplateResult
	| TemplateResult[]
	| ((fnOrArray?: renderFnOrArrayType) => TemplateResult | TemplateResult[]) {
	const _injectBox = injectBox ?? ((box) => box);
	if (fnOrArray) {
		return _injectBox(renderFnOrArray(fnOrArray, injectBox2));
	} else {
		return (fnOrArray?: renderFnOrArrayType) =>
			_injectBox(renderFnOrArray(fnOrArray, injectBox2));
	}
}
