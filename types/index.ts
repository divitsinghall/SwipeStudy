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
// User Types
// -----------------------------------------------------------------------------

export interface UserPreferences {
  preferredTypes?: ResourceType[];
  topics?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface User {
  id: string;
  email: string;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
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
