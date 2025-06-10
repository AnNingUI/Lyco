import { html, TemplateResult } from "lit";
import { renderFnOrArray, renderFnOrArrayType } from "./core";

interface CardProps {
	padding?: string;
	borderRadius?: string;
	shadow?: string;
	background?: string;
}

export function Card(
	props?: CardProps
): (children?: renderFnOrArrayType) => TemplateResult<1>;

export function Card(
	props?: CardProps,
	children?: renderFnOrArrayType
): TemplateResult<1>;

export function Card(
	props?: CardProps,
	children?: renderFnOrArrayType
): TemplateResult<1> | ((children?: renderFnOrArrayType) => TemplateResult<1>) {
	if (children === undefined) {
		return (children) => Card(props, children ?? [html``]);
	}
	const pd = props?.padding ?? "16px";
	const br = props?.borderRadius ?? "8px";
	const sd = props?.shadow ?? "0 2px 8px rgba(0,0,0,0.1)";
	const bg = props?.background ?? "#fff";
	return html`
		<div
			style="
      background: ${bg};
      border-radius: ${br};
      box-shadow: ${sd};
      padding: ${pd};
      box-sizing: border-box;
    "
		>
			${renderFnOrArray(children)}
		</div>
	`;
}
