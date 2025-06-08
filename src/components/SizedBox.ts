import { html } from "lit";

export function SizedBox(props?: { width?: string; height?: string }) {
	const w = props?.width ? `width: ${props.width};` : "";
	const h = props?.height ? `height: ${props.height};` : "";
	return html` <div style="${w} ${h}"></div> `;
}
