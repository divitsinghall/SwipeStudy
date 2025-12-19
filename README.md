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

## 📱 Phase 1: Core Mechanics

### What's Implemented

- ✅ **Swipe Physics Engine** - Rubber-banding, velocity detection, rotation transforms
- ✅ **SwipeCard Component** - Glassmorphism, directional glow, adaptive shadows  
- ✅ **SwipeDeck Orchestrator** - Card stacking, z-index management, smooth transitions
- ✅ **Zustand Store** - Batch fetching, active index tracking, pre-fetch triggers
- ✅ **Server Actions** - Resource fetching, swipe recording
- ✅ **Database Schema** - User, Resource, Swipe models with heavy indexing

### Swipe Physics Configuration

The swipe behavior is fully tunable via the `SwipePhysicsConfig` interface:

| Parameter | Default | Description |
|-----------|---------|-------------|
| `stiffness` | 300 | Spring tension - higher = snappier return |
| `damping` | 25 | Spring resistance - higher = slower movement |
| `velocityThreshold` | 500 | Min velocity (px/s) for flick detection |
| `distanceThreshold` | 100 | Min distance (px) for drag detection |
| `rotationFactor` | 0.1 | Rotation per pixel (max ±15°) |
| `glowThreshold` | 50 | Distance (px) before glow appears |

To customize physics, pass a `physics` prop to `SwipeCard`:

```tsx
<SwipeCard
  resource={resource}
  onSwipe={handleSwipe}
  physics={{
    stiffness: 400,    // Snappier
    damping: 30,       // More resistance
    velocityThreshold: 400, // Easier to flick
  }}
/>
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

# Seed with sample data
npx tsx scripts/seed_phase1.ts
```

### Development

```bash
# Start the dev server
npm run dev

# Open http://localhost:3000
```

---

## 📁 Project Structure

```
swipestudy/
├── app/
│   ├── actions.ts          # Server Actions
│   ├── globals.css         # Global styles, animations
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main swipe interface
├── components/
│   └── swipe-deck/
│       ├── SwipeCard.tsx   # Core card with physics
│       ├── SwipeDeck.tsx   # Deck orchestrator
│       └── index.ts        # Barrel exports
├── lib/
│   ├── db/
│   │   └── prisma.ts       # Prisma client singleton
│   └── stores/
│       └── useSwipeDeck.ts # Zustand store
├── prisma/
│   └── schema.prisma       # Database schema
├── scripts/
│   └── seed_phase1.ts      # Data seeding script
└── types/
    └── index.ts            # TypeScript definitions
```

---

## 🎨 Design Principles

1. **Physics First** - Every interaction has meaningful physics (rubber-banding, momentum)
2. **Visual Feedback** - Directional glow, rotation, and shadow depth provide instant feedback
3. **Zero Layout Shifts** - Pre-loaded cards, fixed aspect ratios, GPU-accelerated transforms
4. **Mobile Native** - Touch-optimized, safe-area aware, full-bleed design

---

## 📝 Database Schema

### Models

```prisma
model Resource {
  id           String       @id
  title        String
  type         ResourceType // VIDEO | REPO
  url          String
  thumbnailUrl String?
  duration     String?
  metadata     Json
  qualityScore Float
  swipes       Swipe[]
}

model Swipe {
  id         String      @id
  userId     String
  resourceId String
  action     SwipeAction // LEFT | RIGHT | SAVE
}
```

### Indexes

- `Resource.type` - Filter by content type
- `Resource.qualityScore` - Sort by quality
- `Swipe.userId` - User history lookups
- `Swipe.resourceId` - Resource analytics

---

## 🔮 Roadmap

### Phase 2: Learning Paths
- [ ] AI-generated learning sequences
- [ ] Topic clustering
- [ ] Progress tracking

### Phase 3: Social Features
- [ ] Share saved resources
- [ ] Community curated decks
- [ ] Study groups

---

## 📄 License

MIT © SwipeStudy
