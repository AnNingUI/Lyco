import { html, TemplateResult, unsafeCSS } from "lit";
import { renderFnType } from "./core";

export function Swiper(
	props?: {
		gap?: string | number;
		snapType?: "mandatory" | "proximity";
		height?: string;
		width?: string;
	},
	children?: renderFnType
) {
	const gap = props?.gap ?? "8px";
	const snapType = props?.snapType ?? "mandatory";
	const height = props?.height ?? "auto";
	const width = props?.width ?? "100%";

	let slides: TemplateResult[] = [];
	if (typeof children === "function") {
		// @ts-ignore
		slides = (children as any).call?.(null) ?? [];
	} else if (children) {
		slides = [children];
	}

	return html`
		<style>
			.swiper-container {
				width: ${width};
				height: ${height};
				overflow-x: auto;
				overflow-y: hidden;
				display: flex;
				scroll-snap-type: x ${snapType};
				-webkit-overflow-scrolling: touch;
				gap: ${unsafeCSS(gap)};
			}
			.swiper-slide {
				scroll-snap-align: start;
				flex-shrink: 0;
			}
		</style>
		<div class="swiper-container">
			${slides.map((slide) => html` <div class="swiper-slide">${slide}</div> `)}
		</div>
	`;
}
