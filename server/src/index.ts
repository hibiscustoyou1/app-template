// server/src/index.ts
import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import helloRoutes from '@/routes/wage-routes';
import { PROJECT_ROOT } from '@/constants/path';
import { resolveClientPath } from '@/utils/path';

const app = express();
dotenv.config({ path: path.resolve(PROJECT_ROOT, '.env') });
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

const clientDistPath = resolveClientPath();

if (clientDistPath) {
  console.log(`📂 静态资源托管路径: ${clientDistPath}`);
  
  // 2. 静态文件托管
  app.use(express.static(clientDistPath));
  
  // 3. SPA 页面回退 (Catch-all route)
  app.get(/.*/, (_, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
  
} else {
  console.warn('⚠️ 警告: 未找到前端构建产物 (client/dist)。');
  console.warn('   - 如果是本地开发，请先在 client 目录下运行 npm run build');
  console.warn('   - API 接口依然可用，但访问主页将无法显示');
}

app.listen(PORT, () => {
  console.log('env path:', path.resolve(PROJECT_ROOT, '.env'));
  console.log(`🚀 服务已启动: http://localhost:${PORT}`);
});
