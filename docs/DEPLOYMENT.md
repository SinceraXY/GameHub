# 🚀 部署指南 | Deployment Guide

本文档提供了多种部署GameHub的方法。

This document provides multiple ways to deploy GameHub.

**[中文](#中文) | [English](#english)**

---

## 中文

### 📋 前置要求

GameHub是一个纯静态网站，不需要后端服务器。你只需要：
- 一个能托管静态文件的服务
- （可选）一个自定义域名

### 🌐 部署选项

#### 1. GitHub Pages（推荐）

**优点：**
- ✅ 完全免费
- ✅ 自动部署
- ✅ 支持自定义域名
- ✅ HTTPS支持

**步骤：**

1. Fork 或推送代码到GitHub仓库

2. 进入仓库设置
   - 点击 `Settings`
   - 选择 `Pages`

3. 配置GitHub Pages
   - Source: 选择 `Deploy from a branch`
   - Branch: 选择 `main` 或 `master`
   - Folder: 选择 `/root`
   - 点击 `Save`

4. 等待部署完成（通常1-2分钟）

5. 访问你的网站
   ```
   https://YOUR_USERNAME.github.io/GameHub/
   ```

**自定义域名：**

1. 在域名提供商处添加CNAME记录：
   ```
   CNAME记录：www -> YOUR_USERNAME.github.io
   ```

2. 在GitHub Pages设置中添加自定义域名

3. 等待DNS传播（可能需要24-48小时）

---

#### 2. Netlify

**优点：**
- ✅ 免费计划充足
- ✅ 自动部署
- ✅ 表单处理
- ✅ 无服务器函数

**步骤：**

1. 注册Netlify账号（https://www.netlify.com）

2. 连接GitHub仓库
   - 点击 `New site from Git`
   - 选择 `GitHub`
   - 授权并选择仓库

3. 配置构建设置
   - Build command: 留空
   - Publish directory: `/`

4. 点击 `Deploy site`

5. （可选）配置自定义域名

---

#### 3. Vercel

**优点：**
- ✅ 极快的CDN
- ✅ 自动部署
- ✅ 边缘函数支持
- ✅ 免费SSL

**步骤：**

1. 注册Vercel账号（https://vercel.com）

2. 导入项目
   - 点击 `New Project`
   - 导入GitHub仓库

3. 配置项目
   - Framework Preset: `Other`
   - Build Command: 留空
   - Output Directory: `./`

4. 点击 `Deploy`

---

#### 4. Cloudflare Pages

**优点：**
- ✅ 全球CDN
- ✅ 无限带宽
- ✅ 自动部署
- ✅ 免费计划

**步骤：**

1. 注册Cloudflare账号（https://pages.cloudflare.com）

2. 创建项目
   - 点击 `Create a project`
   - 连接GitHub

3. 配置构建
   - Build command: 留空
   - Build output directory: `/`

4. 点击 `Save and Deploy`

---

#### 5. 自托管

**使用Nginx：**

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/GameHub;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 启用gzip压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # 缓存静态资源
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**使用Apache：**

创建 `.htaccess` 文件：

```apache
# 启用重写引擎
RewriteEngine On

# 如果不是文件或目录，重定向到index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]

# 启用gzip压缩
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# 设置缓存
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

---

### ⚙️ 环境配置

#### 更新URL

部署后，需要更新以下文件中的URL：

1. **index.html**
   - 更新Open Graph URL
   - 更新Twitter卡片URL
   - 更新Canonical URL

2. **README.md**
   - 更新在线演示链接

#### 自定义配置

1. **修改网站标题**
   ```html
   <!-- index.html -->
   <title>你的自定义标题</title>
   ```

2. **修改主题颜色**
   ```css
   /* style.css */
   :root {
       --primary: #你的颜色;
       --secondary: #你的颜色;
   }
   ```

3. **修改联系方式**
   - 更新footer中的社交链接
   - 更新README中的联系信息

---

### 🔧 性能优化

#### 1. 图片优化
- 使用WebP格式
- 压缩图片文件
- 使用懒加载

#### 2. 代码压缩
```bash
# 安装工具
npm install -g html-minifier clean-css-cli uglify-js

# 压缩HTML
html-minifier --collapse-whitespace --remove-comments index.html -o index.min.html

# 压缩CSS
cleancss -o style.min.css style.css

# 压缩JavaScript
uglifyjs script.js -o script.min.js -c -m
```

#### 3. CDN加速
使用CDN加速静态资源：
- jsDelivr
- unpkg
- cdnjs

#### 4. 启用HTTP/2
确保你的服务器支持HTTP/2

---

### 📊 分析和监控

#### Google Analytics

添加到 `index.html` 的 `<head>` 中：

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

#### 其他分析工具
- Plausible Analytics
- Umami
- Matomo

---

### 🔒 安全建议

1. **启用HTTPS**
   - 使用Let's Encrypt免费SSL证书
   - 在Cloudflare启用SSL

2. **设置安全头**
   ```nginx
   add_header X-Frame-Options "SAMEORIGIN" always;
   add_header X-Content-Type-Options "nosniff" always;
   add_header X-XSS-Protection "1; mode=block" always;
   ```

3. **配置CORS**（如果需要）
   ```nginx
   add_header Access-Control-Allow-Origin "https://yourdomain.com";
   ```

---

### 🐛 常见问题

#### Q: 游戏链接404错误
**A:** 检查games文件夹的路径是否正确，确保所有游戏文件都已上传。

#### Q: 样式未加载
**A:** 检查CSS文件路径，确保使用相对路径。

#### Q: 在子目录部署
**A:** 如果部署在子目录（如 `/gamehub/`），需要更新所有资源路径。

---

### 📞 获取帮助

如果遇到部署问题：
- 查看 [Issues](https://github.com/SinceraXY/GameHub/issues)
- 创建新issue
- 发送邮件：2952671670@qq.com

---

## English

### 📋 Prerequisites

GameHub is a pure static website that doesn't require a backend server. You only need:
- A service that can host static files
- (Optional) A custom domain

### 🌐 Deployment Options

#### 1. GitHub Pages (Recommended)

**Advantages:**
- ✅ Completely free
- ✅ Automatic deployment
- ✅ Custom domain support
- ✅ HTTPS support

**Steps:**

1. Fork or push code to GitHub repository

2. Go to repository settings
   - Click `Settings`
   - Select `Pages`

3. Configure GitHub Pages
   - Source: Select `Deploy from a branch`
   - Branch: Select `main` or `master`
   - Folder: Select `/root`
   - Click `Save`

4. Wait for deployment (usually 1-2 minutes)

5. Visit your website
   ```
   https://YOUR_USERNAME.github.io/GameHub/
   ```

**Custom Domain:**

1. Add CNAME record at your domain provider:
   ```
   CNAME record: www -> YOUR_USERNAME.github.io
   ```

2. Add custom domain in GitHub Pages settings

3. Wait for DNS propagation (may take 24-48 hours)

---

#### 2. Netlify

**Advantages:**
- ✅ Generous free plan
- ✅ Automatic deployment
- ✅ Form handling
- ✅ Serverless functions

**Steps:**

1. Sign up for Netlify (https://www.netlify.com)

2. Connect GitHub repository
   - Click `New site from Git`
   - Select `GitHub`
   - Authorize and select repository

3. Configure build settings
   - Build command: Leave empty
   - Publish directory: `/`

4. Click `Deploy site`

5. (Optional) Configure custom domain

---

[Continue with similar structure for other deployment methods...]

---

### 📞 Get Help

If you encounter deployment issues:
- Check [Issues](https://github.com/SinceraXY/GameHub/issues)
- Create a new issue
- Email: 2952671670@qq.com

---

<div align="center">

**Happy Deploying! 🚀**

</div>
