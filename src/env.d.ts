declare global {
  namespace NodeJS {
    interface ProcessEnv {
      POSTGRES_DATABASE_URL: string;
      PORT: string;
      JWT_SECRET: string;
      REFRESH_SECRET: string;
      NAVER_CLIENT_ID: string;
      NAVER_CLIENT_SECRET: string;
      NAVER_REDIRECT_URI: string;
      SESSION_SECRET: string;
      AWS_S3_BUCKET_NAME: string;
      AWS_S3_REGION: string;
      AWS_S3_ACCESS_KEY: string;
      AWS_S3_SECRET_KEY: string;
      KAKAO_CLIENT_ID: string;
      KAKAO_CLIENT_SECRET: string;
      KAKAO_CALLBACK_URL: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      GOOGLE_CALLBACK_URL: string;
      FRONTEND_URL: string;
    }
  }
}

export {};
