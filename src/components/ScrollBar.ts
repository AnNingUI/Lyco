import { html, TemplateResult } from "lit";
import { ref } from "lit/directives/ref.js";
import {
	createEventBinder,
	getComponentCount,
	getRandomClassName,
	LycoComponent,
	OnEvent,
	renderFn,
	renderFnType,
	WithHtml,
} from "./core";

export function ScrollBar(props?: {
	direction?: "vertical" | "horizontal";
	height?: string;
	width?: string;
	customCss?: string;
	className?: string;
	on?: OnEvent;
}): WithHtml<renderFnType>;

export function ScrollBar(
	props?: {
		direction?: "vertical" | "horizontal";
		height?: string;
		width?: string;
		customCss?: string;
		className?: string;
		on?: OnEvent;
	},
	children?: renderFnType
): TemplateResult<1>;

export function ScrollBar(
	props?: {
		direction?: "vertical" | "horizontal";
		height?: string;
		width?: string;
		customCss?: string;
		className?: string;
		on?: OnEvent;
	},
	children?: renderFnType
): TemplateResult<1> | WithHtml<renderFnType> {
	if (children === undefined) {
		const _ = (children?: renderFnType) => ScrollBar(props, children ?? html``);
		_.html = (strings: TemplateStringsArray, ...values: unknown[]) =>
			ScrollBar(props, html(strings, ...values));
		return _;
	}
	const dir = props?.direction ?? "vertical";
	const h = props?.height ?? "100%";
	const w = props?.width ?? "100%";
	const extraCss = props?.customCss ?? "";
	const now = getComponentCount("ScrollBar");
	const _className =
		props?.className ??
		getRandomClassName("ScrollBar::scrollbar-container") + "-lyco-now-" + now;
	const overflowStyle =
		dir === "horizontal"
			? "overflow-x: auto; overflow-y: hidden"
			: "overflow-y: auto; overflow-x: hidden";

	const css = `
	.${_className} {
	  ${overflowStyle};
	  width: ${w};
	  height: ${h};
	}
	.${_className}::-webkit-scrollbar {
	  width: 8px;
	  height: 8px;
	}
	.${_className}::-webkit-scrollbar-thumb {
	  background-color: rgba(0, 0, 0, 0.2);
	  border-radius: 4px;
	}
	.${_className}::-webkit-scrollbar-track {
	  background: rgba(0, 0, 0, 0.05);
	}
	${extraCss}
	`;
	const binder = createEventBinder(props?.on ?? {});
	return LycoComponent(
		"ScrollBar",
		html`
			<style>
				${css}
			</style>
			<div ${ref(binder.auto)} class="${_className}">${renderFn(children)}</div>
		`
	);
}
