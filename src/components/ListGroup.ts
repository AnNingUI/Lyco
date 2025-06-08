import { html } from "lit";
import { renderFn, renderFnType } from "./core";

export function ListGroup(
	props?: { bordered?: boolean; striped?: boolean; hover?: boolean },
	children?: renderFnType
) {
	const bordered = props?.bordered
		? `border: 1px solid #ddd; border-radius: 4px`
		: "";
	const striped = props?.striped
		? `li:nth-child(even) { background: #f9f9f9; }`
		: "";
	const hover = props?.hover
		? `li:hover { background: #f1f1f1; cursor: pointer; }`
		: "";
	return html`
		<style>
			ul.list-group {
			  list-style: none;
			  margin: 0;
			  padding: 0;
			  ${bordered};
			}
			ul.list-group li {
			  padding: 12px 16px;
			  ${props?.bordered ? "border-bottom: 1px solid #ddd" : ""};
			}
			ul.list-group li:last-child {
			  ${props?.bordered ? "border-bottom: none" : ""};
			}
			${striped}
			${hover}
		</style>
		<ul class="list-group">
			${renderFn(children)}
		</ul>
	`;
}
