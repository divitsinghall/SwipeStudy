'use client';

import { motion, useMotionValue, useTransform, useAnimation, PanInfo } from 'framer-motion';
import { useCallback, useState } from 'react';
import { Github, Youtube, Clock, Star } from 'lucide-react';
import { Resource, DEFAULT_SWIPE_PHYSICS, SwipePhysicsConfig, isVideoResource, isRepoResource } from '@/types';

// =============================================================================
// TYPES
// =============================================================================

export interface SwipeCardProps {
    resource: Resource;
    onSwipe: (direction: 'left' | 'right') => void;
    onSave?: () => void;
    isActive?: boolean;
    physics?: Partial<SwipePhysicsConfig>;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function SwipeCard({
    resource,
    onSwipe,
    isActive = false,
    physics: customPhysics,
}: SwipeCardProps) {
    const config = { ...DEFAULT_SWIPE_PHYSICS, ...customPhysics };

    // Motion values for finger-tracking
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Used to track if we're currently dragging (for visual states)
    const [, setIsDragging] = useState(false);

    // Animation controls for programmatic animations
    const controls = useAnimation();

    // ==========================================================================
    // TRANSFORMS
    // ==========================================================================

    // Rotation: max ±15 degrees based on x position
    const rotate = useTransform(x, [-300, 0, 300], [-15, 0, 15]);

    // Opacity for directional glow effects
    const rightGlowOpacity = useTransform(
        x,
        [0, config.glowThreshold, config.distanceThreshold],
        [0, 0.3, 0.8]
    );
    const leftGlowOpacity = useTransform(
        x,
        [-config.distanceThreshold, -config.glowThreshold, 0],
        [0.8, 0.3, 0]
    );

    // Scale down slightly when dragging for depth effect
    const scale = useTransform(
        x,
        [-config.distanceThreshold, 0, config.distanceThreshold],
        [0.98, 1, 0.98]
    );

    // Shadow blur increases as card lifts
    const shadowBlur = useTransform(
        x,
        [-config.distanceThreshold, 0, config.distanceThreshold],
        [40, 20, 40]
    );

    // ==========================================================================
    // HANDLERS
    // ==========================================================================

    const handleDragStart = useCallback(() => {
        setIsDragging(true);
    }, []);

    const handleDragEnd = useCallback(
        (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
            setIsDragging(false);

            const { offset, velocity } = info;
            const absX = Math.abs(offset.x);
            const absVelocityX = Math.abs(velocity.x);

            // Velocity-based swipe detection (flick)
            const isFlick = absVelocityX > config.velocityThreshold;

            // Distance-based swipe detection (drag)
            const isDrag = absX > config.distanceThreshold;

            if (isFlick || isDrag) {
                // Determine direction
                const direction = offset.x > 0 ? 'right' : 'left';

                // Animate card flying off screen
                const flyOut = direction === 'right' ? 500 : -500;
                controls.start({
                    x: flyOut,
                    y: offset.y,
                    opacity: 0,
                    transition: {
                        duration: 0.3,
                        ease: 'easeOut',
                    },
                }).then(() => {
                    onSwipe(direction);
                });
            } else {
                // Rubber-band back to center
                controls.start({
                    x: 0,
                    y: 0,
                    transition: {
                        type: 'spring',
                        stiffness: config.stiffness,
                        damping: config.damping,
                    },
                });
            }
        },
        [controls, onSwipe, config]
    );

    // ==========================================================================
    // RENDER HELPERS
    // ==========================================================================

    const renderSourceIcon = () => {
        if (resource.type === 'VIDEO') {
            return (
                <div className="flex items-center gap-1.5 text-red-400">
                    <Youtube className="w-4 h-4" />
                    <span className="text-xs font-medium">YouTube</span>
                </div>
            );
        }
        return (
            <div className="flex items-center gap-1.5 text-purple-400">
                <Github className="w-4 h-4" />
                <span className="text-xs font-medium">GitHub</span>
            </div>
        );
    };

    const renderMetadata = () => {
        if (isVideoResource(resource)) {
            return (
                <div className="flex items-center gap-3 text-white/60 text-sm">
                    <span>{resource.metadata.channelName}</span>
                    {resource.metadata.viewCount && (
                        <span>{formatViewCount(resource.metadata.viewCount)} views</span>
                    )}
                </div>
            );
        }
        if (isRepoResource(resource)) {
            return (
                <div className="flex items-center gap-3 text-white/60 text-sm">
                    <span>{resource.metadata.owner}</span>
                    {resource.metadata.stars && (
                        <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-yellow-400" />
                            <span>{formatStarCount(resource.metadata.stars)}</span>
                        </div>
                    )}
                    {resource.metadata.language && (
                        <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs">
                            {resource.metadata.language}
                        </span>
                    )}
                </div>
            );
        }
        return null;
    };

    const renderDescription = () => {
        const description = isVideoResource(resource)
            ? resource.metadata.description
            : isRepoResource(resource)
                ? resource.metadata.description
                : null;

        if (!description) return null;

        return (
            <p className="text-white/50 text-sm line-clamp-2 leading-relaxed">
                {description}
            </p>
        );
    };

    // ==========================================================================
    // RENDER
    // ==========================================================================

    return (
        <motion.div
            className="absolute inset-0 touch-none cursor-grab active:cursor-grabbing"
            style={{
                x,
                y,
                rotate,
                scale,
                // GPU acceleration hint (only for active card)
                willChange: isActive ? 'transform' : 'auto',
            }}
            animate={controls}
            drag={isActive}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.7}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            whileTap={{ cursor: 'grabbing' }}
        >
            {/* Card Container */}
            <div className="relative w-full h-full rounded-[28px] overflow-hidden">
                {/* Glassmorphism Background */}
                <div
                    className="absolute inset-0 bg-gradient-to-br from-white/[0.12] to-white/[0.05] backdrop-blur-xl"
                    style={{
                        boxShadow: `0 ${shadowBlur.get()}px ${shadowBlur.get() * 2}px rgba(0, 0, 0, 0.4)`,
                    }}
                />

                {/* Border Glow */}
                <div className="absolute inset-0 rounded-[28px] border border-white/[0.15]" />

                {/* Right Swipe Glow (Green) */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-l from-emerald-500/40 via-emerald-500/10 to-transparent pointer-events-none rounded-[28px]"
                    style={{ opacity: rightGlowOpacity }}
                />

                {/* Left Swipe Glow (Red) */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-rose-500/40 via-rose-500/10 to-transparent pointer-events-none rounded-[28px]"
                    style={{ opacity: leftGlowOpacity }}
                />

                {/* Thumbnail Section (Top 55%) */}
                <div className="relative h-[55%] w-full overflow-hidden">
                    {resource.thumbnailUrl ? (
                        <img
                            src={resource.thumbnailUrl}
                            alt={resource.title}
                            className="w-full h-full object-cover"
                            draggable={false}
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                            {resource.type === 'VIDEO' ? (
                                <Youtube className="w-16 h-16 text-white/20" />
                            ) : (
                                <Github className="w-16 h-16 text-white/20" />
                            )}
                        </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Duration Badge (for videos) */}
                    {resource.duration && (
                        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-white/80" />
                            <span className="text-xs font-medium text-white/90">{resource.duration}</span>
                        </div>
                    )}

                    {/* Quality Score Badge */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
                        <span className="text-xs font-semibold text-white/90">
                            ★ {resource.qualityScore.toFixed(1)}
                        </span>
                    </div>
                </div>

                {/* Content Section (Bottom 45%) */}
                <div className="relative h-[45%] p-5 flex flex-col gap-3">
                    {/* Source Icon */}
                    {renderSourceIcon()}

                    {/* Title */}
                    <h2 className="text-xl font-bold text-white leading-tight line-clamp-2">
                        {resource.title}
                    </h2>

                    {/* Metadata */}
                    {renderMetadata()}

                    {/* Description */}
                    {renderDescription()}

                    {/* Action Hint */}
                    <div className="mt-auto flex items-center justify-center gap-6 text-white/30 text-xs">
                        <span className="flex items-center gap-1">
                            <span className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center">←</span>
                            Skip
                        </span>
                        <span className="flex items-center gap-1">
                            Save
                            <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">→</span>
                        </span>
                    </div>
                </div>

                {/* Swipe Direction Indicators */}
                <motion.div
                    className="absolute top-1/2 left-6 -translate-y-1/2 px-4 py-2 rounded-xl bg-rose-500 text-white font-bold text-lg rotate-[-15deg] border-4 border-white shadow-lg"
                    style={{ opacity: leftGlowOpacity }}
                >
                    SKIP
                </motion.div>

                <motion.div
                    className="absolute top-1/2 right-6 -translate-y-1/2 px-4 py-2 rounded-xl bg-emerald-500 text-white font-bold text-lg rotate-[15deg] border-4 border-white shadow-lg"
                    style={{ opacity: rightGlowOpacity }}
                >
                    SAVE
                </motion.div>
            </div>
        </motion.div>
    );
}

// =============================================================================
// UTILITIES
// =============================================================================

function formatViewCount(count: number): string {
    if (count >= 1000000) {
        return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
        return `${(count / 1000).toFixed(0)}K`;
    }
    return count.toString();
}

function formatStarCount(count: number): string {
    if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
}

export default SwipeCard;
