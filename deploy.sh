#!/bin/bash

# =============================================================================
# Binbim Blog Linux 一键部署脚本
# 支持 Ubuntu/Debian 和 CentOS/RHEL 系统
# =============================================================================

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置变量
PROJECT_NAME="binbim-blog"
DEPLOY_DIR="/var/www/${PROJECT_NAME}"
NGINX_CONF_DIR="/etc/nginx/sites-available"
NGINX_ENABLED_DIR="/etc/nginx/sites-enabled"
DOMAIN="localhost"  # 可以修改为你的域名
PORT="80"
NODE_VERSION="18"  # 最低Node.js版本要求

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 错误处理函数
error_exit() {
    log_error "$1"
    exit 1
}

# 检测操作系统
detect_os() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$NAME
        VER=$VERSION_ID
    elif type lsb_release >/dev/null 2>&1; then
        OS=$(lsb_release -si)
        VER=$(lsb_release -sr)
    elif [ -f /etc/redhat-release ]; then
        OS="CentOS"
        VER=$(cat /etc/redhat-release | sed 's/.*release //;s/ .*//')
    else
        error_exit "无法检测操作系统类型"
    fi
    
    log_info "检测到操作系统: $OS $VER"
}

# 检查是否为root用户
check_root() {
    if [ "$EUID" -ne 0 ]; then
        error_exit "请使用root权限运行此脚本 (sudo $0)"
    fi
}

# 安装系统依赖
install_system_deps() {
    log_info "安装系统依赖..."
    
    if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
        apt-get update
        apt-get install -y curl wget git nginx software-properties-common
    elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]]; then
        yum update -y
        yum install -y curl wget git nginx epel-release
    else
        error_exit "不支持的操作系统: $OS"
    fi
    
    log_success "系统依赖安装完成"
}

# 安装Node.js
install_nodejs() {
    log_info "检查Node.js安装状态..."
    
    if command -v node >/dev/null 2>&1; then
        CURRENT_NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
        if [ "$CURRENT_NODE_VERSION" -ge "$NODE_VERSION" ]; then
            log_success "Node.js已安装，版本: $(node -v)"
            return
        else
            log_warning "Node.js版本过低，需要升级"
        fi
    fi
    
    log_info "安装Node.js $NODE_VERSION..."
    
    # 使用NodeSource仓库安装Node.js
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
    
    if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
        apt-get install -y nodejs
    elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]]; then
        yum install -y nodejs npm
    fi
    
    # 验证安装
    if command -v node >/dev/null 2>&1 && command -v npm >/dev/null 2>&1; then
        log_success "Node.js安装成功，版本: $(node -v)"
        log_success "npm版本: $(npm -v)"
    else
        error_exit "Node.js安装失败"
    fi
}

# 创建部署目录
create_deploy_dir() {
    log_info "创建部署目录: $DEPLOY_DIR"
    
    if [ -d "$DEPLOY_DIR" ]; then
        log_warning "部署目录已存在，将备份现有文件"
        mv "$DEPLOY_DIR" "${DEPLOY_DIR}.backup.$(date +%Y%m%d_%H%M%S)"
    fi
    
    mkdir -p "$DEPLOY_DIR"
    log_success "部署目录创建完成"
}

# 复制项目文件
copy_project_files() {
    log_info "复制项目文件到部署目录..."
    
    # 获取脚本所在目录（项目根目录）
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    
    # 复制必要文件，排除不需要的目录
    rsync -av --exclude='node_modules' \
              --exclude='.git' \
              --exclude='dist' \
              --exclude='*.log' \
              --exclude='.env' \
              "$SCRIPT_DIR/" "$DEPLOY_DIR/"
    
    # 复制环境变量文件模板
    if [ -f "$SCRIPT_DIR/.env.example" ]; then
        cp "$SCRIPT_DIR/.env.example" "$DEPLOY_DIR/.env"
        log_info "已复制环境变量模板，请根据需要修改 $DEPLOY_DIR/.env"
    fi
    
    log_success "项目文件复制完成"
}

# 安装项目依赖
install_project_deps() {
    log_info "安装项目依赖..."
    
    cd "$DEPLOY_DIR"
    
    # 设置npm镜像源（可选，提高下载速度）
    npm config set registry https://registry.npmmirror.com
    
    # 安装依赖
    npm ci --production=false
    
    log_success "项目依赖安装完成"
}

# 构建项目
build_project() {
    log_info "构建项目..."
    
    cd "$DEPLOY_DIR"
    
    # 运行构建命令
    npm run build
    
    if [ ! -d "dist" ]; then
        error_exit "构建失败，未找到dist目录"
    fi
    
    log_success "项目构建完成"
}

