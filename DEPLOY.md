# Linux 一键部署指南

本文档介绍如何使用 `deploy.sh` 脚本在 Linux 服务器上一键部署 Binbim Blog。

## 🚀 快速开始

### 系统要求

- **操作系统**: Ubuntu 18.04+, Debian 10+, CentOS 7+, RHEL 7+
- **权限**: Root 或 sudo 权限
- **网络**: 能够访问互联网（用于下载依赖）
- **硬件**: 最低 1GB RAM, 10GB 可用磁盘空间

### 一键部署

1. **下载项目代码**

   ```bash
   git clone <your-repository-url>
   cd Binbim-Blog
   ```

2. **赋予执行权限**

   ```bash
   chmod +x deploy.sh
   ```

3. **运行部署脚本**

   ```bash
   sudo ./deploy.sh
   ```

4. **访问网站**

   部署完成后，在浏览器中访问 `http://your-server-ip` 即可查看博客。

## 📋 部署流程

脚本会自动执行以下步骤：

1. **环境检查**
   - 检测操作系统类型和版本
   - 验证 root 权限

2. **安装系统依赖**
   - 更新系统包管理器
   - 安装 curl, wget, git, nginx 等基础工具

3. **安装 Node.js**
   - 检查现有 Node.js 版本
   - 如需要，安装 Node.js 18+ 和 npm

4. **项目部署**
   - 创建部署目录 `/var/www/binbim-blog`
   - 复制项目文件（排除 node_modules, .git 等）
   - 安装项目依赖
   - 构建生产版本

5. **配置 Web 服务器**
   - 生成 Nginx 配置文件
   - 启用站点配置
   - 重启 Nginx 服务

6. **安全配置**
   - 配置防火墙规则
   - 设置安全响应头

## ⚙️ 自定义配置

### 修改部署参数

编辑 `deploy.sh` 文件中的配置变量：

```bash
# 项目配置
PROJECT_NAME="binbim-blog"          # 项目名称
DEPLOY_DIR="/var/www/${PROJECT_NAME}"  # 部署目录
DOMAIN="your-domain.com"            # 域名（默认 localhost）
PORT="80"                           # 端口（默认 80）
NODE_VERSION="18"                   # Node.js 版本要求
```

### 环境变量配置

部署完成后，编辑环境变量文件：

```bash
sudo nano /var/www/binbim-blog/.env
```

主要配置项：

```bash
# 博客基础配置
VITE_APP_TITLE="你的博客标题"
VITE_APP_DESCRIPTION="博客描述"
VITE_BASE_URL="/"  # 如果部署在子目录，修改此项

# Giscus 评论系统（可选）
VITE_GISCUS_REPO="your-username/your-repository"
VITE_GISCUS_REPO_ID="your-repo-id"
VITE_GISCUS_CATEGORY="General"
VITE_GISCUS_CATEGORY_ID="your-category-id"
```

### SSL/HTTPS 配置

如需启用 HTTPS，可以使用 Let's Encrypt：

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx  # Ubuntu/Debian
sudo yum install certbot python3-certbot-nginx  # CentOS/RHEL

# 获取 SSL 证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo crontab -e
# 添加以下行：
0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔧 常用管理命令

### Nginx 管理

```bash
# 重启 Nginx
sudo systemctl restart nginx

# 查看 Nginx 状态
sudo systemctl status nginx

# 重新加载配置
sudo systemctl reload nginx

# 测试配置文件
sudo nginx -t
```

### 日志查看

```bash
# 查看访问日志
sudo tail -f /var/log/nginx/binbim-blog_access.log

# 查看错误日志
sudo tail -f /var/log/nginx/binbim-blog_error.log

# 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/error.log
```

### 项目更新

```bash
# 进入项目目录
cd /var/www/binbim-blog

# 拉取最新代码
sudo git pull origin main

# 安装新依赖（如有）
sudo npm ci

# 重新构建
sudo npm run build

# 重启 Nginx
sudo systemctl restart nginx
```

## 🐛 故障排除

### 常见问题

1. **端口被占用**

   ```bash
   # 查看端口占用
   sudo netstat -tlnp | grep :80

   # 修改脚本中的 PORT 变量为其他端口
   ```

2. **权限问题**

   ```bash
   # 确保 Nginx 有读取权限
   sudo chown -R www-data:www-data /var/www/binbim-blog
   sudo chmod -R 755 /var/www/binbim-blog
   ```

3. **Node.js 版本问题**

   ```bash
   # 手动安装指定版本的 Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. **构建失败**

   ```bash
   # 检查构建日志
   cd /var/www/binbim-blog
   sudo npm run build

   # 清理缓存重试
   sudo rm -rf node_modules package-lock.json
   sudo npm install
   sudo npm run build
   ```

### 日志分析

```bash
# 查看系统日志
sudo journalctl -u nginx -f

# 查看部署脚本执行日志
sudo tail -f /var/log/syslog | grep deploy
```

## 🔒 安全建议

1. **定期更新系统**

   ```bash
   sudo apt update && sudo apt upgrade  # Ubuntu/Debian
   sudo yum update                       # CentOS/RHEL
   ```

2. **配置防火墙**

   ```bash
   # Ubuntu/Debian
   sudo ufw enable
   sudo ufw allow ssh
   sudo ufw allow 80
   sudo ufw allow 443

   # CentOS/RHEL
   sudo firewall-cmd --permanent --add-service=ssh
   sudo firewall-cmd --permanent --add-service=http
   sudo firewall-cmd --permanent --add-service=https
   sudo firewall-cmd --reload
   ```

3. **限制文件权限**
   ```bash
   # 设置适当的文件权限
   sudo find /var/www/binbim-blog -type f -exec chmod 644 {} \;
   sudo find /var/www/binbim-blog -type d -exec chmod 755 {} \;
   ```

## 📞 技术支持

如果在部署过程中遇到问题，请：

1. 检查系统日志和错误信息
2. 确认系统满足最低要求
3. 查看本文档的故障排除部分
4. 在项目 Issues 中提交问题报告

## 📝 更新日志

- **v1.0.0**: 初始版本，支持 Ubuntu/CentOS 一键部署
- 支持自动环境检测和依赖安装
- 集成 Nginx 配置和 SSL 支持
- 提供完整的错误处理和日志记录

---

**注意**: 本脚本适用于生产环境部署，建议在测试环境中先行验证。
