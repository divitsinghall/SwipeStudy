/**
 * SwipeStudy Phase 1 Seed Script
 * 
 * Seeds the database with 20 high-quality "System Design" resources
 * - 10 YouTube videos
 * - 10 GitHub repositories
 * 
 * Usage: npx tsx scripts/seed_phase1.ts
 */

import { PrismaClient, ResourceType } from '@prisma/client';

const prisma = new PrismaClient();

// =============================================================================
// SEED DATA
// =============================================================================

const YOUTUBE_VIDEOS = [
    {
        title: 'System Design Interview: A Step-By-Step Guide',
        url: 'https://www.youtube.com/watch?v=i7twT3x5yv8',
        thumbnailUrl: 'https://img.youtube.com/vi/i7twT3x5yv8/maxresdefault.jpg',
        duration: '35:22',
        metadata: {
            channelName: 'ByteByteGo',
            viewCount: 2500000,
            description: 'Learn the fundamentals of system design interviews with real examples.',
        },
        qualityScore: 9.5,
    },
    {
        title: 'Designing Instagram: System Design Interview',
        url: 'https://www.youtube.com/watch?v=QmX2NPkJTKg',
        thumbnailUrl: 'https://img.youtube.com/vi/QmX2NPkJTKg/maxresdefault.jpg',
        duration: '28:15',
        metadata: {
            channelName: 'Gaurav Sen',
            viewCount: 1800000,
            description: 'Complete walkthrough of designing Instagram from scratch.',
        },
        qualityScore: 9.2,
    },
    {
        title: 'How Discord Stores Trillions of Messages',
        url: 'https://www.youtube.com/watch?v=O3PwuzCvAjI',
        thumbnailUrl: 'https://img.youtube.com/vi/O3PwuzCvAjI/maxresdefault.jpg',
        duration: '18:42',
        metadata: {
            channelName: 'ByteByteGo',
            viewCount: 1200000,
            description: 'Deep dive into Discord\'s database architecture and scaling strategies.',
        },
        qualityScore: 9.0,
    },
    {
        title: 'Distributed Systems in One Lesson',
        url: 'https://www.youtube.com/watch?v=Y6Ev8GIlbxc',
        thumbnailUrl: 'https://img.youtube.com/vi/Y6Ev8GIlbxc/maxresdefault.jpg',
        duration: '45:00',
        metadata: {
            channelName: 'GOTO Conferences',
            viewCount: 980000,
            description: 'Tim Berglund explains distributed systems concepts clearly.',
        },
        qualityScore: 8.8,
    },
    {
        title: 'Design a URL Shortener (System Design Interview)',
        url: 'https://www.youtube.com/watch?v=fMZMm_0ZhK4',
        thumbnailUrl: 'https://img.youtube.com/vi/fMZMm_0ZhK4/maxresdefault.jpg',
        duration: '22:30',
        metadata: {
            channelName: 'Exponent',
            viewCount: 750000,
            description: 'Step-by-step design of TinyURL with scalability considerations.',
        },
        qualityScore: 8.5,
    },
    {
        title: 'CAP Theorem Simplified',
        url: 'https://www.youtube.com/watch?v=BHqjEjzAicg',
        thumbnailUrl: 'https://img.youtube.com/vi/BHqjEjzAicg/maxresdefault.jpg',
        duration: '15:18',
        metadata: {
            channelName: 'Hussein Nasser',
            viewCount: 620000,
            description: 'Understanding CAP theorem with practical examples.',
        },
        qualityScore: 8.3,
    },
    {
        title: 'Designing Netflix: High-Level System Design',
        url: 'https://www.youtube.com/watch?v=psQzyFfsUGU',
        thumbnailUrl: 'https://img.youtube.com/vi/psQzyFfsUGU/maxresdefault.jpg',
        duration: '32:45',
        metadata: {
            channelName: 'Tech Dummies',
            viewCount: 890000,
            description: 'Complete Netflix architecture breakdown including CDN and video processing.',
        },
        qualityScore: 8.7,
    },
    {
        title: 'Database Indexing Explained',
        url: 'https://www.youtube.com/watch?v=lYh6LrSFe94',
        thumbnailUrl: 'https://img.youtube.com/vi/lYh6LrSFe94/maxresdefault.jpg',
        duration: '19:22',
        metadata: {
            channelName: 'Web Dev Simplified',
            viewCount: 540000,
            description: 'How database indexes work and when to use them.',
        },
        qualityScore: 8.1,
    },
    {
        title: 'Microservices vs Monolith: Which to Choose?',
        url: 'https://www.youtube.com/watch?v=rv4LlmLmVWk',
        thumbnailUrl: 'https://img.youtube.com/vi/rv4LlmLmVWk/maxresdefault.jpg',
        duration: '24:10',
        metadata: {
            channelName: 'IBM Technology',
            viewCount: 470000,
            description: 'Practical guide to choosing between microservices and monolithic architecture.',
        },
        qualityScore: 8.0,
    },
    {
        title: 'Load Balancing Algorithms Explained',
        url: 'https://www.youtube.com/watch?v=dBmxNsS3BGE',
        thumbnailUrl: 'https://img.youtube.com/vi/dBmxNsS3BGE/maxresdefault.jpg',
        duration: '16:55',
        metadata: {
            channelName: 'Hussein Nasser',
            viewCount: 380000,
            description: 'Round-robin, least connections, and consistent hashing explained.',
        },
        qualityScore: 7.9,
    },
];

