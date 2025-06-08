import { html } from "lit";
import { renderFn, renderFnType } from "./core";

export function SideBarContainer(
	props?: {
		sidebarWidth?: string; // 侧边栏宽度，比如 "240px"
		sidebarPosition?: "left" | "right";
		gap?: string | number;
	},
	children?: renderFnType
) {
	const width = props?.sidebarWidth ?? "240px";
	const pos = props?.sidebarPosition ?? "left";
	const gap = props?.gap ?? "0px";

	let sidebarContent = html``;
	let mainContent = html``;

	if (typeof children === "function") {
		// @ts-ignore
		const arr = (children as any).call?.(null) ?? [];
		sidebarContent = arr[0] ?? html``;
		mainContent = arr[1] ?? html``;
	} else {
		mainContent = renderFn(children) as any;
	}

	return html`
		<div
			style="
      display: flex;
      flex-direction: ${pos === "left" ? "row" : "row-reverse"};
      width: 100%;
      height: 100%;
      gap: ${gap};
    "
		>
			<div style="flex: 0 0 ${width}; overflow: auto;">${sidebarContent}</div>
			<div style="flex: 1 1 auto; overflow: auto;">${mainContent}</div>
		</div>
	`;
}
