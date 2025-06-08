// FooterLayout.ts
import { html } from "lit";
import { renderFn, renderFnType } from "./core";

export function FooterLayout(
	props?: {
		columns?: number;
		gap?: string;
		background?: string;
		padding?: string;
	},
	children?: renderFnType
) {
	const cols = props?.columns ?? 4;
	const gap = props?.gap ?? "24px";
	const bg = props?.background ?? "#f8f8f8";
	const pad = props?.padding ?? "40px 16px";
	return html`
		<div
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
