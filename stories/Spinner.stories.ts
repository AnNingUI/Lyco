import { Meta } from "@storybook/web-components";
import { html } from "lit";
import { Progress, Row, Spinner, WithTooltip } from "../src/components";
import { Combobox } from "../src/components/Combobox";
import { SwitchInput } from "../src/components/SwitchInput";
import { WithTooltipPlacement } from "../src/components/Tooltip";

export default {
	title: "Example/Spinner",
	tags: ["autodocs"],
	argTypes: {
		size: {
			control: { type: "text" },
			description: "尺寸大小",
			defaultValue: "24px",
		},
		color: {
			control: { type: "color" },
			description: "颜色",
		},
		thickness: {
			control: { type: "text" },
			description: "线条粗细",
			defaultValue: "2px",
		},
		speed: {
			control: { type: "text" },
			description: "动画速度",
			defaultValue: "0.8s",
		},
		opacity: {
			control: { type: "range", min: 0, max: 1, step: 0.1 },
			description: "透明度",
			defaultValue: 1,
		},
		startAngle: {
			control: { type: "range", min: 0, max: 360, step: 45 },
			description: "起始角度",
			defaultValue: 0,
		},
		easing: {
			control: { type: "select" },
			options: ["linear", "ease", "ease-in", "ease-out", "ease-in-out"],
			description: "缓动函数",
			defaultValue: "linear",
		},
		reverse: {
			control: "boolean",
			description: "反向旋转",
			defaultValue: false,
		},
	},
} as Meta;

export const Basic = () => html`${Spinner()}`;

export const CustomSize = () =>
	Row({ space: "20px", center: true })([
		Spinner({ size: "16px" }),
		Spinner({ size: "24px" }),
		Spinner({ size: "32px" }),
		Spinner({ size: "48px" }),
	]);

export const CustomColor = () => html`
	<div style="display: flex; gap: 20px; align-items: center;">
		${Spinner({ color: "#1976d2" })} ${Spinner({ color: "#dc004e" })}
		${Spinner({ color: "#4caf50" })} ${Spinner({ color: "#ff9800" })}
	</div>
`;

export const CustomSpeed = () => html`
	<div style="display: flex; gap: 20px; align-items: center;">
		${Spinner({ speed: "0.5s" })} ${Spinner({ speed: "1s" })}
		${Spinner({ speed: "2s" })}
	</div>
`;

export const CustomThickness = () => html`
	<div style="display: flex; gap: 20px; align-items: center;">
		${Spinner({ thickness: "1px" })} ${Spinner({ thickness: "2px" })}
		${Spinner({ thickness: "4px" })}
	</div>
`;

export const CustomContent = () => html`
	<div style="display: flex; gap: 20px; align-items: center;">
		${Spinner({
			children: html`<svg
				viewBox="0 0 24 24"
				width="100%"
				height="100%"
				fill="currentColor"
			>
				<path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
			</svg>`,
			size: "32px",
			color: "#1976d2",
		})}
		${Spinner({
			children: html`<div
				style="
					width: 100%;
					height: 100%;
					border: 2px dashed currentColor;
					border-radius: 50%;
				"
			></div>`,
			size: "32px",
			color: "#4caf50",
		})}
	</div>
`;

export const CustomEasing = () => html`
	<div style="display: flex; gap: 20px; align-items: center;">
		${Spinner({ easing: "linear" })} ${Spinner({ easing: "ease" })}
		${Spinner({ easing: "ease-in-out" })}
		${Spinner({ easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)" })}
	</div>
`;

export const CustomStartAngle = () => html`
	<div style="display: flex; gap: 20px; align-items: center;">
		${Spinner({ startAngle: 0 })} ${Spinner({ startAngle: 90 })}
		${Spinner({ startAngle: 180 })} ${Spinner({ startAngle: 270 })}
	</div>
`;

export const ReverseAndOpacity = () => html`
	<div style="display: flex; gap: 20px; align-items: center;">
		${Spinner({ reverse: true, color: "#1976d2" })}
		${Spinner({ opacity: 0.75, color: "#dc004e" })}
		${Spinner({ reverse: true, opacity: 0.5, color: "#4caf50" })}
	</div>
`;

export const SVGMode = () => html`
	<div style="display: flex; gap: 20px; align-items: center;">
		${Spinner({ svgMode: false, color: "#1976d2" })}
		${Spinner({ svgMode: true, color: "#1976d2" })}
	</div>
`;

export const StrokeLinecap = () => html`
	<div style="display: flex; gap: 20px; align-items: center;">
		${Spinner({ svgMode: true, strokeLinecap: "butt", size: "32px" })}
		${Spinner({ svgMode: true, strokeLinecap: "round", size: "32px" })}
		${Spinner({ svgMode: true, strokeLinecap: "square", size: "32px" })}
	</div>
`;

export const StrokeDasharray = () => html`
	<div style="display: flex; gap: 20px; align-items: center;">
		${Spinner({ svgMode: true, strokeDasharray: "", size: "32px" })}
		${Spinner({ svgMode: true, strokeDasharray: "5,5", size: "32px" })}
		${Spinner({ svgMode: true, strokeDasharray: "10,5,2,5", size: "32px" })}
		<!-- ${Progress({
			value: 40,
			bufferValue: 70,
			height: "10px",
			color: "#4caf50",
			secondaryColor: "#c8e6c9",
			striped: true,
			animated: true,
			paused: false,
			showLabel: true,
			labelPosition: "outside",
		})} -->
		<!-- ${WithTooltip({
			content: html`
				<div style="padding: 5px">
					浅色主题提示 支持多行文本展示，并且超过宽度会自动换行。
				</div>
			`,
			placement: WithTooltipPlacement.Left,
			theme: "dark",
			maxWidth: "120px",
			offset: { x: 0, y: 10 },
		})(html`<button>Hover me (Bottom, Light)</button>`)} -->
		<!-- ${SwitchInput({
			checked: true,
			onChange: (checked) => console.log("Switch changed:", checked),
		})} -->
		<!-- ${Combobox({
			value: "apple",
			options: [
				{ value: "apple", label: "Apple" },
				{ value: "banana", label: "Banana" },
				{ value: "orange", label: "Orange" },
			],
			placeholder: "Select a fruit",
			onChange: (value) => console.log("Selected:", value),
		})} -->
	</div>
`;
