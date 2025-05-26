FROM node:18-alpine as builder

WORKDIR /app

# 首先只复制 package.json 文件以利用缓存
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制源代码
COPY . .

# 设置环境变量
ENV NODE_ENV=production

# 构建应用（只执行 vite build）
RUN echo "Starting build process..." && \
    npm run build || (echo "Build failed with error code $?" && exit 1)

FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 nginx 配置
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
