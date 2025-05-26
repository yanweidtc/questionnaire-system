# TypeScript 编译指令说明

## 📦 项目中的 TypeScript 相关命令

在 `package.json` 中定义的命令：

```json
{
  "scripts": {
    "start": "node dist/app.js",    // 运行编译后的代码
    "dev": "nodemon",              // 开发环境运行（自动重启）
    "build": "tsc",                // 编译 TypeScript 代码
    "watch": "tsc -w"              // 监视模式编译
  }
}
```

## 🚀 命令使用说明

### 1. 开发环境
```bash
npm run dev
```
- 使用 `nodemon` 监视文件变化
- 通过 `ts-node` 直接运行 TypeScript 代码
- 自动重启服务器
- 适合开发时使用

### 2. 生产环境
```bash
# 第一步：编译
npm run build

# 第二步：运行
npm start
```
- `build` 将 TypeScript 代码编译为 JavaScript
- 编译后的文件位于 `dist` 目录
- `start` 运行编译后的代码
- 适合生产环境使用

### 3. 监视模式
```bash
npm run watch
```
- 持续监视 TypeScript 文件变化
- 自动重新编译修改的文件
- 不会自动重启服务器
- 适合需要频繁编译的场景

## 📁 文件结构说明

```
backend/
├── src/                    # TypeScript 源代码目录
│   └── app.ts             # 主应用文件
├── dist/                   # 编译输出目录
│   ├── app.js             # 编译后的 JavaScript 文件
│   └── app.js.map         # 源码映射文件（用于调试）
├── tsconfig.json          # TypeScript 配置文件
└── nodemon.json           # Nodemon 配置文件
```

## ⚙️ 配置文件说明

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",           // 编译目标版本
    "module": "commonjs",         // 模块系统
    "outDir": "./dist",           // 输出目录
    "rootDir": "./src",           // 源代码目录
    "strict": true,               // 启用严格模式
    "esModuleInterop": true,      // 启用 ES 模块互操作性
    "sourceMap": true             // 生成源码映射文件
  }
}
```

### nodemon.json
```json
{
  "watch": ["src"],              // 监视的目录
  "ext": ".ts,.js",             // 监视的文件扩展名
  "exec": "ts-node ./src/app.ts" // 执行的命令
}
```

## 🔍 调试说明

1. 源码映射
   - 编译时生成 `.map` 文件
   - 支持在调试时直接查看 TypeScript 源码
   - 错误堆栈会指向 TypeScript 文件

2. 开发工具支持
   - VS Code 提供完整的 TypeScript 支持
   - 支持代码补全、类型检查
   - 支持断点调试

## 📝 注意事项

1. 开发时使用 `npm run dev`
   - 自动重启
   - 直接运行 TypeScript
   - 实时错误提示

2. 部署时使用 `npm run build` + `npm start`
   - 先编译
   - 后运行编译后的代码
   - 更好的性能

3. 代码修改后
   - 开发环境：自动重启
   - 生产环境：需要重新编译 