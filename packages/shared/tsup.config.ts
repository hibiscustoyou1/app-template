import { defineConfig } from 'tsup';

export default defineConfig({
  // 显式指定三个入口
  entry: {
    'common/index': 'src/common/index.ts',
    'node/index': 'src/node/index.ts',
    'browser/index': 'src/browser/index.ts',
  },
  format: ['cjs', 'esm'], // 同时输出 CommonJS 和 ES Module
  dts: true,              // 生成类型定义文件
  splitting: false,
  sourcemap: true,
  clean: true,
  // 排除 node 依赖，防止被打包进 bundle (虽然 node/index 会运行在 node，但保持纯净是个好习惯)
  external: ['dotenv', 'fs', 'path', 'crypto', 'events'],
});
