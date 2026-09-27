import { FamilyStoreState, ThemeId } from '@/types/domain';

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  tagline: string;
  mode: 'dark' | 'light';
  swatchColors: [string, string, string];
  badgeText: string;
}

export const THEME_CATALOG: ThemeDefinition[] = [
  {
    id: 'OBSIDIAN_TEAL',
    name: 'Obsidian Teal',
    tagline: 'Deep slate executive glass with bioluminescent teal & emerald',
    mode: 'dark',
    swatchColors: ['#020617', '#14b8a6', '#6366f1'],
    badgeText: 'Default Dark',
  },
  {
    id: 'AURORA_INDIGO',
    name: 'Cosmic Aurora',
    tagline: 'Midnight violet cosmos with electric cyan & starlight magenta',
    mode: 'dark',
    swatchColors: ['#090518', '#a855f7', '#22d3ee'],
    badgeText: 'Kids Favorite',
  },
  {
    id: 'SOLAR_DAYLIGHT',
    name: 'Solar Daylight',
    tagline: 'High-contrast warm alabaster paper for bright kitchen/classroom hubs',
    mode: 'light',
    swatchColors: ['#f8fafc', '#0d9488', '#4f46e5'],
    badgeText: 'Crisp Light',
  },
  {
    id: 'EVERGREEN_DOJO',
    name: 'Evergreen Dojo',
    tagline: 'Calming pine & bamboo sanctuary with warm gold & jade accents',
    mode: 'dark',
    swatchColors: ['#04130e', '#10b981', '#f59e0b'],
    badgeText: 'Low-Sensory Zen',
  },
  {
    id: 'SUNSET_TERRACOTTA',
    name: 'Warm Sunset',
    tagline: 'Cozy evening espresso dusk with amber, coral & peach warmth',
    mode: 'dark',
    swatchColors: ['#180b08', '#fb923c', '#f43f5e'],
    badgeText: 'Evening Wind-Down',
  },
  {
    id: 'OCEANIC_BREEZE',
    name: 'Oceanic Breeze',
    tagline: 'Airy coastal sky daylight canvas with deep navy & turquoise',
    mode: 'light',
    swatchColors: ['#f0f9ff', '#0284c7', '#0d9488'],
    badgeText: 'Coastal Light',
  },
];

export const PILLAR_META: Record<
  string,
  {
    label: string;
    shortLabel: string;
    description: string;
    badgeClass: string;
    accentHex: string;
  }
> = {
  ACADEMIC_MASTERY: {
    label: 'Academic Mastery',
    shortLabel: 'Academic',
    description: 'AoPS, Abacus, Math Olympiads, ELA/Writing, Science/Robotics',
    badgeClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    accentHex: '#818cf8',
  },
  DISCIPLINES_ARTS: {
    label: 'Disciplines & Arts',
    shortLabel: 'Disciplines',
    description: 'Karate/Martial Arts, Dance, Music Instruments, Swimming & Athletics',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    accentHex: '#fbbf24',
  },
  UNSTRUCTURED_PLAY: {
    label: 'Unstructured Play & Social',
    shortLabel: 'Free Play',
    description: 'Peer play dates, Lego builds, imaginative play, park/outdoor time',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    accentHex: '#34d399',
  },
  RESTORATION_FAMILY: {
    label: 'Restoration & Family',
    shortLabel: 'Restoration',
    description: 'Shared family nights, recreational screen time budget, mindful rest',
    badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    accentHex: '#fb7185',
  },
  EXECUTIVE_HABITS: {
    label: 'Executive Habits',
    shortLabel: 'Executive',
    description: 'Morning checklists, backpack prep, homework submission audits',
    badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    accentHex: '#22d3ee',
  },
};

export const ENERGY_META: Record<
  string,
  {
    label: string;
    shortLabel: string;
    badgeClass: string;
    dotColor: string;
    staminaCost: number;
    description: string;
  }
> = {
  HIGH_COGNITIVE: {
    label: 'High Mental / Cognitive',
    shortLabel: 'High Mental',
    badgeClass: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40',
    dotColor: 'bg-fuchsia-400',
    staminaCost: 3,
    description: 'Deep executive focus & working memory (requires buffer afterward)',
  },
  PHYSICAL: {
    label: 'Physical / Kinesthetic',
    shortLabel: 'Physical',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    dotColor: 'bg-amber-400',
    staminaCost: 2,
    description: 'Embodied movement, coordination, proprioceptive regulation',
  },
  RESTORATIVE: {
    label: 'Restorative / Buffer',
    shortLabel: 'Restorative',
    badgeClass: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    dotColor: 'bg-teal-400',
    staminaCost: -2,
    description: 'Replenishes cognitive battery and prevents transition meltdowns',
  },
};

export const MOOD_META: Record<
  string,
  {
    label: string;
    emoji: string;
    colorClass: string;
    coachingTone: string;
  }
