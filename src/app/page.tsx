'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Compass,
  Sparkles,
} from 'lucide-react';
import { useFamilyStore } from '@/context/FamilyStoreContext';
import { TopCommandHeader } from '@/components/TopCommandHeader';
import { CollapsibleSidebar } from '@/components/CollapsibleSidebar';
import { ChildExecutiveWorkspace } from '@/components/ChildExecutiveWorkspace';
import { ParentCommandCenter } from '@/components/ParentCommandCenter';

const SIX_CRITICAL_GAPS = [
  {
    id: 'gap-1',
    title: '1. Time-Blindness Predictor & Delta Audit',
    vsCommercial: 'Skylight/Tiimo show schedules, not how long tasks actually take.',
    solution:
      'Child guesses duration (e.g. 15m vs 30m) before AoPS/Abacus; visual timer logs actual elapsed delta & accuracy %.',
    targetView: 'child-1',
  },
  {
    id: 'gap-2',
    title: '2. Executive Friction & Cognitive Energy Budget',
    vsCommercial: 'Habitica/Finch treat 30m of AoPS equal to 30m of free play.',
    solution:
      'Tags High-Mental, Physical & Restorative loads; flags back-to-back High-Mental blocks with 1-click Restorative Buffer insertion.',
    targetView: 'child-1',
  },
  {
    id: 'gap-3',
    title: '3. Socratic Parent Coaching & Praise Scripts',
    vsCommercial: 'Apps send raw completion alerts ("Good job!" / "Why didn’t you finish?").',
    solution:
      'Generates dynamic Socratic scripts: "AoPS was marked hard today — ask: Which problem stretched your brain the most?"',
    targetView: 'PARENT_COMMAND_CENTER',
  },
  {
    id: 'gap-4',
    title: '4. Low-Stakes Streak Shields & Bounce-Back Badges',
    vsCommercial: 'Binary streaks break on a sick day, causing elementary kids to quit.',
    solution:
      '2 automatic Monthly Grace Day Shields + "Comeback Kid" Bounce-Back badges celebrating resilience.',
    targetView: 'child-1',
  },
  {
    id: 'gap-5',
    title: '5. Two-Stage Transition Runway Warnings',
    vsCommercial: 'Alarms ring at the exact minute class starts, causing sensory meltdowns.',
    solution:
      '10-minute Approach Runway & 3-minute Final Landing marimba cues ("Wrap up Lego build — Karate prep in 10m").',
    targetView: 'child-1',
  },
  {
    id: 'gap-6',
    title: '6. Socratic 1-on-1 "Sunday Summit" Agenda',
    vsCommercial: 'Apps dump static charts instead of guiding family conversations.',
    solution:
      '10-minute guided Sunday Family Meeting deck with 3 personalized Socratic prompts & collaborative next-week commitments.',
    targetView: 'PARENT_COMMAND_CENTER',
  },
];

export default function HomePage() {
  const { isParentView, setActiveProfile } = useFamilyStore();
  const [showGapMatrix, setShowGapMatrix] = useState(false);

  return (
    <div
      id="page-nuvoriq-executive-hub"
      className="min-h-screen flex flex-col bg-slate-950 text-slate-100 pb-safe-mobile md:pb-0"
    >
      <TopCommandHeader />

      {/* Body Layout: Collapsible Left Sidebar + Main Workspace */}
      <div id="layout-sidebar-and-workspace" className="flex-1 flex min-w-0">
        <CollapsibleSidebar />

        <div id="workspace-scroll-column" className="flex-1 flex flex-col min-w-0">
          <main
            id="main-workspace-container"
            className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6"
          >
            {/* Interactive 6-Gap Architecture Pill Bar */}
            <section
              id="section-six-gap-benchmark-bar"
              aria-label="6 Critical Behavioral Capabilities Overview"
              className="rounded-2xl bg-slate-900/50 border border-slate-800/90 p-3.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-teal-400 shrink-0" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-teal-300">
                    Beyond Hearth, Skylight, Finch &amp; Tiimo:
                  </span>
                  <span className="text-xs text-slate-300">
                    All 6 Executive-Functioning &amp; Socratic Coaching Capabilities Active
                  </span>
                </div>
                <button
                  id="btn-toggle-six-gap-matrix"
                  type="button"
                  aria-expanded={showGapMatrix}
                  aria-controls="grid-six-gap-benchmark-cards"
                  onClick={() => setShowGapMatrix((v) => !v)}
                  className="min-h-[44px] px-3.5 py-1.5 rounded-xl bg-slate-800/90 text-xs font-bold text-slate-200 border border-slate-700 hover:border-teal-500/40 flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    {showGapMatrix ? 'Hide 6-Gap Matrix' : 'Inspect 6-Gap Benchmark Matrix'}
                  </span>
                  {showGapMatrix ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {showGapMatrix && (
                <div
                  id="grid-six-gap-benchmark-cards"
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mt-3.5 pt-3.5 border-t border-slate-800"
                >
                  {SIX_CRITICAL_GAPS.map((gap) => (
                    <div
                      key={gap.id}
                      id={`card-benchmark-${gap.id}`}
                      className="rounded-xl bg-slate-950/90 border border-slate-800 p-3.5 flex flex-col justify-between space-y-2"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h3 id={`heading-benchmark-${gap.id}`} className="text-xs font-black text-white">
                            {gap.title}
                          </h3>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        </div>
                        <p className="text-[11px] text-rose-300/90 mt-1">
                          <strong>Commercial Blindspot:</strong> {gap.vsCommercial}
                        </p>
                        <p className="text-[11px] text-slate-300 mt-1">
                          <strong className="text-teal-300">Nuvoriq Engine:</strong> {gap.solution}
                        </p>
                      </div>
                      <button
                        id={`btn-jump-benchmark-${gap.id}`}
                        type="button"
                        onClick={() => setActiveProfile(gap.targetView)}
                        className="min-h-[40px] text-left text-[11px] font-bold text-teal-300 hover:text-teal-200 underline cursor-pointer pt-1"
                      >
                        Jump to Live Module →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Active View: Either Parent Command Center or Active Child's Executive Workspace */}
            {isParentView ? <ParentCommandCenter /> : <ChildExecutiveWorkspace />}
          </main>

          <footer
            id="footer-nuvoriq-platform"
            className="border-t border-slate-900 bg-slate-950/90 py-4 px-4 sm:px-6 lg:px-8 mt-12 mb-16 md:mb-0"
          >
            <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
              <div id="footer-gradual-release-summary">
                <strong className="text-slate-200">Nuvoriq Family Executive Platform</strong> • Grades K–12 Gradual Release Architecture (Level 1 Guided → Level 2 Co-Pilot → Level 3 Executive)
              </div>
              <div id="footer-pillars-summary" className="font-mono text-[11px] text-teal-400">
                Google SSO Kid Privacy Isolation • 5 Life Pillars • 6 Multi-Mode Themes
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
