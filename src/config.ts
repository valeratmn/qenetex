import dotenv from "dotenv";

const envFile =
  process.env.NODE_ENV === "production" ? ".env.production" : ".env";
dotenv.config({ path: envFile });

export default {
  host: process.env.APP_HOST || 'localhost',
  port: process.env.APP_PORT || 3000,
  dbHost: process.env.DB_HOST || "mongodb://localhost:27017/bookstore",
  jwtSecret: process.env.JWT_SECRET || "jwt_secret",
};
