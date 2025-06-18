# 问题引导选择系统开发工作流程规划

## 📁 项目整体文件结构

```
questionnaire-system/
├── README.md
├── docker-compose.yml          # Docker编排文件
├── .gitignore
├── .env.example               # 环境变量模板
├── docs/                      # 项目文档
│   ├── api.md                # API接口文档
│   ├── database.md           # 数据库设计文档
│   └── deployment.md         # 部署文档
├── backend/                   # 后端API服务
│   ├── Dockerfile
│   ├── package.json
│   ├── src/
│   │   ├── app.js            # Express应用入口
│   │   ├── config/           # 配置文件
│   │   ├── controllers/      # 控制器
│   │   ├── models/           # 数据模型
│   │   ├── routes/           # 路由定义
│   │   ├── middleware/       # 中间件
│   │   ├── services/         # 业务逻辑层
│   │   └── utils/            # 工具函数
│   └── tests/                # 测试文件
├── admin-panel/               # 后台管理系统
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.ts
│   ├── src/
│   │   ├── main.ts           # 入口文件
│   │   ├── App.vue
│   │   ├── components/       # 通用组件
│   │   ├── views/            # 页面组件
│   │   ├── api/              # API接口封装
│   │   ├── stores/           # 状态管理
│   │   ├── router/           # 路由配置
│   │   ├── utils/            # 工具函数
│   │   └── styles/           # 样式文件
│   └── public/
├── frontend/                  # 前端问卷系统
│   ├── h5/                   # H5版本
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── src/
│   └── wechat-mini/          # 微信小程序版本
│       ├── app.js
│       ├── app.json
│       └── pages/
└── infrastructure/            # 基础设施
    ├── nginx/                # Nginx配置
    ├── mongodb/              # MongoDB初始化脚本
    └── redis/                # Redis配置
```

## 🚀 开发阶段规划（6个阶段）

### 阶段1：环境搭建与基础架构（第1-2周）

#### 1.1 初始化项目
```bash
# 创建项目目录
mkdir questionnaire-system
cd questionnaire-system

# 初始化Git
git init
echo "node_modules/" > .gitignore
echo ".env" >> .gitignore
echo "dist/" >> .gitignore

# 创建基本目录结构
mkdir -p {backend/src,admin-panel/src,frontend/h5/src,docs,infrastructure}
```

#### 1.2 Docker环境配置
```yaml
# docker-compose.yml
version: '3.8'

services:
  mongodb:
    image: mongo:5.0
    container_name: questionnaire-mongo
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password123
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
      - ./infrastructure/mongodb/init.js:/docker-entrypoint-initdb.d/init.js

  redis:
    image: redis:6.2-alpine
    container_name: questionnaire-redis
    restart: always
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data

  backend:
    build: ./backend
    container_name: questionnaire-backend
    restart: always
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: development
      MONGODB_URI: mongodb://admin:password123@mongodb:27017/questionnaire?authSource=admin
      REDIS_URI: redis://redis:6379
    depends_on:
      - mongodb
      - redis
    volumes:
      - ./backend:/app
      - /app/node_modules

  admin-panel:
    build: ./admin-panel
    container_name: questionnaire-admin
    restart: always
    ports:
      - "8080:80"
    depends_on:
      - backend

volumes:
  mongodb_data:
  redis_data:
```

#### 1.3 后端基础框架搭建
```javascript
// backend/package.json
{
  "name": "questionnaire-backend",
  "version": "1.0.0",
  "scripts": {
    "dev": "nodemon src/app.js",
    "start": "node src/app.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.3",
    "redis": "^4.6.5",
    "cors": "^2.8.5",
    "helmet": "^6.1.5",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "joi": "^17.9.1",
    "multer": "^1.4.5-lts.1",
    "dotenv": "^16.0.3"
  },
  "devDependencies": {
    "nodemon": "^2.0.22",
    "jest": "^29.5.0",
    "supertest": "^6.3.3"
  }
}

// backend/src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// 中间件
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 根路由
app.get('/', (req, res) => {
  res.json({ message: 'Questionnaire API Server' });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
```

