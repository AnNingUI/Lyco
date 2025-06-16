import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createEventBinder, OnEvent } from "../core";

export function SizedBox(props?: {
	width?: string;
	height?: string;
	on?: OnEvent;
}) {
	const w = props?.width ? `width: ${props.width};` : "";
	const h = props?.height ? `height: ${props.height};` : "";
	const binder = createEventBinder(props?.on ?? {});

	return html`<div
		${ref((el) => {
			if (el) {
				binder.bind(el);
			} else {
				binder.unbindAll();
			}
		})}
		style="${w} ${h}"
	></div>`;
}
