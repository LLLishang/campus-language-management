# 🏫 校园管理系统

全栈校园管理 Web 应用，覆盖学生、教师、管理员三角色，提供请假审批、场地预约、报修管理、AI 助手、通知系统等功能。

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 18 + TypeScript + Ant Design 5 + Vite + Zustand |
| 后端 | NestJS 10 + TypeORM + MySQL + JWT |
| AI | SSE 流式 / 通义千问 / DeepSeek / OpenAI 兼容 |

## 快速开始

### 1. 环境要求

- Node.js 18+
- MySQL 8.0+
- npm 9+

### 2. 数据库

创建 MySQL 数据库：

```sql
CREATE DATABASE campus_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. 后端

```bash
cd backend
cp .env.example .env    # 编辑 .env 填入数据库密码和 AI Key
npm install
npm run start:dev       # 启动在 http://localhost:3000
```

### 4. 前端

```bash
cd frontend
npm install
npm run dev             # 启动在 http://localhost:5173
```

### 5. 访问

浏览器打开 `http://localhost:5173`

## 测试账号

| 角色 | 账号 | 密码 |
|------|------|------|
| 学生 | 13800138001 | 123456 |
| 教师 | 13800138004 | 123456 |
| 管理员 | admin | admin123 |

## 功能概览

### 🎓 学生端
- 请假申请（可视化课程时间表选择时段）
- 请假记录查看
- 场地浏览与预约
- 报修提交
- 我的工单（聚合请假/场地/报修）

### 👨‍🏫 教师端
- 审批中心（请假审批/驳回、查看事由）
- 场地预约管理
- 报修管理

### ⚙️ 管理员端
- 首页数据概览（用户/请假/报修统计 + 趋势图）
- 全校工单管理
- 用户管理（CRUD）
- 场地管理（CRUD）
- 报修管理（状态流转）
- 数据统计中心
- 系统配置

### 公共功能
- 🔔 通知系统（实时未读计数、消息中心、审批/报修联动推送）
- 🤖 AI 助手（SSE 流式对话、浮动面板、支持通义千问/DeepSeek/OpenAI）
- JWT 认证 + 角色权限控制
- 403/404 错误页面

## 项目结构

```
├── backend/                # NestJS 后端
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/       # 认证模块（JWT 登录/刷新）
│   │   │   ├── user/       # 用户/学生/教师实体
│   │   │   ├── leave/      # 请假模块
│   │   │   ├── approval/   # 审批模块
│   │   │   ├── venue/      # 场地预约模块
│   │   │   ├── repair/     # 报修模块
│   │   │   ├── admin/      # 管理员模块
│   │   │   ├── notification/ # 通知模块
│   │   │   └── ai/         # AI 助手模块（SSE 流式）
│   │   └── common/         # 公共（守卫/过滤器/拦截器）
│   └── .env                # 环境配置
│
├── frontend/               # React 前端
│   ├── src/
│   │   ├── pages/          # 页面组件
│   │   │   ├── student/    # 学生端（10 页）
│   │   │   ├── teacher/    # 教师端（5 页）
│   │   │   ├── admin/      # 管理员端（7 页）
│   │   │   ├── notification/ # 消息中心
│   │   │   └── error/      # 403/404 页面
│   │   ├── components/     # 通用组件
│   │   ├── stores/         # Zustand 状态管理
│   │   ├── services/       # API 客户端
│   │   └── router/         # 路由配置
│   └── vite.config.ts
│
└── 校园管理系统-全栈设计文档.md  # 完整设计文档
```

## AI 助手配置

在 `backend/.env` 中配置：

```env
AI_PROVIDER=qianwen          # deepseek / qianwen / openai
AI_API_KEY=your-api-key
AI_MODEL=qwen-plus           # qwen-plus / deepseek-chat / gpt-4o
AI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
```

支持的 provider 及其默认 API 地址：
- `qianwen` → 阿里云 DashScope（兼容模式）
- `deepseek` → api.deepseek.com
- `openai` → api.openai.com

也可通过 `AI_BASE_URL` 自定义任何 OpenAI 兼容接口。

## License

MIT
