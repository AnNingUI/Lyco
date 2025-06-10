import { html, TemplateResult } from "lit";
import { renderFnOrArray, renderFnOrArrayType } from "./core";

export type ContainerProps = {
	maxWidth?: string;
	padding?: string;
	background?: string;
	fullHeight?: boolean;
};

export function Container(
	props?: ContainerProps
): (children?: renderFnOrArrayType) => TemplateResult<1>;

export function Container(
	props?: ContainerProps,
	children?: renderFnOrArrayType
): TemplateResult<1>;

export function Container(
	props?: ContainerProps,
	children?: renderFnOrArrayType
): TemplateResult<1> | ((children?: renderFnOrArrayType) => TemplateResult<1>) {
	if (children === undefined) {
		return (children) => Container(props, children ?? [html``]);
	}
	const mw = props?.maxWidth ?? "1024px";
	const pad = props?.padding ?? "0 16px";
	const bg = props?.background ? `background: ${props.background};` : "";
	const h = props?.fullHeight ? "height: 100%;" : "";

	return html`
		<div
			style="
      width: 100%;
      max-width: ${mw};
      margin-left: auto;
      margin-right: auto;
      padding: ${pad};
      ${bg}
      ${h}
      box-sizing: border-box;
    "
		>
			${renderFnOrArray(children)}
		</div>
	`;
}
