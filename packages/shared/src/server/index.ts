import { findProjectRoot, resolveClientPath } from "../utils/path-tools";

/**
 * 获取服务端相关的绝对路径
 * @param serverDirname - 请传入当前执行环境的 __dirname
 */
export const getServerPaths = (serverDirname: string) => {
  const projectRoot = findProjectRoot(serverDirname);
  return {
    PROJECT_ROOT: projectRoot,
    CLIENT_DIST_PATH: resolveClientPath(projectRoot)
  };
};
