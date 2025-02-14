# element-rotator

元素旋转

## 安装

```sh
npm install element-rotator

yarn add element-rotator
```

## 使用

```js
import ElementRotator from "element-rotator";
import type { IOptions } from 'element-rotator';

const container = document.querySelector("#container");

const options = {
  top: "-50px", // 旋转点偏移位置
  rotate: 45, // 初始旋转角度
  // able: document.querySelector("#target"), // 自定义旋转点
};
const elementRotatorIns = new ElementRotator(container, options as IOptions);
```

## API options

| 参数     | 说明           | 类型                 |
| -------- | -------------- | -------------------- |
| `top`    | 旋转点偏移位置 | `number` \| `string` |
| `rotate` | 初始旋转角度   | `number`             |
| `able`   | 自定义旋转点   | `Element`            |
