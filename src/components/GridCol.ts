import { html, TemplateResult } from "lit";
import {
	getComponentCount,
	getRandomClassName,
	LycoComponent,
	renderFn,
	renderFnType,
	WithHtml,
} from "./core";

export function GridCol(props?: {
	gap?: string | number;
}): WithHtml<renderFnType>;

export function GridCol(
	props?: { gap?: string | number },
	children?: renderFnType
): TemplateResult<1>;

export function GridCol(
	props?: { gap?: string | number },
	children?: renderFnType
) {
	if (children === undefined) {
		const _ = (children?: renderFnType) => GridCol(props, children ?? html``);
		_.html = (strings: TemplateStringsArray, ...values: unknown[]) =>
			GridCol(props, html(strings, ...values));
		return _;
	}
	const now = getComponentCount("GridCol");
	const _className =
		getRandomClassName("GridCol::grid-col") + "-lyco-now-" + now; // 生成随机类名
	const gapStyle = props?.gap ? `column-gap: ${props.gap};` : "";
	const css = `
      .${_className} {
        display: grid;
        grid-auto-flow: column;
        ${gapStyle}
      }
    `;
	return LycoComponent(
		"GridCol",
		html`
			<style>
				${css}
			</style>
			<div class="${_className}">${renderFn(children)}</div>
		`
	);
}
