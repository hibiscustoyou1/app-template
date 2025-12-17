import path from 'path';
import fs from 'fs';
import { PROJECT_ROOT } from '@/constants/path';

export const resolveClientPath = () => {
  const prodPath = path.join(PROJECT_ROOT, 'client');
  const devPath = path.join(PROJECT_ROOT, 'client', 'dist');

  const clientPackageJsonPath = path.join(PROJECT_ROOT, 'client', 'package.json');
  const isDev = fs.existsSync(clientPackageJsonPath);
  
  if (isDev && fs.existsSync(devPath)) {
    return devPath;
  }
  if (!isDev && fs.existsSync(prodPath)) {
    return prodPath;
  }
  
  // 都没找到，返回 null (稍后报错提示)
  return null;
};
