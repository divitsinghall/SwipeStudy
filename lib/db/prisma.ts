import { PrismaClient } from '@prisma/client';

// Declare global type for PrismaClient to prevent multiple instances
declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

/**
 * Prisma Client Singleton
 * 
 * In development, Next.js clears Node.js cache on every reload, which would
 * create a new PrismaClient instance each time. This leads to connection
 * pool exhaustion. We use a global variable to persist the client across
 * hot reloads.
 * 
 * In production, we simply create a single instance.
 */
export const prisma = globalThis.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = prisma;
}

export default prisma;
