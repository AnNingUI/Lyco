import { html, TemplateResult } from "lit";
import {
	componentCount,
	getRandomClassName,
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
	const now = componentCount.value;
	const _className =
		getRandomClassName("GridCol::grid-col") + +`-lyco-now-${now}`; // 生成随机类名
	const gapStyle = props?.gap ? `column-gap: ${props.gap};` : "";
	const css = `
      .${_className} {
        display: grid;
        grid-auto-flow: column;
        ${gapStyle}
      }
    `;
	return html`
		<lyco-component name="GridCol">
			<style>
				${css}
			</style>
			<div class="${_className}">${renderFn(children)}</div>
		</lyco-component>
	`;
}
