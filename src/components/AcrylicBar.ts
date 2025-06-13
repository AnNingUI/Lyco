import { html, TemplateResult } from "lit";
import { ref } from "lit/directives/ref.js";
import {
	createEventBinder,
	OnEvent,
	renderFnOrArrayOrCurry,
	renderFnOrArrayType,
} from "./core";

interface AcrylicBarProps {
	width?: string; // 宽度，如 "300px" 或 "50%"
	height?: string; // 高度，如 "auto" 或 "200px"
	top?: string; // 距离顶部距离，默认 "20%"
	bottom?: string; // 距离底部距离，默认 "auto"
	left?: string; // 距离左侧距离，默认 "50%"
	right?: string; // 距离右侧距离，默认 "auto"
	background?: string; // 背景色，支持透明度，默认 "rgba(255,255,255,0.3)"
	blur?: string; // 模糊半径，默认 "10px"
	borderRadius?: string; // 圆角，默认 "12px"
	padding?: string; // 内边距，默认 "16px"
	zIndex?: number; // z-index，默认 1000
	on?: OnEvent;
}

export function AcrylicBar(
	props?: AcrylicBarProps
): (children?: renderFnOrArrayType) => TemplateResult<1>;

export function AcrylicBar(
	props?: AcrylicBarProps,
	children?: renderFnOrArrayType
): TemplateResult<1>;

export function AcrylicBar(
	props?: AcrylicBarProps,
	children?: renderFnOrArrayType
) {
	const w = props?.width ?? "300px";
	const h = props?.height ?? "auto";
	const top = props?.top ?? "20%";
	const bottom = props?.bottom ?? "auto";
	const left = props?.left ?? "50%";
	const right = props?.right ?? "auto";
	// 如果 left 被设置为非 "auto"，则让组件水平居中
	const translateX = left !== "auto" ? "transform: translateX(-50%);" : "";
	const bg = props?.background ?? "rgba(255, 255, 255, 0.3)";
	const blur = props?.blur ?? "10px";
	const br = props?.borderRadius ?? "12px";
	const pd = props?.padding ?? "16px";
	const z = props?.zIndex ?? 1000;
	const binder = createEventBinder(props?.on ?? {});
	const render = (children: TemplateResult) => {
		return html`
			<div
				${ref(binder.auto)}
				style="
      position: fixed;
      top: ${top};
      bottom: ${bottom};
      left: ${left};
      right: ${right};
      ${translateX}
      width: ${w};
      height: ${h};
      background: ${bg};
      backdrop-filter: blur(${blur});
      -webkit-backdrop-filter: blur(${blur});
      border-radius: ${br};
      padding: ${pd};
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      z-index: ${z};
      display: flex;
      flex-direction: column;
    "
			>
				${children}
			</div>
		`;
	};
	return renderFnOrArrayOrCurry(children, undefined, render);
}