> = {
  ENERGIZED: {
    label: 'Energized',
    emoji: '⚡',
    colorClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
    coachingTone: 'Channel high momentum into a stretch challenge.',
  },
  FOCUSED: {
    label: 'Focused',
    emoji: '🎯',
    colorClass: 'bg-teal-500/20 text-teal-300 border-teal-500/50',
    coachingTone: 'Deep flow state — protect from interruptions.',
  },
  STEADY: {
    label: 'Steady',
    emoji: '🌿',
    colorClass: 'bg-sky-500/20 text-sky-300 border-sky-500/50',
    coachingTone: 'Balanced baseline — ideal for consistent practice.',
  },
  TIRED: {
    label: 'Tired',
    emoji: '🌙',
    colorClass: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
    coachingTone: 'Cognitive battery low — praise effort over speed.',
  },
  OVERWHELMED: {
    label: 'Overwhelmed',
    emoji: '🌊',
    colorClass: 'bg-rose-500/20 text-rose-300 border-rose-500/50',
    coachingTone: 'High friction alert — co-regulate and validate feelings first.',
  },
};

// Pre-built SVG Data URLs for realistic worksheet & project artifacts
const AOPS_WORKSHEET_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="480" height="300" viewBox="0 0 480 300">
  <rect width="480" height="300" rx="16" fill="#0f172a"/>
  <rect x="16" y="16" width="448" height="268" rx="12" fill="#1e293b" stroke="#6366f1" stroke-width="2" stroke-dasharray="6 4"/>
  <text x="36" y="52" fill="#818cf8" font-family="monospace" font-size="14" font-weight="bold">AoPS BEAST ACADEMY 4D • COMBINATORICS &amp; PARITY</text>
  <text x="36" y="88" fill="#e2e8f0" font-family="sans-serif" font-size="13">Problem #14: A 5x5 grid of switches starts all OFF...</text>
  <g stroke="#38bdf8" stroke-width="2" fill="none" transform="translate(40, 110)">
    <rect x="0" y="0" width="120" height="120" rx="6" stroke="#475569"/>
    <line x1="40" y1="0" x2="40" y2="120" stroke="#334155"/>
    <line x1="80" y1="0" x2="80" y2="120" stroke="#334155"/>
    <line x1="0" y1="40" x2="120" y2="40" stroke="#334155"/>
    <line x1="0" y1="80" x2="120" y2="80" stroke="#334155"/>
    <circle cx="20" cy="20" r="10" fill="#22d3ee" fill-opacity="0.3"/>
    <circle cx="60" cy="60" r="10" fill="#22d3ee" fill-opacity="0.3"/>
    <circle cx="100" cy="100" r="10" fill="#22d3ee" fill-opacity="0.3"/>
  </g>
  <text x="185" y="140" fill="#34d399" font-family="monospace" font-size="13" font-weight="bold">✓ Strategy: Invariant Parity Check!</text>
  <text x="185" y="168" fill="#cbd5e1" font-family="sans-serif" font-size="12">Each row flip changes 5 states (odd).</text>
  <text x="185" y="190" fill="#cbd5e1" font-family="sans-serif" font-size="12">Total ON switches = 25 (odd) → Possible in 5 moves!</text>
  <rect x="185" y="212" width="245" height="34" rx="8" fill="#065f46" fill-opacity="0.5" stroke="#10b981"/>
  <text x="200" y="234" fill="#6ee7b7" font-family="sans-serif" font-size="12" font-weight="bold">Leo's Breakthrough: Drew a 3x3 smaller case first</text>
</svg>
`)}`;

const KARATE_STRIPE_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="480" height="300" viewBox="0 0 480 300">
  <rect width="480" height="300" rx="16" fill="#0f172a"/>
  <rect x="20" y="20" width="440" height="260" rx="14" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
  <text x="40" y="58" fill="#fbbf24" font-family="monospace" font-size="14" font-weight="bold">SHOTOKAN DOJO • HEIAN YONDAN KATA STRIPE</text>
  <rect x="40" y="95" width="400" height="48" rx="8" fill="#78350f" stroke="#d97706" stroke-width="2"/>
  <rect x="340" y="95" width="22" height="48" fill="#111827"/>
  <rect x="375" y="95" width="22" height="48" fill="#111827"/>
  <text x="40" y="180" fill="#f8fafc" font-family="sans-serif" font-size="14" font-weight="bold">2nd Black Stripe Earned on Brown Belt!</text>
  <text x="40" y="208" fill="#94a3b8" font-family="sans-serif" font-size="12">Sensei Note: Crisp kiai and balanced back-stance (Kokutsu-dachi) slow pivot.</text>
</svg>
`)}`;

