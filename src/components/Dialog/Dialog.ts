import { html, TemplateResult } from "lit";
import { ref, Ref } from "lit/directives/ref.js";
import {
	createEventBinder,
	getComponentCount,
	getRandomClassName,
	LycoComponent,
	OnEvent,
	renderFnOrArray,
	renderFnOrArrayOrCurry,
	renderFnOrArrayType,
} from "../../core";
import { MD3 } from "../../theme/md3";

export enum DialogPlacement {
	Center = "center",
	Left = "left",
	Right = "right",
	Top = "top",
	Bottom = "bottom",
	TopStart = "top-start",
	TopEnd = "top-end",
	BottomStart = "bottom-start",
	BottomEnd = "bottom-end",
	LeftStart = "left-start",
	LeftEnd = "left-end",
	RightStart = "right-start",
	RightEnd = "right-end",
}

const isSSR = typeof window === "undefined";
const hasNativeDialog = !isSSR && "HTMLDialogElement" in window;

type DialogProps = {
	open?: boolean;
	onClose?: () => void;
	proxyRef?: Ref<IDialogLike>;
	className?: string;
	style?: string;
	on?: OnEvent;
	movable?: Ref<HTMLElement> | "self" | false;
	mask?: boolean; // 新增：是否启用遮罩层
	placement?: DialogPlacement; // 新增：对话框位置
};

const getFallbackStyles = (open: boolean) => `
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: ${open ? "flex" : "none"};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  background: rgba(0,0,0,0.3);
`;

// 创建一个简化的接口，只包含我们需要的方法
interface IDialogLike {
	show(): void;
	showModal(): void;
	close(): void;
	open: boolean;
	style: CSSStyleDeclaration;
	getBoundingClientRect(): DOMRect;
}

// 修改 DialogLike 类实现
class DialogLike implements IDialogLike {
	private element: HTMLDivElement;
	private contentElement: HTMLDivElement;
	private isOpen: boolean = false;

	constructor(container: HTMLDivElement, content: HTMLDivElement) {
		this.element = container;
		this.contentElement = content;
	}

	show() {
		this.element.style.display = "flex";
		this.isOpen = true;
	}

	showModal() {
		this.show();
	}

	close() {
		this.element.style.display = "none";
		this.isOpen = false;
		this.element.dispatchEvent(new Event("close"));
	}

	get open() {
		return this.isOpen;
	}

	// 实现移动相关方法
	getBoundingClientRect() {
		return this.contentElement.getBoundingClientRect();
	}

	// 样式相关
	get style() {
		return this.contentElement.style;
	}

	// 其他必需的 HTMLDialogElement 接口实现...
	returnValue: string = "";
}

