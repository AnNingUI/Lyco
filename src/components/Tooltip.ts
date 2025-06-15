import { html, TemplateResult } from "lit";
import { ref } from "lit/directives/ref.js";
import {
	createEventBinder,
	OnEvent,
	renderFn,
	renderFnOrCurry,
	renderFnType,
} from "./core";

export enum WithTooltipPlacement {
	Top = "top",
	Bottom = "bottom",
	Left = "left",
	Right = "right",
}

export type Offset = number | { x: number; y: number };
export type TooltipTheme = "light" | "dark" | "custom";

export interface WithTooltipProps {
	/** 文本或模板内容 */
	content: string | TemplateResult<1>;
	/** 触发延迟: 显示/隐藏分别的 ms 延迟 */
	delay?: { show: number; hide: number };
	/** 指定显示位置 */
	placement?: WithTooltipPlacement;
	/** 偏移值，支持数字或 {x, y} */
	offset?: Offset;
	/** 是否在点击时隐藏 */
	hideOnClick?: boolean;
	/** 当鼠标移入 tooltip 内容时，保持可见 */
	interactive?: boolean;
	/** 最大宽度 */
	maxWidth?: string;
	/** 自定义主题，自定义时可以通过 CSS 覆盖 .lyco-tooltip--custom */
	theme?: TooltipTheme;
	/** 自定义 z-index */
	zIndex?: number;
	/** 附加类名 */
	className?: string;
	/** 行内样式 */
	style?: string;
	/** 事件绑定 */
	on?: OnEvent;
	/** 显示回调 */
	onShow?: () => void;
	/** 隐藏回调 */
	onHide?: () => void;
}

export function WithTooltip(
	props: WithTooltipProps
): (children?: renderFnType) => TemplateResult;
export function WithTooltip(
	props: WithTooltipProps,
	children?: renderFnType
): TemplateResult;
export function WithTooltip(
	props: WithTooltipProps,
	children?: renderFnType
): TemplateResult | ((children?: renderFnType) => TemplateResult) {
	const {
		content,
		placement = WithTooltipPlacement.Top,
		delay = { show: 200, hide: 100 },
		offset = 8,
		hideOnClick = false,
		interactive = false,
		maxWidth = "200px",
		theme = "dark",
		className = "",
		style = "",
		zIndex = 1000,
		on = {},
		onShow,
		onHide,
	} = props;

	const binder = createEventBinder(on);
	let showTimeout: number;
	let hideTimeout: number;

	function scheduleShow(el: HTMLElement) {
		clearTimeout(hideTimeout);
		showTimeout = window.setTimeout(() => {
			tooltipEl.style.visibility = "visible";
			tooltipEl.style.opacity = "1";
			onShow?.();
		}, delay.show);
	}

	function scheduleHide() {
		clearTimeout(showTimeout);
		hideTimeout = window.setTimeout(() => {
			tooltipEl.style.visibility = "hidden";
			tooltipEl.style.opacity = "0";
			onHide?.();
		}, delay.hide);
	}

	let tooltipEl: HTMLElement;
	const render = (children?: renderFnType) => {
		return html`
			<div
				${ref((el) => {
					if (el) {
						binder.bind(el);
						tooltipEl = el.querySelector(
							".lyco-tooltip-content"
						) as HTMLElement;

						el.addEventListener("mouseenter", () =>
							scheduleShow(el as HTMLElement)
						);
						el.addEventListener("mouseleave", () => scheduleHide());
						if (hideOnClick) el.addEventListener("click", () => scheduleHide());
					} else {
						binder.unbindAll();
					}
				})}
				class="lyco-tooltip lyco-tooltip--${theme} ${className}"
				style="position: relative; display: inline-block; ${style}"
			>
				${renderFn(children)}
				<div
					class="lyco-tooltip-content"
					style="
            position: absolute;
            max-width: ${maxWidth};
            ${placement === WithTooltipPlacement.Top
						? "bottom: 100%; left: 50%; transform: translateX(-50%)"
						: ""}
            ${placement === WithTooltipPlacement.Bottom
						? "top: 100%; left: 50%; transform: translateX(-50%)"
						: ""}
            ${placement === WithTooltipPlacement.Left
						? "right: 100%; top: 50%; transform: translateY(-50%)"
						: ""}
            ${placement === WithTooltipPlacement.Right
						? "left: 100%; top: 50%; transform: translateY(-50%)"
						: ""}
            padding: 4px 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
            background: ${theme === "light"
						? "white; color: black"
						: "rgba(0,0,0,0.8); color: white"};
            border-radius: 4px;
            font-size: 12px;
            white-space: normal;
            width: ${placement === WithTooltipPlacement.Left ||
					placement === WithTooltipPlacement.Right
						? maxWidth
						: "auto"};
            visibility: hidden;
            opacity: 0;
            transition: opacity ${delay.show}ms;
            z-index: ${zIndex};
            margin: ${typeof offset === "number"
						? placement === WithTooltipPlacement.Top ||
						  placement === WithTooltipPlacement.Bottom
							? `${offset}px 0`
							: `0 ${offset}px`
						: `${offset.y}px ${offset.x}px`};
            ${interactive ? "pointer-events: auto" : "pointer-events: none"};
          "
				>
					${content}
				</div>
			</div>
		`;
	};

	return renderFnOrCurry(children, render);
}