### 阶段2：数据库设计与API开发（第3-4周）

#### 2.1 数据库连接和模型定义
```javascript
// backend/src/config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;

// backend/src/models/Question.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['single', 'multiple', 'text'], 
    required: true 
  },
  options: [{
    id: String,
    text: String,
    nextQuestionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' }
  }],
  order: { type: Number, default: 0 },
  theme: { type: String, default: 'default' },
  required: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Question', questionSchema);
```

#### 2.2 核心API开发
```javascript
// backend/src/routes/questions.js
const express = require('express');
const Question = require('../models/Question');
const router = express.Router();

// 获取所有问题
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find({ isActive: true })
      .sort({ order: 1 })
      .populate('options.nextQuestionId');
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建问题
router.post('/', async (req, res) => {
  try {
    const question = new Question(req.body);
    await question.save();
    res.status(201).json(question);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
```

### 阶段3：管理后台开发（第5-6周）

#### 3.1 Vue Vben Admin 初始化
```bash
# 进入admin-panel目录
cd admin-panel

# 初始化Vue项目
npm create vue@latest . -- --typescript --router --pinia --eslint

# 安装UI库和依赖
npm install ant-design-vue @ant-design/icons-vue
npm install axios pinia-persistedstate-plugin
npm install @vueuse/core dayjs
```

#### 3.2 基础配置
```typescript
// admin-panel/src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-persistedstate-plugin'

import App from './App.vue'
import router from './router'

// Ant Design Vue
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(Antd)

app.mount('#app')
```

### 阶段4：可视化问题流程编辑器（第7-8周）

#### 4.1 集成G6图形库
```bash
cd admin-panel
npm install @antv/g6
```

```vue
<!-- admin-panel/src/components/FlowEditor.vue -->
<template>
  <div class="flow-editor">
    <div class="toolbar">
      <a-button @click="addQuestion">添加问题</a-button>
      <a-button @click="saveFlow">保存流程</a-button>
    </div>
    <div id="graph-container" class="graph-container"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import G6 from '@antv/g6'

const graph = ref()

onMounted(() => {
  // 初始化G6图形编辑器
  graph.value = new G6.Graph({
    container: 'graph-container',
    width: 800,
    height: 600,
    modes: {
      default: ['drag-canvas', 'zoom-canvas', 'drag-node']
    },
    layout: {
      type: 'dagre',
      rankdir: 'TB',
      nodesep: 20,
      ranksep: 50
    },
    defaultNode: {
      type: 'rect',
      size: [120, 60],
      style: {
        fill: '#40a9ff',
        stroke: '#1890ff',
        lineWidth: 2
      },
      labelCfg: {
        style: {
          fill: '#fff',
          fontSize: 12
        }
      }
    },
    defaultEdge: {
      type: 'polyline',
      style: {
        stroke: '#1890ff',
        lineWidth: 2
      }
    }
  })

  // 渲染图形
  graph.value.render()
})

const addQuestion = () => {
  // 添加问题节点逻辑
}

const saveFlow = () => {
  // 保存问题流程逻辑
}
</script>
```

### 阶段5：前端问卷系统开发（第9-10周）

#### 5.1 H5版本开发
```bash
cd frontend/h5
npm create vue@latest . -- --router --pinia
npm install vant axios
```

