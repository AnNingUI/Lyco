import { html } from "lit";
import "./virtualizer-example";

interface MyDataItem {
	id: number;
	text: string;
}

const generateLargeDataset = () => {
	const data: MyDataItem[] = [];
	// 减少初始数据量到1万条
	for (let i = 0; i < 1000; i++) {
		data.push({
			id: i,
			text: `Item ${i}`,
		});
	}
	return data;
};

const meta = {
	title: "Example/Virtualizer",
	tags: ["autodocs"],
	render: () => html` <virtualizer-example></virtualizer-example> `,
} as const;

export default meta;

export const WithCustomItemRenderer = {
	name: "基础示例",
	render: () => html`
		<virtualizer-example .items=${generateLargeDataset()}></virtualizer-example>
	`,
};
