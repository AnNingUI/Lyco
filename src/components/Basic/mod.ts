import { html, render, type TemplateResult } from "lit";
import { StyleInfo, styleMap } from "lit/directives/style-map.js";
import {
	createEventBinder,
	OnEvent,
	renderFnOrArray,
	renderFnOrArrayOrCurry,
	renderFnOrArrayType,
} from "../../core";

type HTMLEl =
	| HTMLElementTagNameMap
	| HTMLElementDeprecatedTagNameMap
	| SVGElementTagNameMap
	| MathMLElementTagNameMap;

type Style = string | Readonly<StyleInfo>;

function createStyle(style: Style) {
	if (typeof style === "string") {
		return style;
	} else {
		return styleMap(style).toString();
	}
}

styleMap;
export type BasicHtmlProps<_T extends keyof HTMLElementTagNameMap, AddPorps> = {
	className?: string;
	id?: string;
	key?: string | number;
	style?: Style;
	on?: OnEvent;
	title?: string;
	hidden?: boolean;
	draggable?: boolean;
	lang?: string;
	dir?: string;
	accessKey?: string;
	tabIndex?: number;
	contentEditable?: boolean;
	spellcheck?: boolean;
	dataset?: DOMStringMap;
	role?: string;
	ariaLabel?: string;
	ariaDescribedBy?: string;
	ariaHidden?: string;
	injectFields?: (ref: HTMLElementTagNameMap[_T]) => void;
} & AddPorps;

export type BasicSVGProps<_T extends keyof SVGElementTagNameMap, AddPorps> = {
	className?: string;
	key?: string | number;
	id?: string;
	style?: Style;
	on?: OnEvent;
	// SVG 特有属性
	fill?: string;
	stroke?: string;
	strokeWidth?: number;
	viewBox?: string;
	// 通用SVG属性
	transform?: string;
	opacity?: number;

	// 插入字段
	injectFields?: (ref: SVGElementTagNameMap[_T]) => void;
} & AddPorps;

export type BasicMathMLProps<
	_T extends keyof MathMLElementTagNameMap,
	AddPorps
> = {
	className?: string;
	key?: string | number;
	id?: string;
	style?: Style;
	on?: OnEvent;
	// MathML 特有属性
	display?: "block" | "inline";
	mathbackground?: string;
	mathcolor?: string;
	// 插入字段
	injectFields?: (ref: MathMLElementTagNameMap[_T]) => void;
} & AddPorps;

export type Props<_T extends keyof HTMLEl, AddPorps> =
	| BasicHtmlProps<_T, AddPorps>
	| BasicSVGProps<_T, AddPorps>
	| BasicMathMLProps<_T, AddPorps>;

type ElementFunction<
	_T extends keyof _F,
	_F extends HTMLEl,
	_P extends Props<_T extends keyof HTMLEl ? _T : never, AddPorps>,
	AddPorps
> = {
	(props?: _P): (
		children?: renderFnOrArrayType | string | number
	) => TemplateResult<1>;
	(
		props?: _P,
		children?: renderFnOrArrayType | string | number
	): TemplateResult<1>;
};

