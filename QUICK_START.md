# 🚀 快速开始指南

## 📦 你已经准备好的文件

你的项目已经配置完毕，包含：
- ✅ React + TypeScript 应用代码
- ✅ GitHub Actions 自动部署配置
- ✅ 完整的文档（部署、使用说明）
- ✅ 安全的 API Key 配置方案
- ✅ 快速部署脚本

## 🎯 三步部署到 GitHub Pages

### 方法一：使用命令行（推荐）

```bash
# 1. 在 GitHub 创建新仓库
#    - 仓库名：mediscan-ai（或其他名称）
#    - 类型：Public（公开）
#    - 不要勾选任何初始化选项

# 2. 在终端运行（在项目文件夹内）
./deploy.sh

# 3. 按提示输入你的 GitHub 用户名和仓库名
```

### 方法二：手动上传

```bash
# 1. 初始化 Git
git init
git add .
git commit -m "Initial commit: MediScan AI"

# 2. 连接 GitHub（替换成你的信息）
git branch -M main
git remote add origin https://github.com/你的用户名/mediscan-ai.git
git push -u origin main

# 3. 在 GitHub 仓库设置中启用 Pages
#    Settings → Pages → Source: GitHub Actions
```

### 方法三：直接拖拽

1. 在 GitHub 创建新仓库
2. 进入仓库页面，点击 "Add file" → "Upload files"
3. 将所有文件拖拽到浏览器
4. 提交更改
5. Settings → Pages → Source: GitHub Actions

## ⏱️ 等待部署

1. 点击仓库顶部的 **Actions** 标签
2. 等待 "Deploy to GitHub Pages" 工作流完成（2-3分钟）
3. 绿色勾号 = 部署成功 ✅
4. 访问：`https://你的用户名.github.io/mediscan-ai/`

## 🔐 重要：API Key 安全

你的原始代码中包含了 API Key，我已经将它移除了。现在有两种方案：

### 方案 A：让用户输入自己的 Key（推荐）✅
- 应用会提示用户输入自己的 Google AI API Key
- 每个用户使用自己的配额
- 你的 Key 不会暴露
- **无需额外配置，直接部署即可**

### 方案 B：使用 GitHub Secrets（为朋友提供测试）
1. 进入仓库 Settings → Secrets and variables → Actions
2. 新建 Secret：
   - 名称：`GEMINI_API_KEY`
   - 值：你的 API Key
3. 修改 `.github/workflows/deploy.yml` 第 24 行：
   ```yaml
   - name: Build
     run: npm run build
     env:
       NODE_ENV: production
       GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}  # 添加这行
   ```

## 📖 详细文档

- **部署指南**：`DEPLOYMENT_GUIDE.md`
- **用户使用说明**：`USER_GUIDE.md`
- **项目说明**：`README.md`

## ✅ 检查清单

部署前确认：
- [ ] 已创建 GitHub 公开仓库
- [ ] 已删除代码中的 API Key
- [ ] 已决定使用方案 A 还是方案 B
- [ ] 已准备好向朋友分享应用链接

部署后确认：
- [ ] GitHub Actions 显示绿色勾号
- [ ] 可以访问部署的网址
- [ ] 应用可以正常加载
- [ ] 上传图片功能正常

## 🐛 遇到问题？

### 页面空白
```bash
# 检查 vite.config.ts 中的 base 路径
# 应该是：base: '/你的仓库名/',
```

### 部署失败
- 查看 Actions 标签中的错误日志
- 确认 package.json 没有语法错误
- 检查是否启用了 GitHub Pages

### API Key 不工作
- 确认在 [Google AI Studio](https://makersuite.google.com/app/apikey) 已创建 Key
- 检查 Key 格式（应以 `AIzaSy` 开头）
- 确认 API 未超过配额限制

## 📞 获取帮助

- 查看 `DEPLOYMENT_GUIDE.md` 获取详细步骤
- 检查 GitHub Actions 日志获取错误信息
- 在 GitHub Issues 中提问

## 🎉 成功部署后

分享给朋友：
```
🏥 试试我开发的医疗报告智能解读工具！

链接：https://你的用户名.github.io/mediscan-ai/

功能：
✅ 上传医疗影像或报告
✅ AI 智能分析解读
✅ 通俗易懂的健康建议
✅ 支持语音播报

💡 需要自己的 Google AI API Key（免费）
```

---

祝部署顺利！🚀
