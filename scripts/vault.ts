import * as fs from 'fs';
import * as crypto from 'crypto';
import * as path from 'path';
import { PROJECT_ROOT } from '@repo/shared';

const ALGORITHM: string = 'aes-256-cbc';
// ⚠️ 生产环境建议通过环境变量注入
const PASSWORD = process.env.VAULT_PASS || 'default';
const SALT = 'salty-string-for-app-template';

// 定义文件路径
const envPath = path.resolve(PROJECT_ROOT, '.env');
const encPath = path.resolve(PROJECT_ROOT, '.env.enc');

/**
 * 从密码派生 Key 和 IV
 */
function getCipherKey(password: string) {
  // 使用 scrypt 算法派生 32 字节 Key 和 16 字节 IV
  const key = crypto.scryptSync(password, SALT, 32);
  const iv = crypto.scryptSync(password, SALT, 16);
  return { key, iv };
}

/**
 * 加密流程
 */
function encrypt(): void {
  if (!fs.existsSync(envPath)) {
    console.error('❌ 错误：项目根目录下未找到 .env 文件。');
    process.exit(1);
  }
  
  const { key, iv } = getCipherKey(PASSWORD);
  const content = fs.readFileSync(envPath, 'utf8');
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(content, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  fs.writeFileSync(encPath, encrypted);
  console.log(`🔒 加密成功：.env -> .env.enc`);
}

/**
 * 解密流程
 */
function decrypt(): void {
  if (!fs.existsSync(encPath)) {
    console.error('❌ 错误：未找到 .env.enc 加密文件。');
    process.exit(1);
  }
  
  const { key, iv } = getCipherKey(PASSWORD);
  const content = fs.readFileSync(encPath, 'utf8');
  
  try {
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(content, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    fs.writeFileSync(envPath, decrypted);
    console.log(`🔓 解密成功：.env.enc -> .env`);
  } catch (error) {
    console.error('❌ 解密失败：密码错误或文件已损坏。');
    process.exit(1);
  }
}

function main() {
  const action = process.argv[2];
  console.log(`🔑 正在启动 Vault 脚本... (操作: ${action})`);
  
  switch (action) {
    case 'encrypt':
      encrypt();
      break;
    case 'decrypt':
      decrypt();
      break;
    default:
      console.warn('⚠️  用法: npx tsx scripts/vault.ts [encrypt|decrypt]');
      process.exit(1);
  }
}

main();