// 创建一个HTML元素渲染函数工厂
function createElementRenderer<K extends keyof HTMLElementTagNameMap, Add>(
	tag: K,
	addPropsType?: Set<keyof Add>
) {
	return (props?: BasicHtmlProps<K, Add>, content?: unknown) => {
		const _props = (props ?? {}) as BasicHtmlProps<K, Add>;
		const element = document.createElement(tag);
		const binder = createEventBinder(_props?.on ?? {});
		const injectFields = props?.injectFields ?? ((ref) => {});
		const add = addPropsType ?? new Set();
		// 应用所有属性
		_props.className && (element.className = _props.className);
		_props.id && (element.id = _props.id);
		_props.style && (element.style.cssText = createStyle(_props.style));
		_props.title && (element.title = _props.title);
		_props.lang && (element.lang = _props.lang);
		_props.dir && (element.dir = _props.dir);
		_props.role && (element.role = _props.role);
		_props.ariaLabel && (element.ariaLabel = _props.ariaLabel);
		_props.ariaHidden && (element.ariaHidden = _props.ariaHidden);
		_props.key && element.setAttribute("data-key", _props.key.toString());
		add.forEach((key) => {
			if (_props[key]) {
				(element as any)[key] = _props[key];
			}
		});

		// 设置布尔属性
		if (_props.hidden !== undefined) element.hidden = _props.hidden;
		if (_props.draggable !== undefined) element.draggable = _props.draggable;
		if (_props.contentEditable !== undefined)
			element.contentEditable = _props.contentEditable.toString();
		if (_props.spellcheck !== undefined) element.spellcheck = _props.spellcheck;
		if (_props.tabIndex !== undefined) element.tabIndex = _props.tabIndex;

		// 设置dataset
		_props.dataset &&
			Object.entries(_props.dataset).forEach(([key, value]) => {
				element.dataset[key] = value;
			});

		// 绑定事件
		binder.bind(element);
		injectFields(element);

		// 处理内容
		if (
			content !== null &&
			typeof content === "object" &&
			"_$litType$" in content
		) {
			// 渲染Lit模板
			render(content as TemplateResult<1>, element);
		} else {
			// 设置文本内容
			element.textContent = `${content ?? ""}`;
		}

		// 创建一个包装节点，用于管理生命周期
		const wrapper = document.createElement("div");
		wrapper.remove = () => {
			wrapper.remove();
			binder.unbindAll();
		};
		wrapper.appendChild(element);

		return html`${wrapper.firstElementChild as HTMLElement}`;
	};
}

function createMathMLElementRenderer<
	K extends keyof MathMLElementTagNameMap,
	Add
>(tag: K, addPropsType?: Set<keyof Add>) {
	return (_props?: BasicMathMLProps<K, Add>, content?: unknown) => {
		const props = _props ?? ({} as BasicMathMLProps<K, Add>);
		const element = document.createElementNS(
			"http://www.w3.org/1998/Math/MathML",
			tag
		);
		const binder = createEventBinder(props.on ?? {});
		const injectFields = props?.injectFields ?? ((ref) => {});
		const add = addPropsType ?? new Set();
		// 应用属性
		props.className && (element.className = props.className);
		props.id && (element.id = props.id);
		props.style && (element.style.cssText = createStyle(props.style));
		props.display && element.setAttribute("display", props.display);
		props.key && element.setAttribute("data-key", props.key.toString());
		props.mathbackground &&
			element.setAttribute("mathbackground", props.mathbackground);
		props.mathcolor && element.setAttribute("mathcolor", props.mathcolor);
		add.forEach((key) => {
			if (props[key]) {
				(element as any)[key] = props[key];
			}
		});

		// 绑定事件和注入字段
		binder.bind(element);
		injectFields(element);

		// 处理内容
		if (
			content !== null &&
			typeof content === "object" &&
			"_$litType$" in content
		) {
			render(content as TemplateResult<1>, element as HTMLElement);
		} else {
			element.textContent = `${content ?? ""}`;
		}

		const wrapper = document.createElement("div");
		wrapper.remove = () => {
			wrapper.remove();
			binder.unbindAll();
		};
		wrapper.appendChild(element);

		return html`${wrapper.firstElementChild as MathMLElement}`;
	};
}