const PHONICS_STORY_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="480" height="300" viewBox="0 0 480 300">
  <rect width="480" height="300" rx="16" fill="#0f172a"/>
  <rect x="20" y="20" width="440" height="260" rx="14" fill="#1e293b" stroke="#ec4899" stroke-width="2"/>
  <text x="40" y="58" fill="#f472b6" font-family="monospace" font-size="14" font-weight="bold">MAYA'S DECODABLE STORYBOOK • VOWEL TEAMS (EA / EE)</text>
  <circle cx="105" cy="155" r="46" fill="#be185d" fill-opacity="0.3" stroke="#f472b6" stroke-width="2"/>
  <text x="84" y="165" fill="#fbcfe8" font-family="sans-serif" font-size="28">🐝🌊</text>
  <text x="175" y="135" fill="#f8fafc" font-family="sans-serif" font-size="15" font-weight="bold">"The Green Bee by the Deep Sea"</text>
  <text x="175" y="165" fill="#cbd5e1" font-family="sans-serif" font-size="12">Read 4 pages aloud and sounded out "beneath" &amp; "dreamboat"!</text>
  <text x="175" y="195" fill="#34d399" font-family="monospace" font-size="12" font-weight="bold">★ Self-Corrected 3 Long-E Words Independently</text>
</svg>
`)}`;

