import { html, render as litRender, TemplateResult } from "lit";
import { ref } from "lit/directives/ref.js";
import { AnimationAPI } from "../core"; // Assuming AnimationAPI is correctly implemented

export function LazyForEach<T extends any[]>(
	items: T,
	render: (item: T[number], index: number) => TemplateResult,
	threshold: number = 0.1,
	animationOptions: {
		animationClass?: string;
		animation?: (element: HTMLElement) => void;
		cssProperties?: Record<string, string>;
		duration?: number;
		delay?: number;
	} = {}
): TemplateResult[] {
	const renderedStates: boolean[] = new Array(items.length).fill(false);

	// 定义一个占位符大小（例如50vh和100vw），提升性能
	const placeholderHeight = `${threshold * 100}vh`;
	const placeholderWidth = "100vw";

	const observedElements = items.map((item, index) => {
		return html`
			<div
				${ref((element) => {
					if (element && !renderedStates[index]) {
						// 延迟创建IntersectionObserver实例，避免过早的资源消耗
						const observer = new IntersectionObserver(
							(entries, observerInstance) => {
								entries.forEach((entry) => {
									if (entry.isIntersecting && !renderedStates[index]) {
										const el = entry.target as HTMLElement;
										renderedStates[index] = true;

										// 渲染内容
										litRender(render(item, index), el);

										// 应用动画
										AnimationAPI.applyAnimation(el, animationOptions);

										// 清理占位符
										const placeholder = el.querySelector("[data-fallback]");
										if (placeholder) {
											placeholder.remove(); // 移除占位符
										}

										// 停止观察
										observerInstance.unobserve(el);
									}
								});
							},
							{
								root: null,
								rootMargin: `0px`,
							}
						);

						// 只有在第一次观察时，才开始观察元素
						observer.observe(element);
					}
				})}
				data-index="${index}"
				style="transition: transform ${animationOptions.duration || "1s"} ease;"
			>
				<!-- 占位元素 -->
				<div
					data-fallback
					style="height: ${placeholderHeight}; width: ${placeholderWidth};"
				></div>
			</div>
		`;
	});

	return observedElements;
}
