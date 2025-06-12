import { html, TemplateResult } from "lit";

// 全局样式存储
let globalStyleContent = "";
// 上下文栈
const contextStack: string[] = [];

// Style 函数
export function Style(
	props?: { id?: string },
	children?: () => TemplateResult<1>
): TemplateResult<1> {
	const styleId = props?.id ?? `style-${Date.now()}`;
	// 进入上下文
	contextStack.push(styleId);

	const childResult = children ? children() : html``;

	// 离开上下文
	contextStack.pop();

	if (contextStack.length === 0) {
		// 如果是最外层的 Style 函数，将全局样式注入到页面
		return html`
			<style id="${styleId}">
				${globalStyleContent}
			</style>
			${childResult}
		`;
	}
	return childResult;
}

// 辅助函数，用于将样式添加到当前上下文中
function addStyleToContext(styleContent: string) {
	if (contextStack.length > 0) {
		// 如果有上下文，将样式添加到全局样式中
		globalStyleContent += styleContent;
	} else {
		// 如果没有上下文，返回一个独立的 <style> 标签
		return html`
			<style>
				${styleContent}
			</style>
		`;
	}
	return html``;
}

// 示例组件，使用 addStyleToContext 来添加样式
export function ExampleComponent(
	props?: { className?: string },
	children?: () => TemplateResult<1>
): TemplateResult<1> {
	const className = props?.className ?? `example-${Date.now()}`;
	const styleContent = `
    .${className} {
      color: blue;
      font-size: 16px;
    }
  `;
	const styleTag = addStyleToContext(styleContent);
	const childResult = children ? children() : html``;

	return html`
		${styleTag}
		<div class="${className}">${childResult}</div>
	`;
}
