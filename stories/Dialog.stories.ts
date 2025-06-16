import { Meta, StoryFn } from "@storybook/web-components";
import { html } from "lit";
import { createRef } from "lit/directives/ref.js";
import {
	$Html,
	Dialog,
	DialogActions,
	DialogButton,
	DialogContent,
	DialogTitle,
} from "../src/components/mod";

const Template: StoryFn = (args) => {
	const handleClose = () => {
		args.onClose?.();
	};

	return html`
		${Dialog(
			{
				open: args.open,
				onClose: handleClose,
				style: "max-width: 500px;",
			},
			[
				DialogTitle({}, () => html`对话框标题`),
				DialogContent(
					{},
					() => html`
						<p>这是一个简单的对话框内容。</p>
						<p>您可以在这里放置任何内容。</p>
					`
				),
				DialogActions({}, [
					DialogButton({ onClick: handleClose }, () => html`取消`),
					DialogButton(
						{
							variant: "contained",
							onClick: handleClose,
						},
						() => html`确定`
					),
				]),
			]
		)}
	`;
};

export const WithComplexContent = () =>
	$Html(
		Dialog({ open: true }, [
			DialogTitle({}, () => html`复杂内容示例`),
			DialogContent({}, [
				html`<h3>表单示例</h3>`,
				html`<div style="margin: 16px 0;">
					<label>用户名: </label>
					<input type="text" />
				</div>`,
				html`<div style="margin: 16px 0;">
					<label>密码: </label>
					<input type="password" />
				</div>`,
			]),
			DialogActions({}, [
				DialogButton({}, () => html`取消`),
				DialogButton(
					{ variant: "contained", color: "primary" },
					() => html`提交`
				),
			]),
		])
	);

export const MultipleButtons = () => html`
	${Dialog({ open: true }, [
		DialogTitle({})(html`多按钮示例`),
		DialogContent({})(html` <p>这个示例展示了不同样式的按钮。</p> `),
		DialogActions({})([
			DialogButton({})(html`取消`),
			DialogButton({ variant: "contained", color: "secondary" })(html`保存`),
			DialogButton({ variant: "contained", color: "primary" })(html`发布`),
		]),
	])}
`;

export const CustomStyles = () => {
	let isOpened = true;
	const dRef = createRef<HTMLDialogElement>();
	const rRef = createRef<HTMLDivElement>();
	return $Html(
		Dialog({
			open: isOpened,
			proxyRef: dRef,
			movable: rRef,
		})([
			DialogTitle({
				style: "background: #f5f5f5; border-bottom: 1px solid #ddd;",
				proxyRef: rRef,
			})(html`自定义样式`),
			DialogContent({
				style: "padding: 32px;",
			})(html` <p>这个对话框使用了自定义样式。</p> `),
			DialogActions({
				style: "padding: 16px; border-top: 1px solid #ddd;",
			})([
				DialogButton({
					style: "background: #ff4081;",
					variant: "contained",
					onClick: () => {
						isOpened = false;
						dRef.value?.close();
					},
				})(html`关闭`),
				DialogButton({
					style: "background: #40b6ff;",
					variant: "contained",
				})(html`确定`),
			]),
		])
	);
};

const meta = {
	title: "Example/Dialog",
	argTypes: {
		open: {
			control: "boolean",
			defaultValue: false,
		},
		onClose: { action: "closed" },
	},
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: "An example of a dialog component.",
			},
		},
	},
	render: Template,
} as Meta;

export default meta;
