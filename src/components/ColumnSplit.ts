import { html } from "lit";
import { renderFn, renderFnType } from "./core";

export function ColumnSplit(
	props?: {
		firstHeight?: string; // 第一个面板固定高度或百分比
		gap?: string | number;
	},
	children?: renderFnType
) {
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

	return html`
		<div
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