# 配置Nginx
configure_nginx() {
    log_info "配置Nginx..."
    
    # 创建Nginx配置文件
    cat > "$NGINX_CONF_DIR/$PROJECT_NAME" << EOF
server {
    listen $PORT;
    listen [::]:$PORT;
    
    server_name $DOMAIN;
    root $DEPLOY_DIR/dist;
    index index.html;
    
    # 启用gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # 静态文件缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # 主要路由配置
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    # API路由（如果有的话）
    location /api {
        try_files \$uri \$uri/ /index.html;
    }
    
    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # 日志配置
    access_log /var/log/nginx/${PROJECT_NAME}_access.log;
    error_log /var/log/nginx/${PROJECT_NAME}_error.log;
}
EOF
    
    # 启用站点
    if [ -f "$NGINX_ENABLED_DIR/$PROJECT_NAME" ]; then
        rm "$NGINX_ENABLED_DIR/$PROJECT_NAME"
    fi
    ln -s "$NGINX_CONF_DIR/$PROJECT_NAME" "$NGINX_ENABLED_DIR/$PROJECT_NAME"
    
    # 测试Nginx配置
    nginx -t || error_exit "Nginx配置文件语法错误"
    
    log_success "Nginx配置完成"
}

# 启动服务
start_services() {
    log_info "启动服务..."
    
    # 启动并启用Nginx
    systemctl enable nginx
    systemctl restart nginx
    
    if systemctl is-active --quiet nginx; then
        log_success "Nginx服务启动成功"
    else
        error_exit "Nginx服务启动失败"
    fi
}

# 设置防火墙
setup_firewall() {
    log_info "配置防火墙..."
    
    if command -v ufw >/dev/null 2>&1; then
        # Ubuntu/Debian 使用 ufw
        ufw allow $PORT/tcp
        log_success "UFW防火墙规则已添加"
    elif command -v firewall-cmd >/dev/null 2>&1; then
        # CentOS/RHEL 使用 firewalld
        firewall-cmd --permanent --add-port=$PORT/tcp
        firewall-cmd --reload
        log_success "Firewalld防火墙规则已添加"
    else
        log_warning "未检测到防火墙管理工具，请手动开放端口 $PORT"
    fi
}

# 显示部署信息
show_deployment_info() {
    echo
    echo "============================================================================="
    log_success "部署完成！"
    echo "=============================================================================="
    echo
    echo "📁 部署目录: $DEPLOY_DIR"
    echo "🌐 访问地址: http://$DOMAIN:$PORT"
    echo "📋 Nginx配置: $NGINX_CONF_DIR/$PROJECT_NAME"
    echo "📊 访问日志: /var/log/nginx/${PROJECT_NAME}_access.log"
    echo "❌ 错误日志: /var/log/nginx/${PROJECT_NAME}_error.log"
    echo
    echo "🔧 常用命令:"
    echo "  重启Nginx: sudo systemctl restart nginx"
    echo "  查看Nginx状态: sudo systemctl status nginx"
    echo "  查看错误日志: sudo tail -f /var/log/nginx/${PROJECT_NAME}_error.log"
    echo
    echo "📝 注意事项:"
    echo "  1. 请根据需要修改环境变量文件: $DEPLOY_DIR/.env"
    echo "  2. 如需使用域名，请修改脚本中的DOMAIN变量并重新运行"
    echo "  3. 如需HTTPS，请配置SSL证书"
    echo
    echo "=============================================================================="
}

# 主函数
main() {
    echo "=============================================================================="
    echo "🚀 Binbim Blog Linux 一键部署脚本"
    echo "=============================================================================="
    echo
    
    # 检查权限
    check_root
    
    # 检测系统
    detect_os
    
    # 确认部署
    echo
    log_info "即将开始部署，配置信息:"
    echo "  项目名称: $PROJECT_NAME"
    echo "  部署目录: $DEPLOY_DIR"
    echo "  访问域名: $DOMAIN"
    echo "  监听端口: $PORT"
    echo
    read -p "确认继续部署？(y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "部署已取消"
        exit 0
    fi
    
    # 开始部署
    log_info "开始部署..."
    
    install_system_deps
    install_nodejs
    create_deploy_dir
    copy_project_files
    install_project_deps
    build_project
    configure_nginx
    start_services
    setup_firewall
    
    show_deployment_info
}

# 捕获错误
trap 'log_error "部署过程中发生错误，请检查日志"; exit 1' ERR

# 运行主函数
main "$@"