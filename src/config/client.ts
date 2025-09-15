// Đoạn code này dùng để đảm bảo chỉ có duy nhất một 
// Prisma Client trong suốt vòng đời của app 
// (tránh lỗi tạo nhiều connection khi hot reload trong dev).

import { PrismaClient } from '@prisma/client'
import 'dotenv/config'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
    globalForPrisma.prisma || new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma