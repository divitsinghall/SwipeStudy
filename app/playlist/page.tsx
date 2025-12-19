'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Play,
    CheckCircle2,
    Circle,
    Clock,
    ExternalLink,
    Settings2,
    ChevronDown
} from 'lucide-react';
import { getUserPlaylist, updatePlaylistItemStatus } from '@/actions/feed';
import { updateWeeklyHours, getOrCreateUser } from '@/actions/onboarding';
import { PlaylistItem, PlaylistItemWithWeek, calculateWeeksForPlaylist, ItemStatus } from '@/types';

// =============================================================================
// MOCK USER EMAIL (For development without auth)
// =============================================================================

const MOCK_USER_EMAIL = 'demo@swipestudy.app';

// =============================================================================
// STATUS ICON COMPONENT
// =============================================================================

function StatusIcon({ status, onClick }: { status: ItemStatus; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
        >
            {status === 'DONE' && (
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            )}
            {status === 'IN_PROGRESS' && (
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                >
                    <Play className="w-5 h-5 text-amber-400" />
                </motion.div>
            )}
            {status === 'TODO' && (
                <Circle className="w-6 h-6 text-white/30" />
            )}
        </button>
    );
}

// =============================================================================
// PLAYLIST ITEM COMPONENT
// =============================================================================

interface PlaylistItemCardProps {
    item: PlaylistItemWithWeek;
    isLast: boolean;
    onStatusChange: (itemId: string, status: ItemStatus) => void;
}

function PlaylistItemCard({ item, isLast, onStatusChange }: PlaylistItemCardProps) {
    const resource = item.resource;
    if (!resource) return null;

    const cycleStatus = () => {
        const statusOrder: ItemStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];
        const currentIndex = statusOrder.indexOf(item.status);
        const nextStatus = statusOrder[(currentIndex + 1) % 3];
        onStatusChange(item.id, nextStatus);
    };

    return (
        <div className="relative flex gap-4">
            {/* Timeline line */}
            {!isLast && (
                <div className="absolute left-4 top-10 w-0.5 h-full bg-gradient-to-b from-white/20 to-transparent" />
            )}

            {/* Status indicator */}
            <div className="relative z-10">
                <StatusIcon status={item.status} onClick={cycleStatus} />
            </div>

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex-1 p-4 rounded-2xl bg-white/5 border transition-all ${item.status === 'DONE'
                    ? 'border-emerald-500/30 opacity-60'
                    : item.status === 'IN_PROGRESS'
                        ? 'border-amber-500/30'
                        : 'border-white/10'
                    }`}
            >
                <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                >
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <h3 className={`font-medium text-sm leading-tight group-hover:text-violet-400 transition-colors ${item.status === 'DONE' ? 'line-through text-white/50' : 'text-white'
                                }`}>
                                {resource.title}
                            </h3>
                            <div className="flex items-center gap-3 mt-2 text-xs text-white/40">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {resource.durationMinutes || 15} min
                                </span>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] ${resource.difficulty === 'BEGINNER' ? 'bg-emerald-500/20 text-emerald-400' :
                                    resource.difficulty === 'INTERMEDIATE' ? 'bg-amber-500/20 text-amber-400' :
                                        'bg-rose-500/20 text-rose-400'
                                    }`}>
                                    {resource.difficulty}
                                </span>
                            </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-white/20 group-hover:text-violet-400 transition-colors flex-shrink-0" />
                    </div>
                </a>
            </motion.div>
        </div>
    );
}

// =============================================================================
// WEEK GROUP COMPONENT
// =============================================================================

interface WeekGroupProps {
    weekNumber: number;
    items: PlaylistItemWithWeek[];
    onStatusChange: (itemId: string, status: ItemStatus) => void;
}

