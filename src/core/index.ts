import { html, TemplateResult } from "lit";

const ___LYCO_NULL___ = Symbol("___LYCO_NULL___");
export type Temp = TemplateResult<1> | TemplateResult;
export type renderFnType = Temp | (() => Temp);
export type renderFnOrArrayType = renderFnType | Array<Temp> | (() => Temp[]);

export function renderFn(fn?: renderFnType): Temp {
	return fn ? (typeof fn === "function" ? fn() : fn) : html``;
}

export type WithHtml<K> = ((children?: K) => Temp) & {
	html: (strings: TemplateStringsArray, ...values: unknown[]) => Temp;
};

export function renderFnOrArray(
	fnOrArray?: renderFnOrArrayType,
	injectBox?: (
		box: Temp,
		idx?: number,
		isArray?: boolean,
		isFunc?: boolean
	) => Temp
): Temp | Temp[] {
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
	injectBox?: (box: Temp) => Temp
): Temp | ((fn?: renderFnType) => Temp) {
	const _injectBox = injectBox ?? ((box) => box);
	const curriedFn = (f?: renderFnType) => _injectBox(renderFn(f!));

	return fn ? curriedFn(fn) : curriedFn;
}

export function renderFnOrArrayOrCurry(
	fnOrArray?: renderFnOrArrayType | string | number,
	injectBox?: (box: Temp | Temp[]) => Temp | Temp[],
	injectBox2?: (
		box: Temp,
		idx?: number,
		isArray?: boolean,
		isFunc?: boolean
	) => Temp
): Temp | Temp[] | ((fnOrArray?: renderFnOrArrayType) => Temp | Temp[]) {
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

export function LycoComponent(name: string, slot: Temp) {
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

// 动画API：支持CSS动画类、任意动画库、CSS属性
export class AnimationAPI {
	static applyAnimation(
		element: HTMLElement,
		options: {
			animationClass?: string;
			animation?: (element: HTMLElement) => void;
			cssProperties?: Record<string, string>;
			duration?: number;
			delay?: number;
		}
	) {
		// Apply CSS animation class
		if (options.animationClass) {
			element.classList.add(options.animationClass);
			if (options.duration) {
				element.style.animationDuration = `${options.duration}s`;
			}
			if (options.delay) {
				element.style.animationDelay = `${options.delay}s`;
			}
		}

		// Use custom animation function (supports any animation library)
		if (options.animation) {
			options.animation(element);
		}

		// Apply direct CSS styles for animation
		if (
			options.cssProperties &&
			Object.keys(options.cssProperties).length > 0
		) {
			Object.keys(options.cssProperties).forEach((key) => {
				element.style[key as any] = options.cssProperties![key];
			});
			if (options.duration) {
				element.style.transitionDuration = `${options.duration}s`;
			}
		}
	}
}

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
	const _el = {
		value: null as EventTarget | null,
	};
	const self = {
		bind(el: EventTarget) {
			bindEvents(el, _on, eventListeners);
			_el.value = el;
		},
		unbindAll() {
			eventListeners.forEach((k, v) => {
				_el.value?.removeEventListener(v, k);
			});
			eventListeners.clear();
			_el.value = null;
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
