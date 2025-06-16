import { html, TemplateResult } from "lit";
import { ref } from "lit/directives/ref.js";
import {
	createEventBinder,
	OnEvent,
	renderFnOrArray,
	renderFnOrArrayType,
} from "../core";

interface ZStackProps {
	width?: string;
	height?: string;
	background?: string;
	align?: "top-left" | "top-right" | "center" | "bottom-left" | "bottom-right";
	on?: OnEvent;
}

export function ZStack(
	props?: ZStackProps
): (children?: renderFnOrArrayType) => TemplateResult<1>;

export function ZStack(
	props?: ZStackProps,
	children?: renderFnOrArrayType
): TemplateResult<1>;

export function ZStack(
	props?: ZStackProps,
	children?: renderFnOrArrayType
): TemplateResult<1> | ((children?: renderFnOrArrayType) => TemplateResult<1>) {
	const w = props?.width ? `width: ${props.width};` : "";
	const h = props?.height ? `height: ${props.height};` : "";
	const bg = props?.background ? `background: ${props.background};` : "";
	const binder = createEventBinder(props?.on ?? {});
	if (children === undefined) {
		return (children?: renderFnOrArrayType) =>
			ZStack(props, children ?? [html``]);
	}

	let justify = "flex-start";
	let alignItems = "flex-start";
	switch (props?.align) {
		case "top-right":
			justify = "flex-end";
			alignItems = "flex-start";
			break;
		case "center":
			justify = "center";
			alignItems = "center";
			break;
		case "bottom-left":
			justify = "flex-start";
			alignItems = "flex-end";
			break;
		case "bottom-right":
			justify = "flex-end";
			alignItems = "flex-end";
			break;
		default:
			// "top-left"
			justify = "flex-start";
			alignItems = "flex-start";
	}

	return html`
		<div
			${ref((el) => {
				if (el) {
					binder.bind(el);
				} else {
					binder.unbindAll();
				}
			})}
			style="
      position: relative;
      display: flex;
      justify-content: ${justify};
      align-items: ${alignItems};
      ${w} ${h} ${bg}
    "
		>
			${renderFnOrArray(children)}
		</div>
	`;
}
