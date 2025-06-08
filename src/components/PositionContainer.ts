import { html } from "lit";
import { renderFn, renderFnType } from "./core";

export function PositionContainer(
	props?: { width?: string; height?: string; background?: string },
	children?: renderFnType
) {
	const w = props?.width ? `width: ${props.width};` : "";
	const h = props?.height ? `height: ${props.height};` : "";
	const bg = props?.background ? `background: ${props.background};` : "";

	return html`
		<div
			style="
      position: relative;
      ${w} ${h} ${bg}
      overflow: hidden;
    "
		>
			${renderFn(children)}
		</div>
	`;
}
