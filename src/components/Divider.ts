import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createEventBinder, OnEvent } from "./core";

export function Divider(props?: {
	orientation?: "horizontal" | "vertical";
	thickness?: string;
	color?: string;
	margin?: string;
	on?: OnEvent;
}) {
	const ori = props?.orientation ?? "horizontal";
	const thickness = props?.thickness ?? "1px";
	const color = props?.color ?? "#e0e0e0";
	const margin = props?.margin ?? (ori === "horizontal" ? "8px 0" : "0 8px");
	const binder = createEventBinder(props?.on ?? {});

	const style =
		ori === "horizontal"
			? `width: 100%; height: ${thickness}; background: ${color}; margin: ${margin};`
			: `width: ${thickness}; height: 100%; background: ${color}; margin: ${margin};`;

	return html`<div
		${ref((el) => {
			if (el) {
				binder.bind(el);
			} else {
				binder.unbindAll();
			}
		})}
		style="${style}"
	></div>`;
}
