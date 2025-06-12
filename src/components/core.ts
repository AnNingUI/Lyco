import { html, LitElement, TemplateResult } from "lit";

export type renderFnType = TemplateResult<1> | (() => TemplateResult<1>);

export type renderFnOrArrayType =
	| renderFnType
	| Array<TemplateResult<1>>
	| (() => TemplateResult<1>[]);

export function renderFn(fn?: renderFnType): TemplateResult<1> {
	return fn ? (typeof fn === "function" ? fn() : fn) : html``;
}

export type WithHtml<K> = ((children?: K) => TemplateResult<1>) & {
	html: (
		strings: TemplateStringsArray,
		...values: unknown[]
	) => TemplateResult<1>;
};

export function renderFnOrArray(
	fnOrArray?: renderFnOrArrayType,
	injectBox?: (
		box: TemplateResult<1>,
		idx?: number,
		isArray?: boolean,
		isFunc?: boolean
	) => TemplateResult<1>
): TemplateResult<1> | TemplateResult<1>[] {
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
	injectBox?: (box: TemplateResult<1>) => TemplateResult<1>
): TemplateResult<1> | ((fn?: renderFnType) => TemplateResult<1>) {
	const _injectBox = injectBox ?? ((box) => box);
	const curriedFn = (f?: renderFnType) => _injectBox(renderFn(f!));

	return fn ? curriedFn(fn) : curriedFn;
}

export function renderFnOrArrayOrCurry(
	fnOrArray?: renderFnOrArrayType,
	injectBox?: (
		box: TemplateResult<1> | TemplateResult<1>[]
	) => TemplateResult<1> | TemplateResult<1>[],
	injectBox2?: (
		box: TemplateResult<1>,
		idx?: number,
		isArray?: boolean,
		isFunc?: boolean
	) => TemplateResult<1>
):
	| TemplateResult<1>
	| TemplateResult<1>[]
	| ((
			fnOrArray?: renderFnOrArrayType
	  ) => TemplateResult<1> | TemplateResult<1>[]) {
	const _injectBox = injectBox ?? ((box) => box);
	const curriedFn = (f?: renderFnOrArrayType) =>
		_injectBox(renderFnOrArray(f, injectBox2)!);

	return fnOrArray ? curriedFn(fnOrArray) : curriedFn;
}

const withInit = (prefix: string) => ({
	init: false,
	prefix,
	className: "___LYCO_NULL___",
});

const allRandomClassName = {
	"GridBreakpoint::grid-breakpoint": withInit("grid-breakpoint"),
	"Hidden::hidden-container": withInit("hidden-container"),
	"ListGroup::list-group": withInit("list-group"),
	"ScrollBar::scrollbar-container": withInit("scrollbar-container"),
	"SkeletonLoader::skeleton-shimmer": withInit("skeleton-shimmer"),
	"Swiper::swiper": withInit("swiper"),
	"Table::table": withInit("table"),
	"WaterFlow::waterflow": withInit("waterflow"),
	"AutoFitGrid::auto-fit-grid": withInit("auto-fit-grid"),
	"GridCol::grid-col": withInit("grid-col"),
	"GridRow::grid-row": withInit("grid-row"),
};

export function getRandomClassName(key: keyof typeof allRandomClassName) {
	const r = allRandomClassName[key];
	if (!r.init) {
		allRandomClassName[key].init = true;
		allRandomClassName[key].className = randomClassName(r.prefix);
	}
	return allRandomClassName[key].className === "___LYCO_NULL___"
		? randomClassName(r.prefix)
		: allRandomClassName[key].className;
}

export const componentCount = {
	value: 0,
};
export class LycoComponent extends LitElement {
	shadowRoot: ShadowRoot;
	constructor() {
		super();
		this.shadowRoot = this.attachShadow({ mode: "closed" });
		componentCount.value++;
	}

	render() {
		return html` <slot></slot> `;
	}
}
customElements.define("lyco-component", LycoComponent);
