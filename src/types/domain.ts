export type LifePillar =
  | 'ACADEMIC_MASTERY'
  | 'DISCIPLINES_ARTS'
  | 'UNSTRUCTURED_PLAY'
  | 'RESTORATION_FAMILY'
  | 'EXECUTIVE_HABITS';

export type EnergyLoad = 'HIGH_COGNITIVE' | 'PHYSICAL' | 'RESTORATIVE';

export type ReleaseLevel =
  | 'LEVEL_1_GUIDED'
  | 'LEVEL_2_COPILOT'
  | 'LEVEL_3_EXECUTIVE';

export type MoodState =
  | 'ENERGIZED'
  | 'FOCUSED'
  | 'STEADY'
  | 'TIRED'
  | 'OVERWHELMED';

export type KudosBadgeType =
  | 'GRIT'
  | 'KINDNESS'
  | 'CREATIVE_BREAKTHROUGH'
  | 'SELF_REGULATION'
  | 'TIME_CALIBRATOR';

export type TaskStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'PROPOSED';

export type ThemeId =
  | 'OBSIDIAN_TEAL'
  | 'AURORA_INDIGO'
  | 'SOLAR_DAYLIGHT'
  | 'EVERGREEN_DOJO'
  | 'SUNSET_TERRACOTTA'
  | 'OCEANIC_BREEZE';

export type ActiveSectionId =
  | 'OVERVIEW'
  | 'TIMELINE_CALIBRATOR'
  | 'RESILIENCE_SHIELDS'
  | 'IPSATIVE_RADAR'
  | 'SUNDAY_SUMMIT'
  | 'SOCRATIC_COACH'
  | 'INTEGRATIONS'
  | 'BENCHMARK_MATRIX';

export interface MediaArtifact {
  id: string;
  childId: string;
  taskId: string;
  title: string;
  category: 'WORKSHEET' | 'BELT_STRIPE' | 'CREATIVE_PROJECT' | 'CHECKLIST_SNAP';
  dataUrl: string;
  caption: string;
  createdAt: string;
}

export interface TimeEstimationRecord {
  id: string;
  childId: string;
  taskId: string;
  taskTitle: string;
  pillar: LifePillar;
  energyLoad: EnergyLoad;
  estimatedMinutes: number;
  actualMinutes: number;
  deltaMinutes: number;
  accuracyPercent: number;
  recordedAt: string;
}

export interface MetacognitiveReflection {
  id: string;
  childId: string;
  taskId: string;
  taskTitle: string;
  pillar: LifePillar;
  whatIDid: string;
  whereIGotStuck: string;
  whatClicked: string;
  socraticPromptUsed: string;
  moodBefore: MoodState;
  moodAfter: MoodState;
  artifactId?: string;
  voiceDictated: boolean;
  createdAt: string;
}

export interface ParentKudos {
  id: string;
  childId: string;
  fromParentName: string;
  badgeType: KudosBadgeType;
  message: string;
  relatedTaskId?: string;
  socraticQuestion?: string;
  createdAt: string;
  acknowledgedByChild: boolean;
}

export interface SocraticCoachingSuggestion {
  id: string;
  childId: string;
  childName: string;
  taskId: string;
  taskTitle: string;
  triggerReason: string;
  childMood: MoodState;
  avoidPhrase: string;
  socraticScript: string;
  followUpAction: string;
  dispatched: boolean;
}

export interface ResilienceBadge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlockedAt: string;
  isBounceBack: boolean;
}

export interface IpsativePillarScore {
  pillar: LifePillar;
  label: string;
  previous30DayScore: number;
  currentScore: number;
  targetBalancedScore: number;
  weeklyMinutes: number;
}

export interface ScheduledTask {
  id: string;
  childId: string;
  title: string;
  subtitle: string;
  pillar: LifePillar;
  energyLoad: EnergyLoad;
  scheduledStartTime: string;
  defaultDurationMinutes: number;
  estimatedMinutes?: number;
  actualMinutes?: number;
  status: TaskStatus;
  socraticHints: string[];
  runwayWarning10MinText: string;
  runwayWarning3MinText: string;
  orderIndex: number;
  proposedByChild?: boolean;
  parentApproved?: boolean;
  completedAt?: string;
}

export interface ChildProfile {
  id: string;
  familyId: string;
  name: string;
  nickname: string;
  age: number;
  gradeLabel: string;
  releaseLevel: ReleaseLevel;
  pinCode?: string;
  pinRequired: boolean;
  avatarGradient: string;
  avatarEmoji: string;
  currentMood: MoodState;
  streakDays: number;
  graceShieldsRemaining: number;
  maxGraceShieldsPerMonth: number;
  graceDayActiveToday: boolean;
  lastGraceShieldDate?: string;
  resilienceBadges: ResilienceBadge[];
  ipsativeBaseline: IpsativePillarScore[];
  kudosCount30Days: number;
  coachingCheckIns30Days: number;
  personalBestHeadline: string;
}

export interface SundaySummitCommitment {
  id: string;
  childId: string;
  childName: string;
  celebrationWin: string;
  roadblockIdentified: string;
  socraticDiscussionPrompt: string;
  nextWeekAdjustment: string;
  parentSupportPledge: string;
  completedInSummit: boolean;
}

export interface ExternalIntegrationLog {
  id: string;
  channel: 'ICS_CALENDAR' | 'WEB_PUSH' | 'TWILIO_SMS' | 'RESEND_EMAIL';
  direction: 'OUTBOUND' | 'INBOUND';
  recipient: string;
  subject: string;
  payloadPreview: string;
  status: 'DELIVERED' | 'SYNCED' | 'QUEUED';
  timestamp: string;
}

export interface FamilyStoreState {
  familyId: string;
  familyName: string;
  principalParentName: string;
  coParentName: string;
  activeProfileId: string;
  activeTheme?: ThemeId;
  sidebarCollapsed?: boolean;
  children: ChildProfile[];
  tasks: ScheduledTask[];
  estimations: TimeEstimationRecord[];
  reflections: MetacognitiveReflection[];
  kudos: ParentKudos[];
  artifacts: MediaArtifact[];
  coachingSuggestions: SocraticCoachingSuggestion[];
  summitCommitments: SundaySummitCommitment[];
  integrationLogs: ExternalIntegrationLog[];
}
