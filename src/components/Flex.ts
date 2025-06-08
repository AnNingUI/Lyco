import { html } from "lit";
import { renderFn, renderFnType } from "./core";

export function Flex(
	props?: {
		direction?: "row" | "column";
		justify?: string;
		align?: string;
		gap?: string | number;
	},
	children?: renderFnType
) {
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
