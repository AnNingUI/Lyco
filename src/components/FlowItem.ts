import { html, TemplateResult } from "lit";
import { ref } from "lit/directives/ref.js";
import {
	createEventBinder,
	OnEvent,
	renderFn,
	renderFnType,
	WithHtml,
} from "./core";

export function FlowItem(props?: { on?: OnEvent }): WithHtml<renderFnType>;
export function FlowItem(
	props?: { on?: OnEvent },
	children?: renderFnType
): TemplateResult<1>;

export function FlowItem(
	props?: { on?: OnEvent },
	children?: renderFnType
): TemplateResult<1> | WithHtml<renderFnType> {
	if (children === undefined) {
		const _ = (children?: renderFnType) => FlowItem(props, children ?? html``);
		_.html = (strings: TemplateStringsArray, ...values: unknown[]) =>
			FlowItem(props, html(strings, ...values));
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
			style="break-inside: avoid; margin-bottom: 16px;"
		>
			${renderFn(children)}
		</div>
	`;
}
