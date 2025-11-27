// server/src/index.ts
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import helloRoutes from './routes/wageRoutes';

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// [新增] 验证接口 (用于前端登录页检测密码是否正确)
app.post('/api/verify', (req, res) => {
  const { key } = req.body;
  if (key === process.env.ACCESS_KEY) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false });
  }
});

// 1. API 路由 (必须在静态文件托管之前)
app.use('/api', helloRoutes);

// 目标：找到前端构建产物 (client/dist 或 dist/client)
const resolveClientPath = () => {
  // 场景 A: 生产环境/编译后 (dist/server/index.js) -> 找同级的 ../client
  // 此时 __dirname 是 .../dist/server
  const prodPath = path.join(__dirname, '../client');
  
  // 场景 B: 本地开发 (server/src/index.ts) -> 找外层的 ../../client/dist
  // 此时 __dirname 是 .../server/src
  const devPath = path.join(__dirname, '../../client/dist');
  
  // 优先判断生产环境路径是否存在
  if (fs.existsSync(prodPath)) {
    return prodPath;
  }
  
  // 如果生产路径不存在，尝试开发路径
  if (fs.existsSync(devPath)) {
    return devPath;
  }
  
  // 都没找到，返回 null (稍后报错提示)
  return null;
};

const clientDistPath = resolveClientPath();

if (clientDistPath) {
  console.log(`📂 静态资源托管路径: ${clientDistPath}`);
  
  // 2. 静态文件托管
  app.use(express.static(clientDistPath));
  
  // 3. SPA 页面回退 (Catch-all route)
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
  
} else {
  console.warn('⚠️ 警告: 未找到前端构建产物 (client/dist)。');
  console.warn('    - 如果是本地开发，请先在 client 目录下运行 npm run build');
  console.warn('    - API 接口依然可用，但访问主页将无法显示');
}

app.listen(PORT, () => {
  console.log(`🚀 服务已启动: http://localhost:${PORT}`);
});