export const INITIAL_FAMILY_STORE: FamilyStoreState = {
  familyId: 'fam-principal-01',
  familyName: 'The Sharma-Miller Family Hub',
  principalParentName: 'Principal Nitin (Dad)',
  coParentName: 'Dr. Priya (Mom)',
  activeProfileId: 'child-1',
  activeTheme: 'OBSIDIAN_TEAL',
  sidebarCollapsed: false,
  children: [
    {
      id: 'child-1',
      familyId: 'fam-principal-01',
      name: 'Leo',
      nickname: 'Leo (Grade 4 • Co-Pilot)',
      age: 9,
      gradeLabel: 'Grade 4',
      releaseLevel: 'LEVEL_2_COPILOT',
      pinCode: '1234',
      pinRequired: false,
      avatarGradient: 'from-teal-400 via-cyan-500 to-indigo-600',
      avatarEmoji: '🚀',
      currentMood: 'FOCUSED',
      streakDays: 14,
      graceShieldsRemaining: 2,
      maxGraceShieldsPerMonth: 2,
      graceDayActiveToday: false,
      lastGraceShieldDate: '2026-09-18',
      kudosCount30Days: 14,
      coachingCheckIns30Days: 12,
      personalBestHeadline:
        'Calibrated AoPS time estimation within 2 minutes & solved 4D Parity Challenge by drawing a smaller 3×3 grid!',
      resilienceBadges: [
        {
          id: 'res-1',
          title: 'Comeback Kid',
          description: 'Logged back in & completed Abacus sprint the day after a fever Grace Day without losing momentum.',
          iconName: 'ShieldCheck',
          unlockedAt: '2026-09-19',
          isBounceBack: true,
        },
        {
          id: 'res-2',
          title: 'Time-Sense Architect',
          description: 'Brought Estimated vs. Actual time delta under 15% across 5 consecutive sessions.',
          iconName: 'Clock',
          unlockedAt: '2026-09-24',
          isBounceBack: false,
        },
        {
          id: 'res-3',
          title: 'Friction Navigator',
          description: 'Logged an honest "Where I Got Stuck" reflection during a hard AoPS combinatorics set.',
          iconName: 'Compass',
          unlockedAt: '2026-09-25',
          isBounceBack: true,
        },
      ],
      ipsativeBaseline: [
        {
          pillar: 'ACADEMIC_MASTERY',
          label: 'Academic Mastery',
          previous30DayScore: 72,
          currentScore: 86,
          targetBalancedScore: 85,
          weeklyMinutes: 245,
        },
        {
          pillar: 'DISCIPLINES_ARTS',
          label: 'Disciplines & Arts',
          previous30DayScore: 68,
          currentScore: 82,
          targetBalancedScore: 80,
          weeklyMinutes: 180,
        },
        {
          pillar: 'UNSTRUCTURED_PLAY',
          label: 'Unstructured Play',
          previous30DayScore: 64,
          currentScore: 79,
          targetBalancedScore: 85,
          weeklyMinutes: 290,
        },
        {
          pillar: 'RESTORATION_FAMILY',
          label: 'Restoration & Family',
          previous30DayScore: 70,
          currentScore: 84,
          targetBalancedScore: 85,
          weeklyMinutes: 310,
        },
        {
          pillar: 'EXECUTIVE_HABITS',
          label: 'Executive Habits',
          previous30DayScore: 58,
          currentScore: 77,
          targetBalancedScore: 80,
          weeklyMinutes: 105,
        },
      ],
    },
    {
      id: 'child-2',
      familyId: 'fam-principal-01',
      name: 'Maya',
      nickname: 'Maya (Grade 1 • Guided)',
      age: 6,
      gradeLabel: 'Grade 1',
      releaseLevel: 'LEVEL_1_GUIDED',
      pinRequired: false,
      avatarGradient: 'from-rose-400 via-pink-500 to-amber-400',
      avatarEmoji: '🦋',
      currentMood: 'ENERGIZED',
      streakDays: 9,
      graceShieldsRemaining: 2,
      maxGraceShieldsPerMonth: 2,
      graceDayActiveToday: false,
      lastGraceShieldDate: '2026-09-14',
      kudosCount30Days: 11,
      coachingCheckIns30Days: 9,
      personalBestHeadline:
        'Sounded out 3 multi-syllable vowel-team words independently & transitioned from Puppet Play to Dance with zero tears!',
      resilienceBadges: [
        {
          id: 'res-m1',
          title: 'Comeback Kid',
          description: 'Bounced right back to Morning Checklist after a rainy Sunday rest shield.',
          iconName: 'Sparkles',
          unlockedAt: '2026-09-15',
          isBounceBack: true,
        },
        {
          id: 'res-m2',
          title: 'Runway Pilot',
          description: 'Wrapped up imaginative play before the 3-minute Dance runway chime finished!',
          iconName: 'PlaneLanding',
          unlockedAt: '2026-09-23',
          isBounceBack: false,
        },
      ],
      ipsativeBaseline: [
        {
          pillar: 'ACADEMIC_MASTERY',
          label: 'Academic Mastery',
          previous30DayScore: 62,
          currentScore: 78,
          targetBalancedScore: 75,
          weeklyMinutes: 125,
        },
        {
          pillar: 'DISCIPLINES_ARTS',
          label: 'Disciplines & Arts',
          previous30DayScore: 70,
          currentScore: 85,
          targetBalancedScore: 80,
          weeklyMinutes: 150,
        },
        {
          pillar: 'UNSTRUCTURED_PLAY',
          label: 'Unstructured Play',
          previous30DayScore: 80,
          currentScore: 91,
          targetBalancedScore: 90,
          weeklyMinutes: 410,
        },
        {
          pillar: 'RESTORATION_FAMILY',
          label: 'Restoration & Family',
          previous30DayScore: 75,
          currentScore: 88,
          targetBalancedScore: 85,
          weeklyMinutes: 360,
        },
        {
          pillar: 'EXECUTIVE_HABITS',
          label: 'Executive Habits',
          previous30DayScore: 52,
          currentScore: 71,
          targetBalancedScore: 75,
          weeklyMinutes: 85,
        },
      ],
    },
  ],
  tasks: [
    // CHILD 1 (Leo - Grade 4, Level 2 Co-Pilot)
    // Intentionally has two HIGH_COGNITIVE tasks back-to-back (orderIndex 1 and 2) so the Cognitive Load Balancer triggers immediately and can be resolved in 1 click!
    {
      id: 'task-leo-1',
      childId: 'child-1',
      title: 'AoPS Math: Combinatorics & Parity Quest',
      subtitle: 'Beast Academy 4D • 4 Star Challenge Problems',
      pillar: 'ACADEMIC_MASTERY',
      energyLoad: 'HIGH_COGNITIVE',
      scheduledStartTime: '15:30',
      defaultDurationMinutes: 30,
      status: 'SCHEDULED',
      socraticHints: [
        'What strategy did you try when you hit a wall on a 2-star problem?',
        'Did drawing a smaller diagram or testing simple numbers unlock a pattern?',
        'Which problem stretched your brain the most today?',
      ],
      runwayWarning10MinText: '10-Min Approach Runway: Grab your AoPS graph notebook, sharpened pencil & water bottle.',
      runwayWarning3MinText: '3-Min Landing Runway: Clear desk space and take 2 deep breaths before AoPS.',
      orderIndex: 1,
      parentApproved: true,
    },
    {
      id: 'task-leo-2',
      childId: 'child-1',
      title: 'Abacus Mental Math (Anzan 3-Digit Sprint)',
      subtitle: 'Soroban Visualization & Speed Accuracy Drills',
      pillar: 'ACADEMIC_MASTERY',
      energyLoad: 'HIGH_COGNITIVE',
      scheduledStartTime: '16:05',
      defaultDurationMinutes: 20,
      status: 'SCHEDULED',
      socraticHints: [
        'When picturing the mental soroban beads, which column felt clearest?',
        'Did slowing down on complementary +9/-1 exchanges improve your accuracy?',
      ],
      runwayWarning10MinText: '10-Min Approach Runway: Set out Soroban frame and finger warm-up.',
      runwayWarning3MinText: '3-Min Landing Runway: Shake out hands & close eyes for 10s mental bead reset.',
      orderIndex: 2,
      parentApproved: true,
    },
    {
      id: 'task-leo-3',
      childId: 'child-1',
      title: 'Daily Free Play & Lego Technic Mars Rover',
      subtitle: 'Unstructured gears, suspension build & outdoor scooter break',
      pillar: 'UNSTRUCTURED_PLAY',
      energyLoad: 'RESTORATIVE',
      scheduledStartTime: '16:35',
      defaultDurationMinutes: 35,
      status: 'SCHEDULED',
      socraticHints: [
        'What part of your Lego gear mechanism was most fun to invent?',
        'Did this break help recharge your brain battery after math?',
      ],
      runwayWarning10MinText: '10-Min Approach Runway: Wrap up your Lego build — Karate prep starts in 10 minutes!',
      runwayWarning3MinText: '3-Min Final Runway: Park your Lego rover in the display tray & grab your Karate Gi.',
      orderIndex: 3,
      parentApproved: true,
    },
    {
      id: 'task-leo-4',
      childId: 'child-1',
      title: 'Karate Dojo: Heian Yondan Kata & Sparring',
      subtitle: 'Brown Belt Stripe Prep • Stance Stability & Focus',
      pillar: 'DISCIPLINES_ARTS',
      energyLoad: 'PHYSICAL',
      scheduledStartTime: '17:20',
      defaultDurationMinutes: 45,
      status: 'SCHEDULED',
      socraticHints: [
        'Which stance or slow-kick balance transition felt sharpest today?',
        'How did you reset your breathing after sparring rounds?',
      ],
      runwayWarning10MinText: '10-Min Approach Runway: Tie Brown Belt, fill dojo water bottle, and check shin guards.',
      runwayWarning3MinText: '3-Min Final Runway: Shoes on at the front door — heading to Karate Dojo!',
      orderIndex: 4,
      parentApproved: true,
    },
    {
      id: 'task-leo-5',
      childId: 'child-1',
      title: 'Evening Backpack Audit & Morning Launchpad',
      subtitle: 'Pack folder, charge Chromebook, lay out tomorrow’s clothes',
      pillar: 'EXECUTIVE_HABITS',
      energyLoad: 'RESTORATIVE',
      scheduledStartTime: '19:00',
      defaultDurationMinutes: 15,
      status: 'COMPLETED',
      estimatedMinutes: 15,
      actualMinutes: 14,
      completedAt: '2026-09-26T14:15:00-04:00',
      socraticHints: [
        'What is one thing Future-Leo will thank Tonight-Leo for packing early?',
      ],
      runwayWarning10MinText: '10-Min Approach Runway: Bring school folder to the launchpad hook.',
      runwayWarning3MinText: '3-Min Final Runway: Quick 3-item backpack zip check.',
      orderIndex: 5,
      parentApproved: true,
    },

    // CHILD 2 (Maya - Grade 1, Level 1 Guided)
    {
      id: 'task-maya-1',
      childId: 'child-2',
      title: 'Reading & Phonics: Vowel Team Treasure Hunt',
      subtitle: 'Read 4 decodable pages aloud + sound-box magnet tiles',
      pillar: 'ACADEMIC_MASTERY',
      energyLoad: 'HIGH_COGNITIVE',
      scheduledStartTime: '15:15',
      defaultDurationMinutes: 20,
      status: 'COMPLETED',
      estimatedMinutes: 15,
      actualMinutes: 18,
      completedAt: '2026-09-26T15:33:00-04:00',
      socraticHints: [
        'Which tricky word did you stretch out like a rubber band today?',
        'What was your favorite picture or character in the story?',
      ],
      runwayWarning10MinText: '10-Min Cozy Warning: Pick your favorite reading pillow and phonics magnet board!',
      runwayWarning3MinText: '3-Min Landing Runway: Snuggle into the reading nook — story time in 3 minutes!',
      orderIndex: 1,
      parentApproved: true,
    },
    {
      id: 'task-maya-2',
      childId: 'child-2',
      title: 'Imaginative Play: Woodland Puppet Theater',
      subtitle: 'Unstructured storytelling, dress-up capes & plushie clinic',
      pillar: 'UNSTRUCTURED_PLAY',
      energyLoad: 'RESTORATIVE',
      scheduledStartTime: '15:45',
      defaultDurationMinutes: 35,
      status: 'SCHEDULED',
      socraticHints: [
        'What adventure did your puppets go on today?',
        'How did you help your plushie patients feel better?',
      ],
      runwayWarning10MinText: '10-Min Runway: Let the puppets finish their finale — Dance leotard prep in 10 minutes!',
      runwayWarning3MinText: '3-Min Runway: Tuck puppets into their basket & hop into Dance shoes!',
      orderIndex: 2,
      parentApproved: true,
    },
    {
      id: 'task-maya-3',
      childId: 'child-2',
      title: 'Creative Movement & Contemporary Dance',
      subtitle: 'Rhythm leaps, ribbon spirals & balance freezes',
      pillar: 'DISCIPLINES_ARTS',
      energyLoad: 'PHYSICAL',
      scheduledStartTime: '16:30',
      defaultDurationMinutes: 30,
      status: 'SCHEDULED',
      socraticHints: [
        'Which leap or ribbon twirl made you feel like you were flying?',
      ],
      runwayWarning10MinText: '10-Min Runway: Put on pink dance leotard and grab your water bottle.',
      runwayWarning3MinText: '3-Min Runway: Twirl to the hallway — Dance starts in 3 minutes!',
      orderIndex: 3,
      parentApproved: true,
    },
    {
      id: 'task-maya-4',
      childId: 'child-2',
      title: 'Warm-Water Swimming: Streamline Glides',
      subtitle: 'Kickboard dolphin kicks & back-float star breathing',
      pillar: 'DISCIPLINES_ARTS',
      energyLoad: 'PHYSICAL',
      scheduledStartTime: '17:15',
      defaultDurationMinutes: 30,
      status: 'SCHEDULED',
      socraticHints: [
        'How long did you hold your cozy starfish back-float today?',
      ],
      runwayWarning10MinText: '10-Min Runway: Goggles and towel in the swim tote bag!',
      runwayWarning3MinText: '3-Min Runway: Goggles ready — pool deck check-in!',
      orderIndex: 4,
      parentApproved: true,
    },
    {
      id: 'task-maya-5',
      childId: 'child-2',
      title: 'Family Movie Night & Cozy Blanket Fort',
      subtitle: 'Shared family cinema, popcorn bowls & Friday/Saturday wind-down',
      pillar: 'RESTORATION_FAMILY',
      energyLoad: 'RESTORATIVE',
      scheduledStartTime: '18:30',
      defaultDurationMinutes: 60,
      status: 'SCHEDULED',
      socraticHints: [
        'Which moment in the movie made everyone laugh or cheer together?',
      ],
      runwayWarning10MinText: '10-Min Runway: Pajamas on and pick two cozy throw blankets for the fort!',
      runwayWarning3MinText: '3-Min Runway: Grab popcorn bowls — lights dimming in 3 minutes!',
      orderIndex: 5,
      parentApproved: true,
    },
  ],
  estimations: [
    {
      id: 'est-1',
      childId: 'child-1',
      taskId: 'task-leo-1',
      taskTitle: 'AoPS Math: Number Theory Stars',
      pillar: 'ACADEMIC_MASTERY',
      energyLoad: 'HIGH_COGNITIVE',
      estimatedMinutes: 15,
      actualMinutes: 28,
      deltaMinutes: 13,
      accuracyPercent: 54,
      recordedAt: '2026-09-21',
    },
    {
      id: 'est-2',
      childId: 'child-1',
      taskId: 'task-leo-2',
      taskTitle: 'Abacus Mental Math Sprint',
      pillar: 'ACADEMIC_MASTERY',
      energyLoad: 'HIGH_COGNITIVE',
      estimatedMinutes: 15,
      actualMinutes: 21,
      deltaMinutes: 6,
      accuracyPercent: 71,
      recordedAt: '2026-09-22',
    },
    {
      id: 'est-3',
      childId: 'child-1',
      taskId: 'task-leo-1',
      taskTitle: 'AoPS Math: Grid Logic',
      pillar: 'ACADEMIC_MASTERY',
      energyLoad: 'HIGH_COGNITIVE',
      estimatedMinutes: 25,
      actualMinutes: 31,
      deltaMinutes: 6,
      accuracyPercent: 81,
      recordedAt: '2026-09-24',
    },
    {
      id: 'est-4',
      childId: 'child-1',
      taskId: 'task-leo-4',
      taskTitle: 'Karate Kata Practice',
      pillar: 'DISCIPLINES_ARTS',
      energyLoad: 'PHYSICAL',
      estimatedMinutes: 30,
      actualMinutes: 33,
      deltaMinutes: 3,
      accuracyPercent: 91,
      recordedAt: '2026-09-25',
    },
    {
      id: 'est-5',
      childId: 'child-1',
      taskId: 'task-leo-5',
      taskTitle: 'Evening Backpack Audit & Launchpad',
      pillar: 'EXECUTIVE_HABITS',
      energyLoad: 'RESTORATIVE',
      estimatedMinutes: 15,
      actualMinutes: 14,
      deltaMinutes: -1,
      accuracyPercent: 93,
      recordedAt: '2026-09-26',
    },
    {
      id: 'est-m1',
      childId: 'child-2',
      taskId: 'task-maya-1',
      taskTitle: 'Reading & Phonics: Vowel Team Treasure Hunt',
      pillar: 'ACADEMIC_MASTERY',
      energyLoad: 'HIGH_COGNITIVE',
      estimatedMinutes: 15,
      actualMinutes: 18,
      deltaMinutes: 3,
      accuracyPercent: 83,
      recordedAt: '2026-09-26',
    },
  ],
  reflections: [
    {
      id: 'ref-leo-1',
      childId: 'child-1',
      taskId: 'task-leo-1',
      taskTitle: 'AoPS Math: Combinatorics & Parity Quest',
      pillar: 'ACADEMIC_MASTERY',
      whatIDid: 'Worked through 4 Beast Academy parity switch problems and drew a 3x3 test grid in my notebook.',
      whereIGotStuck: 'Got stuck for 12 minutes on Problem #14 because I tried guessing flips on the 5x5 grid and started feeling frustrated.',
      whatClicked: 'Testing a tiny 3x3 grid first showed me that every row flip changes an odd number of switches (parity invariant)!',
      socraticPromptUsed: 'Did drawing a smaller diagram or testing simple numbers unlock a pattern?',
      moodBefore: 'STEADY',
      moodAfter: 'TIRED',
      artifactId: 'art-leo-1',
      voiceDictated: true,
      createdAt: '2026-09-25T16:10:00-04:00',
    },
    {
      id: 'ref-leo-2',
      childId: 'child-1',
      taskId: 'task-leo-4',
      taskTitle: 'Karate Dojo: Heian Yondan Kata & Sparring',
      pillar: 'DISCIPLINES_ARTS',
      whatIDid: 'Practiced the slow double-block extension in Heian Yondan 8 times and earned my 2nd black stripe.',
      whereIGotStuck: 'My front foot wobbled on the spinning back-stance transition when I rushed.',
      whatClicked: 'Exhaling slowly and bending my back knee deeper kept my center of gravity locked in.',
      socraticPromptUsed: 'Which stance or slow-kick balance transition felt sharpest today?',
      moodBefore: 'TIRED',
      moodAfter: 'ENERGIZED',
      artifactId: 'art-leo-2',
      voiceDictated: false,
      createdAt: '2026-09-25T18:15:00-04:00',
    },
    {
      id: 'ref-maya-1',
      childId: 'child-2',
      taskId: 'task-maya-1',
      taskTitle: 'Reading & Phonics: Vowel Team Treasure Hunt',
      pillar: 'ACADEMIC_MASTERY',
      whatIDid: 'Read "The Green Bee by the Deep Sea" out loud and built 6 EA/EE words with magnet tiles.',
      whereIGotStuck: 'Mixed up "bread" (short e) and "bead" (long e) on page 3.',
      whatClicked: 'Tapped each sound with my fingers and remembered the two-vowels-walking rule!',
      socraticPromptUsed: 'Which tricky word did you stretch out like a rubber band today?',
      moodBefore: 'ENERGIZED',
      moodAfter: 'FOCUSED',
      artifactId: 'art-maya-1',
      voiceDictated: true,
      createdAt: '2026-09-26T15:35:00-04:00',
    },
  ],
  artifacts: [
    {
      id: 'art-leo-1',
      childId: 'child-1',
      taskId: 'task-leo-1',
      title: 'AoPS 4D Parity Grid Proof Sketch',
      category: 'WORKSHEET',
      dataUrl: AOPS_WORKSHEET_SVG,
      caption: 'Tested 3x3 parity invariant before solving the 5x5 challenge!',
      createdAt: '2026-09-25T16:10:00-04:00',
    },
    {
      id: 'art-leo-2',
      childId: 'child-1',
      taskId: 'task-leo-4',
      title: 'Brown Belt 2nd Black Stripe (Heian Yondan)',
      category: 'BELT_STRIPE',
      dataUrl: KARATE_STRIPE_SVG,
      caption: 'Sensei awarded 2nd stripe for slow-tension Kokutsu-dachi balance!',
      createdAt: '2026-09-25T18:15:00-04:00',
    },
    {
      id: 'art-maya-1',
      childId: 'child-2',
      taskId: 'task-maya-1',
      title: 'Vowel Teams Storybook & Magnet Tile Snap',
      category: 'WORKSHEET',
      dataUrl: PHONICS_STORY_SVG,
      caption: 'Sounded out "beneath" and "dreamboat" independently!',
      createdAt: '2026-09-26T15:35:00-04:00',
    },
  ],
  kudos: [
    {
      id: 'kudos-1',
      childId: 'child-1',
      fromParentName: 'Principal Nitin (Dad)',
      badgeType: 'GRIT',
      message:
        'I noticed you hit a 12-minute wall on AoPS Problem #14 and chose to draw a smaller 3x3 case instead of quitting. That strategy shift is what real mathematicians do!',
      relatedTaskId: 'task-leo-1',
      socraticQuestion: 'Which problem stretched your brain the most today, and where else could you use the "smaller case" strategy?',
      createdAt: '2026-09-25T19:30:00-04:00',
      acknowledgedByChild: true,
    },
    {
      id: 'kudos-2',
      childId: 'child-2',
      fromParentName: 'Dr. Priya (Mom)',
      badgeType: 'SELF_REGULATION',
      message:
        'You heard the 10-minute Runway chime during Puppet Theater, tucked your puppets into their basket calmly, and hopped into your dance shoes with a huge smile!',
      relatedTaskId: 'task-maya-2',
      socraticQuestion: 'How did it feel in your body when you had plenty of time to get ready for Dance?',
      createdAt: '2026-09-25T19:45:00-04:00',
      acknowledgedByChild: true,
    },
  ],
  coachingSuggestions: [
    {
      id: 'coach-1',
      childId: 'child-1',
      childName: 'Leo',
      taskId: 'task-leo-1',
      taskTitle: 'AoPS Math: Combinatorics & Parity Quest',
      triggerReason: 'Logged "Tired" mood after AoPS + underestimated task time by 13 min earlier this week',
      childMood: 'TIRED',
      avoidPhrase: '"Did you get all the problems right?" or "Why did 4 problems take 30 minutes?"',
      socraticScript:
        '"AoPS was marked high-stretch today — which problem made you stretch your brain the most? Show me how your 3×3 sketch helped!"',
      followUpAction: 'Insert a 15-min Restorative Lego or snack buffer before Abacus.',
      dispatched: false,
    },
    {
      id: 'coach-2',
      childId: 'child-2',
      childName: 'Maya',
      taskId: 'task-maya-1',
      taskTitle: 'Reading & Phonics: Vowel Team Treasure Hunt',
      triggerReason: 'Logged self-correction on tricky "ea" vowel team words ("bread" vs "bead")',
      childMood: 'FOCUSED',
      avoidPhrase: '"You’re such a smart reader!" (Fixed-trait label)',
      socraticScript:
        '"I loved hearing how you stretched out \'beneath\' when you got stuck! How did your brain figure out when \'ea\' says short-e vs long-e?"',
      followUpAction: 'Send a Grit or Creative Breakthrough badge before Family Movie Night.',
      dispatched: false,
    },
    {
      id: 'coach-3',
      childId: 'child-1',
      childName: 'Leo',
      taskId: 'task-leo-2',
      taskTitle: 'Abacus Mental Math (Anzan 3-Digit Sprint)',
      triggerReason: 'Schedule Alert: Two High-Cognitive blocks (AoPS + Abacus) clustered back-to-back',
      childMood: 'FOCUSED',
      avoidPhrase: '"Just push through Abacus right now so you’re done early."',
      socraticScript:
        '"Your brain just did heavy lifting in AoPS. As Co-Pilot, do you want to place your Lego Rover Restorative block between AoPS and Abacus today?"',
      followUpAction: 'Use 1-Click Cognitive Load Rebalancer to swap Abacus and Free Play.',
      dispatched: false,
    },
  ],
  summitCommitments: [
    {
      id: 'sum-1',
      childId: 'child-1',
      childName: 'Leo (Grade 4)',
      celebrationWin:
        'Improved time estimation accuracy from 54% → 91% and earned 2nd Brown Belt stripe in Karate!',
      roadblockIdentified:
        'Doing Abacus immediately after AoPS at 4:05 PM drains mental battery and causes frustration.',
      socraticDiscussionPrompt:
        '"When your brain feels full after AoPS, what 20-minute restorative activity recharges you best before Abacus?"',
      nextWeekAdjustment:
        'Schedule 25 min of Unstructured Lego/Outdoor Play between AoPS and Abacus on Tue/Thu/Sat.',
      parentSupportPledge:
        'Dad will celebrate strategy sketches over speed and honor the 10-min Lego runway warning.',
      completedInSummit: false,
    },
    {
      id: 'sum-2',
      childId: 'child-2',
      childName: 'Maya (Grade 1)',
      celebrationWin:
        'Read 4 full decodable pages aloud and used the 10-minute Runway Chime to pack up puppets peacefully!',
      roadblockIdentified:
        'Gets hungry and wiggly right between Dance and Swimming around 5:05 PM.',
      socraticDiscussionPrompt:
        '"What power-snack in the car or poolside helps your body feel cozy and strong before Swimming?"',
      nextWeekAdjustment:
        'Pack apple slices + cheddar cubes in the swim bag as part of the 10-minute Runway routine.',
      parentSupportPledge:
        'Mom will play Maya’s favorite marimba runway song 10 minutes before Puppet Theater ends.',
      completedInSummit: false,
    },
  ],
  integrationLogs: [
    {
      id: 'int-1',
      channel: 'ICS_CALENDAR',
      direction: 'OUTBOUND',
      recipient: 'sharma.family.hub@googlecalendar.ics',
      subject: '2-Way .ICS Sync: 10 Family Executive & Pillar Blocks Published',
      payloadPreview: 'BEGIN:VCALENDAR // SUMMARY:[HIGH-MENTAL] AoPS Math // VALARM:-PT10M (Runway Stage 1) & -PT3M (Runway Stage 2)',
      status: 'SYNCED',
      timestamp: '2026-09-26T14:00:00-04:00',
    },
    {
      id: 'int-2',
      channel: 'TWILIO_SMS',
      direction: 'OUTBOUND',
      recipient: '+1 (555) 234-8910 (Principal Nitin)',
      subject: 'Socratic Coaching Whisper Triggered',
      payloadPreview: 'Nuvoriq Coach: Leo finished AoPS (marked Tired). Ask: "Which problem stretched your brain most today?"',
      status: 'DELIVERED',
      timestamp: '2026-09-25T16:11:00-04:00',
    },
    {
      id: 'int-3',
      channel: 'RESEND_EMAIL',
      direction: 'OUTBOUND',
      recipient: 'parents@sharma-miller-family.org',
      subject: 'Sunday Family Summit Agenda Ready (10-Min Guided Script)',
      payloadPreview: 'Weekly Ipsative Growth Digest + 3 Personalized Socratic Conversation Prompts for Leo & Maya.',
      status: 'DELIVERED',
      timestamp: '2026-09-26T09:00:00-04:00',
    },
  ],
};
