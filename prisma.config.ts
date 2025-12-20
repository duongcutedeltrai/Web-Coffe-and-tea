import 'dotenv/config'
import { defineConfig, env } from "prisma/config";

export default defineConfig({
    migrations: {
        path: "./prisma/migrations",
    },
    datasource: {
        url: process.env.DATABASE_URL || env("DATABASE_URL"),
    }
});