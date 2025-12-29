import { defineConfig } from 'tsup'
import { dependencies } from './package.json'

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: ['cjs'],
  target: 'node22',
  platform: 'node',
  clean: true,
  // 关键配置：告诉 tsup 不要排除 dependencies，而是把它们打包进来
  // 但是！必须排除 @prisma/client，否则会报错
  noExternal: Object.keys(dependencies).filter(d => !d.includes('@prisma')),
})
