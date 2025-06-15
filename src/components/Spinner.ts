import { css, html, TemplateResult } from "lit";
import { ref } from "lit/directives/ref.js";
import {
	createEventBinder,
	getComponentCount,
	LycoComponent,
	OnEvent,
} from "./core";
import { MD3 } from "../theme/md3";

type SpinnerProps = {
	size?: string; // 尺寸，默认 "24px"
	color?: string; // 颜色，默认 "currentColor"
	thickness?: string; // 线条粗细，默认 "2px"
	speed?: string; // 动画速度，默认 "0.8s"
	className?: string;
	style?: string;
	opacity?: number; // 透明度
	startAngle?: number; // 起始角度
	easing?: string; // 缓动函数
	reverse?: boolean; // 反向旋转
	on?: OnEvent;
	children?: TemplateResult | string;

	// 新增高级样式支持
	svgMode?: boolean; // 使用 SVG 渲染
	strokeLinecap?: "butt" | "round" | "square"; // 线帽样式
	strokeDasharray?: string; // 虚线样式
};

export function Spinner(props?: SpinnerProps): TemplateResult<1> {
	const {
		size = "24px",
		color = MD3.colors.primary,
		thickness = "2px",
		speed = "1.2s",
		className = "",
		opacity = 1,
		startAngle = 0,
		easing = "linear",
		reverse = false,
		style = "",
		on = {},
		children,
		svgMode = false,
		strokeLinecap = "butt",
		strokeDasharray = "",
	} = props ?? {};

	const binder = createEventBinder(on);
	const id = getComponentCount("Spinner");
	ref;
	// 普通 DIV 渲染
	const divSpinner = html`
		<div
			class="${className}"
			style="display: inline-flex; align-items: center; justify-content: center; width: ${size}; height: ${size}; ${style}"
			${ref()}
		>
			<div
				style="
					width: 100%;
					height: 100%;
					border: ${thickness} solid ${color};
					border-right-color: transparent;
					border-radius: 50%;
					box-sizing: border-box;
					opacity: ${opacity};
					animation: lyco-spin-${id} ${speed} ${easing} infinite ${reverse
					? "reverse"
					: "normal"};
				"
			></div>
		</div>
		<style>
			${css`
				@keyframes lyco-spin-${id} {
					from {
						transform: rotate(${startAngle}deg);
					}
					to {
						transform: rotate(${startAngle + 360}deg);
					}
				}
			`.cssText}
		</style>
	`;

	// SVG 渲染
	const svgSpinner = html`
		<div
			class="${className}"
			style="display: inline-flex; align-items: center; justify-content: center; width: ${size}; height: ${size}; ${style}"
			${ref((el) => {
				if (el) {
					binder.bind(el);
				} else {
					binder.unbindAll();
				}
			})}
		>
			<svg
				width="100%"
				height="100%"
				viewBox="0 0 100 100"
				style="opacity: ${opacity}; overflow: visible; filter: drop-shadow(${MD3
					.elevation.level1});"
			>
				<circle
					cx="50"
					cy="50"
					r="45"
					fill="none"
					stroke="${color}"
					style="
					stroke-width: ${thickness};
					stroke-linecap: ${strokeLinecap};
					stroke-dasharray: ${strokeDasharray};
					transform-origin: 50% 50%;
					animation: lyco-svg-spin-${id} ${speed} ${easing} infinite ${reverse
						? "reverse"
						: "normal"};
				"
				></circle>
			</svg>
		</div>
		<style>
			${css`
				@keyframes lyco-svg-spin-${id} {
					from {
						transform: rotate(${startAngle}deg);
					}
					to {
						transform: rotate(${startAngle + 360}deg);
					}
				}
			`.cssText}
		</style>
	`;

	return LycoComponent("Spinner", svgMode ? svgSpinner : divSpinner);
}
