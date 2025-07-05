import { html, TemplateResult } from "lit";
import { ref } from "lit/directives/ref.js";
import {
	createEventBinder,
	getComponentCount,
	getRandomClassName,
	LycoComponent,
	OnEvent,
	renderFnOrArray,
	renderFnOrArrayOrCurry,
	renderFnOrArrayType,
	Temp,
} from "../core";

export function ListGroup(props?: {
	bordered?: boolean;
	striped?: boolean;
	hover?: boolean;
	className?: string;
	on?: OnEvent;
}): (children?: renderFnOrArrayType) => TemplateResult<1>;

export function ListGroup(
	props?: {
		bordered?: boolean;
		striped?: boolean;
		hover?: boolean;
		className?: string;
		on?: OnEvent;
	},
	children?: renderFnOrArrayType
): TemplateResult<1>;

export function ListGroup(
	props?: {
		bordered?: boolean;
		striped?: boolean;
		hover?: boolean;
		className?: string;
		on?: OnEvent;
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
	const now = getComponentCount("ListGroup");
	const _className =
		props?.className ??
		getRandomClassName("ListGroup::list-group") + "-lyco-now-" + now;
	const injectRender = (
		children: Temp,
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
	`;
	const binder = createEventBinder(props?.on ?? {});
	const render = (children: Temp | Temp[]) =>
		LycoComponent(
			"ListGroup",
			html`
				<style>
					${css}
				</style>
				<ul
					${ref((el) => {
						if (el) {
							binder.bind(el);
						} else {
							binder.unbindAll();
						}
					})}
					class="${_className}"
				>
					${renderFnOrArray(children, injectRender)}
				</ul>
			`
		);

	return renderFnOrArrayOrCurry(children, render);
}
