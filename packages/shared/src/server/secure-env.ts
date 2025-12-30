import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';

const ALGORITHM = 'aes-256-gcm';

/**
 * 内存解密 .env.enc，不写入磁盘
 */
export function loadSecureEnv(projectRoot: string) {
  // 1. 优先尝试加载未加密的 .env (通常用于本地开发)
  const envPath = path.resolve(projectRoot, '.env');
  if (fs.existsSync(envPath)) {
    console.log('加载本地配置: .env');
    dotenv.config({ path: envPath });
    return;
  }
  
  // 2. 尝试加载加密的 .env.enc (生产环境)
  const encPath = path.resolve(projectRoot, '.env.enc');
  if (!fs.existsSync(encPath)) {
    console.warn('⚠️ 未找到 .env 或 .env.enc 配置文件');
    return;
  }
  
  const password = process.env.VAULT_PASS;
  if (!password) {
    console.error('❌ 生产环境错误: 存在 .env.enc 但未设置环境变量 VAULT_PASS');
    process.exit(1);
  }
  
  try {
    const fileContent = fs.readFileSync(encPath, 'utf8');
    const parts = fileContent.split(':');
    
    if (parts.length !== 4) {
      throw new Error('Invalid format');
    }
    
    const [saltHex, ivHex, authTagHex, encryptedContent] = parts;
    
    const salt = Buffer.from(saltHex, 'hex');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    
    const key = crypto.scryptSync(password, salt, 32);
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedContent, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    // 解析并注入 process.env
    const envConfig = dotenv.parse(decrypted);
    for (const k in envConfig) {
      if (!process.env[k]) {
        process.env[k] = envConfig[k];
      }
    }
    console.log('安全加载配置: .env.enc (内存解密)');
  } catch (error) {
    console.error('❌ 解密失败: 密码错误或文件损坏');
    process.exit(1);
  }
}
