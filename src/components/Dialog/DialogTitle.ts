import { html, TemplateResult } from "lit";
import { ref, type Ref } from "lit/directives/ref.js";
import {
	createEventBinder,
	OnEvent,
	renderFn,
	renderFnOrCurry,
	renderFnType,
} from "../../core";

type DialogTitleProps = {
	className?: string;
	style?: string;
	proxyRef?: Ref<Element>;
	on?: OnEvent;
};

export function DialogTitle(
	props?: DialogTitleProps
): (children?: renderFnType) => TemplateResult<1>;
export function DialogTitle(
	props?: DialogTitleProps,
	children?: renderFnType
): TemplateResult<1>;
export function DialogTitle(props?: DialogTitleProps, children?: renderFnType) {
	const className = props?.className ?? "";
	const style = props?.style ?? "";
	const binder = createEventBinder(props?.on ?? {});
	const proxyRef = props?.proxyRef ?? {
		value: null,
	};
	const render = (children?: renderFnType) => {
		return html`
			<div
				${ref((el) => {
					if (el) {
						// @ts-ignore
						proxyRef.value = el;
						binder.bind(el);
					} else {
						binder.unbindAll();
					}
				})}
				class="lyco-dialog-title ${className}"
				style="
          padding: 16px 24px;
          font-size: 20px;
          font-weight: 500;
          line-height: 1.6;
          letter-spacing: 0.0075em;
          ${style}
        "
			>
				${renderFn(children)}
			</div>
		`;
	};

	return renderFnOrCurry(children, render);
}
