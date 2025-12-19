// =============================================================================
// SwipeStudy Type Definitions
// =============================================================================

// -----------------------------------------------------------------------------
// Resource Types
// -----------------------------------------------------------------------------

export type ResourceType = 'VIDEO' | 'REPO';

export interface VideoMetadata {
  channelName: string;
  viewCount?: number;
  description?: string;
}

export interface RepoMetadata {
  owner: string;
  stars?: number;
  language?: string;
  description?: string;
}

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  url: string;
  thumbnailUrl: string | null;
  duration: string | null; // e.g., "12:34" for videos
  metadata: VideoMetadata | RepoMetadata;
  qualityScore: number;
  // Phase 2 fields
  tags?: string[];
  difficulty?: Difficulty;
  durationMinutes?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Type guards for discriminated unions
export function isVideoResource(resource: Resource): resource is Resource & { metadata: VideoMetadata } {
  return resource.type === 'VIDEO';
}

export function isRepoResource(resource: Resource): resource is Resource & { metadata: RepoMetadata } {
  return resource.type === 'REPO';
}

// -----------------------------------------------------------------------------
// Swipe Types
// -----------------------------------------------------------------------------

export type SwipeAction = 'LEFT' | 'RIGHT' | 'SAVE';

export interface Swipe {
  id: string;
  userId: string;
  resourceId: string;
  action: SwipeAction;
  createdAt: Date;
}

// -----------------------------------------------------------------------------
// Phase 2: Onboarding & Difficulty Types
// -----------------------------------------------------------------------------

export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type ItemStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface OnboardingData {
  goals: string[];
  level: Difficulty;
  weeklyHours: number;
}

// Available topics for onboarding
export const AVAILABLE_TOPICS = ['React', 'System Design', 'Rust', 'Algo Trading'] as const;
export type Topic = typeof AVAILABLE_TOPICS[number];

// Level mappings for display
export const LEVEL_LABELS: Record<Difficulty, { label: string; description: string }> = {
  BEGINNER: { label: 'Novice', description: 'Just starting out' },
  INTERMEDIATE: { label: 'Builder', description: 'Some experience' },
  ADVANCED: { label: 'Pro', description: 'Ready for advanced topics' },
};

// -----------------------------------------------------------------------------
// User Types
// -----------------------------------------------------------------------------

export interface UserPreferences {
  preferredTypes?: ResourceType[];
  topics?: string[];
  difficulty?: Difficulty;
}

export interface User {
  id: string;
  email: string;
  preferences: UserPreferences;
  onboardingCompleted: boolean;
  goals: string[];
  level: Difficulty;
  weeklyHours: number;
  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Phase 2: Playlist Types
// -----------------------------------------------------------------------------

export interface Playlist {
  id: string;
  userId: string;
  title: string;
  items: PlaylistItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PlaylistItem {
  id: string;
  playlistId: string;
  resourceId: string;
  resource?: Omit<Resource, 'metadata'> & { metadata?: Record<string, unknown> };
  order: number;
  status: ItemStatus;
  createdAt: Date;
}

// Calculated at runtime, not stored in DB
export interface PlaylistItemWithWeek extends PlaylistItem {
  weekNumber: number;
}

// Utility function to calculate weeks dynamically
export function calculateWeeksForPlaylist(
  items: PlaylistItem[],
  weeklyMinutes: number
): PlaylistItemWithWeek[] {
  if (weeklyMinutes <= 0) weeklyMinutes = 60; // Default 1 hour if invalid

  let currentWeek = 1;
  let runningDuration = 0;

  return items.map((item) => {
    const duration = item.resource?.durationMinutes || 15; // Default 15 min
    runningDuration += duration;

    if (runningDuration > weeklyMinutes) {
      currentWeek++;
      runningDuration = duration; // Start new week with this item
    }

    return { ...item, weekNumber: currentWeek };
  });
}

// -----------------------------------------------------------------------------
// Swipe Physics Configuration
// -----------------------------------------------------------------------------

export interface SwipePhysicsConfig {
  /** Spring tension - higher = snappier return */
  stiffness: number;
  /** Spring resistance - higher = slower movement */
  damping: number;
  /** Minimum velocity (px/s) to trigger a flick swipe */
  velocityThreshold: number;
  /** Minimum distance (px) to trigger a drag swipe */
  distanceThreshold: number;
  /** Rotation per horizontal pixel (radians), clamped to ±15° */
  rotationFactor: number;
  /** Opacity threshold for directional glow */
  glowThreshold: number;
}

export const DEFAULT_SWIPE_PHYSICS: SwipePhysicsConfig = {
  stiffness: 300,
  damping: 25,
  velocityThreshold: 500,
  distanceThreshold: 100,
  rotationFactor: 0.1,
  glowThreshold: 50,
};

// -----------------------------------------------------------------------------
// Deck State Types
// -----------------------------------------------------------------------------

export interface DeckState {
  resources: Resource[];
  activeIndex: number;
  isLoading: boolean;
  hasMore: boolean;
  error: string | null;
}

