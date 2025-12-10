import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();
const currentBasename = path.basename(__filename);

// 扫描当前目录下的所有文件
fs.readdirSync(__dirname).forEach((file) => {
  // 匹配 .routes.ts 或 .routes.js，并排除 index 文件自身
  if (
    (file.endsWith('.routes.ts') || file.endsWith('.routes.js')) &&
    file !== currentBasename
  ) {
    // 动态引入路由模块
    // 注意：在 esbuild 打包模式下，需确保这些文件被正确包含或使用 external 配置
    // 在开发模式 (nodemon + ts-node) 下可直接工作
    const routePath = path.join(__dirname, file);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const routeModule = require(routePath);
    
    // 挂载路由 (假设导出为 default)
    router.use('/', routeModule.default || routeModule);
  }
});

export default router;