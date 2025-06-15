export const MD3 = {
	// 圆角设置
	borderRadius: {
		small: "4px",
		medium: "8px",
		large: "16px",
		full: "9999px",
	},

	// 阴影层级
	elevation: {
		level1: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.14)",
		level2: "0 3px 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.12)",
		level3: "0 10px 20px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.10)",
		level4: "0 15px 25px rgba(0,0,0,0.15), 0 5px 10px rgba(0,0,0,0.05)",
		level5: "0 20px 40px rgba(0,0,0,0.2)",
	},

	// 动画过渡
	animation: {
		standard: "0.2s cubic-bezier(0.4, 0, 0.2, 1)",
		emphasized: "0.3s cubic-bezier(0.4, 0, 0.2, 1)",
		decelerated: "0.4s cubic-bezier(0, 0, 0.2, 1)",
	},

	// 调色板
	colors: {
		primary: "#6750A4",
		onPrimary: "#FFFFFF",
		primaryContainer: "#EADDFF",
		onPrimaryContainer: "#21005E",

		secondary: "#625B71",
		onSecondary: "#FFFFFF",
		secondaryContainer: "#E8DEF8",
		onSecondaryContainer: "#1E192B",

		surface: "#FEF7FF",
		onSurface: "#1C1B1F",
		surfaceVariant: "#E7E0EB",
		onSurfaceVariant: "#49454E",

		error: "#B00020",
	},
} as const;
