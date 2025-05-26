import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(helmet());
app.use(express.json());

// 基础路由
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to Questionnaire System API' });
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
