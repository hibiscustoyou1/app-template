import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { initRoutes } from '@/routes';
import { getServerPaths } from '@repo/shared/server';

const { PROJECT_ROOT, CLIENT_DIST_PATH } = getServerPaths(__dirname);

const app = express();
dotenv.config({ path: path.resolve(PROJECT_ROOT, '.env') });
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

initRoutes(app)

const clientDistPath = CLIENT_DIST_PATH;

if (clientDistPath) {
  console.log(`📂 静态资源托管路径: ${clientDistPath}`);
  app.use(express.static(clientDistPath));
  
  // SPA 页面回退 (Catch-all route)
  app.get(/.*/, (_, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  console.warn('⚠️ 警告: 未找到前端构建产物。');
  console.warn('   - 如果是本地开发，请先在 client 目录下运行 npm run build');
  console.warn('   - API 接口依然可用，但访问主页将无法显示');
}

app.listen(PORT, () => {
  console.log(`🚀 服务已启动: http://localhost:${PORT}`);
});