function createSVGElementRenderer<K extends keyof SVGElementTagNameMap, Add>(
	tag: K,
	addPropsType?: Set<keyof Add>
) {
	return (_props?: BasicSVGProps<K, Add>, content?: unknown) => {
		const props = _props ?? ({} as BasicSVGProps<K, Add>);
		const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
		const binder = createEventBinder(props.on ?? {});
		const injectFields = props?.injectFields ?? ((ref) => {});
		const add = addPropsType ?? new Set();

		// 应用SVG属性
		props.className && element.setAttribute("class", props.className);
		props.id && (element.id = props.id);
		props.style && (element.style.cssText = createStyle(props.style));
		props.fill && element.setAttribute("fill", props.fill);
		props.stroke && element.setAttribute("stroke", props.stroke);
		props.key && element.setAttribute("data-key", props.key.toString());
		props.strokeWidth &&
			element.setAttribute("stroke-width", props.strokeWidth.toString());
		props.viewBox && element.setAttribute("viewBox", props.viewBox);
		props.transform && element.setAttribute("transform", props.transform);
		props.opacity !== undefined &&
			element.setAttribute("opacity", props.opacity.toString());
		add.forEach((key) => {
			if (props[key]) {
				const value = props[key];
				if (typeof value === "function") {
					(element as any)[key] = value;
				} else {
					// 将驼峰式属性名转换为短横线式
					const attributeName = key
						.toString()
						.replace(/([A-Z])/g, "-$1")
						.toLowerCase();
					element.setAttribute(attributeName, value.toString());
				}
			}
		});

		// 绑定事件
		binder.bind(element);
		injectFields(element);

		// 处理内容
		if (
			(content !== null &&
				typeof content === "object" &&
				"_$litType$" in content) ||
			(Array.isArray(content) &&
				content.length > 0 &&
				typeof content[0] === "object" &&
				"_$litType$" in content[0])
		) {
			render(content as TemplateResult<1>, element as unknown as HTMLElement);
		} else {
			console.log("content", content);
			element.textContent = `${content ?? ""}`;
		}

		const wrapper = document.createElement("div");
		wrapper.remove = () => {
			wrapper.remove();
			binder.unbindAll();
		};
		wrapper.appendChild(element);

		return html`${wrapper.firstElementChild as SVGElement}`;
	};
}

// 元素注册函数
function registerHtmlElement<K extends keyof HTMLElementTagNameMap, Add>(
	tag: K,
	addPropsType?: Set<keyof Add>
): ElementFunction<K, HTMLElementTagNameMap, BasicHtmlProps<K, Add>, Add> {
	const renderer = createElementRenderer(tag, addPropsType);
	return ((props?: BasicHtmlProps<K, Add>, children?: renderFnOrArrayType) => {
		const render = (c?: renderFnOrArrayType) =>
			renderer(props, renderFnOrArray(c));
		return renderFnOrArrayOrCurry(children, render) as
			| TemplateResult<1>
			| ((children?: renderFnOrArrayType) => TemplateResult<1>);
	}) as ElementFunction<K, HTMLElementTagNameMap, BasicHtmlProps<K, Add>, Add>;
}

function registerMathMLElement<
	K extends keyof MathMLElementTagNameMap,
	Add = {}
>(
	tag: K,
	addPropsType?: Set<keyof Add>
): ElementFunction<K, MathMLElementTagNameMap, BasicMathMLProps<K, Add>, Add> {
	const renderer = createMathMLElementRenderer(tag, addPropsType);
	return ((
		props?: BasicMathMLProps<K, Add>,
		children?: renderFnOrArrayType
	) => {
		const render = (c?: renderFnOrArrayType) =>
			renderer(props, renderFnOrArray(c));
		return renderFnOrArrayOrCurry(children, render) as
			| TemplateResult<1>
			| ((children?: renderFnOrArrayType) => TemplateResult<1>);
	}) as ElementFunction<
		K,
		MathMLElementTagNameMap,
		BasicMathMLProps<K, Add>,
		Add
	>;
}

function registerSVGElement<K extends keyof SVGElementTagNameMap, Add>(
	tag: K,
	addPropsType?: Set<keyof Add>
): ElementFunction<K, SVGElementTagNameMap, BasicSVGProps<K, Add>, Add> {
	const renderer = createSVGElementRenderer(tag, addPropsType);
	return ((props?: BasicSVGProps<K, Add>, children?: renderFnOrArrayType) => {
		const render = (c?: renderFnOrArrayType) =>
			renderer(props, renderFnOrArray(c));
		return renderFnOrArrayOrCurry(children, render) as
			| TemplateResult<1>
			| ((children?: renderFnOrArrayType) => TemplateResult<1>);
	}) as ElementFunction<K, SVGElementTagNameMap, BasicSVGProps<K, Add>, Add>;
}

// 定义所有HTML元素映射

type FromAddProps = {
	method?: string;
	action?: string;
	enctype?: string;
	target?: string;
	novalidate?: boolean;
};
type InputAddProps = {
	type?: string;
	value?: string;
	placeholder?: string;
	maxLength?: number;
	minLength?: number;
	required?: boolean;
	disabled?: boolean;
	readonly?: boolean;
	checked?: boolean;
	name?: string;
};

