'use server';

import { prisma } from '@/lib/db';
import { OnboardingData } from '@/types';

// =============================================================================
// COMPLETE ONBOARDING
// =============================================================================

export async function completeOnboarding(
    userId: string,
    data: OnboardingData
): Promise<{ success: boolean; error?: string }> {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                goals: data.goals,
                level: data.level,
                weeklyHours: data.weeklyHours,
                onboardingCompleted: true,
            },
        });

        return { success: true };
    } catch (error) {
        console.error('[completeOnboarding] Error:', error);
        return { success: false, error: 'Failed to complete onboarding' };
    }
}

// =============================================================================
// GET OR CREATE USER
// =============================================================================

export async function getOrCreateUser(email: string) {
    try {
        let user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    goals: [],
                    level: 'BEGINNER',
                    weeklyHours: 5,
                    onboardingCompleted: false,
                },
            });
        }

        return {
            id: user.id,
            email: user.email,
            onboardingCompleted: user.onboardingCompleted,
            goals: user.goals,
            level: user.level,
            weeklyHours: user.weeklyHours,
        };
    } catch (error) {
        console.error('[getOrCreateUser] Error:', error);
        throw new Error('Failed to get or create user');
    }
}

// =============================================================================
// UPDATE USER WEEKLY HOURS
// =============================================================================

export async function updateWeeklyHours(
    userId: string,
    weeklyHours: number
): Promise<{ success: boolean }> {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { weeklyHours },
        });
        return { success: true };
    } catch (error) {
        console.error('[updateWeeklyHours] Error:', error);
        return { success: false };
    }
}
