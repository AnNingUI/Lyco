import { html, TemplateResult, unsafeCSS } from "lit";
import { randomClassName, renderFnType } from "./core";

export function Swiper(
	props?: {
		gap?: string | number;
		snapType?: "mandatory" | "proximity";
		height?: string;
		width?: string;
		className?: string;
	},
	children?: renderFnType
) {
	const gap = props?.gap ?? "8px";
	const snapType = props?.snapType ?? "mandatory";
	const height = props?.height ?? "auto";
	const width = props?.width ?? "100%";
	const _className = props?.className ?? randomClassName("swiper");
	const _containerClassName = _className + "-container";
	const _slideClassName = _className + "-slide";
	let slides: TemplateResult[] = [];
	if (typeof children === "function") {
		// @ts-ignore
		slides = (children as any).call?.(null) ?? [];
	} else if (children) {
		slides = [children];
	}

	return html`
		<style>
			.${_containerClassName} {
				width: ${width};
				height: ${height};
				overflow-x: auto;
				overflow-y: hidden;
				display: flex;
				scroll-snap-type: x ${snapType};
				-webkit-overflow-scrolling: touch;
				gap: ${unsafeCSS(gap)};
			}
			.${_slideClassName} {
				scroll-snap-align: start;
				flex-shrink: 0;
			}
		</style>
		<div class="${_containerClassName}">
			${slides.map(
				(slide) => html` <div class="${_slideClassName}">${slide}</div> `
			)}
		</div>
	`;
}
