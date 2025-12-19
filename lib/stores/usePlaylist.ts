import { create } from 'zustand';
import { PlaylistItem, ItemStatus } from '@/types';

// =============================================================================
// PLAYLIST STORE
// =============================================================================

interface PlaylistStore {
    // State
    items: PlaylistItem[];
    isLoading: boolean;

    // Actions
    setItems: (items: PlaylistItem[]) => void;
    addItem: (item: PlaylistItem) => void;
    removeItem: (id: string) => void;
    updateStatus: (id: string, status: ItemStatus) => void;
    setLoading: (loading: boolean) => void;
    reset: () => void;
}

export const usePlaylist = create<PlaylistStore>((set) => ({
    items: [],
    isLoading: false,

    setItems: (items) => set({ items }),

    addItem: (item) =>
        set((state) => ({
            items: [...state.items, item],
        })),

    removeItem: (id) =>
        set((state) => ({
            items: state.items.filter((i) => i.id !== id),
        })),

    updateStatus: (id, status) =>
        set((state) => ({
            items: state.items.map((item) =>
                item.id === id ? { ...item, status } : item
            ),
        })),

    setLoading: (isLoading) => set({ isLoading }),

    reset: () => set({ items: [], isLoading: false }),
}));

export default usePlaylist;
