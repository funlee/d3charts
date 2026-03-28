# D3Charts

A collection of elegant and animated data visualization charts built with D3.js v3.

[中文文档](./README.zh.md) | **English**

## Preview

Online Demo: [https://funlee.github.io/d3charts/](https://funlee.github.io/d3charts/)

## Charts Included

| Chart Type | Description |
|---|---|
| **Bar Chart** | Gradient bar chart with hover tooltip and entrance animation |
| **Bar (Normal)** | Standard bar chart variant |
| **Bar (Mask)** | Bar chart with image mask effect |
| **Bar (Path)** | Bar chart rendered using SVG path |
| **Bar (CSS)** | Horizontal bar chart implemented with CSS animation |
| **Line Chart** | Multi-series smooth line chart with fade-in animation |
| **Area Chart** | Gradient area chart with bounce animation using SVG mask |
| **Pie Chart** | Donut-style pie chart with image fill and label lines |
| **Water Ball** | Animated liquid ball chart showing percentage with wave motion |
| **Radar Chart** | Dual-series radar/spider chart with concentric grid |
| **Triangle Chart** | Creative triangle-shaped bar chart |
| **China Map** | Choropleth map of China with province hover tooltip and color legend |

## Tech Stack

- **[D3.js v3](https://d3js.org/)** — Core SVG drawing and data binding
- **[Webpack 3](https://webpack.js.org/)** — Module bundler and dev server
- **[Handlebars](https://handlebarsjs.com/)** — HTML templating engine
- **[Mock.js](http://mockjs.com/)** — Random data generation for demos
- **[jQuery](https://jquery.com/)** — DOM utilities
- **[Bootstrap 3](https://getbootstrap.com/docs/3.4/)** — Base styles
- **Less** — CSS pre-processor

## Getting Started

### Prerequisites

- Node.js >= 6.x
- npm or yarn

### Installation

```bash
git clone https://github.com/funlee/d3charts.git
cd d3charts
npm install
```

### Development

```bash
npm run start
```

Then open [http://localhost:8080](http://localhost:8080) in your browser. The page will auto-refresh on file changes.

### Build

```bash
npm run build
```

The bundled output will be generated in the `dist/` directory.

## Project Structure

```
d3charts/
├── build/
│   └── webpack.config.js        # Webpack configuration
├── src/
│   ├── app.js                   # Application entry point
│   ├── css/
│   │   └── app.css              # Global styles
│   ├── hbs/                     # Page layout templates
│   │   ├── banner.hbs
│   │   ├── container.hbs
│   │   ├── layer.hbs
│   │   └── footer.hbs
│   ├── img/                     # Image assets
│   └── components/
│       ├── render.js            # Chart router / dispatcher
│       ├── charts/              # Individual chart implementations
│       │   ├── bar.js           # Gradient bar chart
│       │   ├── barNormal.js     # Normal bar chart
│       │   ├── barMask.js       # Mask bar chart
│       │   ├── barPath.js       # Path bar chart
│       │   ├── barCss.js        # CSS bar chart
│       │   ├── line.js          # Line chart
│       │   ├── area.js          # Area chart
│       │   ├── pie.js           # Pie chart
│       │   ├── waterBall.js     # Water ball chart
│       │   ├── radar.js         # Radar chart
│       │   ├── triangle.js      # Triangle chart
│       │   └── map.js           # China map chart
│       ├── tool/                # Shared utilities
│       │   ├── getContainer.js  # SVG container factory
│       │   ├── getSize.js       # Responsive size calculator
│       │   ├── getLinearGradient.js  # SVG gradient generator
│       │   ├── tooltip.js       # Floating tooltip component
│       │   ├── chinaMap.js      # China map helper
│       │   ├── southChinaSea.js # South China Sea inset
│       │   └── getIdRandom.js   # Random ID generator
│       ├── lib/
│       │   └── chinageo.json    # China GeoJSON data
│       ├── hbs/
│       │   └── barCss.hbs       # CSS bar chart template
│       └── style/               # Component styles
│           ├── line.css
│           └── barCss.css
└── package.json
```

## How It Works

Each chart is a self-contained class that follows a consistent pattern:

1. **`defaultSet()`** — Returns default configuration (colors, margins, sizes)
2. **`constructor(selector, option)`** — Creates SVG container, initializes mock data, and merges options
3. **`render(data)`** — Draws axes and delegates to specific draw methods

Clicking a chart card on the homepage triggers `render.js`, which instantiates the corresponding chart class inside a modal layer.

## License

ISC © [funlee](https://github.com/funlee)
