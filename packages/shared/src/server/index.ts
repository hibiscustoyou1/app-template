import { findProjectRoot, resolveClientPath } from "../utils/path-tools";

// [修复] 直接使用 __dirname
// tsup 构建时开启 --shims 参数后，会自动兼容 ESM 和 CJS 环境
export const PROJECT_ROOT_FOR_SERVER = findProjectRoot(__dirname);

export const CLIENT_DIST_PATH = resolveClientPath(PROJECT_ROOT_FOR_SERVER);
