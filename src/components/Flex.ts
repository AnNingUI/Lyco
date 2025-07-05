import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import {
	createEventBinder,
	OnEvent,
	renderFn,
	renderFnType,
	Temp,
	WithHtml,
} from "../core";

interface FlexProps {
	direction?: "row" | "column";
	justify?: string;
	align?: string;
	gap?: string | number;
	on?: OnEvent;
}

export function Flex(props?: FlexProps): WithHtml<renderFnType>;

export function Flex(props?: FlexProps, children?: renderFnType): Temp;

export function Flex(
	props?: FlexProps,
	children?: renderFnType
): Temp | WithHtml<renderFnType> {
	if (children === undefined) {
		const _ = (children: renderFnType) => Flex(props, children ?? html``);
		_.html = (strings: TemplateStringsArray, ...values: unknown[]) =>
			Flex(props, html(strings, ...values));
		return _ as WithHtml<renderFnType>;
	}
	const dir = props?.direction ?? "row";
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
