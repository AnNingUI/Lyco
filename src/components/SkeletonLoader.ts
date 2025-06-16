// SkeletonLoader.ts
import { html, TemplateResult } from "lit";
import { ref } from "lit/directives/ref.js";
import {
	createEventBinder,
	getComponentCount,
	getRandomClassName,
	LycoComponent,
	OnEvent,
} from "../core";

export function SkeletonLoader(props?: {
	type?: "rect" | "circle";
	width?: string;
	height?: string;
	borderRadius?: string;
	animation?: boolean;
	animationType?: "shimmer" | "pulse";
	bgColor?: string;
	highlightColor?: string;
	count?: number;
	spacing?: string;
	direction?: "horizontal" | "vertical";
	delay?: number; // 延迟显示，单位 ms
	autoHide?: boolean; // 是否在完成后自动隐藏
	duration?: number; // 自动隐藏持续时间，单位 ms
	on?: OnEvent;
}) {
	const {
		type = "rect",
		width = "100%",
		height = "16px",
		borderRadius = "4px",
		animation = true,
		animationType = "shimmer",
		bgColor = "#eee",
		highlightColor = "#ddd",
		count = 1,
		spacing = "8px",
		direction = "vertical",
		delay = 0,
		autoHide = false,
		duration = 2000,
		on = {},
	} = props ?? {};

	const now = getComponentCount("SkeletonLoader");
	const baseClass =
		getRandomClassName("SkeletonLoader::skeleton") + "-lyco-now-" + now;
	const binder = createEventBinder(on);

	// 样式和动画
	const shapeStyle =
		type === "circle"
			? `border-radius:50%;width:${width};height:${width}`
			: `border-radius:${borderRadius};width:${width};height:${height}`;

	let keyframes = "";
	let animCss = "";

	if (animation) {
		if (animationType === "shimmer") {
			keyframes = `@keyframes ${baseClass}-shimmer { 0% { background-color: ${bgColor}; } 50% { background-color: ${highlightColor}; } 100% { background-color: ${bgColor}; } }`;
			animCss = `animation:${baseClass}-shimmer 1.2s infinite ease-in-out;`;
		} else {
			keyframes = `@keyframes ${baseClass}-pulse { 0% { opacity:1; } 50% { opacity:0.4; } 100% { opacity:1; } }`;
			animCss = `animation:${baseClass}-pulse 1.2s infinite ease-in-out;`;
		}
	}

	// 容器布局
	const containerStyle =
		direction === "horizontal"
			? `display:flex;flex-direction:row;gap:${spacing}`
			: `display:flex;flex-direction:column;gap:${spacing}`;

	// 渲染骨架块
	const blocks: TemplateResult[] = [];
	for (let i = 0; i < count; i++) {
		blocks.push(html`
			<div
				class="${baseClass}"
				style="${shapeStyle};background-color:${bgColor};${animCss};opacity:0;transition:opacity 0.3s"
				${ref((el) => {
					if (!el) return;
					binder.bind(el);
				})}
			></div>
		`);
	}

	// 定时逻辑
	function applyLifecycle(root: HTMLElement) {
		const items = Array.from(
			root.querySelectorAll(`.${baseClass}`)
		) as HTMLElement[];
		// 延迟显示
		setTimeout(() => {
			items.forEach((el) => (el.style.opacity = "1"));
			// 自动隐藏
			if (autoHide) {
				setTimeout(() => {
					items.forEach((el) => (el.style.opacity = "0"));
				}, duration);
			}
		}, delay);
	}

	return LycoComponent(
		"SkeletonLoader",
		html`
			<style>
				${keyframes}
			</style>
			<div
				style="${containerStyle}"
				${ref((el) => el && applyLifecycle(el as HTMLElement))}
			>
				${blocks}
			</div>
		`
	);
}
