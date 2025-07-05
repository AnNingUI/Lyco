import { html, TemplateResult } from "lit";
import { createRef, ref, RefOrCallback } from "lit/directives/ref.js";
import { createEventBinder, OnEvent } from "../core";

export function Canvas(props?: {
	className?: string;
	style?: string;
	on?: OnEvent;
}): (initRef?: RefOrCallback<HTMLCanvasElement>) => TemplateResult<1>;

export function Canvas(
	props?: {
		className?: string;
		style?: string;
		on?: OnEvent;
	},
	initRef?: RefOrCallback<HTMLCanvasElement>
): TemplateResult<1>;

export function Canvas(
	props?: {
		className?: string;
		style?: string;
		on?: OnEvent;
	},
	initRef?: RefOrCallback<HTMLCanvasElement>
):
	| ((initRef?: RefOrCallback<HTMLCanvasElement>) => TemplateResult<1>)
	| TemplateResult<1> {
	if (!initRef) {
		return (initRef?: RefOrCallback<HTMLCanvasElement>) =>
			Canvas(props, initRef ?? createRef()) as TemplateResult<1>;
	}
	// 绑定事件
	const binder = createEventBinder(props?.on ?? {});
	// 合并外部引用与事件绑定引用
	const combinedRef = (el: Element | undefined) => {
		if (el) {
			binder.bind(el);
			typeof initRef === "function"
				? initRef(el as HTMLCanvasElement)
				: (initRef = { value: el as HTMLCanvasElement });
		} else {
			binder.unbindAll();
		}
	};
	return html`
		<canvas
			${ref(combinedRef)}
			.class=${props?.className}
			style=${props?.style ?? ""}
		></canvas>
	`;
}
