'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Award,
  BatteryCharging,
  Brain,
  CheckCircle2,
  Clock,
  Flame,
  HeartHandshake,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  Timer,
  Wand2,
} from 'lucide-react';
import {
  EnergyLoad,
  LifePillar,
  MoodState,
  ReleaseLevel,
  ScheduledTask,
} from '@/types/domain';
import { ENERGY_META, MOOD_META, PILLAR_META } from '@/lib/seedData';
import { useFamilyStore } from '@/context/FamilyStoreContext';
import { TransitionRunwayBanner } from '@/components/TransitionRunwayBanner';
import { FocusCalibrationModal } from '@/components/FocusCalibrationModal';
import { IpsativeRadarChart } from '@/components/IpsativeRadarChart';

const RELEASE_LEVEL_META: Record<
  ReleaseLevel,
  { title: string; badge: string; description: string }
> = {
  LEVEL_1_GUIDED: {
    title: 'Level 1 • K–3 Guided',
    badge: 'Guided Mode',
    description:
      'Parent schedules; child executes, estimates time, and records voice/visual reflections.',
  },
  LEVEL_2_COPILOT: {
    title: 'Level 2 • Grades 4–7 Co-Pilot',
    badge: 'Co-Pilot Mode',
    description:
      'Child rearranges task order & proposes new blocks; parent reviews & approves.',
  },
  LEVEL_3_EXECUTIVE: {
    title: 'Level 3 • Grades 8–12 Executive',
    badge: 'Autonomous Mode',
    description:
      'Student manages full calendar & buffers; parent reviews macro-analytics & Sunday Summit.',
  },
};

