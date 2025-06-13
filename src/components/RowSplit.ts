import { html, TemplateResult } from "lit";
import { ref } from "lit/directives/ref.js";
import {
	createEventBinder,
	OnEvent,
	renderFn,
	renderFnType,
	WithHtml,
} from "./core";

export function RowSplit(props?: {
	firstWidth?: string; // 第一个面板固定宽度或百分比
	gap?: string | number;
	on?: OnEvent;
}): WithHtml<renderFnType>;

export function RowSplit(
	props?: {
		firstWidth?: string; // 第一个面板固定宽度或百分比
		gap?: string | number;
		on?: OnEvent;
	},
	children?: renderFnType
): TemplateResult<1>;

export function RowSplit(
	props?: {
		firstWidth?: string; // 第一个面板固定宽度或百分比
		gap?: string | number;
		on?: OnEvent;
	},
	children?: renderFnType
): TemplateResult<1> | WithHtml<renderFnType> {
	if (children === undefined) {
		const _ = (children?: renderFnType) => RowSplit(props, children ?? html``);
		_.html = (strings: TemplateStringsArray, ...values: unknown[]) =>
			RowSplit(props, html(strings, ...values));
		return _;
	}
	const gap = props?.gap ?? "0px";
	const firstW = props?.firstWidth ?? "50%";

	let leftNode = html``;
	let rightNode = html``;

	if (typeof children === "function") {
		// @ts-ignore
		const arr = (children as any).call?.(null) ?? [];
		leftNode = arr[0] ?? html``;
		rightNode = arr[1] ?? html``;
	} else {
		leftNode = renderFn(children) as any;
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
      flex-direction: row;
      width: 100%;
      height: 100%;
      gap: ${gap};
    "
		>
			<div style="flex: 0 0 ${firstW}; overflow: auto;">${leftNode}</div>
			<div style="flex: 1 1 auto; overflow: auto;">${rightNode}</div>
		</div>
	`;
}
