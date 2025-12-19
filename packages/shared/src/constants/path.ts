import path from 'path';
import fs from 'fs';

/**
 * 智能查找项目根目录
 * 兼容两种模式：
 * 1. Production (构建后): 位于 dist/server，根目录应为 dist (因为 .env 在 dist/.env)
 * 2. Development (开发中): 位于 apps/server/src，根目录为 Monorepo 根 (依靠 pnpm-workspace.yaml)
 */
export function findProjectRoot(startDir: string = __dirname): string {
  // --- 策略 1: 生产环境快速匹配 (Dist Mode) ---
  // 检查逻辑：如果当前执行文件的目录是 "server" 或 "client"，且它的父级包含 .env
  // 说明我们处于 dist/server 结构中
  const parentDir = path.resolve(startDir, '..');
  const envInParent = path.join(parentDir, '.env');
  
  if (fs.existsSync(envInParent)) {
    // 找到了 dist/.env，直接认定 dist 为根目录
    return parentDir;
  }
  
  // --- 策略 2: 开发环境递归查找 (Monorepo Mode) ---
  // 依据：递归寻找 pnpm-workspace.yaml
  let currentDir = startDir;
  const systemRoot = path.parse(currentDir).root;
  
  while (currentDir !== systemRoot) {
    if (fs.existsSync(path.join(currentDir, 'pnpm-workspace.yaml'))) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }
  
  // 如果实在找不到（比如单文件运行），回退到一个安全的假设或抛出错误
  throw new Error('Could not find Server Root (server folder missing)');
}

// 导出计算好的项目根目录绝对路径
export const PROJECT_ROOT = findProjectRoot();

/**
 * 查找 Client 构建产物路径
 * 兼容逻辑：
 * - Prod: 在 dist/client
 * - Dev:  在 apps/client/dist
 */
export const resolveClientPath = (): string | null => {
  // 1. 尝试找 dist/client (生产环境)
  // 如果 PROJECT_ROOT 已经是 dist 了，那么 client 就在 PROJECT_ROOT/client
  const prodClient = path.join(PROJECT_ROOT, 'client');
  if (fs.existsSync(prodClient) && fs.existsSync(path.join(prodClient, 'index.html'))) {
    return prodClient;
  }
  
  // 2. 尝试找 apps/client/dist (开发环境)
  const devClient = path.join(PROJECT_ROOT, 'apps', 'client', 'dist');
  if (fs.existsSync(devClient)) {
    return devClient;
  }
  
  return null;
};