const GITHUB_REPOS = [
    {
        title: 'system-design-primer',
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
    },
    {
        title: 'awesome-scalability',
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
    },
    {
        title: 'distributed-systems',
        url: 'https://github.com/aphyr/distsys-class',
        thumbnailUrl: 'https://opengraph.githubassets.com/1/aphyr/distsys-class',
        duration: null,
        metadata: {
            owner: 'aphyr',
            stars: 9200,
            language: 'Markdown',
            description: 'Class notes and materials for distributed systems lecture series.',
        },
        qualityScore: 9.0,
    },
    {
        title: 'system-design-101',
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
    },
    {
        title: 'raft',
        url: 'https://github.com/hashicorp/raft',
        thumbnailUrl: 'https://opengraph.githubassets.com/1/hashicorp/raft',
        duration: null,
        metadata: {
            owner: 'hashicorp',
            stars: 7800,
            language: 'Go',
            description: 'Golang implementation of the Raft consensus protocol.',
        },
        qualityScore: 8.7,
    },
    {
        title: 'kubernetes',
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
    },
    {
        title: 'etcd',
        url: 'https://github.com/etcd-io/etcd',
        thumbnailUrl: 'https://opengraph.githubassets.com/1/etcd-io/etcd',
        duration: null,
        metadata: {
            owner: 'etcd-io',
            stars: 46000,
            language: 'Go',
            description: 'Distributed reliable key-value store for the most critical data.',
        },
        qualityScore: 8.9,
    },
    {
        title: 'redis',
        url: 'https://github.com/redis/redis',
        thumbnailUrl: 'https://opengraph.githubassets.com/1/redis/redis',
        duration: null,
        metadata: {
            owner: 'redis',
            stars: 64000,
            language: 'C',
            description: 'Redis is an in-memory database that persists on disk.',
        },
        qualityScore: 9.1,
    },
    {
        title: 'kafka',
        url: 'https://github.com/apache/kafka',
        thumbnailUrl: 'https://opengraph.githubassets.com/1/apache/kafka',
        duration: null,
        metadata: {
            owner: 'apache',
            stars: 27000,
            language: 'Java',
            description: 'Mirror of Apache Kafka - distributed event streaming platform.',
        },
        qualityScore: 8.8,
    },
    {
        title: 'cockroach',
        url: 'https://github.com/cockroachdb/cockroach',
        thumbnailUrl: 'https://opengraph.githubassets.com/1/cockroachdb/cockroach',
        duration: null,
        metadata: {
            owner: 'cockroachdb',
            stars: 29000,
            language: 'Go',
            description: 'CockroachDB - the cloud native, distributed SQL database.',
        },
        qualityScore: 8.6,
    },
];

// =============================================================================
// SEED FUNCTION
// =============================================================================

async function seed() {
    console.log('🌱 Starting Phase 1 seed...\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await prisma.swipe.deleteMany();
    await prisma.resource.deleteMany();
    await prisma.user.deleteMany();

    // Seed YouTube videos
    console.log('📹 Seeding YouTube videos...');
    for (const video of YOUTUBE_VIDEOS) {
        await prisma.resource.create({
            data: {
                title: video.title,
                type: ResourceType.VIDEO,
                url: video.url,
                thumbnailUrl: video.thumbnailUrl,
                duration: video.duration,
                metadata: video.metadata,
                qualityScore: video.qualityScore,
            },
        });
        console.log(`   ✓ ${video.title}`);
    }

    // Seed GitHub repos
    console.log('\n🔗 Seeding GitHub repositories...');
    for (const repo of GITHUB_REPOS) {
        await prisma.resource.create({
            data: {
                title: repo.title,
                type: ResourceType.REPO,
                url: repo.url,
                thumbnailUrl: repo.thumbnailUrl,
                duration: repo.duration,
                metadata: repo.metadata,
                qualityScore: repo.qualityScore,
            },
        });
        console.log(`   ✓ ${repo.title}`);
    }

    // Create a test user
    console.log('\n👤 Creating test user...');
    await prisma.user.create({
        data: {
            email: 'test@swipestudy.dev',
            preferences: {
                preferredTypes: ['VIDEO', 'REPO'],
                topics: ['system-design', 'distributed-systems'],
                difficulty: 'intermediate',
            },
        },
    });
    console.log('   ✓ test@swipestudy.dev');

    // Summary
    const resourceCount = await prisma.resource.count();
    const userCount = await prisma.user.count();

    console.log('\n✅ Seed completed!');
    console.log(`   📊 Resources: ${resourceCount}`);
    console.log(`   👥 Users: ${userCount}`);
}

// =============================================================================
// EXECUTE
// =============================================================================

seed()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
