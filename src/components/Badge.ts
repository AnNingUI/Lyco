// Badge.ts
import { html } from "lit";
import { renderFn, renderFnType } from "./core";

export function Badge(
	props?: {
		content?: string | number;
		position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
		size?: string;
		background?: string;
		color?: string;
	},
	children?: renderFnType
) {
	const pos = props?.position ?? "top-right";
	const size = props?.size ?? "16px";
	const bg = props?.background ?? "red";
	const col = props?.color ?? "#fff";
	// 计算定位
	const [top, right, bottom, left] = [
		pos.includes("top") ? "0" : "auto",
		pos.includes("right") ? "0" : "auto",
		pos.includes("bottom") ? "0" : "auto",
		pos.includes("left") ? "0" : "auto",
	];
	return html`
		<div style="position: relative; display: inline-block;">
			${renderFn(children)}
			<div
				style="
        position: absolute;
        top: ${top};
        right: ${right};
        bottom: ${bottom};
        left: ${left};
        width: ${size};
        height: ${size};
        background: ${bg};
        color: ${col};
        font-size: calc(${size} * 0.6);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        transform: translate(${left === "0"
					? "-50%"
					: left === "auto"
					? "0"
					: "0"}, ${top === "0" ? "-50%" : top === "auto" ? "0" : "0"});
      "
			>
				${props?.content ?? ""}
			</div>
		</div>
	`;
}
