// types/env.d.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;

      APP_SESSION_SECRET: string;

      DB_PATH?: string;

      DEFAULT_USER: string;
      DEFAULT_PASS: string;

      NODE_ENV?: "development" | "production";
    }
  }
}

export {};
