'use server';

import { prisma } from '@/lib/db';
import { Resource, Difficulty } from '@/types';
import { fetchResourcesForGoals } from '@/lib/services/youtube';

// =============================================================================
// GET RECOMMENDED BATCH
// =============================================================================

export async function getRecommendedBatch(userId: string): Promise<Resource[]> {
    try {
        // Get user's goals and level from DB
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                goals: true,
                level: true,
            },
        });

        if (!user || user.goals.length === 0) {
            // Return empty if no goals set
            return [];
        }

        // Get IDs of resources user has already swiped on
        const swipedResources = await prisma.swipe.findMany({
            where: { userId },
            select: { resourceId: true },
        });
        const swipedIds = new Set(swipedResources.map((s) => s.resourceId));

        // Fetch resources from YouTube service / mock data
        const allResources = await fetchResourcesForGoals(
            user.goals,
            user.level as Difficulty
        );

        // Filter out already swiped resources
        const filteredResources = allResources.filter((r) => !swipedIds.has(r.id));

        // Return top 20 resources
        return filteredResources.slice(0, 20);
    } catch (error) {
        console.error('[getRecommendedBatch] Error:', error);
        throw new Error('Failed to fetch recommended resources');
    }
}

// =============================================================================
// ADD TO PLAYLIST
// =============================================================================

interface AddToPlaylistResult {
    success: boolean;
    error?: string;
    playlistItemId?: string;
}

export async function addToPlaylist(
    userId: string,
    resourceId: string
): Promise<AddToPlaylistResult> {
    try {
        // Get or create the user's default playlist
        let playlist = await prisma.playlist.findFirst({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });

        if (!playlist) {
            playlist = await prisma.playlist.create({
                data: {
                    userId,
                    title: 'My Learning Path',
                },
            });
        }

        // Check if resource is already in playlist
        const existing = await prisma.playlistItem.findUnique({
            where: {
                playlistId_resourceId: {
                    playlistId: playlist.id,
                    resourceId,
                },
            },
        });

        if (existing) {
            return { success: true, playlistItemId: existing.id };
        }

        // Get the current max order
        const maxOrder = await prisma.playlistItem.aggregate({
            where: { playlistId: playlist.id },
            _max: { order: true },
        });

        const nextOrder = (maxOrder._max.order ?? 0) + 1;

        // Create playlist item
        const item = await prisma.playlistItem.create({
            data: {
                playlistId: playlist.id,
                resourceId,
                order: nextOrder,
                status: 'TODO',
            },
        });

        return { success: true, playlistItemId: item.id };
    } catch (error) {
        console.error('[addToPlaylist] Error:', error);
        return { success: false, error: 'Failed to add to playlist' };
    }
}

// =============================================================================
// GET USER PLAYLIST
// =============================================================================

export async function getUserPlaylist(userId: string) {
    try {
        const playlist = await prisma.playlist.findFirst({
            where: { userId },
            include: {
                items: {
                    include: {
                        resource: true,
                    },
                    orderBy: { order: 'asc' },
                },
            },
        });

        if (!playlist) {
            return null;
        }

        return {
            id: playlist.id,
            title: playlist.title,
            items: playlist.items.map((item) => ({
                id: item.id,
                playlistId: item.playlistId,
                resourceId: item.resourceId,
                order: item.order,
                status: item.status as 'TODO' | 'IN_PROGRESS' | 'DONE',
                createdAt: item.createdAt,
                resource: item.resource
                    ? {
                        id: item.resource.id,
                        title: item.resource.title,
                        type: item.resource.type as 'VIDEO' | 'REPO',
                        url: item.resource.url,
                        thumbnailUrl: item.resource.thumbnailUrl,
                        duration: item.resource.duration,
                        durationMinutes: item.resource.durationMinutes,
                        difficulty: item.resource.difficulty as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
                        tags: item.resource.tags,
                        metadata: item.resource.metadata as Record<string, unknown>,
                        qualityScore: item.resource.qualityScore,
                        createdAt: item.resource.createdAt,
                        updatedAt: item.resource.updatedAt,
                    }
                    : undefined,
            })),
        };
    } catch (error) {
        console.error('[getUserPlaylist] Error:', error);
        throw new Error('Failed to fetch playlist');
    }
}

// =============================================================================
// UPDATE PLAYLIST ITEM STATUS
// =============================================================================

export async function updatePlaylistItemStatus(
    itemId: string,
    status: 'TODO' | 'IN_PROGRESS' | 'DONE'
): Promise<{ success: boolean }> {
    try {
        await prisma.playlistItem.update({
            where: { id: itemId },
            data: { status },
        });
        return { success: true };
    } catch (error) {
        console.error('[updatePlaylistItemStatus] Error:', error);
        return { success: false };
    }
}
