import { html, TemplateResult } from "lit";
import { ref } from "lit/directives/ref.js";
import {
	createEventBinder,
	OnEvent,
	renderFnOrArray,
	renderFnOrArrayOrCurry,
	renderFnOrArrayType,
} from "../core";

type DialogActionsProps = {
	className?: string;
	style?: string;
	on?: OnEvent;
};

export function DialogActions(
	props?: DialogActionsProps
): (children?: renderFnOrArrayType) => TemplateResult<1>;
export function DialogActions(
	props?: DialogActionsProps,
	children?: renderFnOrArrayType
): TemplateResult<1>;
export function DialogActions(
	props?: DialogActionsProps,
	children?: renderFnOrArrayType
) {
	const className = props?.className ?? "";
	const style = props?.style ?? "";
	const binder = createEventBinder(props?.on ?? {});

	const render = (children?: renderFnOrArrayType) => {
		return html`
			<div
				${ref((el) => {
					if (el) {
						binder.bind(el);
					} else {
						binder.unbindAll();
					}
				})}
				class="lyco-dialog-actions ${className}"
				style="
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 8px 24px;
          ${style}
        "
			>
				${renderFnOrArray(children)}
			</div>
		`;
	};

	return renderFnOrArrayOrCurry(children, render);
}
