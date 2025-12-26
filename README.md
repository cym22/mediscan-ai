# 🏥 MediScan AI - 医疗报告智能解读助手

一款基于 Google Gemini AI 的医疗影像和报告智能分析工具，帮助用户理解复杂的医疗检查结果。

## ✨ 功能特点

- 📸 **智能图像识别**：支持上传医疗影像（X光、CT、MRI、B超等）
- 📄 **报告解读**：智能分析体检报告、化验单等医疗文档
- 🎯 **异常提示**：自动标注异常指标并给出通俗解释
- 💡 **健康建议**：提供基于AI的初步健康指导
- 🔊 **语音播报**：支持将解读结果语音朗读
- 💬 **对话追问**：可以继续提问获取更多信息

## 🚀 快速开始

### 在线使用
访问部署好的应用：`https://你的用户名.github.io/mediscan-ai/`

### 本地运行

1. **克隆项目**
```bash
git clone https://github.com/你的用户名/mediscan-ai.git
cd mediscan-ai
```

2. **安装依赖**
```bash
npm install
```

3. **配置 API Key**

创建 `.env.local` 文件：
```bash
GEMINI_API_KEY=你的Google_AI_API_Key
```

获取 API Key：访问 [Google AI Studio](https://makersuite.google.com/app/apikey)

4. **启动应用**
```bash
npm run dev
```

访问 http://localhost:3000

## 📦 部署到 GitHub Pages

详细部署指南请查看 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

快速步骤：
1. 创建 GitHub 公开仓库
2. 上传代码
3. 在仓库 Settings → Pages 中启用 GitHub Actions
4. 等待自动部署完成

## 🔒 安全提示

⚠️ **请勿将 API Key 直接提交到代码中！**

推荐做法：
- 让用户在应用中输入自己的 API Key
- 或使用 GitHub Secrets 进行环境变量注入

## 🛠️ 技术栈

- **前端框架**：React 19 + TypeScript
- **构建工具**：Vite 6
- **AI 能力**：Google Gemini API
- **样式方案**：Tailwind CSS
- **部署平台**：GitHub Pages

## 📸 使用场景

- 帮助老人理解复杂的医疗报告
- 快速了解体检结果的含义
- 识别医疗影像中的关键信息
- 获取初步的健康建议（非医疗诊断）

## ⚠️ 免责声明

本工具仅供参考，不能替代专业医疗诊断。如有健康问题，请咨询专业医生。

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

💡 提示：这是基于 Google AI Studio 开发的应用，适合作为学习 AI 集成和 Web 开发的参考项目。
