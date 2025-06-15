import { html, TemplateResult } from "lit";
import { ref } from "lit/directives/ref.js";
import {
	createEventBinder,
	OnEvent,
	renderFn,
	renderFnOrCurry,
	renderFnType,
} from "../core";

type DialogButtonProps = {
	variant?: "text" | "contained";
	color?: "primary" | "secondary" | "default";
	onClick?: (el: MouseEvent) => void;
	className?: string;
	style?: string;
	on?: OnEvent;
};

export function DialogButton(
	props?: DialogButtonProps
): (children?: renderFnType) => TemplateResult<1>;
export function DialogButton(
	props?: DialogButtonProps,
	children?: renderFnType
): TemplateResult<1>;
export function DialogButton(
	props?: DialogButtonProps,
	children?: renderFnType
) {
	const variant = props?.variant ?? "text";
	const color = props?.color ?? "default";
	const className = props?.className ?? "";
	const style = props?.style ?? "";
	const binder = createEventBinder({
		click: (props?.onClick
			? (e) => {
					e.preventDefault();
					props.onClick?.(e);
			  }
			: undefined) as OnEvent["click"],
		...props?.on,
	});

	const render = (children?: renderFnType) => {
		return html`
			<button
				${ref((el) => {
					if (el) {
						binder.bind(el);
					} else {
						binder.unbindAll();
					}
				})}
				class="lyco-dialog-button ${variant} ${color} ${className}"
				style="
          padding: 6px 16px;
          font-size: 14px;
          border-radius: 4px;
          cursor: pointer;
          border: none;
          outline: none;
          margin: 0 4px;
          ${variant === "contained"
					? "background: #1976d2; color: white;"
					: "background: transparent;"}
          ${style}
        "
			>
				${renderFn(children)}
			</button>
		`;
	};

	return renderFnOrCurry(children, render);
}
