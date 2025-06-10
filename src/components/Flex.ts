import { html, TemplateResult } from "lit";
import { renderFn, renderFnType, WithHtml } from "./core";
interface FlexProps {
	direction?: "row" | "column";
	justify?: string;
	align?: string;
	gap?: string | number;
}

export function Flex(props?: FlexProps): WithHtml<renderFnType>;

export function Flex(
	props?: FlexProps,
	children?: renderFnType
): TemplateResult<1>;

export function Flex(props?: FlexProps, children?: renderFnType) {
	if (children === undefined) {
		const _ = (children: renderFnType) => Flex(props, children ?? html``);
		_.html = (strings: TemplateStringsArray, ...values: unknown[]) =>
			Flex(props, html(strings, ...values));
		return _;
	}
	const dir = props?.direction ?? "row";
	return html`
		<div
			style="
      display: flex;
      flex-direction: ${dir};
      ${props?.justify ? `justify-content: ${props.justify};` : ""}
      ${props?.align ? `align-items: ${props.align};` : ""}
      ${props?.gap ? `gap: ${props.gap};` : ""}
    "
		>
			${renderFn(children)}
		</div>
	`;
}
