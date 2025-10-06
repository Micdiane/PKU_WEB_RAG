# PKU AI Workflow Platform

一个可上线的 AI 工作流平台，支持拖拽配置 AI 流程、文档知识检索、发布为 API 接口，三端可访问，并具备 Docker 部署与 CI/CD 自动化能力。

## Features / 特性

- 🎨 **拖拽式工作流设计器** - 可视化配置 AI 处理流程
- 📚 **文档知识检索** - 基于 RAG 的智能文档问答
- 🔗 **API 接口发布** - 一键将工作流发布为 REST API
- 📱 **三端访问** - Web、移动端、桌面端全平台支持
- 🐳 **Docker 部署** - 容器化部署，开箱即用
- 🚀 **CI/CD 自动化** - 自动化构建、测试、部署

## Tech Stack / 技术栈

- **Backend**: Python + FastAPI + SQLAlchemy
- **Frontend**: React + TypeScript + React Flow
- **Database**: SQLite (开发) / PostgreSQL (生产)
- **RAG**: Vector Database + Sentence Transformers
- **Deployment**: Docker + Docker Compose
- **CI/CD**: GitHub Actions

## Quick Start / 快速开始

### 使用 Docker (推荐)

```bash
# 克隆项目
git clone https://github.com/Micdiane/PKU_WEB_RAG.git
cd PKU_WEB_RAG

# 启动服务
docker-compose up -d

# 访问应用
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### 本地开发

```bash
# 后端设置
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# 前端设置 (新终端)
cd frontend
npm install
npm start
```

## Architecture / 架构

```
├── backend/          # FastAPI 后端服务
│   ├── app/         # 应用核心代码
│   ├── models/      # 数据模型
│   ├── api/         # API 路由
│   └── services/    # 业务逻辑
├── frontend/        # React 前端应用
│   ├── src/         # 源代码
│   └── public/      # 静态资源
├── docker/          # Docker 配置
└── .github/         # CI/CD 配置
```

## API Documentation / API 文档

启动后端服务后，访问 `http://localhost:8000/docs` 查看完整的 API 文档。

## Contributing / 贡献

欢迎提交 Issue 和 Pull Request！

## License / 许可证

MIT License