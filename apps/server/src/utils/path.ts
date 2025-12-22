import path from 'path';
import fs from 'fs';
import { PROJECT_ROOT } from '@repo/shared';

export const resolveClientPath = () => {
  const prodPath = path.join(PROJECT_ROOT, 'client');
  const devPath = path.join(PROJECT_ROOT, 'apps', 'client', 'dist');

  const clientPackageJsonPath = path.join(PROJECT_ROOT, 'apps', 'client', 'package.json');
  const isDev = fs.existsSync(clientPackageJsonPath);
  
  if (isDev && fs.existsSync(devPath)) {
    return devPath;
  }
  if (!isDev && fs.existsSync(prodPath)) {
    return prodPath;
  }
  return null;
};
