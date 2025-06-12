import { html, TemplateResult } from "lit";
import {
	componentCount,
	getRandomClassName,
	renderFnOrArray,
	renderFnOrArrayOrCurry,
	renderFnOrArrayType,
} from "./core";

export function ListGroup(props?: {
	bordered?: boolean;
	striped?: boolean;
	hover?: boolean;
	className?: string;
}): (children?: renderFnOrArrayType) => TemplateResult<1>;

export function ListGroup(
	props?: {
		bordered?: boolean;
		striped?: boolean;
		hover?: boolean;
		className?: string;
	},
	children?: renderFnOrArrayType
): TemplateResult<1>;

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
	const now = componentCount.value;
	const _className =
		props?.className ??
		getRandomClassName("ListGroup::list-group") + `-lyco-now-${now}`;
	const injectRender = (
		children: TemplateResult<1>,
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
	const render = (children: TemplateResult<1> | TemplateResult<1>[]) => html`
		<lyco-component name="ListGroup">
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
		</lyco-component>
	`;

	return renderFnOrArrayOrCurry(children, render);
}
