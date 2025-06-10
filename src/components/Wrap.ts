import { html, TemplateResult } from "lit";
import { renderFnOrArray, renderFnOrArrayType } from "./core";

interface WrapProps {
	direction?: "row" | "column";
	gap?: string | number;
	align?: string;
	justify?: string;
}

export function Wrap(
	props?: WrapProps
): (children?: renderFnOrArrayType) => TemplateResult<1>;

export function Wrap(
	props?: WrapProps,
	children?: renderFnOrArrayType
): TemplateResult<1>;

export function Wrap(
	props?: WrapProps,
	children?: renderFnOrArrayType
): TemplateResult<1> | ((children?: renderFnOrArrayType) => TemplateResult<1>) {
	const dir = props?.direction ?? "row";
	if (children === undefined) {
		return (children) => Wrap(props, children ?? html``);
	}
	return html`
		<div
			style="
      display: flex;
      flex-direction: ${dir};
      flex-wrap: wrap;
      ${props?.gap ? `gap: ${props.gap};` : ""}
      ${props?.align ? `align-items: ${props.align};` : ""}
      ${props?.justify ? `justify-content: ${props.justify};` : ""}
    "
		>
			${renderFnOrArray(children)}
		</div>
	`;
}
