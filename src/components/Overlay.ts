import { html, TemplateResult } from "lit";
import { ref } from "lit/directives/ref.js";
import {
	createEventBinder,
	OnEvent,
	renderFnOrArray,
	renderFnOrArrayType,
} from "./core";

export function Overlay(props?: {
	background?: string;
	zIndex?: number;
	fullScreen?: boolean;
	on?: OnEvent;
}): (children?: renderFnOrArrayType) => TemplateResult<1>;

export function Overlay(
	props?: {
		background?: string;
		zIndex?: number;
		fullScreen?: boolean;
		on?: OnEvent;
	},
	children?: renderFnOrArrayType
): TemplateResult<1>;

export function Overlay(
	props?: {
		background?: string;
		zIndex?: number;
		fullScreen?: boolean;
		on?: OnEvent;
	},
	children?: renderFnOrArrayType
): TemplateResult<1> | ((children?: renderFnOrArrayType) => TemplateResult<1>) {
	if (children === undefined) {
		return (children?: renderFnOrArrayType) =>
			Overlay(props, children ?? [html``]);
	}
	const bg = props?.background ?? "rgba(0, 0, 0, 0.5)";
	const z = props?.zIndex ?? 1000;
	const full = props?.fullScreen !== false;
	const binder = createEventBinder(props?.on ?? {});

	return html`
		<div
			${ref(binder.auto)}
			style="
        position: ${full ? "fixed" : "absolute"};
        top: 0; left: 0; right: 0; bottom: 0;
        background: ${bg};
        z-index: ${z};
        display: flex;
        justify-content: center;
        align-items: center;
      "
		>
			${renderFnOrArray(children)}
		</div>
	`;
}
