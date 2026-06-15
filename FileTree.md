├── 📁 public
├── 📁 src
│   ├── 📁 assets
│   ├── 📁 components
│   │   └── 📁 AnalyticsBarGraph
│   │       ├── 📁 context
│   │       │   ├── 📄 GraphDataContext.tsx
│   │       │   ├── 📄 GraphSelectionContext.tsx
│   │       │   └── 📄 GraphThemeContext.tsx
│   │       ├── 📁 engines
│   │       │   ├── 📄 RealtimeAdapter.ts
│   │       │   ├── 📄 ScalingEngine.ts
│   │       │   └── 📄 SelectionEngine.ts
│   │       ├── 📁 features
│   │       │   ├── 📁 Bars
│   │       │   │   ├── 📄 Bar.tsx
│   │       │   │   └── 📄 BarContainer.tsx
│   │       │   ├── 📁 Footer
│   │       │   │   ├── 📄 AggregationRenderer.tsx
│   │       │   │   └── 📄 Footer.tsx
│   │       │   ├── 📁 GraphArea
│   │       │   │   ├── 📄 GraphArea.tsx
│   │       │   │   ├── 📄 Grid.tsx
│   │       │   │   ├── 📄 ThresholdLayer.tsx
│   │       │   │   └── 📄 YAxis.tsx
│   │       │   ├── 📁 Header
│   │       │   │   ├── 📄 Header.tsx
│   │       │   │   └── 📄 HeaderActions.tsx
│   │       │   ├── 📁 Legend
│   │       │   │   ├── 📄 Legend.tsx
│   │       │   │   └── 📄 LegendSeries.tsx
│   │       │   └── 📁 Zones
│   │       │       ├── 📄 XAxisContent.tsx
│   │       │       ├── 📄 Zone.tsx
│   │       │       └── 📄 ZoneInteractionLayer.tsx
│   │       ├── 📁 types
│   │       │   ├── 📄 engine.types.ts
│   │       │   ├── 📄 graph.types.ts
│   │       │   └── 📄 theme.types.ts
│   │       ├── 📁 utils
│   │       │   ├── 📄 dom.utils.ts
│   │       │   ├── 📄 math.utils.ts
│   │       │   └── 📄 memoization.utils.ts
│   │       ├── 📄 AnalyticsBarGraph.tsx
│   │       └── 📄 index.ts
│   ├── 📁 data
│   │   ├── 📁 schema
│   │   │   ├── 📄 api-response.schema.ts
│   │   │   └── 📄 socket-event.schema.ts
│   │   ├── 📁 static
│   │   │   ├── ⚙️ default-series.json
│   │   │   ├── ⚙️ historical-metrics.json
│   │   │   └── ⚙️ initial-zones.json
│   │   └── 📁 websocket
│   │       ├── 📄 mock-socket-client.ts
│   │       ├── 📄 payload-generators.ts
│   │       └── 📄 stream-simulator.ts
│   ├── 📁 styles
│   │   ├── 📁 animations
│   │   │   ├── 🎨 css-transitions.css
│   │   │   └── 🎨 framer-motion-overrides.css
│   │   ├── 📁 components
│   │   │   ├── 🎨 bars.css
│   │   │   ├── 🎨 footer-cards.css
│   │   │   ├── 🎨 header-actions.css
│   │   │   ├── 🎨 legend.css
│   │   │   └── 🎨 threshold.css
│   │   ├── 📁 layout
│   │   │   ├── 🎨 graph-area.css
│   │   │   ├── 🎨 responsive-overflow.css
│   │   │   ├── 🎨 z-index-layers.css
│   │   │   └── 🎨 zone-grid.css
│   │   ├── 📁 states
│   │   │   ├── 🎨 disabled.css
│   │   │   ├── 🎨 focus-visible.css
│   │   │   ├── 🎨 hover-fade.css
│   │   │   └── 🎨 selection.css
│   │   ├── 📁 theme
│   │   │   ├── 🎨 colors.css
│   │   │   ├── 🎨 radius-borders.css
│   │   │   ├── 🎨 shadows.css
│   │   │   ├── 🎨 spacing.css
│   │   │   ├── 🎨 typography.css
│   │   │   └── 🎨 variables.css
│   │   └── 🎨 index.css
│   ├── 📄 App.tsx
│   └── 📄 main.tsx
├── ⚙️ .gitignore
├── 📝 FileTree.md
├── 📝 README.md
├── 📄 eslint.config.js
├── 🌐 index.html
├── ⚙️ package-lock.json
├── ⚙️ package.json
├── ⚙️ tsconfig.app.json
├── ⚙️ tsconfig.json
├── ⚙️ tsconfig.node.json
└── 📄 vite.config.ts