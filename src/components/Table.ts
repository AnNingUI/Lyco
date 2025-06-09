import { html } from "lit";
import { randomClassName, renderFn, renderFnType } from "./core";

export function Table(
	props?: { striped?: boolean; hover?: boolean; bordered?: boolean, className?: string },
	children?: renderFnType,
) {
	const _className = props?.className ?? randomClassName("table");
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
      .${_className} table, .${_className} th, .${_className} td { border: 1px solid #ddd; }
    `
		: "";
	return html`
		<style>
			.${_className} table {
			  width: 100%;
			  border-collapse: collapse;
			}
			.${_className} th, .${_className} td {
			  padding: 8px 12px;
			  text-align: left;
			}
			${striped}
			${hover}
			${bordered}
		</style>
		<table class="table">
			${renderFn(children)}
		</table>
	`;
}
