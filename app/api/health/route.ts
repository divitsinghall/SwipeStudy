import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Test database connection
        const userCount = await prisma.user.count();
        const resourceCount = await prisma.resource.count();

        return NextResponse.json({
            success: true,
            message: 'Database connected successfully',
            data: {
                userCount,
                resourceCount,
                timestamp: new Date().toISOString(),
            }
        });
    } catch (error) {
        console.error('Database connection error:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
        }, { status: 500 });
    }
}
