'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { SwipeDeck } from '@/components/swipe-deck';
import { Resource } from '@/types';
import { getRecommendedBatch, addToPlaylist } from '@/actions/feed';
import { recordSwipe } from '@/app/actions';
import { Loader2, BookOpen, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// =============================================================================
// MOCK USER ID (For development without auth)
// =============================================================================

const MOCK_USER_ID = 'demo-user-001';

// =============================================================================
// TOAST NOTIFICATION
// =============================================================================

interface ToastProps {
    message: string;
    isVisible: boolean;
}

function Toast({ message, isVisible }: ToastProps) {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50"
                >
                    <div className="px-5 py-3 rounded-2xl bg-emerald-500/90 backdrop-blur-xl border border-emerald-400/50 shadow-lg shadow-emerald-500/20 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-white" />
                        <span className="text-white font-medium text-sm">{message}</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// =============================================================================
// FEED PAGE
// =============================================================================

export default function FeedPage() {
    const router = useRouter();
    const [resources, setResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState({ message: '', isVisible: false });

    const showToast = useCallback((message: string) => {
        setToast({ message, isVisible: true });
        setTimeout(() => setToast({ message: '', isVisible: false }), 2000);
    }, []);

    useEffect(() => {
        async function loadResources() {
            try {
                setIsLoading(true);
                const batch = await getRecommendedBatch(MOCK_USER_ID);
                setResources(batch);
            } catch (err) {
                console.error('Failed to load resources:', err);
                setError('Failed to load recommendations');
            } finally {
                setIsLoading(false);
            }
        }

        loadResources();
    }, []);

    const handleSwipe = useCallback(async (resource: Resource, direction: 'left' | 'right') => {
        console.log(`[Feed] Swiped ${direction} on: ${resource.title}`);

        // Record the swipe
        await recordSwipe({
            userId: MOCK_USER_ID,
            resourceId: resource.id,
            action: direction === 'right' ? 'RIGHT' : 'LEFT',
        });

        // If swiped right, add to playlist
        if (direction === 'right') {
            const result = await addToPlaylist(MOCK_USER_ID, resource.id);
            if (result.success) {
                showToast('✓ Saved to your path');
            }
        }
    }, [showToast]);

    const handleEmpty = useCallback(() => {
        console.log('[Feed] All cards reviewed!');
    }, []);

    // Loading state
    if (isLoading) {
        return (
            <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-violet-400 animate-spin mx-auto mb-4" />
                    <p className="text-white/50">Loading your personalized feed...</p>
                </div>
            </main>
        );
    }

    // Error state
    if (error) {
        return (
            <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-6">
                <div className="text-center p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 max-w-sm">
                    <p className="text-rose-400 text-lg font-medium mb-2">Oops!</p>
                    <p className="text-white/60 mb-4">{error}</p>
                    <button
                        onClick={() => router.push('/onboarding')}
                        className="px-6 py-3 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-500 transition-colors"
                    >
                        Complete Onboarding
                    </button>
                </div>
            </main>
        );
    }

    // Empty state (no goals set)
    if (resources.length === 0) {
        return (
            <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-6">
                <div className="text-center p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 max-w-sm">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-white text-xl font-semibold mb-2">Set Your Goals First</p>
                    <p className="text-white/50 mb-4">
                        Complete onboarding to get personalized recommendations.
                    </p>
                    <button
                        onClick={() => router.push('/onboarding')}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-medium shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all"
                    >
                        Get Started
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="h-full flex flex-col">
            {/* Header */}
            <header className="flex-shrink-0 px-6 pt-safe-top py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">
                            Swipe<span className="text-gradient">Study</span>
                        </h1>
                        <p className="text-white/40 text-sm">Discover • Learn • Save</p>
                    </div>
                    <button
                        onClick={() => router.push('/playlist')}
                        className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                        <span className="text-lg">📚</span>
                    </button>
                </div>
            </header>

            {/* Card Deck */}
            <div className="flex-1 px-4 pb-8 min-h-0">
                <div className="h-full max-h-[680px] mx-auto">
                    <SwipeDeck
                        initialResources={resources}
                        onSwipe={handleSwipe}
                        onEmpty={handleEmpty}
                    />
                </div>
            </div>

            {/* Bottom Instructions */}
            <footer className="flex-shrink-0 px-6 pb-safe-bottom py-4">
                <div className="flex items-center justify-center gap-8">
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
                            <span className="text-rose-400 text-lg">←</span>
                        </div>
                        <span className="text-xs text-white/40">Skip</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                            <span className="text-emerald-400 text-lg">→</span>
                        </div>
                        <span className="text-xs text-white/40">Save</span>
                    </div>
                </div>
            </footer>

            {/* Toast */}
            <Toast message={toast.message} isVisible={toast.isVisible} />
        </main>
    );
}
