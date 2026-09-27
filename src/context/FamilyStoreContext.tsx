'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  ChildProfile,
  EnergyLoad,
  ExternalIntegrationLog,
  FamilyStoreState,
  KudosBadgeType,
  LifePillar,
  MediaArtifact,
  MoodState,
  ReleaseLevel,
  ScheduledTask,
  SocraticCoachingSuggestion,
  ThemeId,
} from '@/types/domain';
import { INITIAL_FAMILY_STORE } from '@/lib/seedData';
import { supabaseMockClient } from '@/lib/supabaseMock';
import { playRunwayChime } from '@/lib/audioChime';

export interface CognitiveClashWarning {
  childId: string;
  firstTask: ScheduledTask;
  secondTask: ScheduledTask;
  explanation: string;
}

interface CompleteTaskPayload {
  taskId: string;
  estimatedMinutes: number;
  actualMinutes: number;
  whatIDid: string;
  whereIGotStuck: string;
  whatClicked: string;
  socraticPromptUsed: string;
  moodBefore: MoodState;
  moodAfter: MoodState;
  voiceDictated: boolean;
  artifactDataUrl?: string;
  artifactTitle?: string;
  artifactCategory?: MediaArtifact['category'];
}

interface ProposeTaskPayload {
  childId: string;
  title: string;
  subtitle: string;
  pillar: LifePillar;
  energyLoad: EnergyLoad;
  scheduledStartTime: string;
  defaultDurationMinutes: number;
}

interface FamilyStoreContextValue {
  state: FamilyStoreState;
  isHydrated: boolean;
  activeChild: ChildProfile | undefined;
  isParentView: boolean;
  activeTheme: ThemeId;
  isSidebarCollapsed: boolean;
  isMobileSidebarOpen: boolean;
  activePillarFilter: LifePillar | 'ALL';
  setActiveTheme: (theme: ThemeId) => void;
  toggleSidebarCollapsed: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
  setActivePillarFilter: (pillar: LifePillar | 'ALL') => void;
  setActiveProfile: (profileId: string) => void;
  toggleChildPinRequirement: (childId: string) => void;
  setChildReleaseLevel: (childId: string, level: ReleaseLevel) => void;
  setChildMood: (childId: string, mood: MoodState) => void;
  getChildTasks: (childId: string) => ScheduledTask[];
  getCognitiveClashes: (childId: string) => CognitiveClashWarning[];
  autoBalanceCognitiveSchedule: (childId: string) => void;
  moveTaskOrder: (taskId: string, direction: 'UP' | 'DOWN') => void;
  completeTaskWithCalibrationAndReflection: (payload: CompleteTaskPayload) => void;
  proposeOrCreateTask: (payload: ProposeTaskPayload, isParent: boolean) => void;
  approveProposedTask: (taskId: string) => void;
  activateGraceDayShield: (childId: string, reason: string) => void;
  triggerBounceBackCheckIn: (childId: string) => void;
  dispatchParentKudos: (
    childId: string,
    badgeType: KudosBadgeType,
    message: string,
    socraticQuestion?: string,
    suggestionIdToMark?: string
  ) => void;
  toggleSummitCommitmentComplete: (commitmentId: string) => void;
  updateSummitAdjustment: (commitmentId: string, nextWeekAdjustment: string, parentSupportPledge: string) => void;
  logIntegrationEvent: (log: Omit<ExternalIntegrationLog, 'id' | 'timestamp'>) => void;
  importTasksFromIcs: (tasks: Partial<ScheduledTask>[], childId: string) => void;
  resetDemoData: () => Promise<void>;
}

const FamilyStoreContext = createContext<FamilyStoreContextValue | null>(null);

