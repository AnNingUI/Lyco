import { html } from "lit";
import { renderFn, renderFnType } from "./core";

export function GridBreakpoint(
	props: {
		breakpoints: Record<string, number>;
		defaultColumns?: number;
		gap?: string;
	},
	children?: renderFnType
) {
	const defCols = props.defaultColumns ?? 1;
	const gap = props.gap ?? "16px";
	// 生成媒体查询 CSS
	const mqCss = Object.entries(props.breakpoints)
		.map(
			([query, cols]) => `
      @media ${query} {
        .grid-breakpoint { grid-template-columns: repeat(${cols}, 1fr); }
      }
    `
		)
		.join("\n");
	return html`
		<style>
			.grid-breakpoint {
			  display: grid;
			  grid-template-columns: repeat(${defCols}, 1fr);
			  gap: ${gap};
			}
			${mqCss}
		</style>
		<div class="grid-breakpoint">${renderFn(children)}</div>
	`;
}
