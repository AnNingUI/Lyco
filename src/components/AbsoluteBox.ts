import { html, TemplateResult } from "lit";
import { ref } from "lit/directives/ref.js";
import {
	createEventBinder,
	OnEvent,
	renderFn,
	renderFnOrCurry,
	renderFnType,
} from "../core";

type AbsoluteBoxProps = {
	top?: string;
	right?: string;
	bottom?: string;
	left?: string;
	width?: string;
	height?: string;
	zIndex?: number;
	style?: string;
	className?: string;
	on?: OnEvent;
};

export function AbsoluteBox(
	props?: AbsoluteBoxProps
): (children?: renderFnType) => TemplateResult<1>;

export function AbsoluteBox(
	props?: AbsoluteBoxProps,
	children?: renderFnType
): TemplateResult<1>;

export function AbsoluteBox(props?: AbsoluteBoxProps, children?: renderFnType) {
	const t = props?.top ? `top: ${props.top};` : "";
	const r = props?.right ? `right: ${props.right};` : "";
	const b = props?.bottom ? `bottom: ${props.bottom};` : "";
	const l = props?.left ? `left: ${props.left};` : "";
	const w = props?.width ? `width: ${props.width};` : "";
	const h = props?.height ? `height: ${props.height};` : "";
	const z =
		typeof props?.zIndex === "number" ? `z-index: ${props.zIndex};` : "";
	const style = props?.style ? props.style : "";
	const className = props?.className ? props.className : "";
	const binder = createEventBinder(props?.on ?? {});
	const render = (children?: renderFnType) => {
		return html`
			<div
				${ref((el) => {
					if (el) {
						binder.bind(el);
					} else {
						binder.unbindAll();
					}
				})}
				class="${className}"
				style="
      position: absolute;
      ${t} ${r} ${b} ${l}
      ${w} ${h}
      ${z}
	  ${style}
    "
			>
				${renderFn(children)}
			</div>
		`;
	};
	return renderFnOrCurry(children, render);
}
