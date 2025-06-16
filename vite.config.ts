// vite.config.ts
import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
	// plugins: [lit()],
	build: {
		// 指定库模式构建
		lib: {
			entry: {
				index: path.resolve(__dirname, "src/index.ts"),
				basic: path.resolve(__dirname, "src/basic.ts"),
			},
			name: "Lyco", // UMD 名称（如果需要 UMD 格式，可额外配置）
			fileName: (format, entryName) => `${entryName}.${format}.js`,
			formats: ["es", "cjs"], // 仅输出 ESM + CJS
		},
		rollupOptions: {
			// 确保将 peerDependencies（尤其是 lit）排除在打包之外
			external: [
				"lit",
				"lit/decorators.js",
				"lit/directives/ref.js",
				"lit/directives/unsafe-svg.js",
				"lit/directives/style-map.js",
				"lit/directives/unsafe-html.js",
			],
			output: {
				// 为每种格式添加注释 banner（可选）
				banner: `/* lyco v1.0.0 | (c) Copyright AnNingUI */`,
			},
		},
		sourcemap: true, // 是否生成 sourcemap，根据需要开启
	},
	plugins: [
		// vite-plugin-dts 用于生成类型声明文件到 dist/types
		dts({
			insertTypesEntry: true, // 在 dist 根目录生成 index.d.ts
			// 忽略 stories 目录
			exclude: ["stories"],
			outDir: "dist/types",
			tsconfigPath: "tsconfig.json",
		}),
	],
});
