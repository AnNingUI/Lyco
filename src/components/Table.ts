import { html, TemplateResult } from "lit";
import { ref } from "lit/directives/ref.js";
import {
	createEventBinder,
	getComponentCount,
	getRandomClassName,
	LycoComponent,
	OnEvent,
	renderFn,
	renderFnType,
	WithHtml,
} from "../core";
import { MD3 } from "../theme/md3";

export interface TableProps {
	striped?: boolean;
	hover?: boolean;
	bordered?: boolean;
	className?: string;
	on?: OnEvent;
}

export function Table(props?: TableProps): WithHtml<renderFnType>;

export function Table(
	props?: TableProps,
	children?: renderFnType // TemplateResult | (() => TemplateResult)
): TemplateResult<1>;

export function Table(
	props?: TableProps,
	children?: renderFnType
): TemplateResult<1> | WithHtml<renderFnType> {
	// 如果第二个参数 children 没传，则返回一个只接收 children 的函数
	if (children === undefined) {
		const _ = (children?: renderFnType) => Table(props, children ?? html``);
		_.html = (strings: TemplateStringsArray, ...values: unknown[]) =>
			Table(props, html(strings, ...values));
		return _;
	}

	const now = getComponentCount("Table");

	// 到这里说明 props 和 children 都已经传齐
	const _className =
		props?.className ?? getRandomClassName("Table::table") + `-lyco-now-${now}`;
	const striped = props?.striped
		? `
      .${_className} tr:nth-child(even) { 
        background: ${MD3.colors.surface};
      }
    `
		: "";
	const hover = props?.hover
		? `
      .${_className} tr:hover { 
        background: ${MD3.colors.primaryContainer};
        cursor: pointer;
      }
    `
		: "";
	const bordered = props?.bordered
		? `
      .${_className}, .${_className} th, .${_className} td { 
        border: 1px solid ${MD3.colors.surfaceVariant}; 
      }
    `
		: "";

	const css = `
	.${_className} table {
	  width: 100%;
	  border-collapse: separate;
	  border-spacing: 0;
	  border-radius: ${MD3.borderRadius.medium};
	  overflow: hidden;
	  box-shadow: ${MD3.elevation.level1};
	}
	.${_className} th,
	.${_className} td {
	  padding: 16px;
	  text-align: left;
	  transition: background ${MD3.animation.standard};
	}
	.${_className} th {
	  background: ${MD3.colors.surfaceVariant};
	  color: ${MD3.colors.onSurfaceVariant};
	  font-weight: 500;
	}
	.${_className} td {
	  border-bottom: 1px solid ${MD3.colors.surfaceVariant}; 
	}
	${striped}
	${hover}
	${bordered}
	`;

	const binder = createEventBinder(props?.on ?? {});

	return LycoComponent(
		"Table",
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
				<table>
					${renderFn(children)}
				</table>
			</div>
		`
	);
}
