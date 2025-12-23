import * as fs from 'fs';
import * as crypto from 'crypto';
import * as path from 'path';
import { getServerPaths } from '@repo/shared/server';

const ALGORITHM = 'aes-256-gcm';
const PASSWORD = process.env.VAULT_PASS;

// 获取路径
const { PROJECT_ROOT } = getServerPaths(__dirname);
const envPath = path.resolve(PROJECT_ROOT, '.env');
const encPath = path.resolve(PROJECT_ROOT, '.env.enc');

function checkPasswordOrExit(): string {
  if (!PASSWORD) {
    console.error('\n❌ 安全错误: 未设置环境变量 VAULT_PASS');
    console.error('👉 请运行: VAULT_PASS=你的强密码 pnpm vault:enc \n');
    process.exit(1);
  }
  return PASSWORD;
}

/**
 * 派生密钥 (PBKDF2 / Scrypt)
 * @param password 密码
 * @param salt 随机盐
 */
function deriveKey(password: string, salt: Buffer): Buffer {
  return crypto.scryptSync(password, salt, 32);
}

function encrypt() {
  const password = checkPasswordOrExit();
  
  if (!fs.existsSync(envPath)) {
    console.error(`❌ 错误：未找到源文件 ${envPath}`);
    process.exit(1);
  }
  
  const content = fs.readFileSync(envPath, 'utf8');
  const salt = crypto.randomBytes(32);
  const iv = crypto.randomBytes(12);
  const key = deriveKey(password, salt);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(content, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();
  
  const payload = [
    salt.toString('hex'),
    iv.toString('hex'),
    authTag.toString('hex'),
    encrypted
  ].join(':');
  
  fs.writeFileSync(encPath, payload);
  console.log(`🔒 加密成功 (AES-256-GCM): .env -> .env.enc`);
  console.log(`📦 输出包含: 随机Salt + 随机IV + 完整性校验Tag + 密文`);
}

function decrypt() {
  const password = checkPasswordOrExit();
  
  if (!fs.existsSync(encPath)) {
    console.error(`❌ 错误：未找到加密文件 ${encPath}`);
    process.exit(1);
  }
  
  const fileContent = fs.readFileSync(encPath, 'utf8');
  
  const parts = fileContent.split(':');
  if (parts.length !== 4) {
    console.error('❌ 解密失败：文件格式错误或版本不兼容。');
    process.exit(1);
  }
  
  const [saltHex, ivHex, authTagHex, encryptedContent] = parts;
  
  const salt = Buffer.from(saltHex, 'hex');
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  
  const key = deriveKey(password, salt);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  try {
    let decrypted = decipher.update(encryptedContent, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    fs.writeFileSync(envPath, decrypted);
    console.log(`🔓 解密成功：.env.enc -> .env`);
  } catch (error) {
    console.error('❌ 解密失败：密码错误 或 文件内容已被篡改！');
    process.exit(1);
  }
}

function main() {
  const action = process.argv[2];
  
  switch (action) {
    case 'encrypt':
      encrypt();
      break;
    case 'decrypt':
      decrypt();
      break;
    default:
      console.log('🛡️  Secure Vault Script');
      console.log('用法:');
      console.log('  encrypt: VAULT_PASS=xxx npx tsx scripts/vault.ts encrypt');
      console.log('  decrypt: VAULT_PASS=xxx npx tsx scripts/vault.ts decrypt');
      process.exit(1);
  }
}

main();
