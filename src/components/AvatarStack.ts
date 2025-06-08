import { html } from "lit";
import { renderFnType } from "./core";

export function AvatarStack(
	props?: { size?: string; overlap?: string },
	children?: renderFnType
) {
	const sz = props?.size ?? "32px";
	const ov = props?.overlap ?? "-8px";
	return html`
		<div style="display: flex; align-items: center;">
			${typeof children === "function"
				? (children() as any).map(
						(avatar: unknown, idx: number) => html`
							<div
								style="
              width: ${sz};
              height: ${sz};
              border-radius: 50%;
              overflow: hidden;
              border: 2px solid #fff;
              margin-left: ${idx === 0 ? "0" : ov};
              box-sizing: content-box;
            "
							>
								${avatar}
							</div>
						`
				  )
				: html``}
		</div>
	`;
}
