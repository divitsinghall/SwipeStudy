# SwipeStudy

A high-performance, swipe-based learning path generator built with Next.js 14, featuring "Apple-quality" UI and intuitive gesture interactions.

![SwipeStudy Preview](./public/demo/preview.png)

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Animation**: framer-motion (physics-based swipe interactions)
- **State**: Zustand (lightweight, performant state management)
- **Database**: PostgreSQL with Prisma ORM
- **Design System**: Custom glassmorphism + iOS-style typography

---

## 📱 Features

### Phase 1: Core Mechanics
- ✅ **Swipe Physics Engine** - Rubber-banding, velocity detection, rotation transforms
- ✅ **SwipeCard Component** - Glassmorphism, directional glow, adaptive shadows  
- ✅ **SwipeDeck Orchestrator** - Card stacking, z-index management, smooth transitions
- ✅ **Zustand Store** - Batch fetching, active index tracking, pre-fetch triggers
- ✅ **Server Actions** - Resource fetching, swipe recording
- ✅ **Database Schema** - User, Resource, Swipe models with heavy indexing

### Phase 2: The Intelligence Loop
- ✅ **Apple-Style Onboarding** - Multi-step wizard with AnimatePresence animations
- ✅ **Topic Selection** - Choose from React, System Design, Rust, Algo Trading
- ✅ **Level-Based Content** - Beginner, Intermediate, Advanced difficulty filtering
- ✅ **YouTube Integration** - Real API or high-fidelity mock data fallback
- ✅ **Playlist Generation** - Swipe right to save resources to your path
- ✅ **Timeline View** - Visual week-by-week learning schedule
- ✅ **Dynamic Week Calculation** - Instant recomputation on commitment changes

---

## 🔄 Phase 2: Data Flow

```mermaid
graph TD
    A[User] -->|Visits /| B{Onboarding Complete?}
    B -->|No| C[/onboarding]
    B -->|Yes| D[/feed]
    C -->|Select Topics| E[Goals Saved]
    C -->|Select Level| E
    C -->|Set Hours| E
    E -->|Complete| D
    D -->|Load Resources| F[getRecommendedBatch]
    F -->|Filter by Goals/Level| G[YouTube Service]
    G -->|API Key?| H{Check ENV}
    H -->|Yes| I[YouTube API v3]
    H -->|No| J[Mock Data 50+]
    I --> K[Filtered Resources]
    J --> K
    D -->|Swipe Right| L[addToPlaylist]
    L -->|Save| M[/playlist]
    M -->|Adjust Hours| N[Dynamic Week Recalc]
```

---

## 🛠 Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL running locally (or use a cloud provider)

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/swipestudy.git
cd swipestudy

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL
```

### Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Or run migrations
npx prisma migrate dev
```

### Development

```bash
# Start the dev server
npm run dev

# Open http://localhost:3000
```

---

## 🔑 YouTube API Setup (Optional)

The app works without a YouTube API key using high-fidelity mock data. To enable real YouTube search:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **YouTube Data API v3**
4. Create credentials (API Key)
5. Add to your `.env`:

```env
YOUTUBE_API_KEY=your_api_key_here
```

> **Note**: Without an API key, the app uses 48+ curated mock resources across all topics.

---

## 📁 Project Structure

```
swipestudy/
├── app/
│   ├── page.tsx            # Entry point (redirect logic)
│   ├── onboarding/         # Multi-step onboarding wizard
│   ├── feed/               # Swipe deck with real data
│   └── playlist/           # Timeline view with week grouping
├── actions/
│   ├── feed.ts             # getRecommendedBatch, addToPlaylist
│   └── onboarding.ts       # completeOnboarding, getOrCreateUser
├── components/
│   └── swipe-deck/         # SwipeCard, SwipeDeck components
├── lib/
│   ├── db/                 # Prisma client singleton
│   ├── services/
│   │   └── youtube.ts      # YouTube API + mock data
│   └── stores/             # Zustand stores
├── prisma/
│   └── schema.prisma       # Database schema
└── types/
    └── index.ts            # TypeScript definitions
```

---

## 🎨 Design Principles

1. **Physics First** - Every interaction has meaningful physics (rubber-banding, momentum)
2. **Visual Feedback** - Directional glow, rotation, and shadow depth provide instant feedback
3. **Zero Layout Shifts** - Pre-loaded cards, fixed aspect ratios, GPU-accelerated transforms
4. **Mobile Native** - Touch-optimized, safe-area aware, full-bleed design
5. **Dynamic Calculations** - Week numbers computed on render, not stored in DB

---

## 📝 Database Schema

### Phase 2 Models

```prisma
model User {
  id                  String     @id
  email               String     @unique
  onboardingCompleted Boolean    @default(false)
  goals               String[]
  level               Difficulty @default(BEGINNER)
  weeklyHours         Int        @default(5)
  swipes              Swipe[]
  playlists           Playlist[]
}

model Playlist {
  id     String         @id
  userId String
  title  String
  items  PlaylistItem[]
}

model PlaylistItem {
  id         String     @id
  playlistId String
  resourceId String
  order      Int
  status     ItemStatus // TODO | IN_PROGRESS | DONE
}
```

> **Key Decision**: `weekNumber` is NOT stored in the database. It's calculated dynamically on the frontend, enabling instant UI updates when users adjust their weekly commitment.

---

## 🔮 Roadmap

### Phase 3: Social Features
- [ ] Share saved resources
- [ ] Community curated decks
- [ ] Study groups

### Phase 4: AI Enhancement
- [ ] Smart recommendations based on learning style
- [ ] Progress analytics
- [ ] Spaced repetition integration

---

## 📄 License

MIT © SwipeStudy

