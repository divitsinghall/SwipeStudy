'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getOrCreateUser } from '@/actions/onboarding';
import { Loader2 } from 'lucide-react';

// =============================================================================
// MOCK USER (For development without auth)
// =============================================================================

const MOCK_USER_EMAIL = 'demo@swipestudy.app';

// =============================================================================
// HOME PAGE - ROUTING LOGIC
// =============================================================================

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        async function checkUserStatus() {
            try {
                const user = await getOrCreateUser(MOCK_USER_EMAIL);

                if (user.onboardingCompleted) {
                    router.replace('/feed');
                } else {
                    router.replace('/onboarding');
                }
            } catch (error) {
                console.error('Failed to check user status:', error);
                // Default to onboarding on error
                router.replace('/onboarding');
            }
        }

        checkUserStatus();
    }, [router]);

    // Show loading while determining redirect
    return (
        <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
            <div className="text-center">
                <div className="relative mb-6">
                    <Loader2 className="w-12 h-12 text-violet-400 animate-spin mx-auto" />
                    <div className="absolute inset-0 w-12 h-12 mx-auto rounded-full bg-violet-500/20 blur-xl" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">
                    Swipe<span className="text-gradient">Study</span>
                </h1>
                <p className="text-white/40">Loading your experience...</p>
            </div>
        </main>
    );
}
