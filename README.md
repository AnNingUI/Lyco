# Lyco

<p align="center">
    <a href="./README_EN.md"> English </a> | <span> 简体中文 </span>
</p>

## 基于 Lit 的纯 CSS 布局渲染函数库

`Lyco` 是一个基于 [Lit](https://lit.dev) 构建的轻量级 CSS 布局库，提供了多种常用的布局组件（如 Row, Column, Flex, Grid 等），帮助开发者更高效地构建响应式网页布局。

### 特性

- 🧱 提供丰富的布局组件
- 🌐 支持响应式设计
- 💡 基于 Lit，性能优异
- 🎨 纯 CSS 实现，易于定制

### 安装

```bash
npm install lyco
```

### 使用示例

```ts
import { html, LitElement } from 'lit';
import { Row, Spacer } from 'lyco';

class MyLayout extends LitElement {
  render() {
    return html`
        ${Row({}, () => html`
            <div>左侧内容</div>
            ${Spacer()}
            <div>右侧内容</div>
        `)}
    `;
  }
}
```

### 组件列表

以下是一些常用组件：

| 组件名         | 描述           |
| -------------- | -------------- |
| Row            | 水平布局容器   |
| Column         | 垂直布局容器   |
| Flex           | 弹性布局容器   |
| Grid           | 网格布局容器   |
| Card           | 卡片式布局     |
| Divider        | 分隔线         |
| AvatarStack    | 头像堆叠布局   |
| Badge          | 徽章组件       |
| SkeletonLoader | 骨架屏加载动画 |

### 贡献

欢迎提交 PR 或 Issue！更多详情请查看 [贡献指南](https://github.com/AnNingUI/lyco/blob/main/CONTRIBUTING.md)。

### 许可证

MIT License. Copyright (c) AnNingUI。