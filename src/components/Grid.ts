import { html, TemplateResult } from "lit";
import { ref } from "lit/directives/ref.js";
import {
	createEventBinder,
	OnEvent,
	renderFnOrArray,
	renderFnOrArrayType,
} from "./core";

export function Grid(props?: {
	columns?: number;
	gap?: string | number;
	on?: OnEvent;
}): (children?: renderFnOrArrayType) => TemplateResult<1>;

export function Grid(
	props?: { columns?: number; gap?: string | number; on?: OnEvent },
	children?: renderFnOrArrayType
): TemplateResult<1>;

export function Grid(
	props?: { columns?: number; gap?: string | number; on?: OnEvent },
	children?: renderFnOrArrayType
): TemplateResult<1> | ((children?: renderFnOrArrayType) => TemplateResult<1>) {
	if (children === undefined) {
		return (children) => Grid(props, children ?? [html``]);
	}
	const cols = props?.columns ?? 1;
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
        display: grid;
        grid-template-columns: repeat(${cols}, 1fr);
        ${props?.gap ? `gap: ${props.gap};` : ""}
      "
		>
			${renderFnOrArray(children)}
		</div>
	`;
}
