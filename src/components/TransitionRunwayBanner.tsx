'use client';

import React, { useState } from 'react';
import { BellRing, CheckCircle2, Clock, PlaneLanding, Volume2 } from 'lucide-react';
import { ScheduledTask } from '@/types/domain';
import { playRunwayChime } from '@/lib/audioChime';

interface TransitionRunwayBannerProps {
  upcomingTask?: ScheduledTask;
  childName: string;
}

export function TransitionRunwayBanner({
  upcomingTask,
  childName,
}: TransitionRunwayBannerProps) {
  const [activeStage, setActiveStage] = useState<'NONE' | 'STAGE_10MIN' | 'STAGE_3MIN'>('STAGE_10MIN');
  const [acknowledged, setAcknowledged] = useState(false);

  if (!upcomingTask) return null;

  const triggerStage = (stage: 'STAGE_10MIN' | 'STAGE_3MIN') => {
    setActiveStage(stage);
    setAcknowledged(false);
    playRunwayChime(stage === 'STAGE_10MIN' ? 'RUNWAY_10MIN' : 'RUNWAY_3MIN');
  };

  return (
    <section
      id={`section-transition-runway-${upcomingTask.id}`}
      aria-label="Transition Runway Alert"
      className={`rounded-2xl border p-4 transition-all duration-300 ${
        activeStage === 'STAGE_3MIN'
          ? 'bg-amber-950/40 border-amber-500/50 shadow-lg shadow-amber-500/10'
          : 'bg-slate-900/70 border-teal-500/40 shadow-lg shadow-teal-500/5'
      }`}
    >
      <div
        id={`runway-banner-inner-${upcomingTask.id}`}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div className="flex items-start gap-3.5">
          <div
            id={`runway-icon-badge-${upcomingTask.id}`}
            className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
              activeStage === 'STAGE_3MIN'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
            }`}
          >
            <PlaneLanding className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                id={`runway-stage-pill-${upcomingTask.id}`}
                className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40"
              >
                {activeStage === 'STAGE_3MIN'
                  ? 'Stage 2 • 3-Min Final Landing Runway'
                  : 'Stage 1 • 10-Min Approach Runway'}
              </span>
              <span
                id={`runway-next-task-time-${upcomingTask.id}`}
                className="text-xs text-slate-400 font-mono flex items-center gap-1"
              >
                <Clock className="w-3.5 h-3.5 text-teal-400" />
                Next Up at {upcomingTask.scheduledStartTime}: {upcomingTask.title}
              </span>
            </div>
            <p
              id={`runway-warning-message-${upcomingTask.id}`}
              className="text-sm font-semibold text-slate-100 mt-1.5"
            >
              {activeStage === 'STAGE_3MIN'
                ? upcomingTask.runwayWarning3MinText
                : upcomingTask.runwayWarning10MinText}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Prevents sensory rush-hour meltdowns by giving {childName}&apos;s working memory a gentle 2-stage transition buffer.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            id={`btn-runway-10min-chime-${upcomingTask.id}`}
            type="button"
            onClick={() => triggerStage('STAGE_10MIN')}
            className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
              activeStage === 'STAGE_10MIN'
                ? 'bg-teal-500/25 text-teal-200 border-teal-400/60'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-teal-500/40'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            10m Cue Chime
          </button>

          <button
            id={`btn-runway-3min-chime-${upcomingTask.id}`}
            type="button"
            onClick={() => triggerStage('STAGE_3MIN')}
            className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
              activeStage === 'STAGE_3MIN'
                ? 'bg-amber-500/30 text-amber-200 border-amber-400/60'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-amber-500/40'
            }`}
          >
            <BellRing className="w-3.5 h-3.5" />
            3m Final Chime
          </button>

          <button
            id={`btn-runway-acknowledge-${upcomingTask.id}`}
            type="button"
            onClick={() => {
              setAcknowledged(true);
              playRunwayChime('KUDOS_SENT');
            }}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
              acknowledged
                ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-400/50'
                : 'bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 hover:from-teal-300 hover:to-emerald-300'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {acknowledged ? 'Runway Acknowledged!' : "I'm Wrapping Up"}
          </button>
        </div>
      </div>
    </section>
  );
}