type TextareaAddProps = {
	rows?: number;
	cols?: number;
	wrap?: string;
	maxLength?: number;
	minLength?: number;
	required?: boolean;
	disabled?: boolean;
	readonly?: boolean;
	name?: string;
};

type SelectAddProps = {
	multiple?: boolean;
	required?: boolean;
	disabled?: boolean;
	name?: string;
	size?: number;
};

type AAddProps = {
	href?: string;
	target?: string;
	rel?: string;
	download?: string;
	type?: string;
};

type ImgAddProps = {
	src?: string;
	alt?: string;
	width?: number | string;
	height?: number | string;
	loading?: "lazy" | "eager";
	decoding?: "sync" | "async" | "auto";
};

export const htmlElements = {
	div: registerHtmlElement("div"),
	p: registerHtmlElement("p"),
	span: registerHtmlElement("span"),
	h1: registerHtmlElement("h1"),
	h2: registerHtmlElement("h2"),
	h3: registerHtmlElement("h3"),
	h4: registerHtmlElement("h4"),
	h5: registerHtmlElement("h5"),
	h6: registerHtmlElement("h6"),
	article: registerHtmlElement("article"),
	section: registerHtmlElement("section"),
	nav: registerHtmlElement("nav"),
	aside: registerHtmlElement("aside"),
	header: registerHtmlElement("header"),
	footer: registerHtmlElement("footer"),
	main: registerHtmlElement("main"),
	ul: registerHtmlElement("ul"),
	ol: registerHtmlElement("ol"),
	li: registerHtmlElement("li"),
	dl: registerHtmlElement("dl"),
	dt: registerHtmlElement("dt"),
	dd: registerHtmlElement("dd"),
	form: registerHtmlElement<"form", FromAddProps>(
		"form",
		new Set(["method", "action", "enctype", "target", "novalidate"])
	),
	label: registerHtmlElement("label"),
	input: registerHtmlElement<"input", InputAddProps>("input"),
	textarea: registerHtmlElement<"textarea", TextareaAddProps>(
		"textarea",
		new Set([
			"cols",
			"rows",
			"wrap",
			"maxLength",
			"minLength",
			"required",
			"disabled",
			"readonly",
			"name",
		])
	),
	button: registerHtmlElement("button"),
	select: registerHtmlElement<"select", SelectAddProps>(
		"select",
		new Set(["multiple", "required", "disabled", "name", "size"])
	),
	option: registerHtmlElement("option"),
	table: registerHtmlElement("table"),
	thead: registerHtmlElement("thead"),
	tbody: registerHtmlElement("tbody"),
	tfoot: registerHtmlElement("tfoot"),
	tr: registerHtmlElement("tr"),
	th: registerHtmlElement("th"),
	td: registerHtmlElement("td"),
	a: registerHtmlElement<"a", AAddProps>(
		"a",
		new Set(["href", "target", "rel", "download", "type"])
	),
	img: registerHtmlElement<"img", ImgAddProps>(
		"img",
		new Set(["src", "alt", "width", "height", "loading", "decoding"])
	),
	iframe: registerHtmlElement("iframe"),
	embed: registerHtmlElement("embed"),
	object: registerHtmlElement("object"),
	video: registerHtmlElement("video"),
	audio: registerHtmlElement("audio"),
	source: registerHtmlElement("source"),
	track: registerHtmlElement("track"),
	canvas: registerHtmlElement("canvas"),
	map: registerHtmlElement("map"),
	area: registerHtmlElement("area"),
	summary: registerHtmlElement("summary"),
	details: registerHtmlElement("details"),
	slot: registerHtmlElement("slot"),
	template: registerHtmlElement("template"),
	style: registerHtmlElement("style"),
	script: registerHtmlElement("script"),
	link: registerHtmlElement("link"),
	meta: registerHtmlElement("meta"),
	title: registerHtmlElement("title"),
	base: registerHtmlElement("base"),
	head: registerHtmlElement("head"),
	body: registerHtmlElement("body"),
	html: registerHtmlElement("html"),
	abbr: registerHtmlElement("abbr"),
	b: registerHtmlElement("b"),
	bdi: registerHtmlElement("bdi"),
	bdo: registerHtmlElement("bdo"),
	blockquote: registerHtmlElement("blockquote"),
	br: registerHtmlElement("br"),
	caption: registerHtmlElement("caption"),
	cite: registerHtmlElement("cite"),
	code: registerHtmlElement("code"),
	col: registerHtmlElement("col"),
	colgroup: registerHtmlElement("colgroup"),
	data: registerHtmlElement("data"),
	del: registerHtmlElement("del"),
	dfn: registerHtmlElement("dfn"),
	em: registerHtmlElement("em"),
	i: registerHtmlElement("i"),
	kbd: registerHtmlElement("kbd"),
	mark: registerHtmlElement("mark"),
	q: registerHtmlElement("q"),
	rp: registerHtmlElement("rp"),
	rt: registerHtmlElement("rt"),
	ruby: registerHtmlElement("ruby"),
	s: registerHtmlElement("s"),
	samp: registerHtmlElement("samp"),
	small: registerHtmlElement("small"),
	strong: registerHtmlElement("strong"),
	sub: registerHtmlElement("sub"),
	sup: registerHtmlElement("sup"),
	time: registerHtmlElement("time"),
	u: registerHtmlElement("u"),
	var: registerHtmlElement("var"),
	address: registerHtmlElement("address"),
	progress: registerHtmlElement("progress"),
	meter: registerHtmlElement("meter"),
	output: registerHtmlElement("output"),
	datalist: registerHtmlElement("datalist"),
	dialog: registerHtmlElement("dialog"),
	menu: registerHtmlElement("menu"),
	fieldset: registerHtmlElement("fieldset"),
	legend: registerHtmlElement("legend"),
	figcaption: registerHtmlElement("figcaption"),
	figure: registerHtmlElement("figure"),
	hgroup: registerHtmlElement("hgroup"),
	hr: registerHtmlElement("hr"),
	ins: registerHtmlElement("ins"),
	noscript: registerHtmlElement("noscript"),
	optgroup: registerHtmlElement("optgroup"),
	picture: registerHtmlElement("picture"),
	pre: registerHtmlElement("pre"),
	search: registerHtmlElement("search"),
	wbr: registerHtmlElement("wbr"),
} as const;

