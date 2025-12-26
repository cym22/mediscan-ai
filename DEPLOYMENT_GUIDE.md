# MediScan AI - GitHub Pages 部署指南

这是一个医疗报告智能解读助手，使用 Google Gemini AI 来分析医疗影像和报告。

## 📋 部署前准备

### 1. 获取 Google AI API Key
1. 访问 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 点击 "Create API Key"
3. 复制生成的 API Key（格式类似：`AIzaSy...`）

### 2. 创建 GitHub 仓库
1. 登录 GitHub
2. 点击右上角 "+" → "New repository"
3. 仓库名建议：`mediscan-ai` 或其他名称
4. 设置为 **Public**（GitHub Pages 免费版仅支持公开仓库）
5. 不要勾选 "Add a README file"
6. 点击 "Create repository"

## 🚀 部署步骤

### 方法一：使用 Git 命令行（推荐）

```bash
# 1. 进入项目文件夹
cd /path/to/your/app

# 2. 初始化 Git 仓库
git init
git add .
git commit -m "Initial commit: MediScan AI"

# 3. 连接到 GitHub 仓库（替换成你的用户名和仓库名）
git branch -M main
git remote add origin https://github.com/你的用户名/mediscan-ai.git
git push -u origin main
```

### 方法二：直接上传文件

1. 在 GitHub 仓库页面点击 "Add file" → "Upload files"
2. 将所有文件拖拽到页面中
3. 点击 "Commit changes"

### 3. 配置 GitHub Pages

1. 进入仓库的 **Settings** 页面
2. 在左侧菜单找到 **Pages**
3. 在 "Build and deployment" 部分：
   - Source: 选择 **GitHub Actions**
4. 保存设置

### 4. 等待部署完成

1. 点击仓库顶部的 **Actions** 标签
2. 等待 "Deploy to GitHub Pages" 工作流运行完成（约 2-3 分钟）
3. 部署成功后，访问：`https://你的用户名.github.io/mediscan-ai/`

## 🔐 API Key 安全配置

### ⚠️ 重要警告
**永远不要将 API Key 直接写在代码中并提交到公开仓库！**

### 推荐方案：用户自行输入 Key

应用已配置为让用户在首次使用时输入自己的 API Key，这样：
- ✅ 不会暴露你的 Key
- ✅ 每个用户使用自己的配额
- ✅ 更安全、更灵活

### 可选方案：使用 GitHub Secrets（为测试用户提供 Key）

如果你希望为朋友提供测试，可以这样做：

1. 进入仓库 **Settings** → **Secrets and variables** → **Actions**
2. 点击 "New repository secret"
3. 名称：`GEMINI_API_KEY`
4. 值：粘贴你的 API Key
5. 点击 "Add secret"

然后修改 `.github/workflows/deploy.yml` 文件，在 Build 步骤添加：

```yaml
- name: Build
  run: npm run build
  env:
    NODE_ENV: production
    GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
```

## 📱 使用说明

部署成功后，用户可以：
1. 上传医疗影像（X光、CT、MRI等）或医疗报告截图
2. 应用会使用 AI 分析并提供：
   - 图像内容识别
   - 异常指标解读
   - 健康建议
   - 语音播报功能

## 🛠️ 本地开发

```bash
# 安装依赖
npm install

# 创建 .env.local 文件
echo "GEMINI_API_KEY=你的API_Key" > .env.local

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

## 📝 自定义配置

### 修改仓库路径

如果你的仓库名不是 `mediscan-ai`，需要更新 `vite.config.ts`：

```typescript
base: '/你的仓库名/',
```

### 自定义域名

1. 在仓库根目录创建 `public/CNAME` 文件
2. 写入你的域名：`mediscan.yourdomain.com`
3. 在域名服务商处添加 CNAME 记录指向：`你的用户名.github.io`

## 🐛 常见问题

### 部署后页面空白
- 检查 `vite.config.ts` 中的 `base` 路径是否正确
- 检查浏览器控制台是否有错误

### API Key 不工作
- 确认 Key 格式正确（以 `AIzaSy` 开头）
- 检查 Google AI Studio 中 API 是否已启用
- 确认 API 配额未超限

### GitHub Actions 失败
- 检查 `package.json` 中的依赖版本
- 查看 Actions 日志中的具体错误信息

## 📞 技术支持

如有问题，可以：
- 查看 [Vite 文档](https://vitejs.dev/)
- 查看 [Google AI SDK 文档](https://ai.google.dev/)
- 在 GitHub Issues 中提问

## 📄 许可证

本项目基于 Google AI Studio 生成，仅供学习和测试使用。
