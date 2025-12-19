import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Difficulty, OnboardingData } from '@/types';

// =============================================================================
// USER PREFERENCES STORE
// =============================================================================

interface UserPreferencesStore {
    // State
    userId: string | null;
    goals: string[];
    level: Difficulty;
    weeklyHours: number;
    onboardingCompleted: boolean;

    // Actions
    setUserId: (id: string) => void;
    setPreferences: (data: OnboardingData) => void;
    setWeeklyHours: (hours: number) => void;
    markOnboardingComplete: () => void;
    reset: () => void;
}

const initialState = {
    userId: null,
    goals: [],
    level: 'BEGINNER' as Difficulty,
    weeklyHours: 5,
    onboardingCompleted: false,
};

export const useUserPreferences = create<UserPreferencesStore>()(
    persist(
        (set) => ({
            ...initialState,

            setUserId: (id) => set({ userId: id }),

            setPreferences: (data) =>
                set({
                    goals: data.goals,
                    level: data.level,
                    weeklyHours: data.weeklyHours,
                }),

            setWeeklyHours: (hours) => set({ weeklyHours: hours }),

            markOnboardingComplete: () => set({ onboardingCompleted: true }),

            reset: () => set(initialState),
        }),
        {
            name: 'swipestudy-user-preferences',
        }
    )
);

export default useUserPreferences;
