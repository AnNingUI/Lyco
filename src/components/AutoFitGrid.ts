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

export function AutoFitGrid(props: {
	minItemWidth: string;
	gap?: string | number;
	on?: OnEvent;
}): WithHtml<renderFnType>;

export function AutoFitGrid(
	props: {
		minItemWidth: string;
		gap?: string | number;
		on?: OnEvent;
	},
	children?: renderFnType
): TemplateResult<1>;

export function AutoFitGrid(
	props: {
		minItemWidth: string;
		gap?: string | number;
		on?: OnEvent;
	},
	children?: renderFnType
): TemplateResult<1> | WithHtml<renderFnType> {
	if (children === undefined) {
		const _ = (children?: renderFnType) => AutoFitGrid(props, children);
		_.html = (strings: TemplateStringsArray, ...values: unknown[]) =>
			AutoFitGrid(props, html(strings, ...values));
		return _;
	}
	const now = getComponentCount("AutoFitGrid");
	const _className =
		getRandomClassName("AutoFitGrid::auto-fit-grid") + "-lyco-now-" + now; // 生成随机类名
	const gap = props?.gap ?? "16px";
	const css = `
      .${_className} {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(${props.minItemWidth}, 1fr));
        gap: ${gap};
      }
    `;
	const binder = createEventBinder(props.on ?? {});
	return LycoComponent(
		"AutoFitGrid",
		html`
			<style>
				${css}
			</style>
			<div class="${_className}" ${ref(binder.auto)}>${renderFn(children)}</div>
		`
	);
}
