import { html, TemplateResult } from "lit";
import { ref } from "lit/directives/ref.js";
import {
	createEventBinder,
	OnEvent,
	renderFnOrArray,
	renderFnOrArrayType,
} from "../core";

interface WrapProps {
	direction?: "row" | "column";
	gap?: string | number;
	align?: string;
	justify?: string;
	// 新增 on 属性
	on?: OnEvent;
}

export function Wrap(
	props?: WrapProps
): (children?: renderFnOrArrayType) => TemplateResult<1>;

export function Wrap(
	props?: WrapProps,
	children?: renderFnOrArrayType
): TemplateResult<1>;

export function Wrap(
	props?: WrapProps,
	children?: renderFnOrArrayType
): TemplateResult<1> | ((children?: renderFnOrArrayType) => TemplateResult<1>) {
	const dir = props?.direction ?? "row";
	// 创建事件绑定器
	const binder = createEventBinder(props?.on ?? {});
	if (children === undefined) {
		return (children) => Wrap(props, children ?? html``);
	}
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
      flex-direction: ${dir};
      flex-wrap: wrap;
      ${props?.gap ? `gap: ${props.gap};` : ""}
      ${props?.align ? `align-items: ${props.align};` : ""}
      ${props?.justify ? `justify-content: ${props.justify};` : ""}
    "
		>
			${renderFnOrArray(children)}
		</div>
	`;
}