function WeekGroup({ weekNumber, items, onStatusChange }: WeekGroupProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const completedCount = items.filter(i => i.status === 'DONE').length;
    const totalDuration = items.reduce((sum, i) => sum + (i.resource?.durationMinutes || 15), 0);

    return (
        <div className="mb-8">
            {/* Week Header */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10 mb-4 group hover:bg-white/10 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gradient">Week {weekNumber}</span>
                    <span className="text-xs text-white/40">
                        {completedCount}/{items.length} completed • {totalDuration} min
                    </span>
                </div>
                <motion.div
                    animate={{ rotate: isCollapsed ? -90 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className="w-5 h-5 text-white/40 group-hover:text-white/60" />
                </motion.div>
            </button>

            {/* Items */}
            <AnimatePresence>
                {!isCollapsed && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-3 pl-2"
                    >
                        {items.map((item, index) => (
                            <PlaylistItemCard
                                key={item.id}
                                item={item}
                                isLast={index === items.length - 1}
                                onStatusChange={onStatusChange}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// =============================================================================
// MAIN PLAYLIST PAGE
// =============================================================================

export default function PlaylistPage() {
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    const [items, setItems] = useState<PlaylistItem[]>([]);
    const [weeklyHours, setWeeklyHoursState] = useState(5);
    const [isLoading, setIsLoading] = useState(true);
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        async function loadPlaylist() {
            try {
                setIsLoading(true);
                // Get user first
                const user = await getOrCreateUser(MOCK_USER_EMAIL);
                setUserId(user.id);
                setWeeklyHoursState(user.weeklyHours);
                // Load playlist
                const playlist = await getUserPlaylist(user.id);
                if (playlist) {
                    setItems(playlist.items);
                }
            } catch (error) {
                console.error('Failed to load playlist:', error);
            } finally {
                setIsLoading(false);
            }
        }

        loadPlaylist();
    }, []);

    // Calculate weeks dynamically - this is the key feature!
    const itemsWithWeeks = useMemo(() => {
        const weeklyMinutes = weeklyHours * 60;
        return calculateWeeksForPlaylist(items, weeklyMinutes);
    }, [items, weeklyHours]);

    // Group items by week
    const groupedByWeek = useMemo(() => {
        const groups: Map<number, PlaylistItemWithWeek[]> = new Map();
        itemsWithWeeks.forEach(item => {
            const existing = groups.get(item.weekNumber) || [];
            groups.set(item.weekNumber, [...existing, item]);
        });
        return Array.from(groups.entries()).sort((a, b) => a[0] - b[0]);
    }, [itemsWithWeeks]);

    const handleStatusChange = useCallback(async (itemId: string, status: ItemStatus) => {
        // Optimistic update
        setItems(prev => prev.map(item =>
            item.id === itemId ? { ...item, status } : item
        ));

        // Persist to DB
        await updatePlaylistItemStatus(itemId, status);
    }, []);

    const handleWeeklyHoursChange = useCallback(async (hours: number) => {
        setWeeklyHoursState(hours);
        if (userId) {
            await updateWeeklyHours(userId, hours);
        }
    }, [userId]);

    // Loading state
    if (isLoading) {
        return (
            <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white/50">Loading your learning path...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#0a0a0f]">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
                <div className="px-6 pt-safe-top py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.push('/feed')}
                                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-white/70" />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-white">My Learning Path</h1>
                                <p className="text-xs text-white/40">
                                    {items.length} resources • {groupedByWeek.length} weeks
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${showSettings ? 'bg-violet-500/20 text-violet-400' : 'bg-white/5 text-white/70 hover:bg-white/10'
                                }`}
                        >
                            <Settings2 className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Settings Panel */}
                    <AnimatePresence>
                        {showSettings && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10"
                            >
                                <label className="block text-sm text-white/70 mb-2">
                                    Weekly commitment: <span className="text-white font-semibold">{weeklyHours} hours</span>
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="20"
                                    value={weeklyHours}
                                    onChange={(e) => handleWeeklyHoursChange(parseInt(e.target.value))}
                                    className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-5
                    [&::-webkit-slider-thumb]:h-5
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-violet-500
                    [&::-webkit-slider-thumb]:cursor-pointer
                  "
                                />
                                <p className="text-xs text-white/30 mt-2">
                                    Adjust to see how your schedule changes in real-time
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </header>

            {/* Content */}
            <div className="px-6 py-6 pb-safe-bottom">
                {items.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                            <span className="text-4xl">📚</span>
                        </div>
                        <p className="text-white/70 text-lg font-medium mb-2">No items yet</p>
                        <p className="text-white/40 text-sm mb-6">
                            Swipe right on resources to add them here
                        </p>
                        <button
                            onClick={() => router.push('/feed')}
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-medium"
                        >
                            Start Swiping
                        </button>
                    </div>
                ) : (
                    <div>
                        {groupedByWeek.map(([weekNumber, weekItems]) => (
                            <WeekGroup
                                key={weekNumber}
                                weekNumber={weekNumber}
                                items={weekItems}
                                onStatusChange={handleStatusChange}
                            />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
