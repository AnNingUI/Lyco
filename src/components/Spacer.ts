import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createEventBinder, OnEvent } from "./core";

export function Spacer(props?: { on?: OnEvent }) {
	const binder = createEventBinder(props?.on ?? {});
	return html`<div ${ref(binder.auto)} style="flex: 1 1 auto;"></div>`;
}
