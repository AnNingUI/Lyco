import { html, TemplateResult } from "lit";
import { ref } from "lit/directives/ref.js";
import {
	createEventBinder,
	OnEvent,
	renderFnOrArray,
	renderFnOrArrayType,
} from "./core";

interface AspectRatioProps {
	ratio: number; // 宽高比，例如 16/9、4/3
	maxWidth?: string;
	background?: string;
	overflow?: string;
	on?: OnEvent;
}

export function AspectRatio(
	props: AspectRatioProps
): (children?: renderFnOrArrayType) => TemplateResult<1>;

export function AspectRatio(
	props: AspectRatioProps,
	children?: renderFnOrArrayType
): TemplateResult<1>;

export function AspectRatio(
	props: AspectRatioProps,
	children?: renderFnOrArrayType
): TemplateResult<1> | ((children?: renderFnOrArrayType) => TemplateResult<1>) {
	if (children === undefined) {
		return (children) => AspectRatio(props, children ?? [html``]);
	}
	const paddingTop = `${100 / props.ratio}%`;
	const mw = props.maxWidth ? `max-width: ${props.maxWidth};` : "";
	const bg = props.background ? `background: ${props.background};` : "";
	const ov = props.overflow ?? "hidden";
	const binder = createEventBinder(props.on ?? {});
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
      position: relative;
      width: 100%;
      ${mw}
      ${bg}
      overflow: ${ov};
    "
		>
			<div style="width: 100%; padding-top: ${paddingTop};"></div>
			<div
				style="
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      "
			>
				${renderFnOrArray(children)}
			</div>
		</div>
	`;
}
