import { html, TemplateResult } from "lit";
import { $Html } from "../src";
import { $AllEl } from "../src/basic";

// 模拟数据源
interface ChartData {
	id: number;
	label: string;
	value: number;
	color: string;
}

const data: ChartData[] = [
	{ id: 1, label: "A", value: 30, color: "#FF6B6B" },
	{ id: 2, label: "B", value: 50, color: "#4ECDC4" },
	{ id: 3, label: "C", value: 70, color: "#45B7D1" },
	{ id: 4, label: "D", value: 40, color: "#96CEB4" },
];

// 状态模拟：高亮显示某个数据项
let highlightedId: number | null = null;

// 点击事件处理函数
const handleClick = (item: ChartData) => {
	highlightedId = highlightedId === item.id ? null : item.id;
};

// 构建条形图
const renderBarChart = (): TemplateResult => {
	const barWidth = 30;
	const spacing = 10;
	const maxValue = Math.max(...data.map((d) => d.value));
	const chartHeight = 200; // 增加高度
	const chartWidth = (barWidth + spacing) * data.length + spacing; // 计算总宽度

	return $Html(
		$AllEl.div(
			{
				style: {
					width: `${chartWidth}px`,
					height: `${chartHeight}px`,
					margin: "20px",
				},
			},
			$AllEl.svg(
				{
					width: "100%",
					height: "100%",
					style: {
						backgroundColor: "#f8f8f8",
					},
					viewBox: `0 0 ${chartWidth} ${chartHeight}`,
					on: {
						click: () => {
							highlightedId = null;
						},
					},
				},
				[
					...data.map((item, index) => {
						const x = spacing + index * (barWidth + spacing);
						const barHeight = (item.value / maxValue) * (chartHeight - 40); // 留出上下边距
						const y = chartHeight - barHeight - 20; // 底部留出边距

						return $AllEl.g(
							{
								key: item.id,
								transform: `translate(${x}, 0)`,
								on: {
									click: (e: Event) => {
										e.stopPropagation();
										handleClick(item);
									},
								},
								style: {
									cursor: "pointer",
									transition: "transform 0.3s ease",
								},
							},
							[
								// 条形柱
								$AllEl.rect({
									x: 0,
									y: y,
									width: barWidth,
									height: barHeight,
									fill: item.color,
									stroke: highlightedId === item.id ? "black" : "none",
									strokeWidth: 2,
								})(),

								// 标签
								$AllEl.text({
									x: barWidth / 2,
									y: y - 5,
									fontSize: 12,
									textAnchor: "middle",
									fill: "black",
								})(item.label),

								// 值
								$AllEl.text({
									x: barWidth / 2,
									y: chartHeight - 5,
									fontSize: 12,
									textAnchor: "middle",
									fill: "gray",
								})(`${item.value}`),
							]
						);
					}),
				]
			)
		)
	) as TemplateResult<1>;
};

// 构建饼图扇区路径
const renderPieSlice = (
	startAngle: number,
	endAngle: number,
	radius: number,
	color: string
): TemplateResult<1> => {
	const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
	const x1 = radius + radius * Math.cos((startAngle * Math.PI) / 180);
	const y1 = radius + radius * Math.sin((startAngle * Math.PI) / 180);
	const x2 = radius + radius * Math.cos((endAngle * Math.PI) / 180);
	const y2 = radius + radius * Math.sin((endAngle * Math.PI) / 180);

	const pathData = `
    M ${radius},${radius}
    L ${x1},${y1}
    A ${radius},${radius} 0 ${largeArcFlag},1 ${x2},${y2}
    Z
  `;

	return $AllEl.path({
		d: pathData.trim(),
		fill: color,
		stroke: "white",
		strokeWidth: 1,
	})();
};

// 构建饼图
const renderPieChart = (): TemplateResult => {
	const radius = 50;
	let currentAngle = 0;

	return $Html(
		$AllEl.svg(
			{
				width: "100%",
				height: "100%",
				viewBox: `0 0 ${radius * 2} ${radius * 2}`,
				style: "background-color: #f8f8f8",
			},
			[
				...data.map((item) => {
					const sliceAngle = (item.value / 200) * 360; // 总值为 200
					const nextAngle = currentAngle + sliceAngle;
					const result = renderPieSlice(
						currentAngle,
						nextAngle,
						radius,
						item.color
					);
					currentAngle = nextAngle;
					return result;
				}),
				// 中心文字
				$AllEl.text({
					x: radius,
					y: radius + 5,
					fontSize: 12,
					textAnchor: "middle",
					fontWeight: "bold",
					fill: "black",
				})("Sales"),
			]
		)
	) as TemplateResult<1>;
};

// 组合图表组件
export const DashboardComponent = () => {
	return html`
		<div style="display: flex; gap: 20px; padding: 20px;">
			<div>${renderBarChart()}</div>
			<div>${renderPieChart()}</div>
		</div>
	`;
};
