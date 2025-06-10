import { html, TemplateResult } from "lit";
import { randomClassName, renderFn, renderFnType, WithHtml } from "./core";

export type GridBreakpointProps = {
	breakpoints: Record<string, number>;
	defaultColumns?: number;
	gap?: string;
	className?: string;
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
	const _className = props.className ?? randomClassName("grid-breakpoint");
	// 生成媒体查询 CSS
	const mqCss = Object.entries(props.breakpoints)
		.map(
			([query, cols]) => `
      @media ${query} {
        .${_className} { grid-template-columns: repeat(${cols}, 1fr); }
      }
    `
		)
		.join("\n");
	return html`
		<style>
			.${_className} {
			  display: grid;
			  grid-template-columns: repeat(${defCols}, 1fr);
			  gap: ${gap};
			}
			${mqCss}
		</style>
		<div class="${_className}">${renderFn(children)}</div>
	`;
}
