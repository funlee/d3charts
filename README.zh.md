# D3Charts

基于 D3.js v3 构建的一系列精美数据可视化图表，全部带有动画效果。

**中文文档** | [English](./README.md)

## 在线预览

在线访问：[https://funlee.github.io/d3charts/](https://funlee.github.io/d3charts/)

## 图表类型

| 图表类型 | 描述 |
|---|---|
| **柱状图（渐变）** | 带线性渐变色、鼠标悬浮 Tooltip 和入场动画的柱状图 |
| **柱状图（普通）** | 标准样式柱状图 |
| **柱状图（蒙版）** | 使用图片蒙版效果的柱状图 |
| **柱状图（Path）** | 通过 SVG path 路径绘制的柱状图 |
| **柱状图（CSS）** | 使用 CSS 动画实现的水平进度条柱状图 |
| **折线图** | 多系列平滑曲线图，支持渐显入场动画 |
| **面积图** | 渐变填充面积图，通过 SVG mask 蒙版实现弹跳动画 |
| **饼图** | 图案填充扇形图，带有引导线和标签 |
| **水球图** | 带波浪动画的液体进度球，支持百分比数值滚动 |
| **雷达图** | 双系列雷达蜘蛛图，含同心圆网格背景 |
| **三角面积图** | 创意三角形柱状图，hover 时显示数值 |
| **中国地图** | 全国省级热力地图，支持悬浮 Tooltip 和颜色图例 |

## 技术栈

- **[D3.js v3](https://d3js.org/)** — SVG 绘图与数据绑定核心库
- **[Webpack 3](https://webpack.js.org/)** — 模块打包与本地开发服务
- **[Handlebars](https://handlebarsjs.com/)** — HTML 模板引擎
- **[Mock.js](http://mockjs.com/)** — 随机 Mock 数据生成（用于演示）
- **[jQuery](https://jquery.com/)** — DOM 操作工具库
- **[Bootstrap 3](https://getbootstrap.com/docs/3.4/)** — 基础样式
- **Less** — CSS 预处理器

## 快速开始

### 环境要求

- Node.js >= 6.x
- npm 或 yarn

### 安装依赖

```bash
git clone https://github.com/funlee/d3charts.git
cd d3charts
npm install
```

### 本地开发

```bash
npm run start
```

启动后在浏览器中打开 [http://localhost:8080](http://localhost:8080)，修改源文件后页面会自动刷新。

### 打包构建

```bash
npm run build
```

打包产物将输出到 `dist/` 目录。

## 项目结构

```
d3charts/
├── build/
│   └── webpack.config.js        # Webpack 配置文件
├── src/
│   ├── app.js                   # 应用入口
│   ├── css/
│   │   └── app.css              # 全局样式
│   ├── hbs/                     # 页面布局模板
│   │   ├── banner.hbs           # 顶部横幅
│   │   ├── container.hbs        # 图表卡片容器
│   │   ├── layer.hbs            # 弹层（图表展示区）
│   │   └── footer.hbs           # 底部
│   ├── img/                     # 图片资源
│   └── components/
│       ├── render.js            # 图表路由调度器
│       ├── charts/              # 各图表实现
│       │   ├── bar.js           # 渐变柱状图
│       │   ├── barNormal.js     # 普通柱状图
│       │   ├── barMask.js       # 蒙版柱状图
│       │   ├── barPath.js       # Path 柱状图
│       │   ├── barCss.js        # CSS 柱状图
│       │   ├── line.js          # 折线图
│       │   ├── area.js          # 面积图
│       │   ├── pie.js           # 饼图
│       │   ├── waterBall.js     # 水球图
│       │   ├── radar.js         # 雷达图
│       │   ├── triangle.js      # 三角面积图
│       │   └── map.js           # 中国地图
│       ├── tool/                # 公共工具函数
│       │   ├── getContainer.js  # SVG 容器工厂函数
│       │   ├── getSize.js       # 响应式尺寸计算
│       │   ├── getLinearGradient.js  # SVG 线性渐变生成器
│       │   ├── tooltip.js       # 浮动 Tooltip 组件
│       │   ├── chinaMap.js      # 地图辅助工具
│       │   ├── southChinaSea.js # 南海诸岛小图
│       │   └── getIdRandom.js   # 随机 ID 生成器
│       ├── lib/
│       │   └── chinageo.json    # 中国省级 GeoJSON 数据
│       ├── hbs/
│       │   └── barCss.hbs       # CSS 柱状图模板
│       └── style/               # 组件样式
│           ├── line.css
│           └── barCss.css
└── package.json
```

## 实现原理

每个图表都是一个独立的类，遵循统一的设计模式：

1. **`defaultSet()`** — 返回默认配置项（颜色、边距、尺寸等）
2. **`constructor(selector, option)`** — 创建 SVG 容器、初始化 Mock 数据并合并用户配置
3. **`render(data)`** — 绘制坐标轴，并调用具体的绘图方法

首页点击图表卡片时，`render.js` 会作为调度器实例化对应的图表类，并在弹层中完成渲染。

### 通用工具说明

| 工具 | 功能 |
|---|---|
| `getContainer` | 确保 SVG/DOM 元素存在（不重复创建） |
| `getSize` | 根据父容器计算实际宽高（支持百分比） |
| `getLinearGradient` | 生成 SVG `<linearGradient>` 定义片段 |
| `tooltip` | 创建跟随鼠标的浮动 Tooltip |

## License

ISC © [funlee](https://github.com/funlee)
