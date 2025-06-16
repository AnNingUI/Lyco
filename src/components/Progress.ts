import { css, html, TemplateResult } from "lit";
import { ref } from "lit/directives/ref.js";
import { createEventBinder, OnEvent } from "../core";

type ProgressProps = {
	value?: number; // 主进度 (0-100)
	bufferValue?: number; // 缓冲/次要进度 (0-100)
	color?: string; // 主进度条颜色
	secondaryColor?: string; // 缓冲进度颜色
	backgroundColor?: string; // 整体背景颜色
	height?: string; // 进度条高度
	radius?: string; // 圆角
	showLabel?: boolean; // 是否显示进度标签
	labelPosition?: "inside" | "outside";
	labelColor?: string;
	labelFontSize?: string;
	striped?: boolean; // 是否条纹化
	animated?: boolean; // 条纹动画
	paused?: boolean; // 是否暂停动画
	transitionDuration?: string;
	prefixIcon?: TemplateResult<1>; // 前置图标
	suffixIcon?: TemplateResult<1>; // 后置图标
	className?: string;
	style?: string;
	on?: OnEvent;
};

export function Progress(props?: ProgressProps): TemplateResult<1> {
	const value = Math.min(100, Math.max(0, props?.value ?? 0));
	const buffer = Math.min(100, Math.max(0, props?.bufferValue ?? 0));
	const color = props?.color ?? "#1976d2";
	const secondaryColor = props?.secondaryColor ?? "#90caf9";
	const backgroundColor = props?.backgroundColor ?? "#e0e0e0";
	const height = props?.height ?? "4px";
	const radius = props?.radius ?? "4px";
	const showLabel = props?.showLabel ?? false;
	const labelPosition = props?.labelPosition ?? "inside";
	const labelColor = props?.labelColor ?? (value > 50 ? "white" : color);
	const labelFontSize = props?.labelFontSize ?? "12px";
	const striped = props?.striped ?? false;
	const animated = props?.animated ?? false;
	const paused = props?.paused ?? false;
	const duration = props?.transitionDuration ?? "0.3s";
	const className = props?.className ?? "";
	const style = props?.style ?? "";
	const binder = createEventBinder(props?.on ?? {});

	const stripes = striped
		? `background-image: linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent);
      background-size: 1rem 1rem;
      animation: progress-stripes 1s linear infinite;
      animation-play-state: ${paused ? "paused" : "running"};`
		: "";
	return html`
		<style>
			${css`
				@keyframes progress-stripes {
					from {
						background-position: 1rem 0;
					}
					to {
						background-position: 0 0;
					}
				}
			`.cssText}
		</style>

		<div
			${ref((el) => {
				if (el) binder.bind(el);
				else binder.unbindAll();
			})}
			class="lyco-progress ${className}"
			role="progressbar"
			aria-valuemin="0"
			aria-valuemax="100"
			aria-valuenow="${value}"
			style="
        width: 100%;
        background: ${backgroundColor};
        border-radius: ${radius};
        height: ${height};
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        ${style}
      "
		>
			${props?.prefixIcon}
			<!-- 缓冲进度 -->
			<div
				style="
          position: absolute;
          width: ${buffer}%;
          height: 100%;
          background: ${secondaryColor};
          transition: width ${duration} ease;
        "
			></div>
			<!-- 主进度 -->
			<div
				style="
          position: absolute;
          width: ${value}%;
          height: 100%;
          background: ${color};
          border-radius: ${radius};
          transition: width ${duration} ease;
          ${stripes}
        "
			></div>

			<!-- 文本标签 -->
			${showLabel
				? html`
						<div
							style="
                position: ${labelPosition === "inside"
								? "absolute"
								: "relative"};
                ${labelPosition === "inside"
								? "right: 8px; top: 50%; transform: translateY(-50%);"
								: "margin-left: auto; margin-right: 4px;"}
                font-size: ${labelFontSize};
                color: ${labelColor};
                z-index: 1;
              "
						>
							${value}%
						</div>
				  `
				: ""}
			${props?.suffixIcon}
		</div>
	`;
}
