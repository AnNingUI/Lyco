import { html } from "lit";
import { renderFn, renderFnType } from "./core";

export function Table(
	props?: { striped?: boolean; hover?: boolean; bordered?: boolean },
	children?: renderFnType
) {
	const striped = props?.striped
		? `
    tr:nth-child(even) { background: #f9f9f9; }
  `
		: "";
	const hover = props?.hover
		? `
    tr:hover { background: #f1f1f1; }
  `
		: "";
	const bordered = props?.bordered
		? `
      table, th, td { border: 1px solid #ddd; }
    `
		: "";
	return html`
		<style>
			table {
			  width: 100%;
			  border-collapse: collapse;
			}
			th, td {
			  padding: 8px 12px;
			  text-align: left;
			}
			${striped}
			${hover}
			${bordered}
		</style>
		<table>
			${renderFn(children)}
		</table>
	`;
}
