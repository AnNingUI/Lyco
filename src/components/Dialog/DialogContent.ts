import { html, TemplateResult } from "lit";
import {
	createEventBinder,
	OnEvent,
	renderFnOrArray,
	renderFnOrArrayOrCurry,
	renderFnOrArrayType,
} from "../core";

type DialogContentProps = {
	className?: string;
	style?: string;
	on?: OnEvent;
};

export function DialogContent(
	props?: DialogContentProps
): (children?: renderFnOrArrayType) => TemplateResult<1>;
export function DialogContent(
	props?: DialogContentProps,
	children?: renderFnOrArrayType
): TemplateResult<1>;
export function DialogContent(
	props?: DialogContentProps,
	children?: renderFnOrArrayType
) {
	const className = props?.className ?? "";
	const style = props?.style ?? "";
	const binder = createEventBinder(props?.on ?? {});

	const render = (children?: renderFnOrArrayType) => {
		return html`
			<div
				class="lyco-dialog-content ${className}"
				style="
          background: white;
          border-radius: 4px;
          padding: 20px;
          min-width: 300px;
          position: relative;
          ${style}
        "
			>
				${renderFnOrArray(children)}
			</div>
		`;
	};

	return renderFnOrArrayOrCurry(children, render);
}
