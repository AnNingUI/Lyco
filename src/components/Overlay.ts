import { html } from "lit";
import { renderFn, renderFnType } from "./core";

export function Overlay(
	props?: { background?: string; zIndex?: number; fullScreen?: boolean },
	children?: renderFnType
) {
	const bg = props?.background ?? "rgba(0, 0, 0, 0.5)";
	const z = props?.zIndex ?? 1000;
	const full = props?.fullScreen !== false;
	return html`
		<div
			style="
      position: ${full ? "fixed" : "absolute"};
      top: 0; left: 0; right: 0; bottom: 0;
      background: ${bg};
      z-index: ${z};
      display: flex;
      justify-content: center;
      align-items: center;
    "
		>
			${renderFn(children)}
		</div>
	`;
}
