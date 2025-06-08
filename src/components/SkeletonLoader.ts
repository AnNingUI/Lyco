// SkeletonLoader.ts
import { html } from "lit";

export function SkeletonLoader(props?: {
	type?: "rect" | "circle";
	width?: string;
	height?: string;
	borderRadius?: string;
	animation?: boolean;
}) {
	const type = props?.type ?? "rect";
	const w = props?.width ?? "100%";
	const h = props?.height ?? "16px";
	const br = props?.borderRadius ?? "4px";
	const anim = props?.animation !== false;
	const shapeStyle =
		type === "circle"
			? `border-radius: 50%; width: ${w}; height: ${w}`
			: `border-radius: ${br}; width: ${w}; height: ${h}`;
	return html`
		<style>
			${`
            @keyframes skeleton-shimmer {
			  0% { background-color: #eee; }
			  50% { background-color: #ddd; }
			  100% { background-color: #eee; }
			}    
            `}
			.skeleton {
			  ${shapeStyle};
			  background-color: #eee;
			  ${anim ? "animation: skeleton-shimmer 1.2s infinite ease-in-out" : ""};
			}
		</style>
		<div class="skeleton"></div>
	`;
}
