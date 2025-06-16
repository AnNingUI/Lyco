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

export interface ComboboxOption {
	value: string;
	label: string;
}

export interface ComboboxProps {
	value?: string;
	options: ComboboxOption[];
	placeholder?: string;
	disabled?: boolean;
	error?: boolean;
	className?: string;
	style?: string;
	maxHeight?: string;
	onChange?: (value: string) => void;
	onInput?: (value: string) => void;
	onFocus?: () => void;
	onBlur?: () => void;
	on?: OnEvent;
	optionRender?: (option: ComboboxOption) => TemplateResult<1>;
}

export function Combobox(props?: ComboboxProps): TemplateResult<1> {
	const {
		value = "",
		options = [],
		placeholder = "",
		disabled = false,
		error = false,
		className = "",
		style = "",
		maxHeight = "300px",
		onChange,
		onInput,
		onFocus,
		onBlur,
		on = {},
		optionRender,
	} = props ?? {};

	const now = getComponentCount("Combobox");
	const _className =
		getRandomClassName("Combobox::combobox") + `-lyco-now-${now}`;
	let isOpen = false;
	let inputElement: HTMLInputElement | null = null;

	const css = `
    .${_className} {
      position: relative;
      width: 100%;
    }

    .${_className} input {
      width: 100%;
      padding: 12px 16px;
      font-size: 16px;
      border: 1px solid ${error ? MD3.colors.error : MD3.colors.surfaceVariant};
      border-radius: ${MD3.borderRadius.small};
      color: ${MD3.colors.onSurface};
      transition: all ${MD3.animation.standard};
      outline: none;
      box-sizing: border-box;
    }

    .${_className} input:focus {
      border-color: ${MD3.colors.primary};
      box-shadow: 0 0 0 2px ${MD3.colors.primaryContainer};
    }

    .${_className} input:disabled {
      background: ${MD3.colors.surfaceVariant};
      color: ${MD3.colors.onSurfaceVariant};
      cursor: not-allowed;
    }

    .${_className} .options {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      max-height: ${maxHeight};
      overflow-y: auto;
      border: 1px solid ${MD3.colors.surfaceVariant};
      border-radius: ${MD3.borderRadius.small};
      box-shadow: ${MD3.elevation.level2};
      z-index: 1000;
      display: none;
    }

    .${_className} .options.open {
      display: block;
    }

    .${_className} .option {
      padding: 12px 16px;
      cursor: pointer;
      transition: background ${MD3.animation.standard};
    }

    .${_className} .option:hover {
      background: ${MD3.colors.primaryContainer};
    }

    .${_className} .option.selected {
      background: ${MD3.colors.primaryContainer};
      color: ${MD3.colors.onPrimaryContainer};
    }
  `;

	const binder = createEventBinder(on);
	let optionsElement: HTMLElement | null = null;

	const toggleOptions = () => {
		if (isOpen) {
			optionsElement?.classList.remove("open");
		} else {
			optionsElement?.classList.add("open");
		}
		isOpen = !isOpen;
	};

	const handleOptionClick = (option: ComboboxOption, ev: MouseEvent) => {
		if (inputElement) {
			inputElement.value = option.value;
			const t = ev.currentTarget as HTMLElement;
			// 先删除其他的 selected
			Array.from(optionsElement?.querySelectorAll(".selected") ?? []).forEach(
				(t) => t.classList.remove("selected")
			);
			!t.classList.contains("selected") && t.classList.add("selected");
			onChange?.(option.value);
		}
		toggleOptions();
	};

	const handleClickOutside = (e: MouseEvent) => {
		const target = e.target as HTMLElement;
		if (!target.closest(`.${_className}`)) {
			isOpen = false;
			optionsElement?.classList.remove("open");
		}
	};

	if (typeof window !== "undefined") {
		document.addEventListener("click", handleClickOutside);
	}

	return LycoComponent(
		"Combobox",
		html`
			<style>
				${css}
			</style>
			<div class="${_className} ${className}" style="${style}">
				<input
					${ref((el) => {
						if (el) {
							inputElement = el as HTMLInputElement;
							binder.bind(el);
						} else {
							binder.unbindAll();
						}
					})}
					type="text"
					.value=${value}
					placeholder=${placeholder}
					?disabled=${disabled}
					@focus=${() => {
						onFocus?.();
						toggleOptions();
					}}
					@input=${(e: Event) => {
						const target = e.target as HTMLInputElement;
						onInput?.(target.value);
					}}
					@change=${(e: Event) => {
						const target = e.target as HTMLInputElement;
						onChange?.(target.value);
					}}
				/>
				<div
					${ref((el) => {
						if (el) optionsElement = el as HTMLElement;
					})}
					class="options"
				>
					${options.map(
						(option) => html`
							<div
								class="option ${option.value === (inputElement?.value ?? value)
									? "selected"
									: ""}"
								@click=${(ev: MouseEvent) => handleOptionClick(option, ev)}
							>
								${optionRender ? optionRender(option) : option.label}
							</div>
						`
					)}
				</div>
			</div>
		`
	);
}
