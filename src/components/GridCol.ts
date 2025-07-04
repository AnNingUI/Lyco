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

export function GridCol(props?: {
	gap?: string | number;
	on?: OnEvent;
}): WithHtml<renderFnType>;

export function GridCol(
	props?: { gap?: string | number; on?: OnEvent },
	children?: renderFnType
): Temp;

export function GridCol(
	props?: { gap?: string | number; on?: OnEvent },
	children?: renderFnType
): Temp | WithHtml<renderFnType> {
	if (children === undefined) {
		const _ = (children?: renderFnType) => GridCol(props, children ?? html``);
		_.html = (strings: TemplateStringsArray, ...values: unknown[]) =>
			GridCol(props, html(strings, ...values));
		return _;
	}
	const now = getComponentCount("GridCol");
	const _className =
		getRandomClassName("GridCol::grid-col") + "-lyco-now-" + now;
	const gapStyle = props?.gap ? `column-gap: ${props.gap};` : "";
	const css = `
      .${_className} {
        display: grid;
        grid-auto-flow: column;
        ${gapStyle}
      }
    `;
	const binder = createEventBinder(props?.on ?? {});
	return LycoComponent(
		"GridCol",
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
