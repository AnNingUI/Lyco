import { html, TemplateResult } from "lit";
import { ref } from "lit/directives/ref.js";
import {
	createEventBinder,
	OnEvent,
	renderFn,
	renderFnType,
	WithHtml,
} from "./core";

interface FlexProps {
	direction?: "row" | "column";
	justify?: string;
	align?: string;
	gap?: string | number;
	on?: OnEvent;
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
	const binder = createEventBinder(props?.on ?? {});

	return html`
		<div
			${ref(binder.auto)}
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
