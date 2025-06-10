import { html, TemplateResult } from "lit";
import { type renderFnOrArrayType, renderFnOrArray } from "./core";

export function AvatarStack(props?: {
	size?: string;
	overlap?: string;
}): (children?: renderFnOrArrayType) => TemplateResult<1>;

export function AvatarStack(
	props?: { size?: string; overlap?: string },
	children?: renderFnOrArrayType
): TemplateResult<1>;

export function AvatarStack(
	props?: { size?: string; overlap?: string },
	children?: renderFnOrArrayType
): TemplateResult<1> | ((children?: renderFnOrArrayType) => TemplateResult<1>) {
	if (children === undefined) {
		return (children?: renderFnOrArrayType) =>
			AvatarStack(props, children ?? [html``]);
	}
	const sz = props?.size ?? "32px";
	const ov = props?.overlap ?? "-8px";
	const injectBox = (avatar: TemplateResult, idx?: number) => html`
		<div
			style="
              width: ${sz};
              height: ${sz};
              border-radius: 50%;
              overflow: hidden;
              border: 2px solid #fff;
              margin-left: ${idx === 0 ? "0" : ov};
              box-sizing: content-box;
            "
		>
			${avatar}
		</div>
	`;
	return html`
		<div style="display: flex; align-items: center;">
			${renderFnOrArray(children, injectBox)}
		</div>
	`;
}
