import "dotenv/config";
const getEnv = (key: string, defaultValue?: string) => {
  const value = process.env[key] || defaultValue;

  if (value === undefined) throw new Error(`Missing enviourment key: ${key}`);

  return value;
};

export const MONGO_URI = getEnv("MONGO_URI");
export const REDIS_URI = getEnv("REDIS_URI");
export const SMTP_HOST = getEnv("SMTP_HOST");
export const SMTP_PORT = getEnv("SMTP_PORT", "587");
export const SMTP_SERVICE = getEnv("SMTP_SERVICE");
export const SMTP_USER = getEnv("SMTP_USER");
export const SMTP_PASS = getEnv("SMTP_PASS");
