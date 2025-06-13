import { html, TemplateResult } from "lit";
import {
	getComponentCount,
	getRandomClassName,
	LycoComponent,
	renderFn,
	renderFnType,
	WithHtml,
} from "./core";

export interface TableProps {
	striped?: boolean;
	hover?: boolean;
	bordered?: boolean;
	className?: string;
}

export function Table(props?: TableProps): WithHtml<renderFnType>;

export function Table(
	props?: TableProps,
	children?: renderFnType // TemplateResult | (() => TemplateResult)
): TemplateResult<1>;

export function Table(
	props?: TableProps,
	children?: renderFnType
): TemplateResult<1> | WithHtml<renderFnType> {
	// 如果第二个参数 children 没传，则返回一个只接收 children 的函数
	if (children === undefined) {
		const _ = (children?: renderFnType) => Table(props, children ?? html``);
		_.html = (strings: TemplateStringsArray, ...values: unknown[]) =>
			Table(props, html(strings, ...values));
		return _;
	}

	const now = getComponentCount("Table");

	// 到这里说明 props 和 children 都已经传齐
	const _className =
		props?.className ?? getRandomClassName("Table::table") + `-lyco-now-${now}`;
	const striped = props?.striped
		? `
      .${_className} tr:nth-child(even) { background: #f9f9f9; }
    `
		: "";
	const hover = props?.hover
		? `
      .${_className} tr:hover { background: #f1f1f1; }
    `
		: "";
	const bordered = props?.bordered
		? `
      .${_className}, .${_className} th, .${_className} td { border: 1px solid #ddd; }
    `
		: "";

	const css = `
	/* 将表格包裹在带有 _className 的 div 里，使后续 CSS 作用于该 div 下的 table */
	.${_className} table {
	  width: 100%;
	  border-collapse: collapse;
	}
	.${_className} th,
	.${_className} td {
	  padding: 8px 12px;
	  text-align: left;
	}
	${striped}
	${hover}
	${bordered}
	`;

	return LycoComponent(
		"Table",
		html`
			<style>
				${css}
			</style>

			<div class="${_className}">
				<table>
					${renderFn(children)}
				</table>
			</div>
		`
	);
}
