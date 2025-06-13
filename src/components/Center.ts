import { html, TemplateResult } from "lit";
import { ref } from "lit/directives/ref.js";
import {
	createEventBinder,
	OnEvent,
	renderFn,
	renderFnType,
	WithHtml,
} from "./core";
export function Center(props?: {
	width?: string;
	height?: string;
	background?: string;
	on?: OnEvent;
}): WithHtml<renderFnType>;

export function Center(
	props?: {
		width?: string;
		height?: string;
		background?: string;
		on?: OnEvent;
	},
	children?: renderFnType
): TemplateResult<1>;

export function Center(
	props?: {
		width?: string;
		height?: string;
		background?: string;
		on?: OnEvent;
	},
	children?: renderFnType
): TemplateResult<1> | WithHtml<renderFnType> {
	if (children === undefined) {
		const _ = (children?: renderFnType) => Center(props, children ?? html``);
		_.html = (strings: TemplateStringsArray, ...values: unknown[]) =>
			Center(props, html(strings, ...values));
		return _;
	}
	const w = props?.width ? `width: ${props.width};` : "";
	const h = props?.height ? `height: ${props.height};` : "";
	const bg = props?.background ? `background: ${props.background};` : "";
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
      justify-content: center;
      align-items: center;
      ${w} ${h} ${bg}
    "
		>
			${renderFn(children)}
		</div>
	`;
}
