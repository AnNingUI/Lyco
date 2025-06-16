// 假设以下代码存放在 Lyco/src/components/List.ts 文件中
import { html, TemplateResult } from "lit";
import {
	getComponentCount,
	getRandomClassName,
	LycoComponent,
	renderFnOrArray,
	renderFnOrArrayType,
} from "../core";

// ListItem 组件
export function ListItem(children?: renderFnOrArrayType): TemplateResult<1> {
	return html` <li>${renderFnOrArray(children)}</li> `;
}

// List 组件
export function List(props?: {
	bordered?: boolean;
	striped?: boolean;
	hover?: boolean;
	className?: string;
}): (children?: renderFnOrArrayType) => TemplateResult<1>;

export function List(
	props?: {
		bordered?: boolean;
		striped?: boolean;
		hover?: boolean;
		className?: string;
	},
	children?: renderFnOrArrayType
): TemplateResult<1>;

export function List(
	props?: {
		bordered?: boolean;
		striped?: boolean;
		hover?: boolean;
		className?: string;
	},
	children?: renderFnOrArrayType
): ((children?: renderFnOrArrayType) => TemplateResult<1>) | TemplateResult<1> {
	const bordered = props?.bordered
		? `border: 1px solid #ddd; border-radius: 4px`
		: "";
	const striped = props?.striped
		? `li:nth-child(even) { background: #f9f9f9; }`
		: "";
	const hover = props?.hover
		? `li:hover { background: #f1f1f1; cursor: pointer; }`
		: "";
	const now = getComponentCount("List");
	const _className =
		props?.className ?? getRandomClassName("List::list") + `-lyco-now-${now}`;

	const css = `
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
    `.toString();
	const render = (children?: renderFnOrArrayType) =>
		LycoComponent(
			"List",
			html`
				<style>
					${css}
				</style>
				<ul class="${_className}">
					${renderFnOrArray(children)}
				</ul>
			`
		);

	return children === undefined ? render : render(children);
}
