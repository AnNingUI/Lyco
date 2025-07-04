import { html, TemplateResult } from "lit";
import { ref } from "lit/directives/ref.js";
import {
	createEventBinder,
	OnEvent,
	renderFnOrArray,
	renderFnOrArrayType,
} from "../core";

export function Column(props?: {
	space?: string | number;
	center?: boolean;
	className?: string;
	style?: string;
	on?: OnEvent;
}): (children?: renderFnOrArrayType) => TemplateResult<1>;

export function Column(
	props?: {
		space?: string | number;
		center?: boolean;
		className?: string;
		style?: string;
		on?: OnEvent;
	},
	children?: renderFnOrArrayType
): TemplateResult<1>;

export function Column(
	props?: {
		space?: string | number;
		center?: boolean;
		className?: string;
		style?: string;
		on?: OnEvent;
	},
	children?: renderFnOrArrayType
): TemplateResult<1> | ((children?: renderFnOrArrayType) => TemplateResult<1>) {
	const binder = createEventBinder(props?.on ?? {});
	if (children === undefined) {
		return (children) => Column(props, children ?? [html``]);
	}
	return html`
		<div
			.class="${props?.className}"
			${ref((el) => {
				if (el) {
					binder.bind(el);
				} else {
					binder.unbindAll();
				}
			})}
			style="
      display: flex;
      flex-direction: column;
	  ${props?.center ? "align-items: center;" : ""}
      ${props?.space ? `gap: ${props.space};` : ""}
      ${props?.style ?? ""}
    "
		>
			${renderFnOrArray(children)}
		</div>
	`;
}
