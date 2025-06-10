import { html, TemplateResult } from "lit";
import { renderFn, renderFnType, WithHtml } from "./core";

interface StickyProps {
	top?: string;
	bottom?: string;
	zIndex?: number;
}

export function Sticky(props?: StickyProps): WithHtml<renderFnType>;

export function Sticky(
	props?: StickyProps,
	children?: renderFnType
): TemplateResult<1>;
export function Sticky(
	props?: StickyProps,
	children?: renderFnType
): TemplateResult<1> | WithHtml<renderFnType> {
	if (children === undefined) {
		const _ = (children?: renderFnType) => Sticky(props, children ?? html``);
		_.html = (strings: TemplateStringsArray, ...values: unknown[]) =>
			Sticky(props, html(strings, ...values));
		return _;
	}

	const top = props?.top ? `top: ${props.top};` : "";
	const bottom = props?.bottom ? `bottom: ${props.bottom};` : "";
	const z =
		typeof props?.zIndex === "number" ? `z-index: ${props.zIndex};` : "";

	return html`
		<div
			style="
      position: sticky;
      ${top} ${bottom}
      ${z}
    "
		>
			${renderFn(children)}
		</div>
	`;
}
