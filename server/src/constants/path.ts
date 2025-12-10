import path from 'path';

/**
 * 递归向上查找项目根目录
 * @param startDir 起始目录 (通常传 __dirname)
 */
function findServerRoot(startDir: string): string {
  let currentDir = startDir;
  const systemRoot = path.parse(currentDir).root;

  while (currentDir !== systemRoot) {
    if (path.basename(currentDir) === 'server') {
      return currentDir
    }
    currentDir = path.dirname(currentDir);
  }
  throw new Error('Could not find Server Root (server folder missing)');
}

// 导出计算好的路径
export const SERVER_ROOT = findServerRoot(__dirname);
export const PROJECT_ROOT = path.dirname(SERVER_ROOT);
