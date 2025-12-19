'use client';

import { SwipeDeck } from '@/components/swipe-deck';
import { Resource } from '@/types';

// =============================================================================
// MOCK DATA (For development without database)
// =============================================================================

const MOCK_RESOURCES: Resource[] = [
    {
        id: '1',
        title: 'System Design Interview: A Step-By-Step Guide',
        type: 'VIDEO',
        url: 'https://www.youtube.com/watch?v=i7twT3x5yv8',
        thumbnailUrl: 'https://img.youtube.com/vi/i7twT3x5yv8/maxresdefault.jpg',
        duration: '35:22',
        metadata: {
            channelName: 'ByteByteGo',
            viewCount: 2500000,
            description: 'Learn the fundamentals of system design interviews with real examples.',
        },
        qualityScore: 9.5,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '2',
        title: 'Designing Instagram: System Design Interview',
        type: 'VIDEO',
        url: 'https://www.youtube.com/watch?v=QmX2NPkJTKg',
        thumbnailUrl: 'https://img.youtube.com/vi/QmX2NPkJTKg/maxresdefault.jpg',
        duration: '28:15',
        metadata: {
            channelName: 'Gaurav Sen',
            viewCount: 1800000,
            description: 'Complete walkthrough of designing Instagram from scratch.',
        },
        qualityScore: 9.2,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '3',
        title: 'system-design-primer',
        type: 'REPO',
        url: 'https://github.com/donnemartin/system-design-primer',
        thumbnailUrl: 'https://opengraph.githubassets.com/1/donnemartin/system-design-primer',
        duration: null,
        metadata: {
            owner: 'donnemartin',
            stars: 245000,
            language: 'Python',
            description: 'Learn how to design large-scale systems. Prep for the system design interview.',
        },
        qualityScore: 9.8,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '4',
        title: 'How Discord Stores Trillions of Messages',
        type: 'VIDEO',
        url: 'https://www.youtube.com/watch?v=O3PwuzCvAjI',
        thumbnailUrl: 'https://img.youtube.com/vi/O3PwuzCvAjI/maxresdefault.jpg',
        duration: '18:42',
        metadata: {
            channelName: 'ByteByteGo',
            viewCount: 1200000,
            description: "Deep dive into Discord's database architecture and scaling strategies.",
        },
        qualityScore: 9.0,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '5',
        title: 'system-design-101',
        type: 'REPO',
        url: 'https://github.com/ByteByteGoHq/system-design-101',
        thumbnailUrl: 'https://opengraph.githubassets.com/1/ByteByteGoHq/system-design-101',
        duration: null,
        metadata: {
            owner: 'ByteByteGoHq',
            stars: 58000,
            language: 'Markdown',
            description: 'Explain complex systems using visuals and simple terms.',
        },
        qualityScore: 9.5,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '6',
        title: 'Distributed Systems in One Lesson',
        type: 'VIDEO',
        url: 'https://www.youtube.com/watch?v=Y6Ev8GIlbxc',
        thumbnailUrl: 'https://img.youtube.com/vi/Y6Ev8GIlbxc/maxresdefault.jpg',
        duration: '45:00',
        metadata: {
            channelName: 'GOTO Conferences',
            viewCount: 980000,
            description: 'Tim Berglund explains distributed systems concepts clearly.',
        },
        qualityScore: 8.8,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '7',
        title: 'awesome-scalability',
        type: 'REPO',
        url: 'https://github.com/binhnguyennus/awesome-scalability',
        thumbnailUrl: 'https://opengraph.githubassets.com/1/binhnguyennus/awesome-scalability',
        duration: null,
        metadata: {
            owner: 'binhnguyennus',
            stars: 52000,
            language: 'Markdown',
            description: 'The Patterns of Scalable, Reliable, and Performant Large-Scale Systems.',
        },
        qualityScore: 9.3,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '8',
        title: 'Design a URL Shortener (System Design Interview)',
        type: 'VIDEO',
        url: 'https://www.youtube.com/watch?v=fMZMm_0ZhK4',
        thumbnailUrl: 'https://img.youtube.com/vi/fMZMm_0ZhK4/maxresdefault.jpg',
        duration: '22:30',
        metadata: {
            channelName: 'Exponent',
            viewCount: 750000,
            description: 'Step-by-step design of TinyURL with scalability considerations.',
        },
        qualityScore: 8.5,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '9',
        title: 'kubernetes',
        type: 'REPO',
        url: 'https://github.com/kubernetes/kubernetes',
        thumbnailUrl: 'https://opengraph.githubassets.com/1/kubernetes/kubernetes',
        duration: null,
        metadata: {
            owner: 'kubernetes',
            stars: 105000,
            language: 'Go',
            description: 'Production-Grade Container Scheduling and Management.',
        },
        qualityScore: 9.2,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '10',
        title: 'CAP Theorem Simplified',
        type: 'VIDEO',
        url: 'https://www.youtube.com/watch?v=BHqjEjzAicg',
        thumbnailUrl: 'https://img.youtube.com/vi/BHqjEjzAicg/maxresdefault.jpg',
        duration: '15:18',
        metadata: {
            channelName: 'Hussein Nasser',
            viewCount: 620000,
            description: 'Understanding CAP theorem with practical examples.',
        },
        qualityScore: 8.3,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

// =============================================================================
// HOME PAGE
// =============================================================================

export default function Home() {
    const handleSwipe = (resource: Resource, direction: 'left' | 'right') => {
        console.log(`[Home] Swiped ${direction} on: ${resource.title}`);
        // In production, this would call the recordSwipe server action
    };

    const handleEmpty = () => {
        console.log('[Home] All cards reviewed!');
        // In production, this could trigger a refresh or show a completion screen
    };

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
                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                        <span className="text-lg">📚</span>
                    </div>
                </div>
            </header>

            {/* Card Deck */}
            <div className="flex-1 px-4 pb-8 min-h-0">
                <div className="h-full max-h-[680px] mx-auto">
                    <SwipeDeck
                        initialResources={MOCK_RESOURCES}
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
        </main>
    );
}
