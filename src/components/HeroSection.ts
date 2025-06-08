import { html } from "lit";
import { renderFnOrArray, renderFnOrArrayType } from "./core";

export function HeroSection(
	props?: {
		backgroundImage?: string;
		height?: string;
		overlayColor?: string;
	},
	children?: renderFnOrArrayType
) {
	const bgImage = props?.backgroundImage
		? `background-image: url('${props.backgroundImage}');`
		: "";
	const height = props?.height ?? "400px";
	const overlay = props?.overlayColor ?? "rgba(0, 0, 0, 0.3)";
	return html`
		<div
			style="
      position: relative;
      width: 100%;
      height: ${height};
      ${bgImage}
      background-size: cover;
      background-position: center;
    "
		>
			<div
				style="
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background: ${overlay};
      "
			></div>
			<div
				style="
        position: relative;
        z-index: 1;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        text-align: center;
        padding: 0 16px;
        box-sizing: border-box;
      "
			>
				${renderFnOrArray(children)}
			</div>
		</div>
	`;
}
