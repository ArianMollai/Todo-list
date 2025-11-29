import dotenv from 'dotenv-safe';
dotenv.config({
  example: '.env.example',
});

export const env = {
  MONGO_URI: process.env.MONGO_URI!,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  PORT: Number(process.env.PORT),
};
