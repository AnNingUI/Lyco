# Lyco

<p align="center">
    <span> English </span> | <a href="./README.md"> 简体中文 </a>
</p>

## Pure CSS Layout Rendering Function Library Based on Lit

`Lyco` is a lightweight CSS layout library built with [Lit](https://lit.dev), providing various commonly used layout components (such as Row, Column, Flex, Grid, etc.), helping developers build responsive web layouts more efficiently.

### Features

- 🧱 Provides a rich set of layout components
- 🌐 Supports responsive design
- 💡 Built on Lit for excellent performance
- 🎨 Pure CSS implementation, easy to customize

### Installation

```bash
npm install lyco
```

### Usage Example

```ts
import { html, LitElement } from 'lit';
import { Row, Spacer } from 'lyco';

class MyLayout extends LitElement {
  render() {
    return html`
        ${Row({}, () => html`
            <div>Left Content</div>
            ${Spacer()}
            <div>Right Content</div>
        `)}
    `;
  }
}
```

### Component List

Here are some commonly used components:

| Component Name | Description                 |
| -------------- | --------------------------- |
| Row            | Horizontal layout container |
| Column         | Vertical layout container   |
| Flex           | Flexible layout container   |
| Grid           | Grid layout container       |
| Card           | Card-style layout           |
| Divider        | Divider line                |
| AvatarStack    | Avatar stack layout         |
| Badge          | Badge component             |
| SkeletonLoader | Skeleton loader animation   |

### Contribution

Contributions and issues are welcome! For details, please see the [Contribution Guide](https://github.com/AnNingUI/lyco/blob/main/CONTRIBUTING.md).

### License

MIT License. Copyright (c) AnNingUI.