# 任务管理系统

基于 **Vue 3 + Vite + Pinia + Element Plus + ECharts** 构建的轻量级任务管理单页应用。数据存储在浏览器 localStorage 中，无需后端服务。

## 功能特性

- **任务 CRUD** — 新增、编辑、删除任务
- **状态切换** — 待办 → 进行中 → 已完成 → 待办 循环切换
- **搜索筛选** — 按关键词、状态、优先级、分类筛选
- **排序** — 按创建时间、截止日期、优先级排序
- **统计图表** — 状态分布、优先级分布、分类统计、任务趋势（ECharts）
- **深色模式** — 一键切换浅色/深色主题
- **数据导入导出** — JSON 格式的数据备份与恢复
- **数据持久化** — 所有数据保存在浏览器 localStorage

## 技术栈

| 技术 | 说明 |
|------|------|
| Vue 3 | Composition API + `<script setup>` |
| Vite 6 | 构建工具 |
| Pinia | 状态管理 |
| Vue Router 4 | 路由（懒加载） |
| Element Plus | UI 组件库 |
| ECharts + vue-echarts | 数据可视化 |
| Day.js | 日期处理 |

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 项目结构

```
└── src/
    ├── assets/styles/    # 全局样式（主题变量）
    ├── components/       # 通用组件（TaskCard, TaskForm）
    ├── views/            # 页面视图（4 个页面）
    ├── router/           # 路由配置
    ├── stores/           # Pinia 状态管理
    ├── utils/            # 工具函数（localStorage 读写）
    ├── App.vue           # 根布局
    └── main.js           # 应用入口
```

## 页面说明

| 页面 | 路由 | 功能 |
|------|------|------|
| 仪表盘 | `/dashboard` | 统计卡片、快捷操作、近期任务、概览饼图 |
| 任务列表 | `/tasks` | 搜索/筛选/排序、任务批量管理 |
| 统计分析 | `/stats` | 4 个 ECharts 图表 |
| 设置 | `/settings` | 主题切换、数据导入导出、清理操作 |
