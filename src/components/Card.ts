import { html, TemplateResult } from "lit";
import { ref } from "lit/directives/ref.js";
import {
	createEventBinder,
	OnEvent,
	renderFnOrArray,
	renderFnOrArrayType,
} from "../core";

interface CardProps {
	padding?: string;
	borderRadius?: string;
	shadow?: string;
	background?: string;
	on?: OnEvent;
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
	const binder = createEventBinder(props?.on ?? {});
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
