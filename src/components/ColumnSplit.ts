import { html, TemplateResult } from "lit";
import { ref } from "lit/directives/ref.js";
import {
	createEventBinder,
	OnEvent,
	renderFn,
	renderFnType,
	WithHtml,
} from "../core";

export function ColumnSplit(props?: {
	firstHeight?: string; // 第一个面板固定高度或百分比
	gap?: string | number;
	on?: OnEvent;
}): WithHtml<renderFnType>;

export function ColumnSplit(
	props?: {
		firstHeight?: string; // 第个面板固定高度或百分比
		gap?: string | number;
		on?: OnEvent;
	},
	children?: renderFnType
): TemplateResult<1>;

export function ColumnSplit(
	props?: {
		firstHeight?: string; // 第一个面板固定高度或百分比
		gap?: string | number;
		on?: OnEvent;
	},
	children?: renderFnType
): TemplateResult<1> | WithHtml<renderFnType> {
	if (children === undefined) {
		const _ = (children?: renderFnType) =>
			ColumnSplit(props, children ?? html``);
		_.html = (strings: TemplateStringsArray, ...values: unknown[]) =>
			ColumnSplit(props, html(strings, ...values));
		return _;
	}
	const gap = props?.gap ?? "0px";
	const firstH = props?.firstHeight ?? "50%";

	let topNode = html``;
	let bottomNode = html``;

	if (typeof children === "function") {
		// @ts-ignore
		const arr = (children as any).call?.(null) ?? [];
		topNode = arr[0] ?? html``;
		bottomNode = arr[1] ?? html``;
	} else {
		topNode = renderFn(children) as any;
	}

	const binder = createEventBinder(props?.on ?? {});

	return html`
		<div
			${ref((el) => {
				if (el) {
					binder.bind(el);
				} else {
					binder.unbindAll();
				}
			})}
			style="
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        gap: ${gap};
      "
		>
			<div style="flex: 0 0 ${firstH}; overflow: auto;">${topNode}</div>
			<div style="flex: 1 1 auto; overflow: auto;">${bottomNode}</div>
		</div>
	`;
}
