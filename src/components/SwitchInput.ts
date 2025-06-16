import { html, TemplateResult } from "lit";
import { ref } from "lit/directives/ref.js";
import {
	createEventBinder,
	getComponentCount,
	getRandomClassName,
	LycoComponent,
	OnEvent,
} from "../core";
import { MD3 } from "../theme/md3";

export interface SwitchInputProps {
	checked?: boolean;
	disabled?: boolean;
	size?: "small" | "medium" | "large";
	color?: string;
	onChange?: (checked: boolean) => void;
	className?: string;
	on?: OnEvent;
}

export function SwitchInput(props?: SwitchInputProps): TemplateResult<1> {
	const {
		checked = false,
		disabled = false,
		size = "medium",
		color = MD3.colors.primary,
		onChange,
		className = "",
		on = {},
	} = props ?? {};

	const now = getComponentCount("SwitchInput");
	const _className =
		getRandomClassName("SwitchInput::switch") + `-lyco-now-${now}`;

	// 计算尺寸
	const sizeMap = {
		small: { width: 32, height: 16, thumbSize: 12 },
		medium: { width: 44, height: 24, thumbSize: 18 },
		large: { width: 56, height: 32, thumbSize: 24 },
	};
	const { width, height, thumbSize } = sizeMap[size];

	const css = `
    .${_className} {
      display: inline-block;
      position: relative;
      width: ${width}px;
      height: ${height}px;
      cursor: ${disabled ? "not-allowed" : "pointer"};
    }

    .${_className} input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .${_className} .slider {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: ${
				disabled ? MD3.colors.surfaceVariant : MD3.colors.onSurfaceVariant
			};
      transition: ${MD3.animation.standard};
      border-radius: ${height}px;
      opacity: ${disabled ? 0.38 : 0.5};
    }

    .${_className} .slider:before {
      position: absolute;
      content: "";
      height: ${thumbSize}px;
      width: ${thumbSize}px;
      left: ${(height - thumbSize) / 2}px;
      bottom: ${(height - thumbSize) / 2}px;
      background-color: ${MD3.colors.surface};
      transition: ${MD3.animation.emphasized};
      border-radius: 50%;
      box-shadow: ${MD3.elevation.level1};
    }

    .${_className} input:checked + .slider {
      background-color: ${disabled ? MD3.colors.surfaceVariant : color};
      opacity: ${disabled ? 0.38 : 1};
    }

    .${_className} input:checked + .slider:before {
      transform: translateX(${width - height}px);
      background-color: ${MD3.colors.onPrimary};
    }

    .${_className}:hover .slider:before {
      box-shadow: ${disabled ? MD3.elevation.level1 : MD3.elevation.level2};
    }

    .${_className}:active .slider:before {
      box-shadow: ${disabled ? MD3.elevation.level1 : MD3.elevation.level3};
      width: ${thumbSize * 1.2}px;
    }
  `;

	const binder = createEventBinder(on);

	return LycoComponent(
		"SwitchInput",
		html`
			<style>
				${css}
			</style>
			<label
				class="${_className} ${className}"
				${ref((el) => {
					if (el) {
						binder.bind(el);
					} else {
						binder.unbindAll();
					}
				})}
			>
				<input
					type="checkbox"
					?checked=${checked}
					?disabled=${disabled}
					@change=${(e: Event) => {
						if (!disabled && onChange) {
							onChange((e.target as HTMLInputElement).checked);
						}
					}}
				/>
				<span class="slider"></span>
			</label>
		`
	);
}
