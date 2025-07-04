import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import {
	createEventBinder,
	getComponentCount,
	getRandomClassName,
	LycoComponent,
	OnEvent,
	renderFn,
	renderFnType,
	Temp,
	WithHtml,
} from "../core";

export function GridRow(props?: {
	gap?: string | number;
	on?: OnEvent;
}): WithHtml<renderFnType>;

export function GridRow(
	props?: { gap?: string | number; on?: OnEvent },
	children?: renderFnType
): Temp;

export function GridRow(
	props?: { gap?: string | number; on?: OnEvent },
	children?: renderFnType
): Temp | WithHtml<renderFnType> {
	if (children === undefined) {
		const _ = (children?: renderFnType) => GridRow(props, children ?? html``);
		_.html = (strings: TemplateStringsArray, ...values: unknown[]) =>
			GridRow(props, html(strings, ...values));
		return _;
	}

	const now = getComponentCount("GridRow");
	const _className =
		getRandomClassName("GridRow::grid-row") + "-lyco-now-" + now;
	const gapStyle = props?.gap ? `row-gap: ${props.gap};` : "";
	const css = `
      .${_className} {
        display: grid;
        grid-auto-flow: row;
        ${gapStyle}
      }
    `;
	const binder = createEventBinder(props?.on ?? {});
	return LycoComponent(
		"GridRow",
		html`
			<style>
				${css}
			</style>
			<div
				${ref((el) => {
					if (el) {
						binder.bind(el);
					} else {
						binder.unbindAll();
					}
				})}
				class="${_className}"
			>
				${renderFn(children)}
			</div>
		`
	);
}
