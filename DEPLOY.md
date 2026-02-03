# 部署指南：议起读教师培训网页

本指南提供几种免费且在国内访问速度较好的部署方案。鉴于"国内能访问"的要求，首推 **Gitee Pages (码云)**。

## 方案一：Gitee Pages (码云) - 推荐 🇨🇳

Gitee 是国内最大的代码托管平台，其 Pages 服务在国内访问速度最快、最稳定。

### 前置条件
1. 注册 Gitee 账号 (gitee.com)
2. **重要**：需要完成实名认证（根据国内法规，开通 Pages 服务必须验证身份信息，通常需上传身份证照片，审核约1个工作日）。

### 部署步骤
1. **创建仓库**：
   - 登录 Gitee，点击右上角 `+` -> "新建仓库"。
   - 仓库名称填 `teacher-training`（或任意名称）。
   - 设为"开源"（Pages 服务通常要求开源仓库，私有仓库可能收费）。
   - 点击"创建"。

2. **上传代码**：
   - 在本地文件夹中打开终端（或使用 Git GUI）。
   - 关联远程仓库并推送：
     ```bash
     git remote add origin https://gitee.com/你的用户名/teacher-training.git
     git push -u origin master
     ```
   - *（如果您不熟悉 Git 命令行，也可以直接在 Gitee 网页端选择"上传文件"，将 `index.html`, `style.css`, `script.js` 和 `images` 文件夹上传）*。

3. **开启 Pages**：
   - 进入此仓库页面，点击菜单栏的 "服务" -> "Gitee Pages"。
   - 分支选择 `master`，部署目录填写 `.` (根目录)。
   - 点击 "启动" 或 "更新"。
   - 等待部署完成后，会生成一个网址（如 `https://yourname.gitee.io/teacher-training`）。

---

## 方案二：腾讯云 EdgeOne Pages - 强烈推荐 🚀

腾讯云 EdgeOne Pages (Pages Drop) 提供免费的静态网站托管服务，拥有境内外加速节点，访问速度极快，是 Gitee Pages 的强力替代方案。

### 部署步骤
1. **注册/登录**：
   - 访问 [EdgeOne Pages 控制台](https://console.cloud.tencent.com/edgeone/pages)。
   - 使用微信或腾讯云账号登录。

2. **创建项目**：
   - 点击 "新建项目"。
   - 如果代码在 GitHub/Gitee：选择 "连接 Git 仓库"（支持实时自动构建）。
   - **最简单方式**：选择 "直接上传"。
     - 将你的项目文件夹（包含 `index.html` 的文件夹）打包成 `.zip` 压缩包。
     - 直接拖拽上传。

3. **获取域名**：
   - 上传完成后，系统会自动生成一个 `*.pages.woa.com` 或类似的免费测试域名。
   - 稍等片刻即可访问，速度通常非常快。

---

## 方案三：Cloudflare Pages - 备选 🌍

Cloudflare 的全球节点（包括边缘节点）通常在国内访问尚可，且不需要实名认证，极其简单。

### 部署步骤
1. 注册 Cloudflare 账号。
2. 进入 Dashboard，选择 "Workers & Pages"。
3. 点击 "Create application" -> "Pages" -> "Upload assets"。
4. 创建项目名称（如 `teacher-training`）。
5. 直接拖拽整个项目文件夹（包含 html/css/js 的文件夹）到上传区域。
6. 点击 "Deploy site"。
7. 获得 `*.pages.dev` 的永久免费域名。

---

## 方案三：Vercel - 备选 ⚡️

Vercel 部署体验极佳，但其默认域名 `vercel.app` 在国内部分地区可能被阻断（DNS污染）。如果有自己的域名（需绑定），则是非常好的选择。

1. 注册 Vercel 账号。
2. 安装 Vercel CLI (`npm i -g vercel`) 或直接在网页端导入 GitHub/GitLab 仓库。
3. 如果使用网页端，关联你的 GitHub 仓库即可自动部署。

---

## 本地预览

如果您只是想在局域网内给同事看，或者自己在电脑上看：
- 直接双击打开 `index.html` 即可（部分图片可能因浏览器安全策略无法加载，建议使用 HTTP 服务）。
- 使用 Python 快速启动服务：
  ```bash
  python3 -m http.server 8000
  ```
  然后访问 `http://localhost:8000`。