#### 5.2 微信小程序版本
```javascript
// frontend/wechat-mini/app.js
App({
  onLaunch() {
    // 小程序启动时执行
    this.checkLogin()
  },

  async checkLogin() {
    try {
      const { code } = await wx.login()
      // 发送code到后端进行登录
      const response = await this.request({
        url: '/api/auth/wechat-login',
        method: 'POST',
        data: { code }
      })
      // 保存用户信息
      wx.setStorageSync('userToken', response.token)
    } catch (error) {
      console.error('登录失败:', error)
    }
  },

  request(options) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.globalData.apiBaseUrl}${options.url}`,
        method: options.method || 'GET',
        data: options.data,
        header: {
          'Authorization': `Bearer ${wx.getStorageSync('userToken')}`,
          ...options.header
        },
        success: resolve,
        fail: reject
      })
    })
  },

  globalData: {
    apiBaseUrl: 'https://api.yourproject.com'
  }
})
```

### 阶段6：集成测试与部署（第11-12周）

#### 6.1 API测试
```javascript
// backend/tests/questions.test.js
const request = require('supertest');
const app = require('../src/app');

describe('Questions API', () => {
  test('GET /api/questions', async () => {
    const response = await request(app)
      .get('/api/questions')
      .expect(200);
    
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('POST /api/questions', async () => {
    const newQuestion = {
      title: '测试问题',
      type: 'single',
      options: [
        { id: '1', text: '选项1' },
        { id: '2', text: '选项2' }
      ]
    };

    const response = await request(app)
      .post('/api/questions')
      .send(newQuestion)
      .expect(201);
    
    expect(response.body.title).toBe(newQuestion.title);
  });
});
```

## 🛠️ 关键开发建议

### 1. Docker环境策略
**是的，建议提前建立Docker环境**，原因：
- 统一开发环境，避免"在我机器上能运行"的问题
- 数据库和Redis服务容器化，便于管理
- 后期部署直接使用相同的Docker配置

### 2. 开发顺序重要性
严格按照这个顺序开发：
1. **后端API优先**：前端依赖后端接口
2. **管理后台次之**：用于创建测试数据
3. **前端问卷最后**：有了数据和管理界面后开发

### 3. 版本控制策略
```bash
# 创建不同分支管理不同功能
git checkout -b feature/backend-api
git checkout -b feature/admin-panel  
git checkout -b feature/frontend-h5
git checkout -b feature/wechat-mini
```

### 4. 环境配置管理
```bash
# .env.example
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://admin:password123@localhost:27017/questionnaire?authSource=admin
REDIS_URI=redis://localhost:6379
JWT_SECRET=your-jwt-secret
WECHAT_APP_ID=your-wechat-app-id
WECHAT_APP_SECRET=your-wechat-app-secret
```

### 5. 日常开发流程
```bash
# 每天开始开发
docker-compose up -d  # 启动服务
cd backend && npm run dev  # 开发后端
# 或
cd admin-panel && npm run dev  # 开发管理后台

# 提交代码
git add .
git commit -m "feat: 添加问题管理功能"
git push origin feature/backend-api
```

## 📋 开发检查清单

### 第1周检查点
- [ ] Docker环境运行正常
- [ ] 后端项目结构搭建完成
- [ ] 数据库连接成功
- [ ] 基础API路由可访问

### 第2周检查点
- [ ] 核心数据模型定义完成
- [ ] 问题CRUD接口开发完成
- [ ] 用户认证模块完成
- [ ] API文档编写完成

### 第4周检查点
- [ ] 管理后台基础界面完成
- [ ] 问题管理功能完成
- [ ] 用户登录功能完成

### 第6周检查点
- [ ] 可视化流程编辑器完成
- [ ] 问题跳转逻辑完成
- [ ] 主题配置功能完成

### 第8周检查点
- [ ] H5问卷界面完成
- [ ] 微信登录集成完成
- [ ] 问卷填写流程完成

### 第10周检查点
- [ ] 所有功能集成测试通过
- [ ] 性能优化完成
- [ ] 部署配置完成

这个规划确保了单人开发时各个模块之间的依赖关系清晰，避免开发过程中的堵塞。您觉得这个计划如何？需要我详细展开某个阶段的具体实现吗？