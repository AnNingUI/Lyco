import { html, TemplateResult } from "lit";
import { ref } from "lit/directives/ref.js";
import {
	createEventBinder,
	OnEvent,
	renderFnOrArray,
	renderFnOrArrayType,
} from "./core";

export type ContainerProps = {
	maxWidth?: string;
	padding?: string;
	background?: string;
	fullHeight?: boolean;
	on?: OnEvent;
};

export function Container(
	props?: ContainerProps
): (children?: renderFnOrArrayType) => TemplateResult<1>;

export function Container(
	props?: ContainerProps,
	children?: renderFnOrArrayType
): TemplateResult<1>;

export function Container(
	props?: ContainerProps,
	children?: renderFnOrArrayType
): TemplateResult<1> | ((children?: renderFnOrArrayType) => TemplateResult<1>) {
	if (children === undefined) {
		return (children) => Container(props, children ?? [html``]);
	}
	const mw = props?.maxWidth ?? "1024px";
	const pad = props?.padding ?? "0 16px";
	const bg = props?.background ? `background: ${props.background};` : "";
	const h = props?.fullHeight ? "height: 100%;" : "";
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
      width: 100%;
      max-width: ${mw};
      margin-left: auto;
      margin-right: auto;
      padding: ${pad};
      ${bg}
      ${h}
      box-sizing: border-box;
    "
		>
			${renderFnOrArray(children)}
		</div>
	`;
}
