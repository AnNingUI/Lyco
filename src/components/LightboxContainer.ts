import { html, TemplateResult } from "lit";
import { renderFn, renderFnType, WithHtml } from "./core";

export function LightboxContainer(props?: {
	fadeBg?: string;
	zIndex?: number;
}): WithHtml<renderFnType>;

export function LightboxContainer(
	props?: { fadeBg?: string; zIndex?: number },
	children?: renderFnType
): TemplateResult<1>;

export function LightboxContainer(
	props?: { fadeBg?: string; zIndex?: number },
	children?: renderFnType
): TemplateResult<1> | WithHtml<renderFnType> {
	if (children === undefined) {
		const _ = (children?: renderFnType) =>
			LightboxContainer(props, children ?? html``);
		_.html = (strings: TemplateStringsArray, ...values: unknown[]) =>
			LightboxContainer(props, html(strings, ...values));
		return _;
	}
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
