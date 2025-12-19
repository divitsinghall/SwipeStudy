'use server';

import { prisma } from '@/lib/db';
import { Resource, SwipeAction } from '@/types';
import { SwipeAction as PrismaSwipeAction } from '@prisma/client';

// =============================================================================
// FETCH RESOURCES
// =============================================================================

interface FetchResourcesParams {
    skip?: number;
    take?: number;
    excludeIds?: string[];
    userId?: string;
}

interface FetchResourcesResult {
    resources: Resource[];
    hasMore: boolean;
}

export async function fetchResources({
    skip = 0,
    take = 10,
    excludeIds = [],
    userId,
}: FetchResourcesParams = {}): Promise<FetchResourcesResult> {
    try {
        // Build where clause
        const whereClause: {
            id?: { notIn: string[] };
            NOT?: { swipes: { some: { userId: string } } };
        } = {};

        if (excludeIds.length > 0) {
            whereClause.id = { notIn: excludeIds };
        }

        // Exclude resources the user has already swiped on
        if (userId) {
            whereClause.NOT = {
                swipes: {
                    some: { userId },
                },
            };
        }

        // Fetch resources sorted by quality score (best first)
        const resources = await prisma.resource.findMany({
            where: whereClause,
            orderBy: [
                { qualityScore: 'desc' },
                { createdAt: 'desc' },
            ],
            skip,
            take: take + 1, // Fetch one extra to check if there are more
        });

        const hasMore = resources.length > take;
        const resultResources = hasMore ? resources.slice(0, take) : resources;

        // Transform Prisma types to app types
        const transformedResources: Resource[] = resultResources.map((r) => ({
            id: r.id,
            title: r.title,
            type: r.type as 'VIDEO' | 'REPO',
            url: r.url,
            thumbnailUrl: r.thumbnailUrl,
            duration: r.duration,
            metadata: r.metadata as unknown as Resource['metadata'],
            qualityScore: r.qualityScore,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt,
        }));

        return {
            resources: transformedResources,
            hasMore,
        };
    } catch (error) {
        console.error('[fetchResources] Error:', error);
        throw new Error('Failed to fetch resources');
    }
}

// =============================================================================
// RECORD SWIPE
// =============================================================================

interface RecordSwipeParams {
    userId: string;
    resourceId: string;
    action: SwipeAction;
}

export async function recordSwipe({
    userId,
    resourceId,
    action,
}: RecordSwipeParams): Promise<{ success: boolean; error?: string }> {
    try {
        // Map app SwipeAction to Prisma SwipeAction
        const prismaAction: PrismaSwipeAction = action as PrismaSwipeAction;

        await prisma.swipe.upsert({
            where: {
                userId_resourceId: {
                    userId,
                    resourceId,
                },
            },
            update: {
                action: prismaAction,
            },
            create: {
                userId,
                resourceId,
                action: prismaAction,
            },
        });

        return { success: true };
    } catch (error) {
        console.error('[recordSwipe] Error:', error);
        return { success: false, error: 'Failed to record swipe' };
    }
}

// =============================================================================
// GET USER SAVED RESOURCES
// =============================================================================

export async function getSavedResources(userId: string): Promise<Resource[]> {
    try {
        const swipes = await prisma.swipe.findMany({
            where: {
                userId,
                action: 'SAVE',
            },
            include: {
                resource: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return swipes.map((s) => ({
            id: s.resource.id,
            title: s.resource.title,
            type: s.resource.type as 'VIDEO' | 'REPO',
            url: s.resource.url,
            thumbnailUrl: s.resource.thumbnailUrl,
            duration: s.resource.duration,
            metadata: s.resource.metadata as unknown as Resource['metadata'],
            qualityScore: s.resource.qualityScore,
            createdAt: s.resource.createdAt,
            updatedAt: s.resource.updatedAt,
        }));
    } catch (error) {
        console.error('[getSavedResources] Error:', error);
        throw new Error('Failed to fetch saved resources');
    }
}
