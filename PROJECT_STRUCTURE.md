# 📁 项目结构说明

```
mediscan-ai-deploy/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 自动部署配置
├── index.html                  # 应用入口 HTML
├── index.tsx                   # React 主应用代码（1400+ 行）
├── package.json                # 项目依赖配置
├── tsconfig.json               # TypeScript 配置
├── vite.config.ts              # Vite 构建工具配置
├── .gitignore                  # Git 忽略文件配置
├── .env.example                # 环境变量示例文件
├── deploy.sh                   # 快速部署脚本（可执行）
├── README.md                   # 项目说明（中文）
├── DEPLOYMENT_GUIDE.md         # 详细部署指南
├── USER_GUIDE.md               # 用户使用说明
├── QUICK_START.md              # 快速开始指南（本文档的上级）
└── metadata.json               # AI Studio 元数据
```

## 📄 关键文件说明

### 核心代码文件

**index.html**
- 应用的 HTML 框架
- 引入 React、Babel、Tailwind CSS 等依赖
- 配置 API Key（已改为空，需用户输入）
- 定义样式和 Import Maps

**index.tsx** (63KB, 1431 行)
- React 主应用组件
- 包含所有业务逻辑：
  - 图片上传和预览
  - Google Gemini AI 调用
  - Markdown 渲染
  - 语音播报功能
  - 对话历史管理
  - 本地存储功能

### 配置文件

**package.json**
```json
{
  "dependencies": {
    "react": "^19.2.3",              // React 框架
    "react-dom": "^19.2.3",          // React DOM
    "@google/genai": "^1.34.0"       // Google AI SDK
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^5.0.0", // Vite React 插件
    "typescript": "~5.8.2",           // TypeScript
    "vite": "^6.2.0"                  // 构建工具
  }
}
```

**vite.config.ts**
- Vite 构建配置
- 设置 base 路径（用于 GitHub Pages）
- 配置环境变量注入
- 开发服务器设置

**tsconfig.json**
- TypeScript 编译配置
- 目标 ES2020
- JSX 支持
- 模块解析配置

### GitHub Actions 配置

**.github/workflows/deploy.yml**
- 自动化部署流程
- 触发条件：push 到 main 分支
- 构建步骤：
  1. 检出代码
  2. 安装 Node.js 20
  3. 安装依赖
  4. 构建项目
  5. 部署到 GitHub Pages

### 文档文件

**README.md**
- 项目介绍
- 功能特点
- 快速开始
- 技术栈说明

**DEPLOYMENT_GUIDE.md**
- 完整的部署步骤
- API Key 安全配置
- 自定义域名设置
- 常见问题解答

**USER_GUIDE.md**
- 终端用户使用说明
- 功能详细介绍
- 使用技巧
- 隐私和安全说明

**QUICK_START.md**
- 三步部署指南
- API Key 配置方案
- 检查清单
- 故障排查

### 工具文件

**deploy.sh**
- Bash 自动化部署脚本
- 交互式配置 GitHub 仓库
- 自动推送代码
- 提供后续步骤指引

**.env.example**
- 环境变量模板
- 展示所需的配置项
- 本地开发参考

**.gitignore**
- 排除 node_modules
- 排除构建产物 (dist)
- 排除环境变量文件 (*.local, .env)
- 排除编辑器配置

## 🔄 工作流程

### 本地开发
```bash
npm install          # 安装依赖
cp .env.example .env.local  # 复制环境变量
# 编辑 .env.local，填入 API Key
npm run dev          # 启动开发服务器
```

### 构建部署
```bash
npm run build        # 构建生产版本 → dist/
npm run preview      # 预览构建结果
```

### 自动部署（GitHub Actions）
```
push → GitHub → Actions 触发 → 构建 → 部署到 Pages
```

## 📊 代码统计

- **总行数**：约 1,500+ 行
- **主要语言**：TypeScript (90%), HTML/CSS (10%)
- **依赖包数**：7 个
- **构建产物大小**：约 200KB（压缩后）

## 🎨 主要功能模块

从 `index.tsx` 中提取的功能：

1. **图标组件** (行 14-110)
   - 自定义 SVG 图标
   - 统一的视觉风格

2. **工具函数** (行 111-200)
   - 文件类型检测
   - 图片压缩
   - Base64 转换

3. **AI 调用逻辑** (行 201-500)
   - Google Gemini API 集成
   - 流式响应处理
   - 错误处理

4. **UI 组件** (行 501-1000)
   - 文件上传区域
   - 结果展示卡片
   - 对话界面
   - 语音控制

5. **状态管理** (行 1001-1200)
   - React Hooks
   - 本地存储同步
   - 历史记录管理

6. **样式和动画** (行 1201-1431)
   - Tailwind CSS 类
   - 加载动画
   - 响应式布局

## 🔧 自定义建议

### 修改应用名称
在以下文件中搜索并替换 "MediScan AI"：
- `index.html` (title 标签)
- `README.md`
- `package.json` (name 字段)

### 调整样式
- 主色调：在 `index.html` 中搜索 `#3b82f6`（蓝色）
- 字体：修改 `index.html` 中的 Google Fonts 链接
- 布局：编辑 `index.tsx` 中的 Tailwind 类名

### 添加功能
建议的扩展点：
- 导出 PDF 报告
- 历史记录搜索
- 多语言支持
- 暗黑模式

## 📝 代码质量

- ✅ TypeScript 类型安全
- ✅ React Hooks 最佳实践
- ✅ 错误边界处理
- ✅ 响应式设计
- ✅ 无障碍支持（ARIA 标签）
- ✅ SEO 友好的 meta 标签

## 🚀 性能优化

已实现：
- 图片压缩（最大 2MB）
- 懒加载组件
- 本地缓存结果
- CDN 加载依赖

可优化：
- 代码分割（动态 import）
- Service Worker（离线支持）
- 虚拟滚动（长列表）

---

如有问题，请参考其他文档或查看代码注释。
