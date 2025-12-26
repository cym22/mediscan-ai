#!/bin/bash

# MediScan AI - 快速部署脚本

echo "🏥 MediScan AI - GitHub Pages 部署向导"
echo "======================================"
echo ""

# 检查是否已初始化 Git
if [ ! -d ".git" ]; then
    echo "📝 步骤 1: 初始化 Git 仓库"
    git init
    git add .
    git commit -m "Initial commit: MediScan AI"
    echo "✅ Git 仓库初始化完成"
    echo ""
else
    echo "✅ Git 仓库已存在"
    echo ""
fi

# 获取 GitHub 用户名和仓库名
echo "📋 步骤 2: 配置 GitHub 仓库"
read -p "请输入你的 GitHub 用户名: " username
read -p "请输入你的仓库名 (如: mediscan-ai): " repo_name

# 检查是否已设置 remote
if git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  Remote 'origin' 已存在，是否覆盖？(y/n)"
    read -p "> " confirm
    if [ "$confirm" == "y" ]; then
        git remote remove origin
        git remote add origin "https://github.com/$username/$repo_name.git"
        echo "✅ Remote 已更新"
    fi
else
    git remote add origin "https://github.com/$username/$repo_name.git"
    echo "✅ Remote 已设置"
fi

echo ""
echo "🚀 步骤 3: 推送到 GitHub"
git branch -M main
git push -u origin main

echo ""
echo "✅ 代码已推送到 GitHub!"
echo ""
echo "📌 接下来的步骤："
echo "1. 访问 https://github.com/$username/$repo_name/settings/pages"
echo "2. 在 'Build and deployment' 部分选择 'GitHub Actions'"
echo "3. 等待部署完成（约 2-3 分钟）"
echo "4. 访问 https://$username.github.io/$repo_name/"
echo ""
echo "🔐 安全提醒："
echo "- 不要将 API Key 直接写在代码中"
echo "- 让用户在应用中输入自己的 API Key"
echo "- 或使用 GitHub Secrets 配置环境变量"
echo ""
echo "📖 详细文档请查看 DEPLOYMENT_GUIDE.md"
