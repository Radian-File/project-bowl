type Environment = Record<string, string | undefined>;

export interface AppEnvironment {
  NODE_ENV: "development" | "test" | "production";
  API_PORT: number;
  WEB_ORIGIN: string;
  DATABASE_URL?: string;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_ACCESS_EXPIRES_IN: string;
  JWT_REFRESH_EXPIRES_IN: string;
  ADMIN_EMAIL?: string;
  ADMIN_PASSWORD?: string;
  ADMIN_NAME?: string;
  OPENROUTER_API_KEY: string;
  OPENROUTER_MODEL: string;
}

const validNodeEnvironments = new Set(["development", "test", "production"]);

function readNumber(value: string | undefined, fallback: number, name: string): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65535) {
    throw new Error(`${name} must be a valid TCP port number`);
  }

  return parsed;
}

export function validateEnvironment(config: Environment): AppEnvironment {
  const nodeEnv = config.NODE_ENV ?? "development";

  if (!validNodeEnvironments.has(nodeEnv)) {
    throw new Error("NODE_ENV must be one of development, test, or production");
  }

  return {
    NODE_ENV: nodeEnv as AppEnvironment["NODE_ENV"],
    API_PORT: readNumber(config.API_PORT, 4000, "API_PORT"),
    WEB_ORIGIN: config.WEB_ORIGIN ?? "http://localhost:3000",
    DATABASE_URL: config.DATABASE_URL,
    JWT_ACCESS_SECRET: config.JWT_ACCESS_SECRET ?? "replace-me",
    JWT_REFRESH_SECRET: config.JWT_REFRESH_SECRET ?? "replace-me",
    JWT_ACCESS_EXPIRES_IN: config.JWT_ACCESS_EXPIRES_IN ?? "15m",
    JWT_REFRESH_EXPIRES_IN: config.JWT_REFRESH_EXPIRES_IN ?? "7d",
    ADMIN_EMAIL: config.ADMIN_EMAIL,
    ADMIN_PASSWORD: config.ADMIN_PASSWORD,
    ADMIN_NAME: config.ADMIN_NAME,
    OPENROUTER_API_KEY: config.OPENROUTER_API_KEY ?? "replace-me",
    OPENROUTER_MODEL: config.OPENROUTER_MODEL ?? "openai/gpt-4o-mini",
  };
}
