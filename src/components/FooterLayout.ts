// FooterLayout.ts
import { html, TemplateResult } from "lit";
import { ref } from "lit/directives/ref.js";
import {
	createEventBinder,
	OnEvent,
	renderFn,
	renderFnType,
	WithHtml,
} from "./core";

interface FooterLayoutProps {
	columns?: number;
	gap?: string;
	background?: string;
	padding?: string;
	on?: OnEvent;
}

export function FooterLayout(props?: FooterLayoutProps): WithHtml<renderFnType>;

export function FooterLayout(
	props?: FooterLayoutProps,
	children?: renderFnType
): TemplateResult<1>;

export function FooterLayout(
	props?: FooterLayoutProps,
	children?: renderFnType
) {
	if (children === undefined) {
		const _ = (children?: renderFnType) =>
			FooterLayout(props, children ?? html``);
		_.html = (strings: TemplateStringsArray, ...values: unknown[]) =>
			FooterLayout(props, html(strings, ...values));
		return _;
	}
	const cols = props?.columns ?? 4;
	const gap = props?.gap ?? "24px";
	const bg = props?.background ?? "#f8f8f8";
	const pad = props?.padding ?? "40px 16px";
	const binder = createEventBinder(props?.on ?? {});
	return html`
		<div
			${ref(binder.auto)}
			style="
      width: 100%;
      background: ${bg};
      padding: ${pad};
      box-sizing: border-box;
    "
		>
			<div
				style="
        display: grid;
        grid-template-columns: repeat(${cols}, 1fr);
        gap: ${gap};
      "
			>
				${renderFn(children)}
			</div>
			<div style="text-align: center; margin-top: 24px; color: #666;">
				© ${new Date().getFullYear()} Your Company. All rights reserved.
			</div>
		</div>
	`;
}