export function FamilyStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<FamilyStoreState>(INITIAL_FAMILY_STORE);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activePillarFilter, setActivePillarFilter] = useState<LifePillar | 'ALL'>('ALL');

  useEffect(() => {
    let mounted = true;
    supabaseMockClient.loadState().then((loaded) => {
      if (mounted) {
        setState({
          ...loaded,
          activeTheme: loaded.activeTheme || 'OBSIDIAN_TEAL',
          sidebarCollapsed: Boolean(loaded.sidebarCollapsed),
        });
        setIsHydrated(true);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const activeTheme: ThemeId = state.activeTheme || 'OBSIDIAN_TEAL';
  const isSidebarCollapsed: boolean = Boolean(state.sidebarCollapsed);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', activeTheme);
    }
  }, [activeTheme]);

  const updateAndPersist = useCallback((updater: (prev: FamilyStoreState) => FamilyStoreState) => {
    setState((prev) => {
      const next = updater(prev);
      supabaseMockClient.saveState(next);
      return next;
    });
  }, []);

  const setActiveTheme = useCallback(
    (theme: ThemeId) => {
      updateAndPersist((prev) => ({
        ...prev,
        activeTheme: theme,
      }));
    },
    [updateAndPersist]
  );

  const toggleSidebarCollapsed = useCallback(() => {
    updateAndPersist((prev) => ({
      ...prev,
      sidebarCollapsed: !prev.sidebarCollapsed,
    }));
  }, [updateAndPersist]);

  const setActiveProfile = useCallback(
    (profileId: string) => {
      updateAndPersist((prev) => ({
        ...prev,
        activeProfileId: profileId,
      }));
    },
    [updateAndPersist]
  );

  const toggleChildPinRequirement = useCallback(
    (childId: string) => {
      updateAndPersist((prev) => ({
        ...prev,
        children: prev.children.map((c) =>
          c.id === childId ? { ...c, pinRequired: !c.pinRequired } : c
        ),
      }));
    },
    [updateAndPersist]
  );

  const setChildReleaseLevel = useCallback(
    (childId: string, releaseLevel: ReleaseLevel) => {
      updateAndPersist((prev) => ({
        ...prev,
        children: prev.children.map((c) =>
          c.id === childId ? { ...c, releaseLevel } : c
        ),
      }));
    },
    [updateAndPersist]
  );

  const setChildMood = useCallback(
    (childId: string, currentMood: MoodState) => {
      updateAndPersist((prev) => ({
        ...prev,
        children: prev.children.map((c) =>
          c.id === childId ? { ...c, currentMood } : c
        ),
      }));
    },
    [updateAndPersist]
  );

  const getChildTasks = useCallback(
    (childId: string): ScheduledTask[] => {
      return state.tasks
        .filter((t) => t.childId === childId)
        .filter((t) => activePillarFilter === 'ALL' || t.pillar === activePillarFilter)
        .sort((a, b) => a.orderIndex - b.orderIndex);
    },
    [state.tasks, activePillarFilter]
  );

  const getCognitiveClashes = useCallback(
    (childId: string): CognitiveClashWarning[] => {
      const ordered = state.tasks
        .filter((t) => t.childId === childId && t.status !== 'COMPLETED')
        .sort((a, b) => a.orderIndex - b.orderIndex);
      const clashes: CognitiveClashWarning[] = [];
      for (let i = 0; i < ordered.length - 1; i++) {
        const curr = ordered[i];
        const next = ordered[i + 1];
        if (curr.energyLoad === 'HIGH_COGNITIVE' && next.energyLoad === 'HIGH_COGNITIVE') {
          clashes.push({
            childId,
            firstTask: curr,
            secondTask: next,
            explanation: `"${curr.title}" and "${next.title}" are both High-Mental blocks scheduled back-to-back without a Restorative or Physical buffer.`,
          });
        }
      }
      return clashes;
    },
    [state.tasks]
  );

  const autoBalanceCognitiveSchedule = useCallback(
    (childId: string) => {
      updateAndPersist((prev) => {
        const childTasks = prev.tasks
          .filter((t) => t.childId === childId)
          .sort((a, b) => a.orderIndex - b.orderIndex);

        for (let i = 0; i < childTasks.length - 1; i++) {
          if (
            childTasks[i].energyLoad === 'HIGH_COGNITIVE' &&
            childTasks[i + 1].energyLoad === 'HIGH_COGNITIVE'
          ) {
            const bufferIdx = childTasks.findIndex(
              (t, idx) =>
                idx > i + 1 &&
                (t.energyLoad === 'RESTORATIVE' || t.energyLoad === 'PHYSICAL')
            );

            if (bufferIdx !== -1) {
              const [bufferTask] = childTasks.splice(bufferIdx, 1);
              childTasks.splice(i + 1, 0, bufferTask);
            } else {
              const newBuffer: ScheduledTask = {
                id: `task-buffer-${Date.now()}`,
                childId,
                title: '15-Min Brain Recharge: Lego & Hydration Buffer',
                subtitle: 'Auto-inserted Restorative Buffer to prevent cognitive fatigue',
                pillar: 'RESTORATION_FAMILY',
                energyLoad: 'RESTORATIVE',
                scheduledStartTime: '16:00',
                defaultDurationMinutes: 15,
                status: 'SCHEDULED',
                socraticHints: ['How does your brain feel after a 15-minute movement & snack pause?'],
                runwayWarning10MinText: '10-Min Warning: Enjoy your restorative break!',
                runwayWarning3MinText: '3-Min Runway: Wrap up break — next focus block in 3 minutes.',
                orderIndex: i + 1.5,
                parentApproved: true,
              };
              childTasks.splice(i + 1, 0, newBuffer);
            }
            break;
          }
        }

        const reindexed = childTasks.map((t, index) => ({
          ...t,
          orderIndex: index + 1,
        }));

        const otherTasks = prev.tasks.filter((t) => t.childId !== childId);
        return {
          ...prev,
          tasks: [...otherTasks, ...reindexed],
        };
      });
    },
    [updateAndPersist]
  );

  const moveTaskOrder = useCallback(
    (taskId: string, direction: 'UP' | 'DOWN') => {
      updateAndPersist((prev) => {
        const target = prev.tasks.find((t) => t.id === taskId);
        if (!target) return prev;
        const childTasks = prev.tasks
          .filter((t) => t.childId === target.childId)
          .sort((a, b) => a.orderIndex - b.orderIndex);
        const idx = childTasks.findIndex((t) => t.id === taskId);
        if (idx === -1) return prev;
        const swapIdx = direction === 'UP' ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= childTasks.length) return prev;

        const copy = [...childTasks];
        const temp = copy[idx];
        copy[idx] = copy[swapIdx];
        copy[swapIdx] = temp;

        const reindexed = copy.map((t, i) => ({ ...t, orderIndex: i + 1 }));
        const otherTasks = prev.tasks.filter((t) => t.childId !== target.childId);
        return {
          ...prev,
          tasks: [...otherTasks, ...reindexed],
        };
      });
    },
    [updateAndPersist]
  );

  const completeTaskWithCalibrationAndReflection = useCallback(
    (payload: CompleteTaskPayload) => {
      playRunwayChime('TASK_COMPLETE');
      updateAndPersist((prev) => {
        const task = prev.tasks.find((t) => t.id === payload.taskId);
        if (!task) return prev;
        const child = prev.children.find((c) => c.id === task.childId);

        const deltaMinutes = payload.actualMinutes - payload.estimatedMinutes;
        const accuracyPercent = Math.max(
          0,
          Math.min(
            100,
            Math.round(
              100 -
                (Math.abs(deltaMinutes) / Math.max(payload.estimatedMinutes, 1)) * 100
            )
          )
        );

        const newEstimation = {
          id: `est-${Date.now()}`,
          childId: task.childId,
          taskId: task.id,
          taskTitle: task.title,
          pillar: task.pillar,
          energyLoad: task.energyLoad,
          estimatedMinutes: payload.estimatedMinutes,
          actualMinutes: payload.actualMinutes,
          deltaMinutes,
          accuracyPercent,
          recordedAt: new Date().toISOString().slice(0, 10),
        };

        let newArtifactId: string | undefined;
        const nextArtifacts = [...prev.artifacts];
        if (payload.artifactDataUrl) {
          newArtifactId = `art-${Date.now()}`;
          nextArtifacts.unshift({
            id: newArtifactId,
            childId: task.childId,
            taskId: task.id,
            title: payload.artifactTitle || `${task.title} Artifact`,
            category: payload.artifactCategory || 'WORKSHEET',
            dataUrl: payload.artifactDataUrl,
            caption: payload.whatClicked || payload.whatIDid,
            createdAt: new Date().toISOString(),
          });
        }

        const newReflection = {
          id: `ref-${Date.now()}`,
          childId: task.childId,
          taskId: task.id,
          taskTitle: task.title,
          pillar: task.pillar,
          whatIDid: payload.whatIDid,
          whereIGotStuck: payload.whereIGotStuck,
          whatClicked: payload.whatClicked,
          socraticPromptUsed: payload.socraticPromptUsed,
          moodBefore: payload.moodBefore,
          moodAfter: payload.moodAfter,
          artifactId: newArtifactId,
          voiceDictated: payload.voiceDictated,
          createdAt: new Date().toISOString(),
        };

        const isHighStretch =
          payload.moodAfter === 'TIRED' ||
          payload.moodAfter === 'OVERWHELMED' ||
          Math.abs(deltaMinutes) >= 8;

        const newCoachingSuggestion: SocraticCoachingSuggestion = {
          id: `coach-${Date.now()}`,
          childId: task.childId,
          childName: child?.name || 'Child',
          taskId: task.id,
          taskTitle: task.title,
          triggerReason: `${child?.name || 'Child'} completed "${task.title}" (Estimated ${payload.estimatedMinutes}m vs Actual ${payload.actualMinutes}m, Mood: ${payload.moodAfter})`,
          childMood: payload.moodAfter,
          avoidPhrase: isHighStretch
            ? `"Why did it take ${payload.actualMinutes} minutes?" or "Did you get them all right?"`
            : `"Good job! You're a natural!"`,
          socraticScript: isHighStretch
            ? `"${task.title} was marked high-stretch today — try asking: 'You mentioned getting stuck on ${payload.whereIGotStuck.slice(0, 50) || 'a tricky step'} — what strategy helped you stretch your brain through it?'"`
            : `"Try asking ${child?.name || 'your child'}: 'Your time estimate was ${accuracyPercent}% accurate (${payload.estimatedMinutes}m vs ${payload.actualMinutes}m)! How did you figure out that ${payload.whatClicked.slice(0, 55) || 'new strategy'}?'"`,
          followUpAction: isHighStretch
            ? 'Send a Grit badge and ensure a 20-minute Restorative Play buffer follows.'
            : 'Send a Time-Sense Calibrator or Creative Breakthrough badge.',
          dispatched: false,
        };

        return {
          ...prev,
          tasks: prev.tasks.map((t) =>
            t.id === task.id
              ? {
                  ...t,
                  status: 'COMPLETED',
                  estimatedMinutes: payload.estimatedMinutes,
                  actualMinutes: payload.actualMinutes,
                  completedAt: new Date().toISOString(),
                }
              : t
          ),
          children: prev.children.map((c) =>
            c.id === task.childId
              ? {
                  ...c,
                  currentMood: payload.moodAfter,
                  ipsativeBaseline: c.ipsativeBaseline.map((score) =>
                    score.pillar === task.pillar
                      ? {
                          ...score,
                          currentScore: Math.min(100, score.currentScore + 2),
                          weeklyMinutes: score.weeklyMinutes + payload.actualMinutes,
                        }
                      : score
                  ),
                }
              : c
          ),
          estimations: [newEstimation, ...prev.estimations],
          reflections: [newReflection, ...prev.reflections],
          artifacts: nextArtifacts,
          coachingSuggestions: [newCoachingSuggestion, ...prev.coachingSuggestions],
        };
      });
    },
    [updateAndPersist]
  );

  const proposeOrCreateTask = useCallback(
    (payload: ProposeTaskPayload, isParent: boolean) => {
      updateAndPersist((prev) => {
        const child = prev.children.find((c) => c.id === payload.childId);
        const childTasks = prev.tasks.filter((t) => t.childId === payload.childId);
        const requiresApproval =
          !isParent && child?.releaseLevel === 'LEVEL_2_COPILOT';

        const newTask: ScheduledTask = {
          id: `task-${Date.now()}`,
          childId: payload.childId,
          title: payload.title,
          subtitle: payload.subtitle || 'Custom Pillar Block',
          pillar: payload.pillar,
          energyLoad: payload.energyLoad,
          scheduledStartTime: payload.scheduledStartTime,
          defaultDurationMinutes: payload.defaultDurationMinutes,
          status: requiresApproval ? 'PROPOSED' : 'SCHEDULED',
          socraticHints: [
            `What strategy helped you most during ${payload.title}?`,
            'Where did you stretch your focus the furthest?',
          ],
          runwayWarning10MinText: `10-Min Approach Runway: Wrap up current activity — ${payload.title} starts in 10 minutes.`,
          runwayWarning3MinText: `3-Min Final Runway: Transition to ${payload.title} in 3 minutes!`,
          orderIndex: childTasks.length + 1,
          proposedByChild: !isParent,
          parentApproved: !requiresApproval,
        };

        return {
          ...prev,
          tasks: [...prev.tasks, newTask],
        };
      });
    },
    [updateAndPersist]
  );

  const approveProposedTask = useCallback(
    (taskId: string) => {
      updateAndPersist((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) =>
          t.id === taskId
            ? { ...t, status: 'SCHEDULED', parentApproved: true }
            : t
        ),
      }));
    },
    [updateAndPersist]
  );

  const activateGraceDayShield = useCallback(
    (childId: string, reason: string) => {
      playRunwayChime('KUDOS_SENT');
      updateAndPersist((prev) => ({
        ...prev,
        children: prev.children.map((c) => {
          if (c.id !== childId || c.graceShieldsRemaining <= 0 || c.graceDayActiveToday) {
            return c;
          }
          return {
            ...c,
            graceShieldsRemaining: c.graceShieldsRemaining - 1,
            graceDayActiveToday: true,
            lastGraceShieldDate: new Date().toISOString().slice(0, 10),
            resilienceBadges: [
              {
                id: `res-shield-${Date.now()}`,
                title: `Grace Shield Activated (${reason})`,
                description: `${c.streakDays}-day momentum protected! Rest is part of high performance.`,
                iconName: 'ShieldAlert',
                unlockedAt: new Date().toISOString().slice(0, 10),
                isBounceBack: true,
              },
              ...c.resilienceBadges,
            ],
          };
        }),
      }));
    },
    [updateAndPersist]
  );

  const triggerBounceBackCheckIn = useCallback(
    (childId: string) => {
      playRunwayChime('TASK_COMPLETE');
      updateAndPersist((prev) => ({
        ...prev,
        children: prev.children.map((c) => {
          if (c.id !== childId) return c;
          return {
            ...c,
            graceDayActiveToday: false,
            streakDays: c.streakDays + 1,
            resilienceBadges: [
              {
                id: `res-comeback-${Date.now()}`,
                title: 'Comeback Kid: Bounce-Back Milestone',
                description:
                  'Logged back in with energy after a Grace Day Shield! True executive resilience.',
                iconName: 'Flame',
                unlockedAt: new Date().toISOString().slice(0, 10),
                isBounceBack: true,
              },
              ...c.resilienceBadges,
            ],
          };
        }),
      }));
    },
    [updateAndPersist]
  );

  const dispatchParentKudos = useCallback(
    (
      childId: string,
      badgeType: KudosBadgeType,
      message: string,
      socraticQuestion?: string,
      suggestionIdToMark?: string
    ) => {
      playRunwayChime('KUDOS_SENT');
      updateAndPersist((prev) => ({
        ...prev,
        kudos: [
          {
            id: `kudos-${Date.now()}`,
            childId,
            fromParentName: prev.principalParentName,
            badgeType,
            message,
            socraticQuestion,
            createdAt: new Date().toISOString(),
            acknowledgedByChild: false,
          },
          ...prev.kudos,
        ],
        children: prev.children.map((c) =>
          c.id === childId
            ? {
                ...c,
                kudosCount30Days: c.kudosCount30Days + 1,
                coachingCheckIns30Days: c.coachingCheckIns30Days + 1,
              }
            : c
        ),
        coachingSuggestions: suggestionIdToMark
          ? prev.coachingSuggestions.map((s) =>
              s.id === suggestionIdToMark ? { ...s, dispatched: true } : s
            )
          : prev.coachingSuggestions,
      }));
    },
    [updateAndPersist]
  );

  const toggleSummitCommitmentComplete = useCallback(
    (commitmentId: string) => {
      updateAndPersist((prev) => ({
        ...prev,
        summitCommitments: prev.summitCommitments.map((sc) =>
          sc.id === commitmentId
            ? { ...sc, completedInSummit: !sc.completedInSummit }
            : sc
        ),
      }));
    },
    [updateAndPersist]
  );

  const updateSummitAdjustment = useCallback(
    (commitmentId: string, nextWeekAdjustment: string, parentSupportPledge: string) => {
      updateAndPersist((prev) => ({
        ...prev,
        summitCommitments: prev.summitCommitments.map((sc) =>
          sc.id === commitmentId
            ? { ...sc, nextWeekAdjustment, parentSupportPledge }
            : sc
        ),
      }));
    },
    [updateAndPersist]
  );

  const logIntegrationEvent = useCallback(
    (log: Omit<ExternalIntegrationLog, 'id' | 'timestamp'>) => {
      updateAndPersist((prev) => ({
        ...prev,
        integrationLogs: [
          {
            ...log,
            id: `int-${Date.now()}`,
            timestamp: new Date().toISOString(),
          },
          ...prev.integrationLogs,
        ],
      }));
    },
    [updateAndPersist]
  );

  const importTasksFromIcs = useCallback(
    (imported: Partial<ScheduledTask>[], childId: string) => {
      updateAndPersist((prev) => {
        const existingCount = prev.tasks.filter((t) => t.childId === childId).length;
        const created: ScheduledTask[] = imported.map((item, idx) => ({
          id: `task-ics-${Date.now()}-${idx}`,
          childId,
          title: item.title || 'Synced Calendar Activity',
          subtitle: item.subtitle || 'Imported via .ICS Two-Way Sync',
          pillar: item.pillar || 'ACADEMIC_MASTERY',
          energyLoad: item.energyLoad || 'HIGH_COGNITIVE',
          scheduledStartTime: item.scheduledStartTime || '16:15',
          defaultDurationMinutes: item.defaultDurationMinutes || 30,
          status: 'SCHEDULED',
          socraticHints: ['What part of this activity stretched your skills today?'],
          runwayWarning10MinText: `10-Min Runway: Prepare for ${item.title || 'activity'}.`,
          runwayWarning3MinText: `3-Min Runway: Starting ${item.title || 'activity'} in 3 minutes.`,
          orderIndex: existingCount + idx + 1,
          parentApproved: true,
        }));
        return {
          ...prev,
          tasks: [...prev.tasks, ...created],
        };
      });
    },
    [updateAndPersist]
  );

  const resetDemoData = useCallback(async () => {
    const fresh = await supabaseMockClient.resetToSeed();
    setState(fresh);
  }, []);

  const activeChild = state.children.find((c) => c.id === state.activeProfileId);
  const isParentView = state.activeProfileId === 'PARENT_COMMAND_CENTER';

  return (
    <FamilyStoreContext.Provider
      value={{
        state,
        isHydrated,
        activeChild,
        isParentView,
        activeTheme,
        isSidebarCollapsed,
        isMobileSidebarOpen,
        activePillarFilter,
        setActiveTheme,
        toggleSidebarCollapsed,
        setMobileSidebarOpen,
        setActivePillarFilter,
        setActiveProfile,
        toggleChildPinRequirement,
        setChildReleaseLevel,
        setChildMood,
        getChildTasks,
        getCognitiveClashes,
        autoBalanceCognitiveSchedule,
        moveTaskOrder,
        completeTaskWithCalibrationAndReflection,
        proposeOrCreateTask,
        approveProposedTask,
        activateGraceDayShield,
        triggerBounceBackCheckIn,
        dispatchParentKudos,
        toggleSummitCommitmentComplete,
        updateSummitAdjustment,
        logIntegrationEvent,
        importTasksFromIcs,
        resetDemoData,
      }}
    >
      {children}
    </FamilyStoreContext.Provider>
  );
}

export function useFamilyStore() {
  const ctx = useContext(FamilyStoreContext);
  if (!ctx) {
    throw new Error('useFamilyStore must be used within FamilyStoreProvider');
  }
  return ctx;
}