export const mathmlElements = {
	math: registerMathMLElement("math"),
	mstyle: registerMathMLElement("mstyle"),
	merror: registerMathMLElement("merror"),
	mtext: registerMathMLElement("mtext"),
	mspace: registerMathMLElement("mspace"),
	msqrt: registerMathMLElement("msqrt"),
	mroot: registerMathMLElement("mroot"),
	mrow: registerMathMLElement("mrow"),
	mfrac: registerMathMLElement("mfrac"),
	msup: registerMathMLElement("msup"),
	msub: registerMathMLElement("msub"),
	msubsup: registerMathMLElement("msubsup"),
	munder: registerMathMLElement("munder"),
	mover: registerMathMLElement("mover"),
	munderover: registerMathMLElement("munderover"),
	mmultiscripts: registerMathMLElement("mmultiscripts"),
	mtable: registerMathMLElement("mtable"),
	mtr: registerMathMLElement("mtr"),
	mtd: registerMathMLElement("mtd"),
	ms: registerMathMLElement("ms"),
	mphantom: registerMathMLElement("mphantom"),
	annotation: registerMathMLElement("annotation"),
	"annotation-xml": registerMathMLElement("annotation-xml"),
	mprescripts: registerMathMLElement("mprescripts"),
	maction: registerMathMLElement("maction"),
	mi: registerMathMLElement("mi"),
	mn: registerMathMLElement("mn"),
	mo: registerMathMLElement("mo"),
	mpadded: registerMathMLElement("mpadded"),
	semantics: registerMathMLElement("semantics"),
};

type SvgAddProps = {
	width?: number | string;
	height?: number | string;
	xmlns?: string;
	version?: string;
};

type CircleAddProps = {
	cx?: number | string;
	cy?: number | string;
	r?: number | string;
};

type PathAddProps = {
	d?: string;
	pathLength?: number;
};

type RectAddProps = {
	x?: number | string;
	y?: number | string;
	width?: number | string;
	height?: number | string;
	rx?: number | string;
	ry?: number | string;
};

type TextAddProps = {
	x?: number | string;
	y?: number | string;
	fontSize?: number | string;
	textAnchor?: "start" | "middle" | "end" | "inherit";
	fontWeight?: "normal" | "bold" | "bolder" | "lighter" | "inherit";
};

