import  fs from 'fs';
import path from 'path';
import { PROJECT_ROOT } from "@repo/shared";

// 定义路径
const distDir: string = path.resolve(__dirname, '../dist');
const prismaSchema: string = path.resolve(__dirname, '../prisma/schema.prisma');

/**
 * 确保目录存在
 */
function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * 复制文件
 */
function copyFile(src: string, dest: string): void {
  fs.copyFileSync(src, dest);
  const fileName = path.basename(src);
  console.log(`   -> Copied ${fileName}`);
}

function main() {
  console.log('📦 开始复制依赖...');
  
  ensureDir(distDir);
  
  if (fs.existsSync(prismaSchema)) {
    console.log('📄 复制 schema.prisma...');
    copyFile(prismaSchema, path.join(distDir, 'schema.prisma'));
  } else {
    console.warn('⚠️  schema.prisma 未找到!');
  }
  
  try {
    
    let prismaClientDir = path.join(PROJECT_ROOT, 'node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/.prisma/client');
    
    if (!prismaClientDir) {
      throw new Error(`未找到 .prisma/client 目录.`);
    }
    
    console.log(`🔍 Prisma Client 目录路径: ${prismaClientDir}`);
    
    const files = fs.readdirSync(prismaClientDir);

    const engineFiles = files.filter(f =>
      f.startsWith('libquery_engine') && f.endsWith('.node')
    );
    
    if (engineFiles.length === 0) {
      console.warn('⚠️ 目标目录中找不到引擎文件.');
    }
    
    engineFiles.forEach(file => {
      copyFile(
        path.join(prismaClientDir, file),
        path.join(distDir, file)
      );
    });
    
    console.log('✅ 依赖复制成功!');
    
  } catch (error) {
    console.error('❌ Prisma Client 错误定位:', error);
    console.error('💡 Hint: Run "pnpm prisma:gen" first.');
    process.exit(1);
  }
}

main()
