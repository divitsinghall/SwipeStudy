import { create } from 'zustand';
import { Resource, SwipeAction, DeckState } from '@/types';

// =============================================================================
// TYPES
// =============================================================================

interface SwipeDeckStore extends DeckState {
    // Actions
    setResources: (resources: Resource[]) => void;
    appendResources: (resources: Resource[]) => void;
    handleSwipe: (direction: 'left' | 'right') => void;
    handleSave: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setHasMore: (hasMore: boolean) => void;
    reset: () => void;

    // Computed
    getCurrentResource: () => Resource | null;
    getRemainingCount: () => number;
    shouldPreFetch: () => boolean;
}

// =============================================================================
// INITIAL STATE
// =============================================================================

const initialState: DeckState = {
    resources: [],
    activeIndex: 0,
    isLoading: false,
    hasMore: true,
    error: null,
};

// =============================================================================
// STORE
// =============================================================================

export const useSwipeDeck = create<SwipeDeckStore>((set, get) => ({
    ...initialState,

    // ===========================================================================
    // ACTIONS
    // ===========================================================================

    setResources: (resources) => set({ resources, activeIndex: 0 }),

    appendResources: (newResources) =>
        set((state) => ({
            resources: [...state.resources, ...newResources],
        })),

    handleSwipe: (direction) => {
        const { resources, activeIndex } = get();
        const currentResource = resources[activeIndex];

        if (!currentResource) return;

        // Log the swipe action (in production, this would call a server action)
        const action: SwipeAction = direction === 'right' ? 'RIGHT' : 'LEFT';
        console.log(`[SwipeDeck] Swiped ${action} on resource: ${currentResource.id}`);

        // Move to next card
        set((state) => ({
            activeIndex: state.activeIndex + 1,
        }));
    },

    handleSave: () => {
        const { resources, activeIndex } = get();
        const currentResource = resources[activeIndex];

        if (!currentResource) return;

        // Log the save action
        console.log(`[SwipeDeck] Saved resource: ${currentResource.id}`);

        // Move to next card
        set((state) => ({
            activeIndex: state.activeIndex + 1,
        }));
    },

    setLoading: (isLoading) => set({ isLoading }),

    setError: (error) => set({ error }),

    setHasMore: (hasMore) => set({ hasMore }),

    reset: () => set(initialState),

    // ===========================================================================
    // COMPUTED
    // ===========================================================================

    getCurrentResource: () => {
        const { resources, activeIndex } = get();
        return resources[activeIndex] ?? null;
    },

    getRemainingCount: () => {
        const { resources, activeIndex } = get();
        return resources.length - activeIndex;
    },

    shouldPreFetch: () => {
        const { hasMore, isLoading } = get();
        const remaining = get().getRemainingCount();
        // Pre-fetch when less than 3 cards remain
        return remaining < 3 && hasMore && !isLoading;
    },
}));

export default useSwipeDeck;