export const svgElements = {
	svg: registerSVGElement<"svg", SvgAddProps>(
		"svg",
		new Set(["width", "height", "xmlns", "version"])
	),
	defs: registerSVGElement("defs"),
	desc: registerSVGElement("desc"),
	title: registerSVGElement("title"),
	metadata: registerSVGElement("metadata"),
	g: registerSVGElement("g"),
	a: registerSVGElement("a"),
	circle: registerSVGElement<"circle", CircleAddProps>(
		"circle",
		new Set(["cx", "cy", "r"])
	),
	ellipse: registerSVGElement("ellipse"),
	line: registerSVGElement("line"),
	path: registerSVGElement<"path", PathAddProps>(
		"path",
		new Set(["d", "pathLength"])
	),
	polygon: registerSVGElement("polygon"),
	polyline: registerSVGElement("polyline"),
	rect: registerSVGElement<"rect", RectAddProps>(
		"rect",
		new Set(["x", "y", "width", "height", "rx", "ry"])
	),
	use: registerSVGElement("use"),
	stop: registerSVGElement("stop"),
	tspan: registerSVGElement("tspan"),
	text: registerSVGElement<"text", TextAddProps>(
		"text",
		new Set(["x", "y", "fontSize", "textAnchor", "fontWeight"])
	),
	image: registerSVGElement("image"),
	clipPath: registerSVGElement("clipPath"),
	linearGradient: registerSVGElement("linearGradient"),
	radialGradient: registerSVGElement("radialGradient"),
	mask: registerSVGElement("mask"),
	pattern: registerSVGElement("pattern"),
	marker: registerSVGElement("marker"),
	symbol: registerSVGElement("symbol"),
	view: registerSVGElement("view"),
	animateMotion: registerSVGElement("animateMotion"),
	animateTransform: registerSVGElement("animateTransform"),
	filter: registerSVGElement("filter"),
	style: registerSVGElement("style"),
	script: registerSVGElement("script"),
	animate: registerSVGElement("animate"),
	set: registerSVGElement("set"),
	mpath: registerSVGElement("mpath"),
	foreignObject: registerSVGElement("foreignObject"),
	textPath: registerSVGElement("textPath"),
	feBlend: registerSVGElement("feBlend"),
	feColorMatrix: registerSVGElement("feColorMatrix"),
	feComponentTransfer: registerSVGElement("feComponentTransfer"),
	feComposite: registerSVGElement("feComposite"),
	feConvolveMatrix: registerSVGElement("feConvolveMatrix"),
	feDiffuseLighting: registerSVGElement("feDiffuseLighting"),
	feDisplacementMap: registerSVGElement("feDisplacementMap"),
	feFlood: registerSVGElement("feFlood"),
	feGaussianBlur: registerSVGElement("feGaussianBlur"),
	feImage: registerSVGElement("feImage"),
	feMerge: registerSVGElement("feMerge"),
	feMorphology: registerSVGElement("feMorphology"),
	feOffset: registerSVGElement("feOffset"),
	feSpecularLighting: registerSVGElement("feSpecularLighting"),
	feTile: registerSVGElement("feTile"),
	feTurbulence: registerSVGElement("feTurbulence"),
	feDistantLight: registerSVGElement("feDistantLight"),
	fePointLight: registerSVGElement("fePointLight"),
	feSpotLight: registerSVGElement("feSpotLight"),
	feFuncR: registerSVGElement("feFuncR"),
	feFuncG: registerSVGElement("feFuncG"),
	feFuncB: registerSVGElement("feFuncB"),
	feFuncA: registerSVGElement("feFuncA"),
	feDropShadow: registerSVGElement("feDropShadow"),
	feMergeNode: registerSVGElement("feMergeNode"),
	switch: registerSVGElement("switch"),
};

/**
 * @alias elements
 */
export const $El = htmlElements;

/**
 * @alias mathmlElements
 */
export const $MathEl = mathmlElements;

/**
 * @alias svgElements
 */
export const $SvgEl = svgElements;

export const $AllEl = {
	...htmlElements,
	...mathmlElements,
	...svgElements,
};
