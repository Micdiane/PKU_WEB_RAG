# PKU AI Workflow Platform - API 文档

## 概述
PKU AI工作流平台提供完整的RESTful API，支持工作流管理、文档处理、RAG问答等功能。

## 认证
所有API请求都需要Bearer Token认证（除了登录和注册）。

```bash
Authorization: Bearer <your_token>
```

## 基础URL
- 开发环境: `http://localhost:8000`
- 生产环境: `https://your-domain.com`

## API 端点

### 1. 认证相关

#### 用户注册
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "string",
  "email": "user@example.com",
  "password": "string"
}
```

#### 用户登录
```http
POST /api/auth/token
Content-Type: application/x-www-form-urlencoded

username=your_username&password=your_password
```

#### 获取当前用户信息
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### 2. 工作流管理

#### 获取工作流列表
```http
GET /api/workflows?skip=0&limit=100
Authorization: Bearer <token>
```

#### 创建工作流
```http
POST /api/workflows
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "工作流名称",
  "description": "工作流描述",
  "config": {
    "nodes": [],
    "edges": []
  }
}
```

#### 获取特定工作流
```http
GET /api/workflows/{workflow_id}
Authorization: Bearer <token>
```

#### 更新工作流
```http
PUT /api/workflows/{workflow_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "更新的名称",
  "description": "更新的描述",
  "config": {...}
}
```

#### 删除工作流
```http
DELETE /api/workflows/{workflow_id}
Authorization: Bearer <token>
```

#### 执行工作流
```http
POST /api/workflows/{workflow_id}/execute
Authorization: Bearer <token>
Content-Type: application/json

{
  "input_data": {
    "text": "要处理的文本",
    "parameters": {...}
  }
}
```

#### 发布工作流为API
```http
POST /api/workflows/{workflow_id}/publish
Authorization: Bearer <token>
```

#### 获取工作流执行历史
```http
GET /api/workflows/{workflow_id}/executions?skip=0&limit=100
Authorization: Bearer <token>
```

### 3. 文档管理

#### 获取文档列表
```http
GET /api/documents?skip=0&limit=100
Authorization: Bearer <token>
```

#### 上传文档
```http
POST /api/documents/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <文件>
title: "文档标题"
```

#### 获取特定文档
```http
GET /api/documents/{document_id}
Authorization: Bearer <token>
```

#### 删除文档
```http
DELETE /api/documents/{document_id}
Authorization: Bearer <token>
```

#### 索引文档
```http
POST /api/documents/{document_id}/index
Authorization: Bearer <token>
```

#### RAG 查询
```http
POST /api/documents/query
Authorization: Bearer <token>
Content-Type: application/json

{
  "query": "您的问题",
  "top_k": 5
}
```

## 响应格式

### 成功响应
```json
{
  "id": 1,
  "name": "示例工作流",
  "description": "这是一个示例",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### 错误响应
```json
{
  "detail": "错误描述信息"
}
```

### RAG 查询响应
```json
{
  "answer": "基于文档的回答内容",
  "sources": [
    {
      "document_id": "1",
      "document_title": "文档标题",
      "chunk_content": "相关文本片段",
      "similarity": 0.95
    }
  ],
  "confidence": 0.89
}
```

## 状态码

- `200` - 成功
- `201` - 创建成功
- `400` - 请求参数错误
- `401` - 未授权
- `403` - 权限不足
- `404` - 资源不存在
- `422` - 数据验证错误
- `500` - 服务器内部错误

## 限制和配额

- 文件上传大小限制: 10MB
- API 请求频率: 1000次/小时
- 工作流执行超时: 30分钟

## SDK 示例

### Python
```python
import requests

# 登录
response = requests.post('http://localhost:8000/api/auth/token', {
    'username': 'your_username',
    'password': 'your_password'
})
token = response.json()['access_token']

# 获取工作流列表
headers = {'Authorization': f'Bearer {token}'}
workflows = requests.get('http://localhost:8000/api/workflows', headers=headers)
print(workflows.json())
```

### JavaScript
```javascript
// 登录
const loginResponse = await fetch('http://localhost:8000/api/auth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: 'username=your_username&password=your_password'
});
const { access_token } = await loginResponse.json();

// 获取工作流列表
const workflowsResponse = await fetch('http://localhost:8000/api/workflows', {
  headers: { 'Authorization': `Bearer ${access_token}` }
});
const workflows = await workflowsResponse.json();
console.log(workflows);
```

### cURL
```bash
# 登录
curl -X POST "http://localhost:8000/api/auth/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=your_username&password=your_password"

# 使用token访问API
curl -X GET "http://localhost:8000/api/workflows" \
  -H "Authorization: Bearer <your_token>"
```

## Webhook 支持

支持工作流执行完成后的回调通知：

```http
POST /api/workflows/{workflow_id}/webhook
Authorization: Bearer <token>
Content-Type: application/json

{
  "url": "https://your-domain.com/webhook",
  "events": ["execution.completed", "execution.failed"]
}
```

## 更多信息

- 交互式API文档: `/docs`
- ReDoc文档: `/redoc`
- 健康检查: `/health`