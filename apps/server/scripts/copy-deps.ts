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
  console.log('📦 Starting dependency copy...');
  
  // 1. 确保 dist 目录存在
  ensureDir(distDir);
  
  // 2. 复制 schema.prisma
  if (fs.existsSync(prismaSchema)) {
    console.log('📄 Copying schema.prisma...');
    copyFile(prismaSchema, path.join(distDir, 'schema.prisma'));
  } else {
    console.warn('⚠️  schema.prisma not found!');
  }
  
  // 3. 自动寻找并复制 Prisma 引擎
  try {
    
    let prismaClientDir = path.join(PROJECT_ROOT, 'node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/.prisma/client');
    
    if (!prismaClientDir) {
      throw new Error(`Cannot find .prisma/client directory.`);
    }
    
    console.log(`🔍 Found Prisma Client at: ${prismaClientDir}`);
    
    const files = fs.readdirSync(prismaClientDir);
    
    // 过滤出引擎文件 (.node)
    const engineFiles = files.filter(f =>
      f.startsWith('libquery_engine') && f.endsWith('.node')
    );
    
    if (engineFiles.length === 0) {
      console.warn('⚠️  No engine files found in the target directory.');
    }
    
    engineFiles.forEach(file => {
      copyFile(
        path.join(prismaClientDir, file),
        path.join(distDir, file)
      );
    });
    
    console.log('✅ Dependencies copied successfully!');
    
  } catch (error) {
    console.error('❌ Error locating Prisma Client:', error);
    console.error('💡 Hint: Run "pnpm prisma:gen" first.');
    process.exit(1);
  }
}

main()
