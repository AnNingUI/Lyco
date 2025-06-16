import { html, TemplateResult } from "lit";

const ___LYCO_NULL___ = Symbol("___LYCO_NULL___");

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
	fnOrArray?: renderFnOrArrayType | string | number,
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
	const typeMap = {
		string: (f?: any) => html` ${f} `,
		number: (f?: any) => html` ${f} `,
	};
	const _fnOrArray =
		typeof fnOrArray in typeMap
			? typeMap[typeof fnOrArray as "string" | "number"]
			: fnOrArray;
	const _injectBox = injectBox ?? ((box) => box);
	const curriedFn = (f?: renderFnOrArrayType | string | number) =>
		_injectBox(renderFnOrArray(f as any, injectBox2)!);

	return _fnOrArray ? curriedFn(_fnOrArray) : curriedFn;
}

const withInit = (
	prefix: string
): {
	init: boolean;
	prefix: string;
	className: string | typeof ___LYCO_NULL___;
} => ({
	init: false,
	prefix,
	className: ___LYCO_NULL___,
});

const allRandomClassName = {
	"GridBreakpoint::grid-breakpoint": withInit("grid-breakpoint"),
	"Hidden::hidden-container": withInit("hidden-container"),
	"ListGroup::list-group": withInit("list-group"),
	"ScrollBar::scrollbar-container": withInit("scrollbar-container"),
	"SkeletonLoader::skeleton": withInit("skeleton"),
	"Swiper::swiper": withInit("swiper"),
	"Table::table": withInit("table"),
	"WaterFlow::waterflow": withInit("waterflow"),
	"AutoFitGrid::auto-fit-grid": withInit("auto-fit-grid"),
	"GridCol::grid-col": withInit("grid-col"),
	"GridRow::grid-row": withInit("grid-row"),
	"List::list": withInit("list"),
	"Dialog::dialog": withInit("dialog"),
	"SwitchInput::switch": withInit("switch"),
	"Combobox::combobox": withInit("combobox"),
};

export function getRandomClassName(key: keyof typeof allRandomClassName) {
	const r = allRandomClassName[key];
	if (!r.init) {
		allRandomClassName[key].init = true;
		allRandomClassName[key].className = randomClassName(r.prefix);
	}
	return allRandomClassName[key].className === ___LYCO_NULL___
		? randomClassName(r.prefix)
		: allRandomClassName[key].className;
}
type ComponentCountItem = {
	value: number;
};

type ComponentCount = {
	[key: string]: ComponentCountItem;
} & {
	all: ComponentCountItem; // 修改为 ComponentCountItem 类型
};
export const componentCount: ComponentCount = {
	all: { value: 0 },
};

export function getComponentCount(name: string) {
	if (!componentCount[name]?.value) {
		componentCount[name] = { value: 0 };
	}
	return componentCount[name].value;
}

export function LycoComponent(name: string, slot: TemplateResult<1>) {
	componentCount.all = {
		value: componentCount.all.value + 1,
	};
	componentCount[name] === undefined
		? (componentCount[name] = { value: 0 })
		: (componentCount[name].value = componentCount[name].value + 1);
	// console.debug(
	// 	`LycoComponent: ${name} - ${componentCount[name].value} - ${componentCount.all.value}`
	// );
	return html`
		<!-- ${name} - ${componentCount[name].value} -->
		${slot}
	`;
}

// type EventType = "click" | "mousedown" | "mouseup" | "mousemove" | "touchstart" | "touchend" | "touchmove";

// class OnEvent<T extends HTMLElement> {
// 	el: T;
// 	constructor(el: T) {
// 		this.el = el;
// 	}
// 	// 具体事件 监听方法
// 	on<K extends keyof GlobalEventHandlersEventMap>(
// 		type: K,
// 		listener: (this: T, ev: GlobalEventHandlersEventMap[K]) => any
// 	): void {
// 		(this.el as any)["on" + type] = listener;
// 	}
// }

type EventHandler<K extends keyof GlobalEventHandlersEventMap> =
	| ((event: GlobalEventHandlersEventMap[K]) => void)
	| {
			handler: (event: GlobalEventHandlersEventMap[K]) => void;
			options?: boolean | AddEventListenerOptions;
	  };

export type OnEvent = {
	[K in keyof GlobalEventHandlersEventMap]?: EventHandler<K>;
};

export function withEvents(on: OnEvent) {
	return on;
}

export function bindEvents(
	el: EventTarget,
	on: Array<[string, EventHandler<any>]>,
	eventListeners: Map<string, EventListener>
): void {
	on.forEach(([name, entry]) => {
		if (!entry) return; // 添加空值检查

		if (eventListeners.has(name)) {
			el.removeEventListener(name, eventListeners.get(name)!);
		}

		let handler: (event: Event) => void;
		let options: boolean | AddEventListenerOptions | undefined;

		if (typeof entry === "function") {
			handler = entry;
			options = undefined;
		} else {
			handler = entry.handler;
			options = entry.options;
		}

		if (!handler) return; // 确保 handler 存在

		const listener = (event: Event) => handler(event);
		el.addEventListener(name, listener, options);
		eventListeners.set(name, listener);
	});
}

export function createEventBinder(on: OnEvent) {
	const eventListeners = new Map<string, EventListener>();
	const _on = Object.entries(on);
	const self = {
		bind(el: EventTarget) {
			bindEvents(el, _on, eventListeners);
		},
		unbindAll() {
			eventListeners.clear();
		},
		auto: (e?: Element) => {
			if (e) {
				self.bind(e);
			} else {
				self.unbindAll();
			}
		},
	};
	return self;
}
