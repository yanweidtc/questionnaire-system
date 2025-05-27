import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swaggerOption';
import questionRoutes from './routes/questionRoutes';

// 加载环境变量
dotenv.config();

// 创建 Express 应用
const app: Express = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 基础中间件
app.use(helmet()); // 安全头
app.use(cors()); // 跨域处理
app.use(express.json()); // JSON 解析
app.use(express.urlencoded({ extended: true })); // URL 编码解析

// 基础路由
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to Questionnaire System API' });
});

app.use('/api/questions', questionRoutes);

// 添加健康检查端点
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'questionnaire-backend'
  });
});

// 错误处理中间件
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});

// 404 处理
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
  });
});


// 启动服务器
// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

export default app;
