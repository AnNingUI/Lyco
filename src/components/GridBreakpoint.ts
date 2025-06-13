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

export type GridBreakpointProps = {
	breakpoints: Record<string, number>;
	defaultColumns?: number;
	gap?: string;
	className?: string;
	on?: OnEvent;
};

export function GridBreakpoint(
	props: GridBreakpointProps
): WithHtml<renderFnType>;

export function GridBreakpoint(
	props: GridBreakpointProps,
	children?: renderFnType
): TemplateResult<1>;

export function GridBreakpoint(
	props: GridBreakpointProps,
	children?: renderFnType
): TemplateResult<1> | WithHtml<renderFnType> {
	if (children === undefined) {
		const _ = (children?: renderFnType) =>
			GridBreakpoint(props, children ?? html``);
		_.html = (strings: TemplateStringsArray, ...values: unknown[]) =>
			GridBreakpoint(props, html(strings, ...values));
		return _;
	}

	const defCols = props.defaultColumns ?? 1;
	const gap = props.gap ?? "16px";
	const now = getComponentCount("GridBreakpoint");
	const _className =
		props.className ??
		getRandomClassName("GridBreakpoint::grid-breakpoint") + "-lyco-now-" + now;
	// 生成媒体查询 CSS
	const mqCss = Object.entries(props.breakpoints)
		.map(
			([query, cols]) =>
				"@media" +
				query +
				"{\n" +
				_className +
				"{ grid-template-columns: repeat(" +
				cols +
				", 1fr); }\n" +
				"}"
		)
		.join("\n");
	const css = `
	.${_className} {
	  display: grid;
	  grid-template-columns: repeat(${defCols}, 1fr);
	  gap: ${gap};
	}
	${mqCss}`;
	const binder = createEventBinder(props?.on ?? {});
	return LycoComponent(
		"GridBreakpoint",
		html`
			<style>
				${css}
			</style>
			<div
				${ref((el) => {
					if (el) {
						binder.bind(el);
					} else {
						binder.unbindAll();
					}
				})}
				class="${_className}"
			>
				${renderFn(children)}
			</div>
		`
	);
}
