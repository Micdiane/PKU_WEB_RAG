# PKU AI Workflow Platform - 部署指南

## 部署选项

### 1. Docker 部署 (推荐)

#### 快速开始
```bash
# 克隆项目
git clone https://github.com/Micdiane/PKU_WEB_RAG.git
cd PKU_WEB_RAG

# 使用 Docker Compose 启动
docker-compose up -d

# 访问应用
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API 文档: http://localhost:8000/docs
```

#### 环境变量配置
复制并修改环境变量文件：
```bash
# 后端配置
cp backend/.env.example backend/.env

# 前端配置
cp frontend/.env.example frontend/.env
```

### 2. 本地开发部署

#### 后端设置
```bash
cd backend

# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Linux/Mac
# 或 venv\Scripts\activate  # Windows

# 安装依赖
pip install -r requirements.txt

# 启动后端服务
uvicorn main:app --reload --port 8000
```

#### 前端设置
```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm start
```

### 3. 生产环境部署

#### 使用 Nginx + Gunicorn
```bash
# 安装 Gunicorn
pip install gunicorn

# 启动后端
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000

# 构建前端
cd frontend
npm run build

# 配置 Nginx 指向 build 目录
```

#### Docker 生产部署
```bash
# 构建生产镜像
docker build -f docker/Dockerfile -t pku-workflow-platform .

# 运行生产容器
docker run -d \
  -p 80:80 \
  -p 8000:8000 \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/uploads:/app/uploads \
  -e ENVIRONMENT=production \
  pku-workflow-platform
```

## 数据库设置

### SQLite (默认)
无需额外配置，自动创建 `app.db` 文件。

### PostgreSQL (推荐生产环境)
```bash
# 修改 DATABASE_URL
DATABASE_URL=postgresql://username:password@localhost:5432/pku_workflow

# 或使用 Docker Compose 中的 PostgreSQL 服务
```

## 监控和日志

### 应用监控
- 健康检查端点: `/health`
- API 文档: `/docs`
- 系统状态: `/`

### 日志配置
```bash
# 查看应用日志
docker-compose logs -f web

# 查看特定服务日志
docker-compose logs -f web
```

## 备份和恢复

### 数据备份
```bash
# SQLite 备份
cp data/app.db data/app.db.backup

# PostgreSQL 备份
pg_dump pku_workflow > backup.sql
```

### 文件备份
```bash
# 备份上传的文档
tar -czf uploads_backup.tar.gz uploads/
```

## 性能优化

### 1. 数据库优化
- 使用 PostgreSQL 替代 SQLite
- 配置数据库连接池
- 添加必要的数据库索引

### 2. 缓存配置
- Redis 缓存热点数据
- CDN 加速静态资源

### 3. 负载均衡
- 使用 Nginx 负载均衡
- 多实例部署

## 安全配置

### 1. HTTPS 配置
```nginx
server {
    listen 443 ssl;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:3000;
    }
    
    location /api/ {
        proxy_pass http://localhost:8000;
    }
}
```

### 2. 环境变量安全
- 生产环境修改 SECRET_KEY
- 使用强密码
- 限制 ALLOWED_HOSTS

### 3. 防火墙配置
```bash
# 只开放必要端口
ufw allow 80
ufw allow 443
ufw allow 22
```

## 故障排除

### 常见问题

1. **端口占用**
   ```bash
   # 查看端口占用
   lsof -i :8000
   lsof -i :3000
   ```

2. **依赖问题**
   ```bash
   # 重新安装依赖
   pip install -r requirements.txt --force-reinstall
   npm install --force
   ```

3. **数据库连接问题**
   - 检查 DATABASE_URL 配置
   - 确认数据库服务状态
   - 检查网络连接

### 日志查看
```bash
# 应用日志
tail -f logs/app.log

# Docker 日志
docker-compose logs -f

# 系统日志
journalctl -u docker
```

## 更新和维护

### 应用更新
```bash
# 拉取最新代码
git pull origin main

# 重新构建和部署
docker-compose down
docker-compose build
docker-compose up -d
```

### 依赖更新
```bash
# 更新 Python 依赖
pip list --outdated
pip install --upgrade package_name

# 更新 Node.js 依赖
npm outdated
npm update
```