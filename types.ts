
// Domain Entities

export interface Tenant {
  id: string;
  name: string;
  type: 'SCHOOL' | 'CHURCH';
  logoUrl?: string;
  primaryColor: string; // Used for accent injection
  leaderName?: string;
  leaderTitle?: string;
  weeklyMessage?: string;
}

export enum LessonStatus {
  LOCKED = 'LOCKED',
  AVAILABLE = 'AVAILABLE',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export interface Lesson {
  id: string;
  title: string;
  reference: string; // e.g., "Lucas 1:1-4"
  pageNumber: number; // Physical bible page
  videoUrl?: string;
  durationMinutes: number;
  status: LessonStatus;
  description: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface UserProgress {
  userId: string;
  completedLessonIds: string[];
  currentStreak: number;
  totalInsights: number;
  // New internal metric for the "S Rate" logic
  lastInsightQuality?: 'S' | 'A' | 'B'; 
}

// New Incentive Types
export type IncentiveType = 'DAILY_MISSION' | 'STREAK_KEEPER' | 'INSIGHT_MASTER';

export interface IncentiveState {
  id: string; // Unique ID for selection
  type: IncentiveType;
  isUnlocked: boolean;
  isSent: boolean;
  label: string;
  description: string;
  value: number; // How many 'points' of light it gives
}

// Updated Ranking/Community Types
export interface CommunityMember {
  userId: string;
  name: string;
  avatarColor: string;
  rank: number;
  
  // New Metrics
  booksRead: number;
  versesPerDay: number;
  incentivesSent: number; // The main ranking metric now
  
  likesReceived: number;
  isLikedByCurrentUser: boolean;
}

export interface SimpleAvatar {
    id: string;
    initial: string;
    color: string;
    message?: string; // Short thought like "Amém", "Forte", "Lendo"
}

export interface ActiveBookCommunity {
    bookName: string;
    totalReaders: number;
    activeAvatars: SimpleAvatar[]; // A sample of users to show floating
    recentInsights: number;
}

// Global Community Heatmap
export interface CommunityGlobalStatus {
    totalOnline: number;
    activeClusters: ActiveBookCommunity[];
}

// Impact / Echo Types
export interface Echo {
    id: string;
    userName: string;
    userAvatarColor: string;
    timestamp: string;
    bibleReference: string;
    content: string;
    isCurrentUser?: boolean; // New field to identify the center node
    userReaction?: 'AMEM' | 'LUZ' | 'CAMINHO';
    reactions: {
        amem: number;
        luz: number;
        caminho: number;
    };
}

export interface CommunityGoal {
    title: string;
    percentage: number;
    currentValue: number;
    targetValue: number;
    unit: string;
    // New detailed stats
    weeklyStats: {
        totalMinutesRead: number;
        activeParticipants: number;
        insightsShared: number;
    }
}
