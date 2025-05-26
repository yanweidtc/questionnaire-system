import app from './app';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

const port = process.env.PORT || 3000;

// 创建 HTTP 服务器
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// 优雅关闭
const gracefulShutdown = () => {
  console.log('Received shutdown signal');

  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });

  // 如果 10 秒后还没有关闭，强制退出
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

// 监听进程信号
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// 未捕获的异常处理
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  gracefulShutdown();
});

// 未处理的 Promise 拒绝
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown();
}); 