import { html, TemplateResult } from "lit";
import { ref } from "lit/directives/ref.js";
import {
	createEventBinder,
	OnEvent,
	renderFnOrArray,
	renderFnOrArrayType,
} from "./core";

export function Row(props?: {
	space?: string | number;
	center?: boolean;
	on?: OnEvent;
}): (children?: renderFnOrArrayType) => TemplateResult<1>;

export function Row(
	props?: { space?: string | number; center?: boolean; on?: OnEvent },
	children?: renderFnOrArrayType
): TemplateResult<1>;

export function Row(
	props?: { space?: string | number; center?: boolean; on?: OnEvent },
	children?: renderFnOrArrayType
): TemplateResult<1> | ((children?: renderFnOrArrayType) => TemplateResult<1>) {
	if (children === undefined) {
		return (children?: renderFnOrArrayType) => Row(props, children ?? [html``]);
	}
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
        display: flex;
        flex-direction: row;
		${props?.center ? "align-items: center;" : ""}
        ${props?.space ? `gap: ${props.space};` : ""}
      "
		>
			${renderFnOrArray(children)}
		</div>
	`;
}
