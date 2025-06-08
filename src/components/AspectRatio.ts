import { html } from "lit";
import { renderFn, renderFnType } from "./core";

export function AspectRatio(
	props: {
		ratio: number; // 宽高比，例如 16/9、4/3
		maxWidth?: string;
		background?: string;
		overflow?: string;
	},
	children?: renderFnType
) {
	const paddingTop = `${100 / props.ratio}%`;
	const mw = props.maxWidth ? `max-width: ${props.maxWidth};` : "";
	const bg = props.background ? `background: ${props.background};` : "";
	const ov = props.overflow ?? "hidden";

	return html`
		<div
			style="
      position: relative;
      width: 100%;
      ${mw}
      ${bg}
      overflow: ${ov};
    "
		>
			<div style="width: 100%; padding-top: ${paddingTop};"></div>
			<div
				style="
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      "
			>
				${renderFn(children)}
			</div>
		</div>
	`;
}
