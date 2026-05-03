// types/env.d.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;

      SESSION_SECRET: string;

      DB_PATH?: string;

      DEFAULT_USER: string;
      DEFAULT_PASS: string;

      NODE_ENV?: "development" | "production";

      ACCESS_TOKEN: string;
      API_GET_MY_EXERCISES: string;
      API_REDIRECT_CREATE_EXERCISE: string;
      API_REDIRECT_EXECUTE_EXERCISE: string;
      API_REDIRECT_MODIFY_EXERCISE: string;
      API_BACK_URL: string;
      API_WEBHOOK: string;
    }
  }
}

export {};
