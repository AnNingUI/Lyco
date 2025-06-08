import { html } from "lit";

export function Divider(props?: {
	orientation?: "horizontal" | "vertical";
	thickness?: string;
	color?: string;
	margin?: string;
}) {
	const ori = props?.orientation ?? "horizontal";
	const thickness = props?.thickness ?? "1px";
	const color = props?.color ?? "#e0e0e0";
	const margin = props?.margin ?? (ori === "horizontal" ? "8px 0" : "0 8px");

	const style =
		ori === "horizontal"
			? `width: 100%; height: ${thickness}; background: ${color}; margin: ${margin};`
			: `width: ${thickness}; height: 100%; background: ${color}; margin: ${margin};`;

	return html`<div style="${style}"></div>`;
}
