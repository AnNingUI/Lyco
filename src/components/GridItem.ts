import { html, TemplateResult } from "lit";
import { ref } from "lit/directives/ref.js";
import {
	createEventBinder,
	OnEvent,
	renderFn,
	renderFnType,
	WithHtml,
} from "./core";

export function GridItem(props?: {
	span?: number;
	on?: OnEvent;
}): WithHtml<renderFnType>;

export function GridItem(
	props?: { span?: number; on?: OnEvent },
	children?: renderFnType
): TemplateResult<1>;

export function GridItem(
	props?: { span?: number; on?: OnEvent },
	children?: renderFnType
): TemplateResult<1> | WithHtml<renderFnType> {
	if (children === undefined) {
		const _ = (children?: renderFnType) => GridItem(props, children ?? html``);
		_.html = (strings: TemplateStringsArray, ...values: unknown[]) =>
			GridItem(props, html(strings, ...values));
		return _;
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
			style="${props?.span ? `grid-column: span ${props.span};` : ""}"
		>
			${renderFn(children)}
		</div>
	`;
}
