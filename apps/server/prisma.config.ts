import { defineConfig } from '@prisma/config';

export default defineConfig({
  // 指向你的 schema 文件
  schema: 'prisma/schema.prisma',
  // 数据库连接配置移到这里
  datasource: {
    url: process.env.DATABASE_URL || 'file:./db/dev.db',
  },
});
