'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Sparkles, Check } from 'lucide-react';
import { completeOnboarding, getOrCreateUser } from '@/actions/onboarding';
import { AVAILABLE_TOPICS, LEVEL_LABELS, Difficulty, OnboardingData } from '@/types';

// =============================================================================
// MOCK USER EMAIL (For development without auth)
// =============================================================================

const MOCK_USER_EMAIL = 'demo@swipestudy.app';

// =============================================================================
// ANIMATION VARIANTS
// =============================================================================

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 300 : -300,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => ({
        x: direction < 0 ? 300 : -300,
        opacity: 0,
    }),
};

const transition = {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
};

// =============================================================================
// STEP COMPONENTS
// =============================================================================

interface TopicSelectionProps {
    selected: string[];
    onToggle: (topic: string) => void;
}

function TopicSelection({ selected, onToggle }: TopicSelectionProps) {
    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">
                    What do you want to master?
                </h2>
                <p className="text-white/50">Select one or more topics</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {AVAILABLE_TOPICS.map((topic) => {
                    const isSelected = selected.includes(topic);
                    return (
                        <motion.button
                            key={topic}
                            onClick={() => onToggle(topic)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`
                relative p-6 rounded-2xl border-2 transition-all duration-300
                ${isSelected
                                    ? 'bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border-violet-400'
                                    : 'bg-white/5 border-white/10 hover:border-white/20'
                                }
              `}
                        >
                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-3 right-3 w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center"
                                >
                                    <Check className="w-4 h-4 text-white" />
                                </motion.div>
                            )}
                            <span className={`text-lg font-semibold ${isSelected ? 'text-white' : 'text-white/70'}`}>
                                {topic}
                            </span>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}

interface LevelSelectionProps {
    selected: Difficulty | null;
    onSelect: (level: Difficulty) => void;
}

function LevelSelection({ selected, onSelect }: LevelSelectionProps) {
    const levels: Difficulty[] = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
    const icons = ['🌱', '🔨', '⚡'];

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">
                    What&apos;s your current level?
                </h2>
                <p className="text-white/50">We&apos;ll tailor content accordingly</p>
            </div>

            <div className="space-y-4">
                {levels.map((level, index) => {
                    const isSelected = selected === level;
                    const labelInfo = LEVEL_LABELS[level];

                    return (
                        <motion.button
                            key={level}
                            onClick={() => onSelect(level)}
                            whileHover={{ scale: 1.01, x: 4 }}
                            whileTap={{ scale: 0.99 }}
                            className={`
                w-full p-5 rounded-2xl border-2 text-left transition-all duration-300 flex items-center gap-4
                ${isSelected
                                    ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-400'
                                    : 'bg-white/5 border-white/10 hover:border-white/20'
                                }
              `}
                        >
                            <span className="text-3xl">{icons[index]}</span>
                            <div>
                                <div className={`text-lg font-semibold ${isSelected ? 'text-white' : 'text-white/70'}`}>
                                    {labelInfo.label}
                                </div>
                                <div className="text-sm text-white/40">{labelInfo.description}</div>
                            </div>
                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="ml-auto w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center"
                                >
                                    <Check className="w-4 h-4 text-white" />
                                </motion.div>
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}

interface CommitmentSliderProps {
    value: number;
    onChange: (value: number) => void;
}

function CommitmentSlider({ value, onChange }: CommitmentSliderProps) {
    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">
                    Weekly commitment
                </h2>
                <p className="text-white/50">How much time can you dedicate?</p>
            </div>

            <div className="space-y-8">
                <div className="text-center">
                    <motion.div
                        key={value}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-6xl font-bold text-gradient"
                    >
                        {value}
                    </motion.div>
                    <div className="text-white/50 text-lg mt-2">hours per week</div>
                </div>

                <div className="px-4">
                    <input
                        type="range"
                        min="1"
                        max="20"
                        value={value}
                        onChange={(e) => onChange(parseInt(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-6
              [&::-webkit-slider-thumb]:h-6
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-gradient-to-r
              [&::-webkit-slider-thumb]:from-violet-500
              [&::-webkit-slider-thumb]:to-fuchsia-500
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:shadow-violet-500/50
              [&::-webkit-slider-thumb]:transition-transform
              [&::-webkit-slider-thumb]:hover:scale-110
            "
                    />
                    <div className="flex justify-between text-sm text-white/30 mt-2">
                        <span>1 hr</span>
                        <span>10 hrs</span>
                        <span>20 hrs</span>
                    </div>
                </div>

                <div className="text-center text-white/40 text-sm">
                    {value <= 3 && "Perfect for busy schedules"}
                    {value > 3 && value <= 7 && "A solid learning pace"}
                    {value > 7 && value <= 12 && "Serious commitment!"}
                    {value > 12 && "Full learning mode activated 🚀"}
                </div>
            </div>
        </div>
    );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function OnboardingPage() {
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [step, setStep] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [selectedLevel, setSelectedLevel] = useState<Difficulty | null>(null);
    const [weeklyHours, setWeeklyHours] = useState(5);

    const totalSteps = 3;
    const progress = ((step + 1) / totalSteps) * 100;

    // Fetch user on mount
    useEffect(() => {
        async function loadUser() {
            try {
                const user = await getOrCreateUser(MOCK_USER_EMAIL);
                setUserId(user.id);
            } catch (error) {
                console.error('Failed to load user:', error);
            } finally {
                setIsLoadingUser(false);
            }
        }
        loadUser();
    }, []);

    const canProceed = () => {
        if (isLoadingUser || !userId) return false;
        if (step === 0) return selectedTopics.length > 0;
        if (step === 1) return selectedLevel !== null;
        if (step === 2) return weeklyHours >= 1;
        return false;
    };

    const handleNext = useCallback(async () => {
        if (step < totalSteps - 1) {
            setDirection(1);
            setStep((s) => s + 1);
        } else {
            // Submit onboarding
            if (!userId) {
                console.error('No user ID available');
                return;
            }
            setIsSubmitting(true);
            try {
                const data: OnboardingData = {
                    goals: selectedTopics,
                    level: selectedLevel!,
                    weeklyHours,
                };
                const result = await completeOnboarding(userId, data);
                if (result.success) {
                    router.push('/feed');
                } else {
                    console.error('Failed to complete onboarding:', result.error);
                }
            } catch (error) {
                console.error('Onboarding error:', error);
            } finally {
                setIsSubmitting(false);
            }
        }
    }, [step, selectedTopics, selectedLevel, weeklyHours, router, userId]);

    const handleBack = useCallback(() => {
        if (step > 0) {
            setDirection(-1);
            setStep((s) => s - 1);
        }
    }, [step]);

    const toggleTopic = useCallback((topic: string) => {
        setSelectedTopics((prev) =>
            prev.includes(topic)
                ? prev.filter((t) => t !== topic)
                : [...prev, topic]
        );
    }, []);

    return (
        <main className="min-h-screen bg-[#0a0a0f] flex flex-col">
            {/* Progress Bar */}
            <div className="fixed top-0 left-0 right-0 z-50 px-6 pt-safe-top py-4">
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                </div>
                <div className="flex justify-between mt-2">
                    <span className="text-xs text-white/30">Step {step + 1} of {totalSteps}</span>
                    <span className="text-xs text-white/30">{Math.round(progress)}% complete</span>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex items-center justify-center px-6 py-24">
                <div className="w-full max-w-md">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={step}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={transition}
                        >
                            {step === 0 && (
                                <TopicSelection
                                    selected={selectedTopics}
                                    onToggle={toggleTopic}
                                />
                            )}
                            {step === 1 && (
                                <LevelSelection
                                    selected={selectedLevel}
                                    onSelect={setSelectedLevel}
                                />
                            )}
                            {step === 2 && (
                                <CommitmentSlider
                                    value={weeklyHours}
                                    onChange={setWeeklyHours}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Navigation */}
            <div className="fixed bottom-0 left-0 right-0 px-6 pb-safe-bottom py-6 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f] to-transparent">
                <div className="flex gap-4 max-w-md mx-auto">
                    {step > 0 && (
                        <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={handleBack}
                            className="flex-1 py-4 px-6 rounded-2xl bg-white/5 border border-white/10 text-white/70 font-medium flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Back
                        </motion.button>
                    )}
                    <motion.button
                        onClick={handleNext}
                        disabled={!canProceed() || isSubmitting}
                        whileHover={canProceed() ? { scale: 1.02 } : {}}
                        whileTap={canProceed() ? { scale: 0.98 } : {}}
                        className={`
              flex-1 py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-300
              ${canProceed()
                                ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40'
                                : 'bg-white/5 text-white/30 cursor-not-allowed'
                            }
            `}
                    >
                        {isSubmitting ? (
                            <>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                >
                                    <Sparkles className="w-5 h-5" />
                                </motion.div>
                                Setting up...
                            </>
                        ) : step === totalSteps - 1 ? (
                            <>
                                <Sparkles className="w-5 h-5" />
                                Start Learning
                            </>
                        ) : (
                            <>
                                Continue
                                <ChevronRight className="w-5 h-5" />
                            </>
                        )}
                    </motion.button>
                </div>
            </div>
        </main>
    );
}