export function ChildExecutiveWorkspace() {
  const {
    state,
    activeChild,
    setChildMood,
    setChildReleaseLevel,
    getChildTasks,
    getCognitiveClashes,
    autoBalanceCognitiveSchedule,
    moveTaskOrder,
    proposeOrCreateTask,
    activateGraceDayShield,
    triggerBounceBackCheckIn,
    activePillarFilter,
    setActivePillarFilter,
  } = useFamilyStore();

  const [activeTaskForModal, setActiveTaskForModal] =
    useState<ScheduledTask | null>(null);
  const [showProposeForm, setShowProposeForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubtitle, setNewTaskSubtitle] = useState('');
  const [newTaskPillar, setNewTaskPillar] =
    useState<LifePillar>('UNSTRUCTURED_PLAY');
  const [newTaskEnergy, setNewTaskEnergy] =
    useState<EnergyLoad>('RESTORATIVE');
  const [newTaskTime, setNewTaskTime] = useState('16:20');
  const [newTaskDuration] = useState(25);

  if (!activeChild) return null;

  const allChildTasks = getChildTasks(activeChild.id);
  const tasks =
    activePillarFilter === 'ALL'
      ? allChildTasks
      : allChildTasks.filter((t) => t.pillar === activePillarFilter);
  const clashes = getCognitiveClashes(activeChild.id);
  const nextScheduledTask = allChildTasks.find((t) => t.status === 'SCHEDULED');

  const childEstimations = state.estimations.filter(
    (e) => e.childId === activeChild.id
  );
  const avgCalibrationAccuracy =
    childEstimations.length > 0
      ? Math.round(
          childEstimations.reduce((acc, e) => acc + e.accuracyPercent, 0) /
            childEstimations.length
        )
      : 85;

  const childReflections = state.reflections.filter(
    (r) => r.childId === activeChild.id
  );
  const childArtifacts = state.artifacts.filter(
    (a) => a.childId === activeChild.id
  );
  const childKudos = state.kudos.filter((k) => k.childId === activeChild.id);

  const canReorderOrPropose =
    activeChild.releaseLevel === 'LEVEL_2_COPILOT' ||
    activeChild.releaseLevel === 'LEVEL_3_EXECUTIVE';

  const handleProposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    proposeOrCreateTask(
      {
        childId: activeChild.id,
        title: newTaskTitle.trim(),
        subtitle:
          newTaskSubtitle.trim() ||
          `Proposed by ${activeChild.name} (${
            RELEASE_LEVEL_META[activeChild.releaseLevel].badge
          })`,
        pillar: newTaskPillar,
        energyLoad: newTaskEnergy,
        scheduledStartTime: newTaskTime,
        defaultDurationMinutes: newTaskDuration,
      },
      activeChild.releaseLevel === 'LEVEL_3_EXECUTIVE'
    );
    setNewTaskTitle('');
    setNewTaskSubtitle('');
    setShowProposeForm(false);
  };

  return (
    <div id={`view-child-workspace-${activeChild.id}`} className="space-y-6">
      {/* 1. Child Hero Status Bar: Mood Dial + Gradual Release Engine + Streak Shield Summary */}
      <section
        id={`section-child-hero-${activeChild.id}`}
        aria-label={`${activeChild.name}'s Executive Status`}
        className="rounded-2xl bg-slate-900/65 border border-slate-800/90 p-5 shadow-xl"
      >
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
          {/* Child Identity & Personal Best Headline */}
          <div className="flex items-start gap-4">
            <div
              id={`avatar-hero-${activeChild.id}`}
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${activeChild.avatarGradient} flex items-center justify-center text-3xl shadow-lg shrink-0`}
            >
              {activeChild.avatarEmoji}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1
                  id={`heading-child-cockpit-${activeChild.id}`}
                  className="text-xl sm:text-2xl font-black text-white tracking-tight"
                >
                  {activeChild.name}&apos;s Executive Cockpit
                </h1>
                <span
                  id={`badge-grade-age-${activeChild.id}`}
                  className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-slate-800 text-teal-300 border border-slate-700"
                >
                  {activeChild.gradeLabel} • Age {activeChild.age}
                </span>
                <span
                  id={`badge-release-level-${activeChild.id}`}
                  className="text-xs font-extrabold px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
                >
                  {RELEASE_LEVEL_META[activeChild.releaseLevel].title}
                </span>
              </div>
              <p
                id={`text-personal-best-${activeChild.id}`}
                className="text-xs text-slate-300 mt-1.5 max-w-3xl"
              >
                <strong className="text-teal-300">Personal Best Win:</strong>{' '}
                {activeChild.personalBestHeadline}
              </p>
            </div>
          </div>

          {/* Gradual Release Level Selector (Scales K-3 -> 4-7 -> 8-12) */}
          <div
            id={`group-autonomy-selector-${activeChild.id}`}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800"
          >
            <span className="text-[11px] font-bold text-slate-400 px-1.5">
              Autonomy Stage:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(RELEASE_LEVEL_META) as ReleaseLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  id={`btn-release-level-${activeChild.id}-${lvl}`}
                  type="button"
                  onClick={() => setChildReleaseLevel(activeChild.id, lvl)}
                  className={`min-h-[44px] px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                    activeChild.releaseLevel === lvl
                      ? 'bg-teal-500/25 text-teal-200 border-teal-400'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {RELEASE_LEVEL_META[lvl].badge}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 5-State Daily Mood & Energy Dial */}
        <div
          id={`bar-daily-mood-dial-${activeChild.id}`}
          className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col lg:flex-row lg:items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2">
            <BatteryCharging className="w-4 h-4 text-teal-400" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
              Daily Mood &amp; Energy Dial:
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              ({MOOD_META[activeChild.currentMood].coachingTone})
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(MOOD_META) as MoodState[]).map((moodKey) => {
              const m = MOOD_META[moodKey];
              const isSelected = activeChild.currentMood === moodKey;
              return (
                <button
                  key={moodKey}
                  id={`btn-mood-dial-${activeChild.id}-${moodKey}`}
                  type="button"
                  data-testid={`mood-dial-${moodKey}`}
                  onClick={() => setChildMood(activeChild.id, moodKey)}
                  className={`min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? `${m.colorClass} scale-[1.03] shadow-sm`
                      : 'bg-slate-950/90 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span>{m.emoji}</span>
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Two-Stage Transition Runway Alert Banner */}
      <TransitionRunwayBanner
        upcomingTask={nextScheduledTask}
        childName={activeChild.name}
      />

      {/* 3. Cognitive Friction & Energy Load Clash Warning Banner */}
      {clashes.length > 0 && (
        <section
          id={`section-cognitive-clash-alert-${activeChild.id}`}
          aria-label="Cognitive Load Balancer Alert"
          data-testid="cognitive-clash-alert"
          className="rounded-2xl bg-fuchsia-950/35 border border-fuchsia-500/50 p-4 shadow-lg shadow-fuchsia-500/10"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-fuchsia-500/25 text-fuchsia-200 border border-fuchsia-400/40">
                    Executive Friction &amp; Energy Budget Alert
                  </span>
                </div>
                <p className="text-sm font-bold text-white mt-1">
                  Back-to-Back High-Cognitive Tasks Detected ({clashes[0].firstTask.title} →{' '}
                  {clashes[0].secondTask.title})
                </p>
                <p className="text-xs text-slate-300 mt-0.5">
                  30 minutes of AoPS followed immediately by Abacus without a Restorative or Physical buffer drains working memory. Insert a restorative break between them!
                </p>
              </div>
            </div>
            <button
              id={`btn-auto-balance-cognitive-${activeChild.id}`}
              type="button"
              data-testid="auto-balance-cognitive-btn"
              onClick={() => autoBalanceCognitiveSchedule(activeChild.id)}
              className="min-h-[44px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-400 to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg hover:scale-[1.02] transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Wand2 className="w-4 h-4" />
              1-Click Insert Restorative Buffer
            </button>
          </div>
        </section>
      )}

      {/* 4. Main 12-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Daily Pillar Schedule Card */}
          <section
            id={`section-daily-schedule-${activeChild.id}`}
            aria-label="Daily Executive Schedule"
            className="rounded-2xl bg-slate-900/65 border border-slate-800/90 p-5 shadow-xl space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-teal-400" />
                  <span>Today&apos;s Energy-Budgeted Timeline</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Every block is tagged with its Life Pillar and Cognitive Energy Load. Click{' '}
                  <strong className="text-teal-300">Start &amp; Estimate Time</strong> to calibrate time perception.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {activePillarFilter !== 'ALL' && (
                  <button
                    id={`btn-clear-pillar-filter-${activeChild.id}`}
                    type="button"
                    onClick={() => setActivePillarFilter('ALL')}
                    className="min-h-[44px] px-3 py-2 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Filter: {PILLAR_META[activePillarFilter].shortLabel} (Clear)</span>
                  </button>
                )}
                {canReorderOrPropose && (
                  <button
                    id={`btn-toggle-propose-task-${activeChild.id}`}
                    type="button"
                    onClick={() => setShowProposeForm((s) => !s)}
                    className="min-h-[44px] px-3.5 py-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-bold flex items-center gap-1.5 hover:bg-indigo-500/30 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    {activeChild.releaseLevel === 'LEVEL_2_COPILOT'
                      ? 'Propose Co-Pilot Task'
                      : 'Add Executive Task'}
                  </button>
                )}
              </div>
            </div>

            {/* Co-Pilot / Executive Task Proposal Form */}
            {showProposeForm && (
              <form
                id={`form-propose-task-${activeChild.id}`}
                onSubmit={handleProposeSubmit}
                className="rounded-xl bg-slate-950 border border-indigo-500/40 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-300">
                    {activeChild.releaseLevel === 'LEVEL_2_COPILOT'
                      ? 'Co-Pilot Proposal (Queues for Parent Approval)'
                      : 'Autonomous Executive Block'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    id={`input-propose-title-${activeChild.id}`}
                    type="text"
                    required
                    placeholder="Activity Title (e.g., Robotics Lego Sensor Test)"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                  <input
                    id={`input-propose-subtitle-${activeChild.id}`}
                    type="text"
                    placeholder="Goal / Subtitle"
                    value={newTaskSubtitle}
                    onChange={(e) => setNewTaskSubtitle(e.target.value)}
                    className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <select
                    id={`select-propose-pillar-${activeChild.id}`}
                    value={newTaskPillar}
                    onChange={(e) => setNewTaskPillar(e.target.value as LifePillar)}
                    aria-label="Select Life Pillar"
                    className="min-h-[44px] px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                  >
                    {Object.entries(PILLAR_META).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v.shortLabel}
                      </option>
                    ))}
                  </select>
                  <select
                    id={`select-propose-energy-${activeChild.id}`}
                    value={newTaskEnergy}
                    onChange={(e) => setNewTaskEnergy(e.target.value as EnergyLoad)}
                    aria-label="Select Cognitive Energy Load"
                    className="min-h-[44px] px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                  >
                    {Object.entries(ENERGY_META).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v.shortLabel}
                      </option>
                    ))}
                  </select>
                  <input
                    id={`input-propose-time-${activeChild.id}`}
                    type="time"
                    value={newTaskTime}
                    onChange={(e) => setNewTaskTime(e.target.value)}
                    aria-label="Scheduled Start Time"
                    className="min-h-[44px] px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono"
                  />
                  <button
                    id={`btn-submit-propose-task-${activeChild.id}`}
                    type="submit"
                    className="min-h-[44px] px-3 py-2 rounded-xl bg-teal-400 text-slate-950 font-extrabold text-xs cursor-pointer"
                  >
                    Submit Block
                  </button>
                </div>
              </form>
            )}

            {/* Task List */}
            <div id={`list-scheduled-tasks-${activeChild.id}`} className="space-y-3">
              {tasks.map((task, idx) => {
                const pillar = PILLAR_META[task.pillar];
                const energy = ENERGY_META[task.energyLoad];
                const isCompleted = task.status === 'COMPLETED';
                const isProposed = task.status === 'PROPOSED';

                return (
                  <article
                    key={task.id}
                    id={`card-task-${task.id}`}
                    data-testid={`task-card-${task.id}`}
                    className={`rounded-2xl border p-4 transition-all ${
                      isCompleted
                        ? 'bg-slate-950/60 border-emerald-500/30 opacity-90'
                        : isProposed
                        ? 'bg-indigo-950/20 border-dashed border-indigo-400/50'
                        : 'bg-slate-950/90 border-slate-800 hover:border-teal-500/40'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            id={`task-time-label-${task.id}`}
                            className="text-xs font-mono font-bold text-slate-400"
                          >
                            {task.scheduledStartTime} ({task.defaultDurationMinutes}m)
                          </span>
                          <span
                            id={`task-pillar-pill-${task.id}`}
                            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${pillar?.badgeClass}`}
                          >
                            {pillar?.shortLabel}
                          </span>
                          <span
                            id={`task-energy-pill-${task.id}`}
                            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border flex items-center gap-1 ${energy?.badgeClass}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${energy?.dotColor}`} />
                            {energy?.shortLabel}
                          </span>
                          {isProposed && (
                            <span
                              id={`task-proposed-pill-${task.id}`}
                              className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40"
                            >
                              Awaiting Parent Approval
                            </span>
                          )}
                        </div>

                        <h3 id={`task-title-${task.id}`} className="text-base font-bold text-white">
                          {task.title}
                        </h3>
                        <p id={`task-subtitle-${task.id}`} className="text-xs text-slate-400">
                          {task.subtitle}
                        </p>

                        {isCompleted && task.estimatedMinutes && task.actualMinutes && (
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            <span
                              id={`task-completed-delta-pill-${task.id}`}
                              className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                            >
                              ✓ Completed • Guessed {task.estimatedMinutes}m vs. Actual{' '}
                              {task.actualMinutes}m (Delta:{' '}
                              {task.actualMinutes - task.estimatedMinutes >= 0
                                ? `+${task.actualMinutes - task.estimatedMinutes}m`
                                : `${task.actualMinutes - task.estimatedMinutes}m`}
                              )
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {canReorderOrPropose && !isCompleted && (
                          <div className="flex sm:flex-col gap-1">
                            <button
                              id={`btn-move-up-${task.id}`}
                              type="button"
                              disabled={idx === 0}
                              onClick={() => moveTaskOrder(task.id, 'UP')}
                              aria-label={`Move ${task.title} earlier`}
                              className="min-h-[38px] min-w-[38px] p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 flex items-center justify-center cursor-pointer"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              id={`btn-move-down-${task.id}`}
                              type="button"
                              disabled={idx === tasks.length - 1}
                              onClick={() => moveTaskOrder(task.id, 'DOWN')}
                              aria-label={`Move ${task.title} later`}
                              className="min-h-[38px] min-w-[38px] p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 flex items-center justify-center cursor-pointer"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        {!isCompleted ? (
                          <button
                            id={`btn-start-task-${task.id}`}
                            type="button"
                            data-testid={`start-task-btn-${task.id}`}
                            onClick={() => setActiveTaskForModal(task)}
                            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md shadow-teal-500/15 hover:scale-[1.02] transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Timer className="w-4 h-4" />
                            Start &amp; Estimate Time
                          </button>
                        ) : (
                          <button
                            id={`btn-recalibrate-task-${task.id}`}
                            type="button"
                            onClick={() => setActiveTaskForModal(task)}
                            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-500/30 cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Recalibrate / View
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Time-Blindness Calibration Audit History Card */}
          <section
            id={`section-time-estimation-history-${activeChild.id}`}
            aria-label="Time-Blindness Estimation Calibration Audit"
            data-testid="time-estimation-history-section"
            className="rounded-2xl bg-slate-900/65 border border-slate-800/90 p-5 shadow-xl space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-400" />
                  <span>Time-Blindness Predictor &amp; Estimation Audit Log</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Visualizes {activeChild.name}&apos;s Pre-Task Guess vs. Actual Elapsed Time to build internal temporal awareness.
                </p>
              </div>
              <div
                id={`badge-avg-calibration-score-${activeChild.id}`}
                className="px-3 py-1.5 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-mono text-xs font-extrabold"
              >
                {avgCalibrationAccuracy}% Avg Calibration Score
              </div>
            </div>

            <div className="space-y-2.5">
              {childEstimations.slice(0, 6).map((est) => {
                const maxBar = Math.max(est.estimatedMinutes, est.actualMinutes, 40);
                return (
                  <div
                    key={est.id}
                    id={`card-estimation-record-${est.id}`}
                    className="rounded-xl bg-slate-950/90 border border-slate-800/90 p-3.5 space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{est.taskTitle}</span>
                        <span className="text-[10px] font-mono text-slate-400">
                          ({est.recordedAt})
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                        <span className="text-indigo-300">
                          Guessed: {est.estimatedMinutes}m
                        </span>
                        <span className="text-slate-500">→</span>
                        <span className="text-teal-300 font-bold">
                          Actual: {est.actualMinutes}m
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-extrabold ${
                            est.accuracyPercent >= 80
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {est.accuracyPercent}% Acc ({est.deltaMinutes >= 0 ? `+${est.deltaMinutes}m` : `${est.deltaMinutes}m`})
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[11px]">
                      <div>
                        <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-indigo-400 rounded-full"
                            style={{ width: `${(est.estimatedMinutes / maxBar) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-teal-400 rounded-full"
                            style={{ width: `${(est.actualMinutes / maxBar) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Behavioral Resilience & Low-Stakes Streak Shields (Gap #4) */}
          <section
            id={`section-resilience-shields-${activeChild.id}`}
            aria-label="Streak Shields and Resilience Mechanics"
            className="rounded-2xl bg-slate-900/65 border border-slate-800/90 p-5 shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-black text-white">
                  Resilience &amp; Grace Day Shields
                </h2>
              </div>
              <span
                id={`badge-streak-days-${activeChild.id}`}
                className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono text-xs font-extrabold flex items-center gap-1"
              >
                <Flame className="w-3.5 h-3.5" />
                {activeChild.streakDays}-Day Momentum
              </span>
            </div>

            <p className="text-xs text-slate-300">
              Unlike binary streak apps that punish sick days, Nuvoriq includes{' '}
              <strong className="text-white">2 Automatic Monthly Grace Shields</strong> and rewards{' '}
              <strong className="text-teal-300">Comeback Kid Bounce-Backs</strong>.
            </p>

            {/* Shield Slots */}
            <div
              id={`card-grace-shield-status-${activeChild.id}`}
              className="rounded-xl bg-slate-950 border border-slate-800 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="text-xs font-bold text-white">
                  Monthly Grace Shields: {activeChild.graceShieldsRemaining} /{' '}
                  {activeChild.maxGraceShieldsPerMonth} Available
                </div>
                <div className="text-[11px] text-slate-400">
                  {activeChild.graceDayActiveToday
                    ? 'Grace Shield Active Today — Streak Protected!'
                    : `Last shield used: ${activeChild.lastGraceShieldDate || 'None'}`}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {!activeChild.graceDayActiveToday ? (
                  <button
                    id={`btn-use-grace-shield-${activeChild.id}`}
                    type="button"
                    disabled={activeChild.graceShieldsRemaining <= 0}
                    onClick={() =>
                      activateGraceDayShield(activeChild.id, 'Rest & Recovery Day')
                    }
                    className="min-h-[44px] px-3.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold hover:bg-amber-500/30 disabled:opacity-40 cursor-pointer"
                  >
                    Use Grace Day Shield
                  </button>
                ) : (
                  <button
                    id={`btn-comeback-kid-checkin-${activeChild.id}`}
                    type="button"
                    onClick={() => triggerBounceBackCheckIn(activeChild.id)}
                    className="min-h-[44px] px-3.5 py-1.5 rounded-xl bg-teal-400 text-slate-950 text-xs font-extrabold hover:bg-teal-300 cursor-pointer"
                  >
                    Log &ldquo;Comeback Kid&rdquo; Bounce-Back!
                  </button>
                )}
              </div>
            </div>

            {/* Unlocked Resilience & Bounce-Back Badges */}
            <div className="space-y-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Unlocked Resilience Milestones
              </span>
              <div className="grid grid-cols-1 gap-2">
                {activeChild.resilienceBadges.slice(0, 3).map((badge) => (
                  <div
                    key={badge.id}
                    id={`card-resilience-badge-${badge.id}`}
                    className="rounded-xl bg-slate-950/80 border border-slate-800/90 p-3 flex items-start gap-3"
                  >
                    <div className="p-2 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/40 shrink-0">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">
                          {badge.title}
                        </span>
                        {badge.isBounceBack && (
                          <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            Bounce-Back
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Child's Own Self-Referenced Ipsative Radar Chart */}
          <section
            id={`section-ipsative-radar-${activeChild.id}`}
            aria-label="Ipsative Growth Radar"
            className="rounded-2xl bg-slate-900/65 border border-slate-800/90 p-5 shadow-xl"
          >
            <IpsativeRadarChart
              childId={activeChild.id}
              childName={activeChild.name}
              gradeLabel={activeChild.gradeLabel}
              scores={activeChild.ipsativeBaseline}
            />
          </section>

          {/* Parent Kudos & Effort Praise Badges Received */}
          <section
            id={`section-child-kudos-feed-${activeChild.id}`}
            aria-label="Parent Growth-Mindset Kudos"
            className="rounded-2xl bg-slate-900/65 border border-slate-800/90 p-5 shadow-xl space-y-3"
          >
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-rose-400" />
              <h2 className="text-base font-black text-white">
                Growth-Mindset Kudos from Parents
              </h2>
            </div>
            {childKudos.map((k) => (
              <div
                key={k.id}
                id={`card-kudos-item-${k.id}`}
                className="rounded-xl bg-slate-950/90 border border-rose-500/30 p-3.5 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    {k.badgeType.replace('_', ' ')} BADGE
                  </span>
                  <span className="text-[11px] text-slate-400">
                    From {k.fromParentName}
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{k.message}</p>
                {k.socraticQuestion && (
                  <p className="text-xs text-teal-300 italic pt-1">
                    💬 Dinner Question: {k.socraticQuestion}
                  </p>
                )}
              </div>
            ))}
          </section>
        </div>
      </div>

      {/* 5. Full-Width 2-Column Showcase: Metacognitive Journal & Work Artifacts (Zero Column Imbalance) */}
      <section
        id={`section-metacognitive-journal-${activeChild.id}`}
        aria-label="Metacognitive Portfolio and Artifacts"
        className="rounded-2xl bg-slate-900/65 border border-slate-800/90 p-5 shadow-xl space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-400" />
            <div>
              <h2 className="text-base font-black text-white">
                Metacognitive Journal &amp; Work Artifacts
              </h2>
              <p className="text-xs text-slate-400">
                Process-focused evidence portfolio capturing strategy shifts, breakthroughs, and physical milestones.
              </p>
            </div>
          </div>
          <span
            id={`badge-journal-count-${activeChild.id}`}
            className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/40"
          >
            {childReflections.length} Logged Reflections
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {childReflections.slice(0, 2).map((ref) => {
            const art = childArtifacts.find((a) => a.id === ref.artifactId);
            return (
              <div
                key={ref.id}
                id={`card-reflection-entry-${ref.id}`}
                className="rounded-xl bg-slate-950 border border-slate-800 p-4 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white">
                      {ref.taskTitle}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-teal-300 shrink-0">
                      {MOOD_META[ref.moodBefore]?.emoji} → {MOOD_META[ref.moodAfter]?.emoji}{' '}
                      {MOOD_META[ref.moodAfter]?.label}
                    </span>
                  </div>
                  <div className="text-xs space-y-1.5 text-slate-300">
                    <p>
                      <strong className="text-slate-100">What I Did:</strong>{' '}
                      {ref.whatIDid}
                    </p>
                    <p>
                      <strong className="text-amber-300">Where I Got Stuck:</strong>{' '}
                      {ref.whereIGotStuck}
                    </p>
                    <p>
                      <strong className="text-emerald-300">What Clicked:</strong>{' '}
                      {ref.whatClicked}
                    </p>
                  </div>
                </div>
                {art && (
                  <div id={`card-artifact-media-${art.id}`} className="pt-2">
                    <img
                      id={`img-artifact-${art.id}`}
                      src={art.dataUrl}
                      alt={art.title}
                      width={460}
                      height={280}
                      className="w-full h-auto rounded-lg border border-slate-800"
                    />
                    <p className="text-[11px] text-slate-400 mt-1.5">
                      📸 {art.title} — {art.caption}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Active Focus & Time-Blindness Calibration Modal */}
      {activeTaskForModal && (
        <FocusCalibrationModal
          task={activeTaskForModal}
          childName={activeChild.name}
          initialMood={activeChild.currentMood}
          onClose={() => setActiveTaskForModal(null)}
        />
      )}
    </div>
  );
}
