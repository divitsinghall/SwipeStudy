'use client';

import { useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { SwipeCard } from './SwipeCard';
import { useSwipeDeck } from '@/lib/stores/useSwipeDeck';
import { Resource } from '@/types';
import { Loader2 } from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface SwipeDeckProps {
    initialResources?: Resource[];
    onSwipe?: (resource: Resource, direction: 'left' | 'right') => void;
    onEmpty?: () => void;
    className?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function SwipeDeck({
    initialResources = [],
    onSwipe,
    onEmpty,
    className = '',
}: SwipeDeckProps) {
    const {
        resources,
        activeIndex,
        isLoading,
        error,
        setResources,
        handleSwipe,
        getCurrentResource,
        getRemainingCount,
    } = useSwipeDeck();

    // Initialize resources on mount
    useEffect(() => {
        if (initialResources.length > 0) {
            setResources(initialResources);
        }
    }, [initialResources, setResources]);

    // Handle empty deck
    useEffect(() => {
        if (resources.length > 0 && getRemainingCount() === 0) {
            onEmpty?.();
        }
    }, [resources.length, getRemainingCount, onEmpty]);

    // Swipe handler
    const onCardSwipe = useCallback(
        (direction: 'left' | 'right') => {
            const currentResource = getCurrentResource();
            if (currentResource) {
                onSwipe?.(currentResource, direction);
            }
            handleSwipe(direction);
        },
        [getCurrentResource, handleSwipe, onSwipe]
    );

    // ==========================================================================
    // RENDER STATES
    // ==========================================================================

    if (error) {
        return (
            <div className={`flex items-center justify-center h-full ${className}`}>
                <div className="text-center p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10">
                    <p className="text-rose-400 text-lg font-medium mb-2">Oops!</p>
                    <p className="text-white/60">{error}</p>
                </div>
            </div>
        );
    }

    if (isLoading && resources.length === 0) {
        return (
            <div className={`flex items-center justify-center h-full ${className}`}>
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-white/40 animate-spin mx-auto mb-4" />
                    <p className="text-white/40">Loading resources...</p>
                </div>
            </div>
        );
    }

    if (resources.length === 0) {
        return (
            <div className={`flex items-center justify-center h-full ${className}`}>
                <div className="text-center p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10">
                    <p className="text-white/60">No resources to show</p>
                </div>
            </div>
        );
    }

    if (getRemainingCount() === 0) {
        return (
            <div className={`flex items-center justify-center h-full ${className}`}>
                <div className="text-center p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 max-w-sm mx-auto">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">🎉</span>
                    </div>
                    <p className="text-white text-xl font-semibold mb-2">All caught up!</p>
                    <p className="text-white/50">
                        You&apos;ve reviewed all the resources. Check back later for more.
                    </p>
                </div>
            </div>
        );
    }

    // ==========================================================================
    // RENDER CARDS
    // ==========================================================================

    // Get the next 3 cards to render (for stack effect)
    const visibleCards = resources.slice(activeIndex, activeIndex + 3);

    return (
        <div className={`relative w-full h-full ${className}`}>
            {/* Card Stack */}
            <AnimatePresence mode="popLayout">
                {visibleCards.map((resource, index) => {
                    const isActive = index === 0;
                    const stackIndex = index;

                    return (
                        <div
                            key={resource.id}
                            className="absolute inset-0"
                            style={{
                                // Stack effect: cards further back are smaller and translucent
                                zIndex: visibleCards.length - stackIndex,
                                transform: `scale(${1 - stackIndex * 0.04}) translateY(${stackIndex * 8}px)`,
                                opacity: isActive ? 1 : 0.7 - stackIndex * 0.2,
                                pointerEvents: isActive ? 'auto' : 'none',
                            }}
                        >
                            <SwipeCard
                                resource={resource}
                                onSwipe={onCardSwipe}
                                isActive={isActive}
                            />
                        </div>
                    );
                })}
            </AnimatePresence>

            {/* Loading indicator for pre-fetch */}
            {isLoading && resources.length > 0 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                    <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center gap-2">
                        <Loader2 className="w-4 h-4 text-white/40 animate-spin" />
                        <span className="text-xs text-white/40">Loading more...</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SwipeDeck;
