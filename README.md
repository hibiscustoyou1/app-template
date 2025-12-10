# Full-Stack App Template (Vue 3 + Express + Prisma)

这是一个现代化的全栈应用开发模版，采用 Monorepo 结构组织代码。前端追求极致的构建速度与开发体验，后端提供稳健的类型安全接口与数据管理。

## ✨ 技术栈 (Tech Stack)

### 🖥️ 前端 (Client)
- **核心框架:** [Vue 3](https://vuejs.org/) (v3.5+)
- **构建工具:** [Vite](https://vitejs.dev/) (Powered by **Rolldown** ⚡️ for blazing fast builds)
- **状态管理:** [Pinia](https://pinia.vuejs.org/)
- **路由管理:** [Vue Router](https://router.vuejs.org/)
- **UI 样式:** [Tailwind CSS](https://tailwindcss.com/) + PostCSS
- **语言:** TypeScript

### ⚙️ 后端 (Server)
- **运行时:** [Node.js](https://nodejs.org/)
- **Web 框架:** [Express](https://expressjs.com/) (v5.1+)
- **ORM:** [Prisma](https://www.prisma.io/)
- **工具:** Nodemon (热重载), Esbuild, Dotenv
- **语言:** TypeScript

## 📂 项目结构 (Structure)

```text
myapp
├── client/          # 前端应用 (Vue 3 + Vite + Tailwind)
├── server/          # 后端服务 (Express + Prisma)
├── package.json     # 根目录脚本
└── pnpm-workspace.yaml
```
## 📋 前置要求 (Prerequisites)

在开始之前，请确保您的开发环境中已安装以下工具：

* **Node.js** (推荐 >= 20)
* **PNPM** (必须安装，本项目依赖 workspaces 功能)

如果您尚未安装 PNPM，请运行：

```bash
npm install -g pnpm
```

## 🚀 快速开始 (Getting Started)

请在项目根目录下依次执行以下步骤：

1.  **安装依赖**
    安装根目录及所有工作区（client/server）的依赖。
    ```bash
    pnpm install
    ```

2.  **批准构建脚本**
    批准依赖包的构建脚本执行权限（Approve build scripts）。
    ```bash
    pnpm approve-builds
    ```

3.  **配置环境 (推荐)**
    > ⚠️ **注意**：由于后端使用了 Prisma，建议在启动前配置数据库连接。

    * 配置 `DATABASE_URL` (参考 `server/prisma/schema.prisma`)。

4.  **构建项目**
    执行前端和后端的构建流程。
    ```bash
    pnpm build
    ```

5.  **启动开发环境**
    同时启动前端和后端服务。
    ```bash
    pnpm start
    ```

---

## 🌐 访问应用

启动成功后，请访问：[http://localhost:30030](http://localhost:3030)

> (注：后端 API 服务通常运行在不同端口，请检查 server 端的控制台输出)

---

## 🛠️ 常用命令说明

| 命令 | 说明 |
| :--- | :--- |
| `pnpm install` | 安装所有依赖 |
| `pnpm approve-builds` | 批准构建脚本 (安全策略) |
| `pnpm build` | 并行构建 Client 和 Server |
| `pnpm start` | 启动开发服务器 |
| `pnpm --filter client [cmd]` | 仅在 client 目录执行命令 |
| `pnpm --filter server [cmd]` | 仅在 server 目录执行命令 |