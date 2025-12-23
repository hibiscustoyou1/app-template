import path from 'path';
import fs from 'fs';

/**
 * 智能查找项目根目录
 * 兼容两种模式：
 * 1. Production (构建后): 位于 dist/server，根目录应为 dist
 * 2. Development (开发中): 位于 apps/server/src，根目录为 Monorepo 根
 */
export function findProjectRoot(startDir: string): string {
  // --- 策略 1: 生产环境快速匹配 (Dist Mode) ---
  const parentDir = path.resolve(startDir, '..');
  const envInParent = path.join(parentDir, '.env');
  
  if (fs.existsSync(envInParent)) {
    return parentDir;
  }
  
  // --- 策略 2: 开发环境递归查找 (Monorepo Mode) ---
  let currentDir = startDir;
  const systemRoot = path.parse(currentDir).root;
  
  while (currentDir !== systemRoot) {
    if (fs.existsSync(path.join(currentDir, 'pnpm-workspace.yaml'))) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }
  
  throw new Error('Could not find Server Root (server folder missing)');
}

/**
 * 查找 Client 构建产物路径
 */
export const resolveClientPath = (rootPath: string): string | null => {
  // 1. Prod: dist/client
  const prodClient = path.join(rootPath, 'client');
  if (fs.existsSync(prodClient) && fs.existsSync(path.join(prodClient, 'index.html'))) {
    return prodClient;
  }
  
  // 2. Dev: apps/client/dist
  const devClient = path.join(rootPath, 'apps', 'client', 'dist');
  if (fs.existsSync(devClient)) {
    return devClient;
  }
  
  return null;
};
