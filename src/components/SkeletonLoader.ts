// SkeletonLoader.ts
import { html } from "lit";
import { getRandomClassName } from "./core";

export function SkeletonLoader(props?: {
	type?: "rect" | "circle";
	width?: string;
	height?: string;
	borderRadius?: string;
	animation?: boolean;
	className?: string;
}) {
	const type = props?.type ?? "rect";
	const w = props?.width ?? "100%";
	const h = props?.height ?? "16px";
	const br = props?.borderRadius ?? "4px";
	const anim = props?.animation !== false;
	const _className =
		props?.className ?? getRandomClassName("SkeletonLoader::skeleton-shimmer");
	const shapeStyle =
		type === "circle"
			? `border-radius: 50%; width: ${w}; height: ${w}`
			: `border-radius: ${br}; width: ${w}; height: ${h}`;
	return html`
		<style>
			${`
            @keyframes ${_className + "-shimmer"} {
			  0% { background-color: #eee; }
			  50% { background-color: #ddd; }
			  100% { background-color: #eee; }
			}    
            `}
			.${_className} {
			  ${shapeStyle};
			  background-color: #eee;
			  ${anim
				? `animation: ${_className + "-shimmer"} 1.2s infinite ease-in-out`
				: ""};
			}
		</style>
		<div class="${_className}"></div>
	`;
}
