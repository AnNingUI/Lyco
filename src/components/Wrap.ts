import { html } from "lit";
import { renderFn, renderFnType } from "./core";

export function Wrap(
	props?: {
		direction?: "row" | "column";
		gap?: string | number;
		align?: string;
		justify?: string;
	},
	children?: renderFnType
) {
	const dir = props?.direction ?? "row";
	return html`
		<div
			style="
      display: flex;
      flex-direction: ${dir};
      flex-wrap: wrap;
      ${props?.gap ? `gap: ${props.gap};` : ""}
      ${props?.align ? `align-items: ${props.align};` : ""}
      ${props?.justify ? `justify-content: ${props.justify};` : ""}
    "
		>
			${renderFn(children)}
		</div>
	`;
}
