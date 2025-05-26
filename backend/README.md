# 问题引导选择系统后端服务

## 项目简介
本项目是一个基于 Node.js + Express + TypeScript + MongoDB 的问题引导选择系统后端服务。

## 技术栈
- Node.js
- Express
- TypeScript
- MongoDB
- Redis
- Docker

## 开发环境要求
- Node.js >= 18
- MongoDB >= 6.0
- Redis >= 7.0
- Docker & Docker Compose

## 项目结构
```
backend/
├── src/                    # 源代码目录
│   ├── config/            # 配置文件
│   ├── controllers/       # 控制器
│   ├── middleware/        # 中间件
│   ├── models/           # 数据模型
│   ├── routes/           # 路由
│   ├── services/         # 业务逻辑
│   ├── types/            # 类型定义
│   └── utils/            # 工具函数
├── tests/                 # 测试文件
├── .env.example          # 环境变量示例
├── .eslintrc.json        # ESLint 配置
├── .prettierrc           # Prettier 配置
├── .prettierignore       # Prettier 忽略文件
├── tsconfig.json         # TypeScript 配置
└── package.json          # 项目依赖
```

## 开发环境设置

### 1. 安装依赖
```bash
npm install
```

### 2. 环境变量配置
复制 `.env.example` 文件并重命名为 `.env`，然后根据实际情况修改配置：
```bash
cp .env.example .env
```

### 3. 启动开发服务器
```bash
npm run dev
```

### 4. 代码规范
项目使用 ESLint 和 Prettier 进行代码规范和格式化：

- ESLint 配置：`.eslintrc.json`
- Prettier 配置：`.prettierrc`
- 忽略文件：`.prettierignore`

可用的命令：
```bash
npm run lint        # 检查代码问题
npm run lint:fix    # 自动修复代码问题
npm run format      # 格式化代码
```

## 构建和部署

### 构建
```bash
npm run build
```

### 启动生产服务
```bash
npm start
```

## Docker 部署
```bash
# 构建镜像
docker build -t questionnaire-backend .

# 运行容器
docker run -p 3000:3000 questionnaire-backend
```

## API 文档
API 文档使用 Swagger 生成，启动服务后访问：
```
http://localhost:3000/api-docs
```

## 测试
```bash
npm test
```

## 项目进度
- [x] 项目初始化
- [x] 基础架构搭建
- [x] 数据库设计
- [x] 用户认证系统
- [x] 问卷 CRUD 操作
- [x] 问卷模板管理
- [x] 问卷填写和提交
- [x] 数据统计和分析
- [x] Docker 环境配置
- [x] 代码规范配置 (ESLint + Prettier)
- [ ] 单元测试
- [ ] 集成测试
- [ ] 性能优化
- [ ] 文档完善 