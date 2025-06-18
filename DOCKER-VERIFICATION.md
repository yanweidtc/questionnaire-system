# Docker 环境验证指南

本文档提供了验证 Docker 环境各个组件是否正常运行的步骤和命令。

## 1. 检查所有服务状态

```bash
# 查看所有服务的运行状态
docker compose ps

# 预期输出应该显示所有服务都是 "Up" 状态：
# - questionnaire-mongo
# - questionnaire-redis
# - questionnaire-backend
# - questionnaire-admin
```

## 2. MongoDB 服务验证

```bash
# 测试 MongoDB 连接
docker exec -it questionnaire-mongo mongosh -u admin -p password123 --authenticationDatabase admin --eval "db.runCommand({ ping: 1 })"

# 预期输出：
# { ok: 1 }

# 检查 MongoDB 日志
docker compose logs mongodb

# 预期输出应该包含：
# - 成功启动信息
# - 没有错误信息
# - 正常的检查点操作日志
```

## 3. Redis 服务验证

```bash
# 测试 Redis 连接
docker exec -it questionnaire-redis redis-cli ping

# 预期输出：
# PONG

# 检查 Redis 日志
docker compose logs redis

# 预期输出应该包含：
# - "Redis is starting"
# - "Ready to accept connections"
# - 没有错误信息
```

## 4. 管理后台服务验证

```bash
# 测试管理后台服务
curl -I http://localhost:8080

# 预期输出：
# HTTP/1.1 200 OK
# Server: nginx/1.27.5
# ...

# 检查管理后台日志
docker compose logs admin-panel

# 预期输出应该包含：
# - Nginx 成功启动信息
# - 工作进程启动信息
# - 没有错误信息
```

## 5. 后端服务验证

```bash
# 测试后端服务
curl -I http://localhost:3000/api/health

# 检查后端日志
docker compose logs backend --tail=20

# 预期输出应该包含：
# - 应用启动信息
# - 数据库连接成功信息
# - 没有错误信息
```

## 6. 服务依赖验证

```bash
# 检查服务之间的网络连接
docker network inspect questionnaire-system_default

# 预期输出应该显示所有服务都在同一个网络中
```

## 7. 数据持久化验证

```bash
# 检查数据卷
docker volume ls | grep questionnaire-system

# 预期输出应该包含：
# - questionnaire-system_mongodb_data
# - questionnaire-system_redis_data
```

## 8. 容器资源使用情况

```bash
# 检查容器资源使用情况
docker stats

# 预期输出应该显示所有容器的资源使用情况，包括：
# - CPU 使用率
# - 内存使用率
# - 网络 I/O
# - 磁盘 I/O
```

## 9. 常见问题排查

### 9.1 服务无法启动
```bash
# 检查服务启动日志
docker compose logs [service-name]

# 重启特定服务
docker compose restart [service-name]
```

### 9.2 端口冲突
```bash
# 检查端口占用
lsof -i :[port-number]

# 例如检查 8080 端口
lsof -i :8080
```

### 9.3 容器网络问题
```bash
# 检查容器网络
docker network inspect questionnaire-system_default

# 进入容器测试网络连接
docker exec -it [container-name] ping [target-service]
```

## 10. 环境清理

```bash
# 停止所有服务
docker compose down

# 停止所有服务并删除数据卷
docker compose down -v

# 重新构建并启动所有服务
docker compose up -d --build
```

## 注意事项

1. 所有命令都需要在项目根目录（包含 docker-compose.yml 的目录）下执行
2. 确保 Docker 和 Docker Compose 已正确安装
3. 确保所需端口（27017, 6379, 3000, 8080）未被其他服务占用
4. 如果遇到权限问题，可能需要使用 sudo 执行命令

## 验证清单

- [ ] 所有服务状态正常
- [ ] MongoDB 连接正常
- [ ] Redis 连接正常
- [ ] 管理后台可访问
- [ ] 后端服务可访问
- [ ] 服务间网络连接正常
- [ ] 数据持久化正常
- [ ] 资源使用情况正常
- [ ] 日志无错误信息 