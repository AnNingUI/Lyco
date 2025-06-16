import { html, TemplateResult } from "lit";
import { createRef, ref, RefOrCallback } from "lit/directives/ref.js";
import { createEventBinder, OnEvent } from "../core";

// 合并两个 ref 的辅助函数
function combineRefs<T>(
	ref1: RefOrCallback<T> | undefined,
	ref2: RefOrCallback<T>
): RefOrCallback<T> {
	// 如果 ref1 未定义则直接返回 ref2
	if (!ref1) return ref2;
	return (el: T | undefined) => {
		typeof ref1 === "function" ? ref1(el) : ((ref1 as any).current = el);
		typeof ref2 === "function" ? ref2(el) : ((ref2 as any).current = el);
	};
}

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
	const combinedRef = combineRefs(initRef as RefOrCallback<Element>, (el) => {
		if (el) {
			binder.bind(el);
		} else {
			binder.unbindAll();
		}
	});
	return html`
		<canvas
			${ref(combinedRef)}
			.class=${props?.className}
			style=${props?.style ?? ""}
		></canvas>
	`;
}
