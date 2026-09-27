'use client';

import React, { useEffect, useState } from 'react';
import {
  ClipboardCheck,
  Sparkles,
  Target,
  UserPlus,
  X,
} from 'lucide-react';
import { useFamilyStore } from '@/context/FamilyStoreContext';
import {
  AssignmentCategory,
  EnergyLoad,
  LifePillar,
  ReleaseLevel,
  TrackerMetricUnit,
} from '@/types/domain';

const EMOJI_OPTIONS = ['🚀', '🦋', '🦁', '⚡', '🎨', '🥋', '🎻', '🧠'];

const GRADE_OPTIONS = [
  'Kindergarten',
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6',
  'Grade 7',
  'Grade 8',
  'Grade 9',
  'Grade 10',
  'Grade 11',
  'Grade 12',
];

export function AddKidAndTrackerModal() {
  const {
    state,
    activeChild,
    isKidIsolatedSession,
    studioModalTab,
    studioPreselectedChildId,
    openStudioModal,
    closeStudioModal,
    addChildProfile,
    createCustomTracker,
    proposeOrCreateTask,
  } = useFamilyStore();

  const defaultChildId =
    studioPreselectedChildId || activeChild?.id || state.children[0]?.id || 'child-1';

  // Tab 1: Add Kid state
  const [kidName, setKidName] = useState('');
  const [kidEmail, setKidEmail] = useState('');
  const [kidAge, setKidAge] = useState(11);
  const [kidGrade, setKidGrade] = useState('Grade 6');
  const [kidReleaseLevel, setKidReleaseLevel] = useState<ReleaseLevel>('LEVEL_2_COPILOT');
  const [kidEmoji, setKidEmoji] = useState('🦁');
  const [kidHeadline, setKidHeadline] = useState('');

  // Tab 2: Create Tracker state
  const [trackerChildId, setTrackerChildId] = useState(defaultChildId);
  const [trackerTitle, setTrackerTitle] = useState('');
  const [trackerDesc, setTrackerDesc] = useState('');
  const [trackerPillar, setTrackerPillar] = useState<LifePillar>('ACADEMIC_MASTERY');
  const [trackerUnit, setTrackerUnit] = useState<TrackerMetricUnit>('PROBLEMS');
  const [trackerTarget, setTrackerTarget] = useState(15);
  const [trackerIncrement, setTrackerIncrement] = useState(1);
  const [trackerDue, setTrackerDue] = useState('Weekly Goal • Due Sun 6:00 PM');

  // Tab 3: Create Assignment state
  const [assignChildId, setAssignChildId] = useState(defaultChildId);
  const [assignTitle, setAssignTitle] = useState('');
  const [assignSubtitle, setAssignSubtitle] = useState('');
  const [assignCategory, setAssignCategory] = useState<AssignmentCategory>('HOMEWORK');
  const [assignPillar, setAssignPillar] = useState<LifePillar>('ACADEMIC_MASTERY');
  const [assignEnergy, setAssignEnergy] = useState<EnergyLoad>('HIGH_COGNITIVE');
  const [assignTime, setAssignTime] = useState('16:30');
  const [assignDuration, setAssignDuration] = useState(30);
  const [assignDue, setAssignDue] = useState('Due Today • 6:00 PM');

  useEffect(() => {
    const resolved =
      isKidIsolatedSession && activeChild
        ? activeChild.id
        : studioPreselectedChildId || activeChild?.id || state.children[0]?.id || 'child-1';
    setTrackerChildId(resolved);
    setAssignChildId(resolved);
  }, [studioPreselectedChildId, activeChild, isKidIsolatedSession, state.children]);

  if (!studioModalTab) return null;

  const handleAddKidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kidName.trim()) return;
    const autoEmail =
      kidEmail.trim() || `${kidName.trim().toLowerCase().replace(/\s+/g, '.')}@gmail.com`;
    addChildProfile({
      name: kidName.trim(),
      age: Number(kidAge) || 10,
      gradeLabel: kidGrade,
      googleEmail: autoEmail,
      releaseLevel: kidReleaseLevel,
      avatarEmoji: kidEmoji,
      personalBestHeadline: kidHeadline.trim(),
    });
    setKidName('');
    setKidEmail('');
    setKidHeadline('');
    closeStudioModal();
  };

  const handleCreateTrackerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackerTitle.trim()) return;
    createCustomTracker({
      childId: trackerChildId,
      title: trackerTitle.trim(),
      description: trackerDesc.trim() || 'Assigned weekly skill & habit tracker',
      pillar: trackerPillar,
      unit: trackerUnit,
      targetValue: Number(trackerTarget) || 10,
      incrementStep: Number(trackerIncrement) || 1,
      dueDateLabel: trackerDue.trim() || 'Weekly Goal',
    });
    setTrackerTitle('');
    setTrackerDesc('');
    closeStudioModal();
  };

  const handleCreateAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignTitle.trim()) return;
    proposeOrCreateTask(
      {
        childId: assignChildId,
        title: assignTitle.trim(),
        subtitle:
          assignSubtitle.trim() ||
          `Assigned ${assignCategory.replace('_', ' ')} • ${assignDue}`,
        pillar: assignPillar,
        energyLoad: assignEnergy,
        scheduledStartTime: assignTime,
        defaultDurationMinutes: Number(assignDuration) || 25,
        isAssignment: true,
        assignmentCategory: assignCategory,
        dueDateLabel: assignDue.trim() || 'Due Today',
        assignedByParentName: state.principalParentName,
      },
      !isKidIsolatedSession
    );
    setAssignTitle('');
    setAssignSubtitle('');
    closeStudioModal();
  };

  const selectableChildren = isKidIsolatedSession
    ? state.children.filter((c) => c.id === activeChild?.id)
    : state.children;

  return (
    <div
      id="modal-kid-tracker-studio-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="heading-kid-tracker-studio"
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        id="card-kid-tracker-studio"
        className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-700/90 shadow-2xl p-6 space-y-5 my-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-400" />
              <h2
                id="heading-kid-tracker-studio"
                className="text-lg font-black text-white"
              >
                Nuvoriq Kid Onboarding, Custom Trackers &amp; Assignments
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Every tracker and assignment is scoped to its assigned child so a logged-in kid
              only sees their own details.
            </p>
          </div>

          <button
            id="btn-close-kid-tracker-studio"
            type="button"
            onClick={closeStudioModal}
            aria-label="Close studio modal"
            className="min-h-[40px] min-w-[40px] rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Studio Mode Switcher Tabs */}
        <div
          id="tabs-kid-tracker-studio"
          role="tablist"
          className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800"
        >
          {!isKidIsolatedSession && (
            <button
              id="tab-studio-add-kid"
              type="button"
              role="tab"
              aria-selected={studioModalTab === 'ADD_KID'}
              onClick={() => openStudioModal('ADD_KID', studioPreselectedChildId)}
              className={`min-h-[42px] px-3 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                studioModalTab === 'ADD_KID'
                  ? 'bg-teal-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Add Kid Profile</span>
            </button>
          )}

          <button
            id="tab-studio-create-tracker"
            type="button"
            role="tab"
            aria-selected={studioModalTab === 'CREATE_TRACKER'}
            onClick={() => openStudioModal('CREATE_TRACKER', studioPreselectedChildId)}
            className={`min-h-[42px] px-3 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              studioModalTab === 'CREATE_TRACKER'
                ? 'bg-teal-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>+ Create Tracker</span>
          </button>

          <button
            id="tab-studio-create-assignment"
            type="button"
            role="tab"
            aria-selected={studioModalTab === 'CREATE_ASSIGNMENT'}
            onClick={() => openStudioModal('CREATE_ASSIGNMENT', studioPreselectedChildId)}
            className={`min-h-[42px] px-3 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              studioModalTab === 'CREATE_ASSIGNMENT'
                ? 'bg-teal-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span>+ Assign Task / Homework</span>
          </button>
        </div>

        {/* TAB 1: ADD NEW KID PROFILE */}
        {studioModalTab === 'ADD_KID' && !isKidIsolatedSession && (
          <form
            id="form-studio-add-kid"
            onSubmit={handleAddKidSubmit}
            className="space-y-3.5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="input-add-kid-name"
                  className="block text-xs font-bold text-slate-200 mb-1"
                >
                  Child First Name *
                </label>
                <input
                  id="input-add-kid-name"
                  type="text"
                  required
                  value={kidName}
                  onChange={(e) => {
                    setKidName(e.target.value);
                    if (!kidEmail) {
                      // Auto-suggest email preview in placeholder
                    }
                  }}
                  placeholder="e.g. Aarav or Zoe"
                  className="w-full min-h-[42px] rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white focus:border-teal-400 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="input-add-kid-email"
                  className="block text-xs font-bold text-slate-200 mb-1"
                >
                  Kid&apos;s Google SSO Email (for Isolated Login)
                </label>
                <input
                  id="input-add-kid-email"
                  type="email"
                  value={kidEmail}
                  onChange={(e) => setKidEmail(e.target.value)}
                  placeholder={
                    kidName
                      ? `${kidName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`
                      : 'e.g. aarav.sharma@gmail.com'
                  }
                  className="w-full min-h-[42px] rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white focus:border-teal-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label
                  htmlFor="input-add-kid-age"
                  className="block text-xs font-bold text-slate-200 mb-1"
                >
                  Age
                </label>
                <input
                  id="input-add-kid-age"
                  type="number"
                  min={4}
                  max={18}
                  value={kidAge}
                  onChange={(e) => setKidAge(Number(e.target.value))}
                  className="w-full min-h-[42px] rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white focus:border-teal-400 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="select-add-kid-grade"
                  className="block text-xs font-bold text-slate-200 mb-1"
                >
                  Grade Level
                </label>
                <select
                  id="select-add-kid-grade"
                  value={kidGrade}
                  onChange={(e) => setKidGrade(e.target.value)}
                  className="w-full min-h-[42px] rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white focus:border-teal-400 focus:outline-none"
                >
                  {GRADE_OPTIONS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="select-add-kid-release-level"
                  className="block text-xs font-bold text-slate-200 mb-1"
                >
                  Autonomy Tier
                </label>
                <select
                  id="select-add-kid-release-level"
                  value={kidReleaseLevel}
                  onChange={(e) => setKidReleaseLevel(e.target.value as ReleaseLevel)}
                  className="w-full min-h-[42px] rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white focus:border-teal-400 focus:outline-none"
                >
                  <option value="LEVEL_1_GUIDED">Level 1: Guided (K–2)</option>
                  <option value="LEVEL_2_COPILOT">Level 2: Co-Pilot (3–6)</option>
                  <option value="LEVEL_3_EXECUTIVE">Level 3: Architect (7–12)</option>
                </select>
              </div>
            </div>

            <div>
              <span className="block text-xs font-bold text-slate-200 mb-1.5">
                Choose Avatar Emblem
              </span>
              <div id="group-add-kid-emoji" className="flex flex-wrap gap-2">
                {EMOJI_OPTIONS.map((em, idx) => (
                  <button
                    key={em}
                    id={`btn-add-kid-emoji-${idx}`}
                    type="button"
                    onClick={() => setKidEmoji(em)}
                    className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center border cursor-pointer ${
                      kidEmoji === em
                        ? 'bg-teal-500/25 border-teal-400'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="input-add-kid-headline"
                className="block text-xs font-bold text-slate-200 mb-1"
              >
                Initial Personal Focus Goal (Optional)
              </label>
              <input
                id="input-add-kid-headline"
                type="text"
                value={kidHeadline}
                onChange={(e) => setKidHeadline(e.target.value)}
                placeholder="e.g. Building independent time-estimation mastery for Robotics & Math!"
                className="w-full min-h-[42px] rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white focus:border-teal-400 focus:outline-none"
              />
            </div>

            <button
              id="btn-submit-add-kid"
              type="submit"
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Kid Profile + Seed Starter Trackers &amp; Google SSO</span>
            </button>
          </form>
        )}

        {/* TAB 2: CREATE CUSTOM TRACKER */}
        {studioModalTab === 'CREATE_TRACKER' && (
          <form
            id="form-studio-create-tracker"
            onSubmit={handleCreateTrackerSubmit}
            className="space-y-3.5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="select-tracker-child"
                  className="block text-xs font-bold text-slate-200 mb-1"
                >
                  Assign Tracker to Kid *
                </label>
                <select
                  id="select-tracker-child"
                  value={trackerChildId}
                  disabled={isKidIsolatedSession}
                  onChange={(e) => setTrackerChildId(e.target.value)}
                  className="w-full min-h-[42px] rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white focus:border-teal-400 focus:outline-none"
                >
                  {selectableChildren.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.avatarEmoji} {c.name} ({c.gradeLabel})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="select-tracker-pillar"
                  className="block text-xs font-bold text-slate-200 mb-1"
                >
                  Life Pillar
                </label>
                <select
                  id="select-tracker-pillar"
                  value={trackerPillar}
                  onChange={(e) => setTrackerPillar(e.target.value as LifePillar)}
                  className="w-full min-h-[42px] rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white focus:border-teal-400 focus:outline-none"
                >
                  <option value="ACADEMIC_MASTERY">Academic Mastery</option>
                  <option value="DISCIPLINES_ARTS">Disciplines &amp; Arts</option>
                  <option value="UNSTRUCTURED_PLAY">Unstructured Free Play</option>
                  <option value="RESTORATION_FAMILY">Restoration &amp; Family</option>
                  <option value="EXECUTIVE_HABITS">Executive Habits</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="input-tracker-title"
                className="block text-xs font-bold text-slate-200 mb-1"
              >
                Tracker Title *
              </label>
              <input
                id="input-tracker-title"
                type="text"
                required
                value={trackerTitle}
                onChange={(e) => setTrackerTitle(e.target.value)}
                placeholder="e.g. Science Olympiad Circuit Lab Tracker"
                className="w-full min-h-[42px] rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white focus:border-teal-400 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="input-tracker-description"
                className="block text-xs font-bold text-slate-200 mb-1"
              >
                Instructions / Milestone Goal
              </label>
              <input
                id="input-tracker-description"
                type="text"
                value={trackerDesc}
                onChange={(e) => setTrackerDesc(e.target.value)}
                placeholder="e.g. Log each completed circuit schematic and test voltage readings."
                className="w-full min-h-[42px] rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white focus:border-teal-400 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label
                  htmlFor="select-tracker-unit"
                  className="block text-xs font-bold text-slate-200 mb-1"
                >
                  Unit
                </label>
                <select
                  id="select-tracker-unit"
                  value={trackerUnit}
                  onChange={(e) => setTrackerUnit(e.target.value as TrackerMetricUnit)}
                  className="w-full min-h-[42px] rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white focus:border-teal-400 focus:outline-none"
                >
                  <option value="PROBLEMS">Problems</option>
                  <option value="PAGES">Pages</option>
                  <option value="MINUTES">Minutes</option>
                  <option value="SESSIONS">Sessions</option>
                  <option value="STEPS">Steps</option>
                  <option value="CHECKINS">Check-ins</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="input-tracker-target"
                  className="block text-xs font-bold text-slate-200 mb-1"
                >
                  Target Goal
                </label>
                <input
                  id="input-tracker-target"
                  type="number"
                  min={1}
                  max={1000}
                  value={trackerTarget}
                  onChange={(e) => setTrackerTarget(Number(e.target.value))}
                  className="w-full min-h-[42px] rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white focus:border-teal-400 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="input-tracker-increment"
                  className="block text-xs font-bold text-slate-200 mb-1"
                >
                  +Step per Tap
                </label>
                <input
                  id="input-tracker-increment"
                  type="number"
                  min={1}
                  max={100}
                  value={trackerIncrement}
                  onChange={(e) => setTrackerIncrement(Number(e.target.value))}
                  className="w-full min-h-[42px] rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white focus:border-teal-400 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="input-tracker-due-label"
                  className="block text-xs font-bold text-slate-200 mb-1"
                >
                  Target Window
                </label>
                <input
                  id="input-tracker-due-label"
                  type="text"
                  value={trackerDue}
                  onChange={(e) => setTrackerDue(e.target.value)}
                  className="w-full min-h-[42px] rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white focus:border-teal-400 focus:outline-none"
                />
              </div>
            </div>

            <button
              id="btn-submit-create-tracker"
              type="submit"
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <Target className="w-4 h-4" />
              <span>Launch Custom Tracker for Selected Kid</span>
            </button>
          </form>
        )}

        {/* TAB 3: ASSIGN NEW TASK / HOMEWORK */}
        {studioModalTab === 'CREATE_ASSIGNMENT' && (
          <form
            id="form-studio-create-assignment"
            onSubmit={handleCreateAssignmentSubmit}
            className="space-y-3.5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="select-assignment-child"
                  className="block text-xs font-bold text-slate-200 mb-1"
                >
                  Assign To Kid *
                </label>
                <select
                  id="select-assignment-child"
                  value={assignChildId}
                  disabled={isKidIsolatedSession}
                  onChange={(e) => setAssignChildId(e.target.value)}
                  className="w-full min-h-[42px] rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white focus:border-teal-400 focus:outline-none"
                >
                  {selectableChildren.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.avatarEmoji} {c.name} ({c.gradeLabel})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="select-assignment-category"
                  className="block text-xs font-bold text-slate-200 mb-1"
                >
                  Assignment Type
                </label>
                <select
                  id="select-assignment-category"
                  value={assignCategory}
                  onChange={(e) =>
                    setAssignCategory(e.target.value as AssignmentCategory)
                  }
                  className="w-full min-h-[42px] rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white focus:border-teal-400 focus:outline-none"
                >
                  <option value="HOMEWORK">Homework Assignment</option>
                  <option value="PROJECT_MILESTONE">Project Milestone</option>
                  <option value="PRACTICE_DRILL">Skill Practice Drill</option>
                  <option value="DAILY_ROUTINE">Executive Routine</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="input-assignment-title"
                className="block text-xs font-bold text-slate-200 mb-1"
              >
                Assignment Title *
              </label>
              <input
                id="input-assignment-title"
                type="text"
                required
                value={assignTitle}
                onChange={(e) => setAssignTitle(e.target.value)}
                placeholder="e.g. Fractions & Number Line Word Problems (Set B)"
                className="w-full min-h-[42px] rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white focus:border-teal-400 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="input-assignment-subtitle"
                className="block text-xs font-bold text-slate-200 mb-1"
              >
                Assignment Instructions / Strategy Hint
              </label>
              <input
                id="input-assignment-subtitle"
                type="text"
                value={assignSubtitle}
                onChange={(e) => setAssignSubtitle(e.target.value)}
                placeholder="e.g. Draw a number-line model before solving each question."
                className="w-full min-h-[42px] rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white focus:border-teal-400 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="select-assignment-pillar"
                  className="block text-xs font-bold text-slate-200 mb-1"
                >
                  Life Pillar
                </label>
                <select
                  id="select-assignment-pillar"
                  value={assignPillar}
                  onChange={(e) => setAssignPillar(e.target.value as LifePillar)}
                  className="w-full min-h-[42px] rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white focus:border-teal-400 focus:outline-none"
                >
                  <option value="ACADEMIC_MASTERY">Academic Mastery</option>
                  <option value="DISCIPLINES_ARTS">Disciplines &amp; Arts</option>
                  <option value="UNSTRUCTURED_PLAY">Unstructured Free Play</option>
                  <option value="RESTORATION_FAMILY">Restoration &amp; Family</option>
                  <option value="EXECUTIVE_HABITS">Executive Habits</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="select-assignment-energy"
                  className="block text-xs font-bold text-slate-200 mb-1"
                >
                  Cognitive Energy Load
                </label>
                <select
                  id="select-assignment-energy"
                  value={assignEnergy}
                  onChange={(e) => setAssignEnergy(e.target.value as EnergyLoad)}
                  className="w-full min-h-[42px] rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white focus:border-teal-400 focus:outline-none"
                >
                  <option value="HIGH_COGNITIVE">High-Cognitive (Deep Focus)</option>
                  <option value="PHYSICAL">Physical / Creative</option>
                  <option value="RESTORATIVE">Restorative / Low-Load</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label
                  htmlFor="input-assignment-time"
                  className="block text-xs font-bold text-slate-200 mb-1"
                >
                  Scheduled Time
                </label>
                <input
                  id="input-assignment-time"
                  type="time"
                  value={assignTime}
                  onChange={(e) => setAssignTime(e.target.value)}
                  className="w-full min-h-[42px] rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white focus:border-teal-400 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="input-assignment-duration"
                  className="block text-xs font-bold text-slate-200 mb-1"
                >
                  Duration (Min)
                </label>
                <input
                  id="input-assignment-duration"
                  type="number"
                  min={5}
                  max={120}
                  value={assignDuration}
                  onChange={(e) => setAssignDuration(Number(e.target.value))}
                  className="w-full min-h-[42px] rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white focus:border-teal-400 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="input-assignment-due"
                  className="block text-xs font-bold text-slate-200 mb-1"
                >
                  Due Label
                </label>
                <input
                  id="input-assignment-due"
                  type="text"
                  value={assignDue}
                  onChange={(e) => setAssignDue(e.target.value)}
                  className="w-full min-h-[42px] rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white focus:border-teal-400 focus:outline-none"
                />
              </div>
            </div>

            <button
              id="btn-submit-create-assignment"
              type="submit"
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-teal-400 to-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>Assign Task to Kid&apos;s Private Timeline</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
