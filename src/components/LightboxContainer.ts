import { html } from "lit";
import { renderFn, renderFnType } from "./core";

export function LightboxContainer(
	props?: { fadeBg?: string; zIndex?: number },
	children?: renderFnType
) {
	const bg = props?.fadeBg ?? "rgba(0,0,0,0.7)";
	const z = props?.zIndex ?? 2000;
	return html`
		<div
			style="
      position: fixed;
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
