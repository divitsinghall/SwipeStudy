'use server';

import { Resource, Difficulty } from '@/types';

// =============================================================================
// MOCK DATA - High-Fidelity Resource Generator
// =============================================================================

const MOCK_RESOURCES_BY_TOPIC: Record<string, Resource[]> = {
    React: [
        {
            id: 'react-001',
            title: 'Advanced React Patterns: Compound Components',
            type: 'VIDEO',
            url: 'https://www.youtube.com/watch?v=hEGg-3pIHlE',
            thumbnailUrl: 'https://img.youtube.com/vi/hEGg-3pIHlE/maxresdefault.jpg',
            duration: '32:15',
            metadata: { channelName: 'Jack Herrington', viewCount: 450000, description: 'Master compound component patterns in React' },
            qualityScore: 9.2,
            tags: ['React', 'Patterns', 'Advanced'],
            difficulty: 'ADVANCED',
            durationMinutes: 32,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'react-002',
            title: 'React Server Components Deep Dive',
            type: 'VIDEO',
            url: 'https://www.youtube.com/watch?v=h_9Vx6kio2s',
            thumbnailUrl: 'https://img.youtube.com/vi/h_9Vx6kio2s/maxresdefault.jpg',
            duration: '45:30',
            metadata: { channelName: 'Theo', viewCount: 380000, description: 'Understanding RSC architecture' },
            qualityScore: 9.4,
            tags: ['React', 'RSC', 'Next.js'],
            difficulty: 'ADVANCED',
            durationMinutes: 45,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'react-003',
            title: 'React useEffect Explained for Beginners',
            type: 'VIDEO',
            url: 'https://www.youtube.com/watch?v=0ZJgIjIuY7U',
            thumbnailUrl: 'https://img.youtube.com/vi/0ZJgIjIuY7U/maxresdefault.jpg',
            duration: '18:45',
            metadata: { channelName: 'Web Dev Simplified', viewCount: 920000, description: 'Everything you need to know about useEffect' },
            qualityScore: 9.0,
            tags: ['React', 'Hooks', 'Beginner'],
            difficulty: 'BEGINNER',
            durationMinutes: 18,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'react-004',
            title: 'React State Management: Redux vs Zustand vs Jotai',
            type: 'VIDEO',
            url: 'https://www.youtube.com/watch?v=5-1LM2NySR0',
            thumbnailUrl: 'https://img.youtube.com/vi/5-1LM2NySR0/maxresdefault.jpg',
            duration: '28:10',
            metadata: { channelName: 'Fireship', viewCount: 650000, description: 'Comparing modern state management solutions' },
            qualityScore: 9.1,
            tags: ['React', 'State Management', 'Zustand'],
            difficulty: 'INTERMEDIATE',
            durationMinutes: 28,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'react-005',
            title: 'react-hook-form',
            type: 'REPO',
            url: 'https://github.com/react-hook-form/react-hook-form',
            thumbnailUrl: 'https://opengraph.githubassets.com/1/react-hook-form/react-hook-form',
            duration: null,
            metadata: { owner: 'react-hook-form', stars: 38000, language: 'TypeScript', description: 'Performant, flexible and extensible forms with easy-to-use validation' },
            qualityScore: 9.5,
            tags: ['React', 'Forms', 'Validation'],
            difficulty: 'INTERMEDIATE',
            durationMinutes: 45,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'react-006',
            title: 'Building Custom Hooks from Scratch',
            type: 'VIDEO',
            url: 'https://www.youtube.com/watch?v=J-g9ZJha8FE',
            thumbnailUrl: 'https://img.youtube.com/vi/J-g9ZJha8FE/maxresdefault.jpg',
            duration: '22:30',
            metadata: { channelName: 'Codevolution', viewCount: 280000, description: 'Learn to create reusable custom hooks' },
            qualityScore: 8.8,
            tags: ['React', 'Hooks', 'Custom Hooks'],
            difficulty: 'INTERMEDIATE',
            durationMinutes: 22,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'react-007',
            title: 'React Performance Optimization Techniques',
            type: 'VIDEO',
            url: 'https://www.youtube.com/watch?v=b2UMeJkFvGg',
            thumbnailUrl: 'https://img.youtube.com/vi/b2UMeJkFvGg/maxresdefault.jpg',
            duration: '35:00',
            metadata: { channelName: 'Ben Awad', viewCount: 220000, description: 'useMemo, useCallback, and React.memo explained' },
            qualityScore: 8.9,
            tags: ['React', 'Performance', 'Optimization'],
            difficulty: 'ADVANCED',
            durationMinutes: 35,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'react-008',
            title: 'tanstack-query',
            type: 'REPO',
            url: 'https://github.com/TanStack/query',
            thumbnailUrl: 'https://opengraph.githubassets.com/1/TanStack/query',
            duration: null,
            metadata: { owner: 'TanStack', stars: 38500, language: 'TypeScript', description: 'Powerful asynchronous state management for TS/JS' },
            qualityScore: 9.6,
            tags: ['React', 'Data Fetching', 'State'],
            difficulty: 'INTERMEDIATE',
            durationMinutes: 60,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'react-009',
            title: 'React Testing Library Complete Guide',
            type: 'VIDEO',
            url: 'https://www.youtube.com/watch?v=YQLn7ycfzEo',
            thumbnailUrl: 'https://img.youtube.com/vi/YQLn7ycfzEo/maxresdefault.jpg',
            duration: '40:15',
            metadata: { channelName: 'The Net Ninja', viewCount: 180000, description: 'Testing React components effectively' },
            qualityScore: 8.7,
            tags: ['React', 'Testing', 'RTL'],
            difficulty: 'INTERMEDIATE',
            durationMinutes: 40,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'react-010',
            title: 'React 19: What\'s New and Migration Guide',
            type: 'VIDEO',
            url: 'https://www.youtube.com/watch?v=AJOGzVygGcY',
            thumbnailUrl: 'https://img.youtube.com/vi/AJOGzVygGcY/maxresdefault.jpg',
            duration: '25:40',
            metadata: { channelName: 'Theo', viewCount: 520000, description: 'All the new features in React 19' },
            qualityScore: 9.3,
            tags: ['React', 'React 19', 'Migration'],
            difficulty: 'INTERMEDIATE',
            durationMinutes: 25,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'react-011',
            title: 'React for Absolute Beginners',
            type: 'VIDEO',
            url: 'https://www.youtube.com/watch?v=CgkZ7MvWUAA',
            thumbnailUrl: 'https://img.youtube.com/vi/CgkZ7MvWUAA/maxresdefault.jpg',
            duration: '55:00',
            metadata: { channelName: 'Traversy Media', viewCount: 1200000, description: 'Learn React from scratch in 2024' },
            qualityScore: 9.1,
            tags: ['React', 'Beginner', 'Tutorial'],
            difficulty: 'BEGINNER',
            durationMinutes: 55,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'react-012',
            title: 'zustand',
            type: 'REPO',
            url: 'https://github.com/pmndrs/zustand',
            thumbnailUrl: 'https://opengraph.githubassets.com/1/pmndrs/zustand',
            duration: null,
            metadata: { owner: 'pmndrs', stars: 42000, language: 'TypeScript', description: 'Bear necessities for state management in React' },
            qualityScore: 9.4,
            tags: ['React', 'State Management', 'Zustand'],
            difficulty: 'BEGINNER',
            durationMinutes: 30,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ],
    'System Design': [
        {
            id: 'sd-001',
            title: 'System Design Interview: A Step-By-Step Guide',
            type: 'VIDEO',
            url: 'https://www.youtube.com/watch?v=i7twT3x5yv8',
            thumbnailUrl: 'https://img.youtube.com/vi/i7twT3x5yv8/maxresdefault.jpg',
            duration: '35:22',
            metadata: { channelName: 'ByteByteGo', viewCount: 2500000, description: 'Learn the fundamentals of system design interviews' },
            qualityScore: 9.5,
            tags: ['System Design', 'Interview', 'Fundamentals'],
            difficulty: 'BEGINNER',
            durationMinutes: 35,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'sd-002',
            title: 'Designing Instagram: System Design Interview',
            type: 'VIDEO',
            url: 'https://www.youtube.com/watch?v=QmX2NPkJTKg',
            thumbnailUrl: 'https://img.youtube.com/vi/QmX2NPkJTKg/maxresdefault.jpg',
            duration: '28:15',
            metadata: { channelName: 'Gaurav Sen', viewCount: 1800000, description: 'Complete walkthrough of designing Instagram' },
            qualityScore: 9.2,
            tags: ['System Design', 'Instagram', 'Social Media'],
            difficulty: 'INTERMEDIATE',
            durationMinutes: 28,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'sd-003',
            title: 'system-design-primer',
            type: 'REPO',
            url: 'https://github.com/donnemartin/system-design-primer',
            thumbnailUrl: 'https://opengraph.githubassets.com/1/donnemartin/system-design-primer',
            duration: null,
            metadata: { owner: 'donnemartin', stars: 245000, language: 'Python', description: 'Learn to design large-scale systems' },
            qualityScore: 9.8,
            tags: ['System Design', 'Primer', 'Fundamentals'],
            difficulty: 'BEGINNER',
            durationMinutes: 120,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'sd-004',
            title: 'How Discord Stores Trillions of Messages',
            type: 'VIDEO',
            url: 'https://www.youtube.com/watch?v=O3PwuzCvAjI',
            thumbnailUrl: 'https://img.youtube.com/vi/O3PwuzCvAjI/maxresdefault.jpg',
            duration: '18:42',
            metadata: { channelName: 'ByteByteGo', viewCount: 1200000, description: 'Discord database architecture deep dive' },
            qualityScore: 9.0,
            tags: ['System Design', 'Discord', 'Database'],
            difficulty: 'ADVANCED',
            durationMinutes: 18,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'sd-005',
            title: 'Load Balancing: The Complete Guide',
            type: 'VIDEO',
            url: 'https://www.youtube.com/watch?v=sCR3SAVdyCc',
            thumbnailUrl: 'https://img.youtube.com/vi/sCR3SAVdyCc/maxresdefault.jpg',
            duration: '22:30',
            metadata: { channelName: 'Hussein Nasser', viewCount: 450000, description: 'Understanding load balancers and algorithms' },
            qualityScore: 8.9,
            tags: ['System Design', 'Load Balancing', 'Infrastructure'],
            difficulty: 'INTERMEDIATE',
            durationMinutes: 22,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'sd-006',
            title: 'CAP Theorem Simplified',
            type: 'VIDEO',
            url: 'https://www.youtube.com/watch?v=BHqjEjzAicg',
            thumbnailUrl: 'https://img.youtube.com/vi/BHqjEjzAicg/maxresdefault.jpg',
            duration: '15:18',
            metadata: { channelName: 'Hussein Nasser', viewCount: 620000, description: 'Understanding CAP theorem with examples' },
            qualityScore: 8.8,
            tags: ['System Design', 'CAP', 'Distributed Systems'],
            difficulty: 'BEGINNER',
            durationMinutes: 15,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'sd-007',
            title: 'Design a URL Shortener',
            type: 'VIDEO',
            url: 'https://www.youtube.com/watch?v=fMZMm_0ZhK4',
            thumbnailUrl: 'https://img.youtube.com/vi/fMZMm_0ZhK4/maxresdefault.jpg',
            duration: '22:30',
            metadata: { channelName: 'Exponent', viewCount: 750000, description: 'TinyURL design with scalability' },
            qualityScore: 8.5,
            tags: ['System Design', 'URL Shortener', 'Interview'],
            difficulty: 'INTERMEDIATE',
            durationMinutes: 22,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'sd-008',
            title: 'awesome-scalability',
            type: 'REPO',
            url: 'https://github.com/binhnguyennus/awesome-scalability',
            thumbnailUrl: 'https://opengraph.githubassets.com/1/binhnguyennus/awesome-scalability',
            duration: null,
            metadata: { owner: 'binhnguyennus', stars: 52000, language: 'Markdown', description: 'Patterns of scalable, reliable large-scale systems' },
            qualityScore: 9.3,
            tags: ['System Design', 'Scalability', 'Patterns'],
            difficulty: 'INTERMEDIATE',
            durationMinutes: 90,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'sd-009',
            title: 'Database Sharding Explained',
            type: 'VIDEO',
            url: 'https://www.youtube.com/watch?v=5faMjKuB9bc',
            thumbnailUrl: 'https://img.youtube.com/vi/5faMjKuB9bc/maxresdefault.jpg',
            duration: '19:45',
            metadata: { channelName: 'ByteByteGo', viewCount: 380000, description: 'When and how to shard your database' },
            qualityScore: 9.1,
            tags: ['System Design', 'Database', 'Sharding'],
            difficulty: 'ADVANCED',
            durationMinutes: 19,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'sd-010',
            title: 'Designing Twitter',
            type: 'VIDEO',
            url: 'https://www.youtube.com/watch?v=wYk0xPP_P_8',
            thumbnailUrl: 'https://img.youtube.com/vi/wYk0xPP_P_8/maxresdefault.jpg',
            duration: '32:00',
            metadata: { channelName: 'Gaurav Sen', viewCount: 980000, description: 'Complete Twitter system design walkthrough' },
            qualityScore: 9.2,
            tags: ['System Design', 'Twitter', 'Social Media'],
            difficulty: 'INTERMEDIATE',
            durationMinutes: 32,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'sd-011',
            title: 'Microservices vs Monolith: Which to Choose?',
            type: 'VIDEO',
            url: 'https://www.youtube.com/watch?v=qYhRvH9tJKw',
            thumbnailUrl: 'https://img.youtube.com/vi/qYhRvH9tJKw/maxresdefault.jpg',
            duration: '24:15',
            metadata: { channelName: 'Fireship', viewCount: 680000, description: 'The architecture decision that matters' },
            qualityScore: 9.0,
            tags: ['System Design', 'Microservices', 'Architecture'],
            difficulty: 'BEGINNER',
            durationMinutes: 24,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'sd-012',
            title: 'system-design-101',
            type: 'REPO',
            url: 'https://github.com/ByteByteGoHq/system-design-101',
            thumbnailUrl: 'https://opengraph.githubassets.com/1/ByteByteGoHq/system-design-101',
            duration: null,
            metadata: { owner: 'ByteByteGoHq', stars: 58000, language: 'Markdown', description: 'Explain complex systems using visuals' },
            qualityScore: 9.5,
            tags: ['System Design', 'Visuals', 'Fundamentals'],
            difficulty: 'BEGINNER',
            durationMinutes: 60,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ],
    Rust: [
        {
            id: 'rust-001',
            title: 'Rust for TypeScript Developers',
            type: 'VIDEO',
            url: 'https://www.youtube.com/watch?v=Z3xPIYHKSoI',
            thumbnailUrl: 'https://img.youtube.com/vi/Z3xPIYHKSoI/maxresdefault.jpg',
            duration: '42:30',
            metadata: { channelName: 'ThePrimeagen', viewCount: 320000, description: 'Learn Rust coming from TypeScript' },
            qualityScore: 9.3,
            tags: ['Rust', 'TypeScript', 'Beginner'],
            difficulty: 'BEGINNER',
            durationMinutes: 42,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'rust-002',
            title: 'Advanced Rust Concurrency Patterns',
            type: 'VIDEO',
            url: 'https://www.youtube.com/watch?v=rMGWeSjctlY',
            thumbnailUrl: 'https://img.youtube.com/vi/rMGWeSjctlY/maxresdefault.jpg',
            duration: '55:00',
            metadata: { channelName: 'Jon Gjengset', viewCount: 180000, description: 'Deep dive into async Rust' },
            qualityScore: 9.5,
            tags: ['Rust', 'Concurrency', 'Async'],
            difficulty: 'ADVANCED',
            durationMinutes: 55,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'rust-003',
            title: 'rustlings',
            type: 'REPO',
            url: 'https://github.com/rust-lang/rustlings',
            thumbnailUrl: 'https://opengraph.githubassets.com/1/rust-lang/rustlings',
            duration: null,
            metadata: { owner: 'rust-lang', stars: 48000, language: 'Rust', description: 'Small exercises to get you used to reading and writing Rust' },
            qualityScore: 9.6,
            tags: ['Rust', 'Exercises', 'Beginner'],
            difficulty: 'BEGINNER',
            durationMinutes: 180,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'rust-004',
            title: 'Understanding Ownership in Rust',
            type: 'VIDEO',
            url: 'https://www.youtube.com/watch?v=VFIOSWy93H0',
            thumbnailUrl: 'https://img.youtube.com/vi/VFIOSWy93H0/maxresdefault.jpg',
            duration: '28:15',
            metadata: { channelName: 'Let\'s Get Rusty', viewCount: 250000, description: 'Master Rust\'s ownership system' },
            qualityScore: 9.1,
            tags: ['Rust', 'Ownership', 'Borrowing'],
            difficulty: 'BEGINNER',
            durationMinutes: 28,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'rust-005',
            title: 'Zero-Cost Abstractions in Rust',
            type: 'VIDEO',
            url: 'https://www.youtube.com/watch?v=HiWkMFE8uOc',
            thumbnailUrl: 'https://img.youtube.com/vi/HiWkMFE8uOc/maxresdefault.jpg',
            duration: '38:00',
            metadata: { channelName: 'No Boilerplate', viewCount: 420000, description: 'How Rust achieves zero-cost abstractions' },
            qualityScore: 9.2,
            tags: ['Rust', 'Performance', 'Abstractions'],
            difficulty: 'INTERMEDIATE',
            durationMinutes: 38,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'rust-006',
            title: 'tokio',
            type: 'REPO',
            url: 'https://github.com/tokio-rs/tokio',
            thumbnailUrl: 'https://opengraph.githubassets.com/1/tokio-rs/tokio',
            duration: null,
            metadata: { owner: 'tokio-rs', stars: 24000, language: 'Rust', description: 'A runtime for writing reliable async applications' },
            qualityScore: 9.4,
            tags: ['Rust', 'Async', 'Runtime'],
            difficulty: 'INTERMEDIATE',
            durationMinutes: 120,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'rust-007',
            title: 'Building a CLI in Rust',
            type: 'VIDEO',
            url: 'https://www.youtube.com/watch?v=Bfr7HNuVB2c',
            thumbnailUrl: 'https://img.youtube.com/vi/Bfr7HNuVB2c/maxresdefault.jpg',
            duration: '35:45',
            metadata: { channelName: 'Dreams of Code', viewCount: 150000, description: 'Create production-ready CLI tools' },
            qualityScore: 8.9,
            tags: ['Rust', 'CLI', 'Tools'],
            difficulty: 'INTERMEDIATE',
            durationMinutes: 35,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'rust-008',
            title: 'Memory Safety Without Garbage Collection',
            type: 'VIDEO',
            url: 'https://www.youtube.com/watch?v=pbqBdHwQGSU',
            thumbnailUrl: 'https://img.youtube.com/vi/pbqBdHwQGSU/maxresdefault.jpg',
            duration: '45:00',
            metadata: { channelName: 'ThePrimeagen', viewCount: 280000, description: 'How Rust manages memory safely' },
            qualityScore: 9.0,
            tags: ['Rust', 'Memory', 'Safety'],
            difficulty: 'BEGINNER',
            durationMinutes: 45,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'rust-009',
            title: 'axum',
            type: 'REPO',
            url: 'https://github.com/tokio-rs/axum',
            thumbnailUrl: 'https://opengraph.githubassets.com/1/tokio-rs/axum',
            duration: null,
            metadata: { owner: 'tokio-rs', stars: 15000, language: 'Rust', description: 'Ergonomic and modular web framework' },
            qualityScore: 9.3,
            tags: ['Rust', 'Web', 'Framework'],
            difficulty: 'INTERMEDIATE',
            durationMinutes: 90,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'rust-010',
            title: 'Rust Lifetimes Clearly Explained',
            type: 'VIDEO',
            url: 'https://www.youtube.com/watch?v=juIINGuZyBc',
            thumbnailUrl: 'https://img.youtube.com/vi/juIINGuZyBc/maxresdefault.jpg',
            duration: '32:20',
            metadata: { channelName: 'Let\'s Get Rusty', viewCount: 220000, description: 'Finally understand lifetimes' },
            qualityScore: 9.1,
            tags: ['Rust', 'Lifetimes', 'Borrowing'],
            difficulty: 'INTERMEDIATE',
            durationMinutes: 32,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'rust-011',
            title: 'Unsafe Rust: When and How',
            type: 'VIDEO',
            url: 'https://www.youtube.com/watch?v=qAi2fHJ7BXQ',
            thumbnailUrl: 'https://img.youtube.com/vi/qAi2fHJ7BXQ/maxresdefault.jpg',
            duration: '48:30',
            metadata: { channelName: 'Jon Gjengset', viewCount: 95000, description: 'Using unsafe Rust responsibly' },
            qualityScore: 9.4,
            tags: ['Rust', 'Unsafe', 'Advanced'],
            difficulty: 'ADVANCED',
            durationMinutes: 48,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'rust-012',
            title: 'serde',
            type: 'REPO',
            url: 'https://github.com/serde-rs/serde',
            thumbnailUrl: 'https://opengraph.githubassets.com/1/serde-rs/serde',
            duration: null,
            metadata: { owner: 'serde-rs', stars: 8500, language: 'Rust', description: 'Serialization framework for Rust' },
            qualityScore: 9.5,
            tags: ['Rust', 'Serialization', 'JSON'],
            difficulty: 'BEGINNER',
            durationMinutes: 45,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ],
    'Algo Trading': [
        {
            id: 'algo-001',
            title: 'Algorithmic Trading Course for Beginners',
            type: 'VIDEO',
            url: 'https://www.youtube.com/watch?v=xfzGZB4HhEE',
            thumbnailUrl: 'https://img.youtube.com/vi/xfzGZB4HhEE/maxresdefault.jpg',
            duration: '65:00',
            metadata: { channelName: 'freeCodeCamp', viewCount: 1200000, description: 'Complete introduction to algo trading with Python' },
            qualityScore: 9.2,
            tags: ['Algo Trading', 'Python', 'Beginner'],
            difficulty: 'BEGINNER',
            durationMinutes: 65,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'algo-002',
            title: 'Building a Trading Bot in Python',
            type: 'VIDEO',
            url: 'https://www.youtube.com/watch?v=GdlFhF6gjKo',
            thumbnailUrl: 'https://img.youtube.com/vi/GdlFhF6gjKo/maxresdefault.jpg',
            duration: '48:30',
            metadata: { channelName: 'Part Time Larry', viewCount: 450000, description: 'Create your first trading bot' },
            qualityScore: 9.0,
            tags: ['Algo Trading', 'Python', 'Bot'],
            difficulty: 'INTERMEDIATE',
            durationMinutes: 48,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'algo-003',
            title: 'freqtrade',
            type: 'REPO',
            url: 'https://github.com/freqtrade/freqtrade',
            thumbnailUrl: 'https://opengraph.githubassets.com/1/freqtrade/freqtrade',
            duration: null,
            metadata: { owner: 'freqtrade', stars: 25000, language: 'Python', description: 'Free, open source crypto trading bot' },
            qualityScore: 9.4,
            tags: ['Algo Trading', 'Crypto', 'Bot'],
            difficulty: 'INTERMEDIATE',
            durationMinutes: 180,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'algo-004',
            title: 'Backtesting Strategies Like a Pro',
            type: 'VIDEO',
            url: 'https://www.youtube.com/watch?v=1-I_2bVnYxI',
            thumbnailUrl: 'https://img.youtube.com/vi/1-I_2bVnYxI/maxresdefault.jpg',
            duration: '38:15',
            metadata: { channelName: 'Algovibes', viewCount: 180000, description: 'Proper backtesting methodology' },
            qualityScore: 9.1,
            tags: ['Algo Trading', 'Backtesting', 'Strategy'],
            difficulty: 'INTERMEDIATE',
            durationMinutes: 38,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'algo-005',
            title: 'High Frequency Trading: The Basics',
            type: 'VIDEO',
            url: 'https://www.youtube.com/watch?v=kFQJNeQDDHA',
            thumbnailUrl: 'https://img.youtube.com/vi/kFQJNeQDDHA/maxresdefault.jpg',
            duration: '28:00',
            metadata: { channelName: 'Quantitative Trading', viewCount: 320000, description: 'Introduction to HFT concepts' },
            qualityScore: 8.8,
            tags: ['Algo Trading', 'HFT', 'Advanced'],
            difficulty: 'ADVANCED',
            durationMinutes: 28,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'algo-006',
            title: 'zipline',
            type: 'REPO',
            url: 'https://github.com/quantopian/zipline',
            thumbnailUrl: 'https://opengraph.githubassets.com/1/quantopian/zipline',
            duration: null,
            metadata: { owner: 'quantopian', stars: 17000, language: 'Python', description: 'Pythonic algorithmic trading library' },
            qualityScore: 9.2,
            tags: ['Algo Trading', 'Backtesting', 'Python'],
            difficulty: 'INTERMEDIATE',
            durationMinutes: 120,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'algo-007',
            title: 'Machine Learning for Trading',
            type: 'VIDEO',
            url: 'https://www.youtube.com/watch?v=D6xfY46TfQY',
            thumbnailUrl: 'https://img.youtube.com/vi/D6xfY46TfQY/maxresdefault.jpg',
            duration: '52:00',
            metadata: { channelName: 'Sentdex', viewCount: 580000, description: 'Using ML models for trading predictions' },
            qualityScore: 9.0,
            tags: ['Algo Trading', 'ML', 'Python'],
            difficulty: 'ADVANCED',
            durationMinutes: 52,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'algo-008',
            title: 'Mean Reversion Strategy Explained',
            type: 'VIDEO',
            url: 'https://www.youtube.com/watch?v=nyqLJPMueQY',
            thumbnailUrl: 'https://img.youtube.com/vi/nyqLJPMueQY/maxresdefault.jpg',
            duration: '24:30',
            metadata: { channelName: 'Algovibes', viewCount: 120000, description: 'Build a mean reversion strategy' },
            qualityScore: 8.7,
            tags: ['Algo Trading', 'Strategy', 'Mean Reversion'],
            difficulty: 'INTERMEDIATE',
            durationMinutes: 24,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'algo-009',
            title: 'ccxt',
            type: 'REPO',
            url: 'https://github.com/ccxt/ccxt',
            thumbnailUrl: 'https://opengraph.githubassets.com/1/ccxt/ccxt',
            duration: null,
            metadata: { owner: 'ccxt', stars: 30000, language: 'JavaScript', description: 'Cryptocurrency exchange trading library' },
            qualityScore: 9.3,
            tags: ['Algo Trading', 'Crypto', 'API'],
            difficulty: 'BEGINNER',
            durationMinutes: 60,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'algo-010',
            title: 'Risk Management in Trading Systems',
            type: 'VIDEO',
            url: 'https://www.youtube.com/watch?v=URn4dGBZKqQ',
            thumbnailUrl: 'https://img.youtube.com/vi/URn4dGBZKqQ/maxresdefault.jpg',
            duration: '35:15',
            metadata: { channelName: 'Part Time Larry', viewCount: 95000, description: 'Position sizing and stop losses' },
            qualityScore: 9.1,
            tags: ['Algo Trading', 'Risk', 'Management'],
            difficulty: 'INTERMEDIATE',
            durationMinutes: 35,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'algo-011',
            title: 'Momentum Trading Strategy',
            type: 'VIDEO',
            url: 'https://www.youtube.com/watch?v=wJzLQEFj_vc',
            thumbnailUrl: 'https://img.youtube.com/vi/wJzLQEFj_vc/maxresdefault.jpg',
            duration: '42:00',
            metadata: { channelName: 'Quantitative Trading', viewCount: 210000, description: 'Build and backtest momentum strategies' },
            qualityScore: 8.9,
            tags: ['Algo Trading', 'Momentum', 'Strategy'],
            difficulty: 'INTERMEDIATE',
            durationMinutes: 42,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'algo-012',
            title: 'vectorbt',
            type: 'REPO',
            url: 'https://github.com/polakowo/vectorbt',
            thumbnailUrl: 'https://opengraph.githubassets.com/1/polakowo/vectorbt',
            duration: null,
            metadata: { owner: 'polakowo', stars: 3800, language: 'Python', description: 'Find your trading edge with vectorized backtesting' },
            qualityScore: 9.0,
            tags: ['Algo Trading', 'Backtesting', 'Vectorized'],
            difficulty: 'ADVANCED',
            durationMinutes: 90,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ],
};

// =============================================================================
// YouTube API Integration
// =============================================================================

interface YouTubeSearchItem {
    id: { videoId: string };
    snippet: {
        title: string;
        description: string;
        thumbnails: { high: { url: string } };
        channelTitle: string;
    };
}

interface YouTubeVideoDetails {
    id: string;
    contentDetails: {
        duration: string; // ISO 8601 format: PT12M34S
    };
    statistics: {
        viewCount: string;
    };
}

function parseIsoDuration(duration: string): { formatted: string; minutes: number } {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return { formatted: '0:00', minutes: 0 };

    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');

    const totalMinutes = hours * 60 + minutes + Math.ceil(seconds / 60);

    if (hours > 0) {
        return { formatted: `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`, minutes: totalMinutes };
    }
    return { formatted: `${minutes}:${seconds.toString().padStart(2, '0')}`, minutes: totalMinutes };
}

function difficultyFromLevel(level: Difficulty): Difficulty {
    return level;
}

async function fetchFromYouTubeAPI(topic: string, level: Difficulty): Promise<Resource[]> {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
        throw new Error('YouTube API key not configured');
    }

    const levelKeyword = level === 'BEGINNER' ? 'beginner tutorial' :
        level === 'INTERMEDIATE' ? 'complete guide' : 'advanced deep dive';
    const query = `${topic} ${levelKeyword}`;

    // Search for videos
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${encodeURIComponent(query)}&key=${apiKey}`;
    const searchResponse = await fetch(searchUrl);

    if (!searchResponse.ok) {
        throw new Error(`YouTube API search failed: ${searchResponse.statusText}`);
    }

    const searchData = await searchResponse.json();
    const videoIds = searchData.items.map((item: YouTubeSearchItem) => item.id.videoId).join(',');

    // Get video details for duration
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds}&key=${apiKey}`;
    const detailsResponse = await fetch(detailsUrl);

    if (!detailsResponse.ok) {
        throw new Error(`YouTube API details failed: ${detailsResponse.statusText}`);
    }

    const detailsData = await detailsResponse.json();
    const detailsMap = new Map<string, YouTubeVideoDetails>();
    detailsData.items.forEach((item: YouTubeVideoDetails) => {
        detailsMap.set(item.id, item);
    });

    return searchData.items.map((item: YouTubeSearchItem) => {
        const details = detailsMap.get(item.id.videoId);
        const { formatted, minutes } = details
            ? parseIsoDuration(details.contentDetails.duration)
            : { formatted: '10:00', minutes: 10 };

        return {
            id: `yt-${item.id.videoId}`,
            title: item.snippet.title,
            type: 'VIDEO' as const,
            url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
            thumbnailUrl: item.snippet.thumbnails.high.url,
            duration: formatted,
            metadata: {
                channelName: item.snippet.channelTitle,
                viewCount: details ? parseInt(details.statistics.viewCount) : 0,
                description: item.snippet.description,
            },
            qualityScore: 8.0 + Math.random() * 1.5, // Estimate quality
            tags: [topic],
            difficulty: difficultyFromLevel(level),
            durationMinutes: minutes,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    });
}

// =============================================================================
// MAIN EXPORT
// =============================================================================

export async function fetchResourcesByTopic(topic: string, level: Difficulty): Promise<Resource[]> {
    // Check if YouTube API key is available
    const hasApiKey = !!process.env.YOUTUBE_API_KEY;

    if (hasApiKey) {
        try {
            return await fetchFromYouTubeAPI(topic, level);
        } catch (error) {
            console.warn(`[YouTube] API call failed, falling back to mock data:`, error);
        }
    }

    // Fallback to mock data
    const topicResources = MOCK_RESOURCES_BY_TOPIC[topic] || [];

    // Filter by difficulty level
    const filteredByLevel = topicResources.filter((r) => {
        if (level === 'BEGINNER') return r.difficulty === 'BEGINNER';
        if (level === 'INTERMEDIATE') return r.difficulty === 'BEGINNER' || r.difficulty === 'INTERMEDIATE';
        return true; // ADVANCED gets all
    });

    // Sort by quality score and return
    return filteredByLevel.sort((a, b) => b.qualityScore - a.qualityScore);
}

export async function fetchResourcesForGoals(goals: string[], level: Difficulty): Promise<Resource[]> {
    const allResources: Resource[] = [];

    for (const goal of goals) {
        const resources = await fetchResourcesByTopic(goal, level);
        allResources.push(...resources);
    }

    // Remove duplicates and shuffle
    const uniqueResources = Array.from(
        new Map(allResources.map((r) => [r.id, r])).values()
    );

    // Sort by quality score
    return uniqueResources.sort((a, b) => b.qualityScore - a.qualityScore);
}
