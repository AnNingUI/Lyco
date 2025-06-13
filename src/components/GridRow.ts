import { html, TemplateResult } from "lit";
import {
	getComponentCount,
	getRandomClassName,
	LycoComponent,
	renderFn,
	renderFnType,
	WithHtml,
} from "./core";

export function GridRow(props?: {
	gap?: string | number;
}): WithHtml<renderFnType>;

export function GridRow(
	props?: { gap?: string | number },
	children?: renderFnType
): TemplateResult<1>;

export function GridRow(
	props?: { gap?: string | number },
	children?: renderFnType
) {
	if (children === undefined) {
		const _ = (children?: renderFnType) => GridRow(props, children ?? html``);
		_.html = (strings: TemplateStringsArray, ...values: unknown[]) =>
			GridRow(props, html(strings, ...values));
		return _;
	}

	const now = getComponentCount("GridRow");
	const _className =
		getRandomClassName("GridRow::grid-row") + "-lyco-now-" + now; // 生成随机类名
	const gapStyle = props?.gap ? `row-gap: ${props.gap};` : "";
	const css = `
      .${_className} {
        display: grid;
        grid-auto-flow: row;
        ${gapStyle}
      }
    `;
	return LycoComponent(
		"GridRow",
		html`
			<style>
				${css}
			</style>
			<div class="${_className}">${renderFn(children)}</div>
		`
	);
}