export function Dialog(
	props?: DialogProps
): (children?: renderFnOrArrayType) => TemplateResult<1>;
export function Dialog(
	props?: DialogProps,
	children?: renderFnOrArrayType
): TemplateResult<1>;
export function Dialog(props?: DialogProps, children?: renderFnOrArrayType) {
	const open = props?.open ?? false;
	const onClose = props?.onClose;
	const className = props?.className ?? "";
	const style = props?.style ?? "";
	const binder = createEventBinder(props?.on ? props?.on : {});
	const movable = props?.movable ?? false;
	const placement = props?.placement ?? DialogPlacement.Center;
	let proxyRef = props?.proxyRef ?? {
		value: null as IDialogLike | null,
	};
	let dialogEl: HTMLElement | null = null;
	let isDragging = false;
	let offset = { x: 0, y: 0 };
	let moveTarget: HTMLElement | null = null;
	let mask = props?.mask ?? true;
	const now = getComponentCount("Dialog");
	const _className = getRandomClassName("Dialog::dialog") + "-lyco-now-" + now;
	function getMoveTarget(dialog: HTMLElement): HTMLElement | null {
		if (!movable) return null;
		if (movable === "self") return dialog;
		if (movable && "value" in movable) return movable.value as HTMLElement;
		return null;
	}

	function getCenteredPosition(): string {
		if (typeof window === "undefined") return "";

		const width = 300; // dialog宽度估值（或你可以动态获取）
		const height = 150; // dialog高度估值
		const left = (window.innerWidth - width) / 2;
		const top = (window.innerHeight - height) / 2;

		return `left: ${left}px; top: ${top}px;`;
	}

	// 获取位置样式
	function getPlacementStyle() {
		switch (placement) {
			case "left":
				return "left: 32px; top: 50%;";
			case "right":
				return "right: 32px; top: 50%;";
			case "top":
				return "top: 32px; left: 50%;";
			case "bottom":
				return "bottom: 32px; left: 50%;";
			case "top-start":
				return "top: 32px; left: 32px;";
			case "top-end":
				return "top: 32px; right: 32px;";
			case "bottom-start":
				return "bottom: 32px; left: 32px;";
			case "bottom-end":
				return "bottom: 32px; right: 32px;";
			case "left-start":
				return "left: 32px; top: 32px;";
			case "left-end":
				return "left: 32px; bottom: 32px;";
			case "right-start":
				return "right: 32px; top: 32px;";
			case "right-end":
				return "right: 32px; bottom: 32px;";
			default:
				// 默认居中：这里也不使用 transform，而是你自己计算 left/top 设置进去
				return getCenteredPosition();
		}
	}

	// 获取百分比
	function getTranslate() {
		switch (placement) {
			case "top-start":
			case "top-end":
			case "bottom-start":
			case "bottom-end":
			case "left-start":
			case "left-end":
			case "right-start":
			case "right-end":
				return {
					txp: 0,
					typ: 0,
				};
			case "left":
				return {
					txp: 0,
					typ: -50,
				};
			case "right":
				return {
					txp: 0,
					typ: -50,
				};
			case "top":
				return {
					txp: -50,
					typ: 0,
				};
			case "bottom":
				return {
					txp: -50,
					typ: 0,
				};
			default:
				return {
					txp: -50,
					typ: -50,
				};
		}
	}

	// 处理鼠标按下事件
	function handleMouseDown(e: MouseEvent, dialog: HTMLElement) {
		if (e.button !== 0) return;
		moveTarget = getMoveTarget(dialog);
		if (!moveTarget || !moveTarget.contains(e.target as Node)) return;
		dialogEl = dialog;

		// ✨ 移除 transform，防止偏移叠加
		dialogEl.style.transform = "none";
		e.preventDefault();
		moveTarget.style.cursor = "grabbing";

		const rect = dialog.getBoundingClientRect();
		const { txp, typ } = getTranslate();

		offset = {
			x: e.clientX - (rect.left + (txp / 100) * rect.width),
			y: e.clientY - (rect.top + (typ / 100) * rect.height),
		};

		isDragging = true;
		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	}

	function handleMouseMove(e: MouseEvent) {
		if (!isDragging || !moveTarget || !dialogEl) return;
		const rect = dialogEl.getBoundingClientRect();
		const { txp, typ } = getTranslate();

		const newLeft = e.clientX - offset.x - (txp / 100) * rect.width;
		const newTop = e.clientY - offset.y - (typ / 100) * rect.height;

		dialogEl.style.left = `${newLeft}px`;
		dialogEl.style.top = `${newTop}px`;
	}

	function handleMouseUp() {
		isDragging = false;
		moveTarget = null;
		dialogEl = null;
		document.removeEventListener("mousemove", handleMouseMove);
		document.removeEventListener("mouseup", handleMouseUp);
	}
	// 获取背景样式
	function getBackdropStyle() {
		const bgColor = mask ? "rgba(0,0,0,0.5)" : "transparent";
		return `
      ${_className}::-webkit-backdrop,
      ${_className}::backdrop {
        background: ${bgColor};
        transition: opacity ${MD3.animation.standard};
      }
    `;
	}

	// 渲染回退方案
	function renderFallback(children?: renderFnOrArrayType) {
		let containerRef: HTMLDivElement | null = null;
		let contentRef: HTMLDivElement | null = null;

		return LycoComponent(
			"Dialog",
			html`
				<div
					${ref((el) => {
						if (el) {
							containerRef = el as HTMLDivElement;
							if (contentRef) {
								const dialogLike = new DialogLike(containerRef, contentRef);
								(proxyRef as any).value = dialogLike;
								binder.bind(containerRef);

								// 初始状态设置
								if (open) {
									dialogLike.showModal();
								} else {
									dialogLike.close();
								}
							}
						} else {
							binder.unbindAll();
						}
					})}
					@click=${(e: MouseEvent) => {
						if (e.target === e.currentTarget) {
							onClose?.();
						}
					}}
					style=${getFallbackStyles(open)}
				>
					<div
						${ref((el) => {
							if (el) {
								contentRef = el as HTMLDivElement;
								if (containerRef) {
									const dialogLike = new DialogLike(containerRef, contentRef);
									(proxyRef as any).value = dialogLike;
								}
							}
						})}
						class="${_className} ${className}"
						style="
              padding: 0;
              border: none;
              background: ${MD3.colors.surface};
              border-radius: ${MD3.borderRadius.large};
              min-width: 300px;
              ${getPlacementStyle()}
              ${typeof movable !== "boolean" ? "cursor: default;" : ""}
              ${style}
            "
					>
						${renderFnOrArray(children)}
					</div>
				</div>
			`
		);
	}

	// 渲染主函数
	function renderMain(children?: renderFnOrArrayType) {
		// 在 SSR 环境或不支持 dialog 的环境使用降级方案
		if (isSSR || !hasNativeDialog) {
			return renderFallback(children);
		}

		return LycoComponent(
			"Dialog",
			html`
				<dialog
					${ref((el) => {
						if (el) {
							(proxyRef as any).value = el as HTMLDialogElement;
							const _el = el as HTMLDialogElement;
							binder.bind(_el);
							// 使用 requestAnimationFrame 确保元素已经被添加到 DOM 中
							requestAnimationFrame(() => {
								try {
									if (open) {
										_el.showModal();
									} else {
										_el.close();
									}
								} catch (e) {
									console.warn("Dialog operation failed:", e);
								}
							});
						} else {
							binder.unbindAll();
						}
					})}
					@close=${onClose}
					@mousedown=${(e: MouseEvent) =>
						handleMouseDown(e, e.currentTarget as HTMLElement)}
					style="
          padding: 0;
          border: none;
          background: ${MD3.colors.surface};
          border-radius: ${MD3.borderRadius.large};
          min-width: 300px;
          margin: 0;
          position: fixed;
          box-shadow: ${MD3.elevation.level3};
          transition: transform ${MD3.animation.emphasized};
          ${getPlacementStyle()}
          ${typeof movable !== "boolean" ? "cursor: default;" : ""}
          ${style}
        "
				>
					${renderFnOrArray(children)}
				</dialog>
				<style>
					${getBackdropStyle()}
				</style>
			`
		);
	}

	return renderFnOrArrayOrCurry(children, renderMain);
}
