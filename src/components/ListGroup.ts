import { html, TemplateResult } from "lit";
import {
	randomClassName,
	renderFnOrArray,
	renderFnOrArrayOrCurry,
	renderFnOrArrayType,
} from "./core";

export function ListGroup(
	props?: {
		bordered?: boolean;
		striped?: boolean;
		hover?: boolean;
		className?: string;
	},
	children?: renderFnOrArrayType
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
	const _className = props?.className ?? randomClassName("list-group");
	const injectRender = (
		children: TemplateResult,
		_idx?: number,
		isArray?: boolean,
		_isFunc?: boolean
	) => {
		if (!isArray) {
			return children;
		} else {
			return html` <li>${children}</li> `;
		}
	};
	const render = (children: TemplateResult | TemplateResult[]) => html`
		<style>
			ul.${_className} {
			  list-style: none;
			  margin: 0;
			  padding: 0;
			  ${bordered};
			}
			ul.${_className} li {
			  padding: 12px 16px;
			  ${props?.bordered ? "border-bottom: 1px solid #ddd" : ""};
			}
			ul.${_className} li:last-child {
			  ${props?.bordered ? "border-bottom: none" : ""};
			}
			${striped}
			${hover}
		</style>
		<ul class="${_className}">
			${renderFnOrArray(children, injectRender)}
		</ul>
	`;

	return renderFnOrArrayOrCurry(children, render);
}
