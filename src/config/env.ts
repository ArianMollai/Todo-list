import dotenv from "dotenv";
dotenv.config();

interface Env {
  PORT: number;
  MONGO_URI: string;
  ACCESS_TOKEN_SECRET: string | undefined;
  REFRESH_TOKEN_SECRET: string | undefined;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  refreshtoken?: string | null;
}

export interface Course {
  name: string;
  duration: string;
  time: string;
  status: string;
}

export const env: Env = {
  PORT: Number(process.env.PORT) || 300,
  MONGO_URI:
    process.env.MONGO_URI ||
    "mongodb+srv://armollaie82_db_user:31FdW05ReWaDRo7g@courses.qesxmpj.mongodb.net/?retryWrites=true&w=majority&appName=courses",
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
};
