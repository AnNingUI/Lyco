import { html } from "lit";
import { randomClassName, renderFn, renderFnType } from "./core";

export function GridBreakpoint(
	props: {
		breakpoints: Record<string, number>;
		defaultColumns?: number;
		gap?: string;
		className?: string;
	},
	children?: renderFnType
) {
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
