'use client';

import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Download,
  HeartHandshake,
  Mail,
  MessageSquareQuote,
  MessageSquareShare,
  Play,
  Scale,
  Send,
  ShieldCheck,
  Sparkles,
  Timer,
  Upload,
  Wand2,
} from 'lucide-react';
import { KudosBadgeType } from '@/types/domain';
import { MOOD_META } from '@/lib/seedData';
import { useFamilyStore } from '@/context/FamilyStoreContext';
import { IpsativeRadarChart } from '@/components/IpsativeRadarChart';
import {
  generateFamilyIcsCalendar,
  parseImportedIcsEvents,
} from '@/lib/icsEngine';

const KUDOS_BADGE_OPTIONS: {
  type: KudosBadgeType;
  label: string;
  defaultMessage: string;
}[] = [
  {
    type: 'GRIT',
    label: 'Grit & Strategy Shift',
    defaultMessage:
      'I loved seeing how you tried a smaller test case when you hit a wall today. Real growth happens in the stretch zone!',
  },
  {
    type: 'TIME_CALIBRATOR',
    label: 'Time-Sense Calibrator',
    defaultMessage:
      'Your time estimation accuracy is getting sharper every day! Planning how long tasks take is a superpower.',
  },
  {
    type: 'SELF_REGULATION',
    label: 'Calm Runway Transition',
    defaultMessage:
      'Thank you for wrapping up your play peacefully during the 10-minute Runway chime today!',
  },
  {
    type: 'CREATIVE_BREAKTHROUGH',
    label: 'Creative Breakthrough',
    defaultMessage:
      'The way you connected ideas and built your project today showed awesome creative focus!',
  },
  {
    type: 'KINDNESS',
    label: 'Sibling Kindness & Empathy',
    defaultMessage:
      'Thank you for encouraging your sibling and respecting their focus sprint timer today!',
  },
];

export function ParentCommandCenter() {
  const {
    state,
    openStudioModal,
    signInWithGoogleSSO,
    getChildTrackers,
    getCognitiveClashes,
    autoBalanceCognitiveSchedule,
    approveProposedTask,
    dispatchParentKudos,
    toggleSummitCommitmentComplete,
    updateSummitAdjustment,
    logIntegrationEvent,
    importTasksFromIcs,
  } = useFamilyStore();

  const [activeTab, setActiveTab] = useState<
    'ALL' | 'SUNDAY_SUMMIT' | 'SOCRATIC_COACH' | 'IPSATIVE_EQUITY' | 'INTEGRATIONS'
  >('ALL');

  const [summitSecondsLeft, setSummitSecondsLeft] = useState(10 * 60);
  const [summitTimerRunning, setSummitTimerRunning] = useState(false);

  const [selectedChildForKudos, setSelectedChildForKudos] = useState(
    state.children[0]?.id || 'child-1'
  );
  const [selectedBadge, setSelectedBadge] = useState<KudosBadgeType>('GRIT');
  const [kudosMessage, setKudosMessage] = useState(
    KUDOS_BADGE_OPTIONS[0].defaultMessage
  );
  const [kudosQuestion, setKudosQuestion] = useState(
    'Which problem or moment stretched your brain the most today?'
  );
  const [webhookStatusBanner, setWebhookStatusBanner] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!summitTimerRunning) return;
    const id = setInterval(() => {
      setSummitSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [summitTimerRunning]);

  const formatSummitTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const proposedTasks = state.tasks.filter((t) => t.status === 'PROPOSED');
  const allClashes = state.children.flatMap((c) => getCognitiveClashes(c.id));

  const totalKudos30d = state.children.reduce(
    (sum, c) => sum + c.kudosCount30Days,
    0
  );

  const handleDownloadIcs = () => {
    const icsText = generateFamilyIcsCalendar(state.tasks, state.children);
    const blob = new Blob([icsText], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nuvoriq-family-executive-schedule.ics';
    a.click();
    URL.revokeObjectURL(url);

    logIntegrationEvent({
      channel: 'ICS_CALENDAR',
      direction: 'OUTBOUND',
      recipient: 'nuvoriq-family-executive-schedule.ics',
      subject: `Exported ${state.tasks.length} Pillar Blocks with -PT10M & -PT3M Runway VALARMs`,
      payloadPreview: icsText.slice(0, 140).replace(/\r\n/g, ' // '),
      status: 'SYNCED',
    });
    setWebhookStatusBanner(
      'Exported RFC-5545 .ICS Calendar with 10-min & 3-min Runway VALARM triggers!'
    );
  };

  const handleSimulateIcsImport = () => {
    const sampleIcs = [
      'BEGIN:VCALENDAR',
      'BEGIN:VEVENT',
      'DTSTART:20260926T174500',
      'SUMMARY:[Leo] Math Olympiad Team Strategy Lab',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
    const parsed = parseImportedIcsEvents(sampleIcs, 'child-1');
    importTasksFromIcs(parsed, 'child-1');
    logIntegrationEvent({
      channel: 'ICS_CALENDAR',
      direction: 'INBOUND',
      recipient: 'Leo (Grade 4 • Co-Pilot)',
      subject: 'Imported 1 External .ICS Event: Math Olympiad Team Strategy Lab',
      payloadPreview: 'DTSTART:17:45 // PILLAR:ACADEMIC_MASTERY // LOAD:HIGH_COGNITIVE',
      status: 'SYNCED',
    });
    setWebhookStatusBanner(
      'Synced inbound .ICS calendar event ("Math Olympiad Team Strategy Lab") into Leo’s timeline!'
    );
  };

  const handleTriggerTwilioSms = async (scriptText: string, childName: string) => {
    try {
      await fetch('/api/webhooks/twilio-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient: '+1 (555) 234-8910',
          childName,
          message: scriptText,
        }),
      });
    } catch {
      // Continue
    }
    logIntegrationEvent({
      channel: 'TWILIO_SMS',
      direction: 'OUTBOUND',
      recipient: '+1 (555) 234-8910 (Principal Nitin)',
      subject: `Socratic Coaching Script for ${childName}`,
      payloadPreview: scriptText,
      status: 'DELIVERED',
    });
    setWebhookStatusBanner(
      `Dispatched Socratic Coaching Script for ${childName} via Twilio SMS Webhook!`
    );
  };

  const handleTriggerResendEmail = async () => {
    const summaryText = state.summitCommitments
      .map((s) => `${s.childName}: ${s.socraticDiscussionPrompt}`)
      .join(' | ');
    try {
      await fetch('/api/webhooks/resend-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'parents@sharma-miller-family.org',
          subject: 'Sunday Family Summit 10-Min Guided Agenda',
          summary: summaryText,
        }),
      });
    } catch {
      // Continue
    }
    logIntegrationEvent({
      channel: 'RESEND_EMAIL',
      direction: 'OUTBOUND',
      recipient: 'parents@sharma-miller-family.org',
      subject: 'Sunday Family Summit 10-Min Guided Agenda Dispatched',
      payloadPreview: summaryText,
      status: 'DELIVERED',
    });
    setWebhookStatusBanner(
      'Sent Sunday Family Summit 10-Minute Guided Agenda via Resend Email Webhook!'
    );
  };

  return (
    <div id="view-parent-command-center" className="space-y-6">
      {/* Command Center Top Banner & Section Filter Tabs */}
      <section
        id="section-parent-command-overview"
        aria-label="Parent Command Center Overview"
        className="rounded-2xl bg-slate-900/75 border border-teal-500/40 p-5 shadow-xl"
      >
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                id="badge-parent-command-role"
                className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/40"
              >
                Principal &amp; Parent Executive Command Center
              </span>
              <span id="text-parent-names" className="text-xs text-slate-400 font-mono">
                {state.principalParentName} &amp; {state.coParentName}
              </span>
            </div>
            <h1 id="heading-parent-command-center" className="text-xl sm:text-2xl font-black text-white mt-1.5">
              Socratic Parent Coaching, Ipsative Growth &amp; Sunday Family Summit
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl">
              Replaces binary chore charts and raw spreadsheets with evidence-based Socratic conversation prompts, cognitive energy load balancing, parental equity auditing, and a 10-minute guided Sunday Family Summit.
            </p>
          </div>

          {/* Sub-View Filter Pills */}
          <div id="tablist-parent-command-modules" role="tablist" className="flex flex-wrap gap-2">
            {[
              { id: 'ALL', label: 'All Command Modules' },
              { id: 'SUNDAY_SUMMIT', label: 'Sunday Summit Agenda' },
              { id: 'SOCRATIC_COACH', label: 'Socratic Praise Scripts' },
              { id: 'IPSATIVE_EQUITY', label: 'Ipsative & Equity Audit' },
              { id: 'INTEGRATIONS', label: '2-Way .ICS & Webhooks' },
            ].map((tab) => (
              <button
                key={tab.id}
                id={`tab-parent-module-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                data-testid={`parent-tab-${tab.id}`}
                onClick={() =>
                  setActiveTab(
                    tab.id as
                      | 'ALL'
                      | 'SUNDAY_SUMMIT'
                      | 'SOCRATIC_COACH'
                      | 'IPSATIVE_EQUITY'
                      | 'INTEGRATIONS'
                  )
                }
                className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-teal-400 text-slate-950 border-teal-300 font-extrabold shadow-md'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {webhookStatusBanner && (
          <div
            id="banner-webhook-status-toast"
            className="mt-4 px-4 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xs font-bold text-emerald-200 flex items-center justify-between"
          >
            <span>✓ {webhookStatusBanner}</span>
            <button
              id="btn-dismiss-webhook-toast"
              type="button"
              onClick={() => setWebhookStatusBanner(null)}
              className="min-h-[36px] px-2 text-emerald-300 underline ml-4 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}
      </section>

      {/* Family Kid Roster, Google SSO Accounts, Custom Trackers & Assignment Dispatcher */}
      <section
        id="section-parent-kid-tracker-manager"
        aria-label="Family Kid Roster, Google SSO Accounts & Assignment Manager"
        className="rounded-2xl bg-slate-900/75 border border-slate-800/90 p-5 shadow-xl space-y-4"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <h2
                id="heading-parent-kid-tracker-manager"
                className="text-base font-black text-white"
              >
                Family Kid Roster, Google SSO Accounts &amp; Tracker/Assignment Studio ({state.children.length} Kids)
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Add new kids with their own Google SSO email, create custom skill trackers, and assign homework tasks. When a kid logs in with their Google SSO email, they strictly see only their own details.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              id="btn-parent-hub-add-kid"
              type="button"
              onClick={() => openStudioModal('ADD_KID')}
              className="min-h-[42px] px-3.5 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>+ Add New Kid Profile</span>
            </button>
            <button
              id="btn-parent-hub-create-tracker"
              type="button"
              onClick={() => openStudioModal('CREATE_TRACKER')}
              className="min-h-[42px] px-3.5 py-2 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/40 hover:bg-teal-500/30 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>+ Create Tracker</span>
            </button>
            <button
              id="btn-parent-hub-create-assignment"
              type="button"
              onClick={() => openStudioModal('CREATE_ASSIGNMENT')}
              className="min-h-[42px] px-3.5 py-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-500/30 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>+ Assign Homework / Task</span>
            </button>
          </div>
        </div>

        <div
          id="grid-parent-kid-roster"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {state.children.map((child) => {
            const trackers = getChildTrackers(child.id);
            const childTasks = state.tasks.filter((t) => t.childId === child.id);
            const email =
              child.googleEmail ||
              `${child.name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`;

            return (
              <article
                key={child.id}
                id={`card-parent-roster-kid-${child.id}`}
                className="rounded-2xl bg-slate-950 border border-slate-800 p-4 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{child.avatarEmoji}</span>
                      <div>
                        <h3
                          id={`heading-roster-kid-${child.id}`}
                          className="text-sm font-black text-white"
                        >
                          {child.name} ({child.gradeLabel} • Age {child.age})
                        </h3>
                        <p className="text-[11px] text-teal-300 font-mono">
                          Google SSO: {email}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                      {trackers.length} Trackers • {childTasks.length} Tasks
                    </span>
                  </div>

                  <div className="space-y-1 pt-1">
                    {trackers.slice(0, 2).map((trk) => (
                      <div
                        key={trk.id}
                        id={`item-roster-tracker-preview-${trk.id}`}
                        className="text-[11px] text-slate-300 flex items-center justify-between bg-slate-900/70 px-2.5 py-1.5 rounded-lg border border-slate-800/80"
                      >
                        <span className="truncate font-semibold">{trk.title}</span>
                        <span className="font-mono text-teal-300 shrink-0 ml-2">
                          {trk.currentValue}/{trk.targetValue} {trk.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-800/80">
                  <button
                    id={`btn-roster-add-tracker-${child.id}`}
                    type="button"
                    onClick={() => openStudioModal('CREATE_TRACKER', child.id)}
                    className="min-h-[38px] px-2 py-1.5 rounded-xl bg-slate-900 hover:border-teal-400 border border-slate-800 text-[11px] font-bold text-teal-300 cursor-pointer"
                  >
                    + Tracker
                  </button>
                  <button
                    id={`btn-roster-assign-task-${child.id}`}
                    type="button"
                    onClick={() => openStudioModal('CREATE_ASSIGNMENT', child.id)}
                    className="min-h-[38px] px-2 py-1.5 rounded-xl bg-slate-900 hover:border-indigo-400 border border-slate-800 text-[11px] font-bold text-indigo-300 cursor-pointer"
                  >
                    + Assign
                  </button>
                  <button
                    id={`btn-roster-login-kid-sso-${child.id}`}
                    type="button"
                    onClick={() =>
                      signInWithGoogleSSO({
                        email,
                        displayName: `${child.name} (${child.gradeLabel})`,
                        role: 'CHILD',
                        linkedChildId: child.id,
                        avatarEmoji: child.avatarEmoji,
                      })
                    }
                    className="min-h-[38px] px-2 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-[11px] font-extrabold text-indigo-200 cursor-pointer"
                  >
                    🔑 Kid SSO
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Household Cognitive Load & Co-Pilot Approval Banner */}
      {(allClashes.length > 0 || proposedTasks.length > 0) && (
        <section
          id="section-parent-schedule-governance-alerts"
          aria-label="Household Schedule Governance Alerts"
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          {allClashes.map((clash, idx) => {
            const child = state.children.find((c) => c.id === clash.childId);
            return (
              <div
                key={`${clash.childId}-${idx}`}
                id={`card-parent-clash-alert-${clash.childId}-${idx}`}
                className="rounded-2xl bg-fuchsia-950/35 border border-fuchsia-500/40 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-fuchsia-300 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-fuchsia-500/20 text-fuchsia-200">
                      {child?.name} • Cognitive Load Clash
                    </span>
                    <p className="text-xs font-bold text-white mt-1">
                      {clash.explanation}
                    </p>
                  </div>
                </div>
                <button
                  id={`btn-parent-insert-buffer-${clash.childId}-${idx}`}
                  type="button"
                  onClick={() => autoBalanceCognitiveSchedule(clash.childId)}
                  className="min-h-[44px] px-3.5 py-2 rounded-xl bg-fuchsia-400 text-slate-950 font-extrabold text-xs shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  Insert Buffer
                </button>
              </div>
            );
          })}

          {proposedTasks.map((pt) => {
            const child = state.children.find((c) => c.id === pt.childId);
            return (
              <div
                key={pt.id}
                id={`card-parent-proposal-${pt.id}`}
                className="rounded-2xl bg-indigo-950/35 border border-indigo-500/40 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                    Co-Pilot Schedule Proposal from {child?.name}
                  </span>
                  <p className="text-sm font-bold text-white mt-1">
                    {pt.title} ({pt.scheduledStartTime} • {pt.defaultDurationMinutes}m)
                  </p>
                </div>
                <button
                  id={`btn-approve-proposal-${pt.id}`}
                  type="button"
                  onClick={() => approveProposedTask(pt.id)}
                  className="min-h-[44px] px-3.5 py-2 rounded-xl bg-teal-400 text-slate-950 font-extrabold text-xs shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Approve Proposal
                </button>
              </div>
            );
          })}
        </section>
      )}

      {/* MODULE 1: THE SOCRATIC 1-ON-1 "SUNDAY SUMMIT" SCRIPT ENGINE (CRITICAL GAP #6) */}
      {(activeTab === 'ALL' || activeTab === 'SUNDAY_SUMMIT') && (
        <section
          id="section-sunday-family-summit"
          aria-label="The Sunday Family Summit Guided Conversation Engine"
          data-testid="sunday-summit-section"
          className="rounded-2xl bg-slate-900/75 border border-amber-500/40 p-5 sm:p-6 shadow-xl space-y-5"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Gap #6 Solution • Guided 10-Minute Family Check-In
                </span>
                <span className="text-xs text-slate-400">
                  Interactive Conversation Cards (Zero Static Spreadsheets)
                </span>
              </div>
              <h2 id="heading-sunday-summit" className="text-xl font-black text-white mt-1 flex items-center gap-2">
                <MessageSquareQuote className="w-6 h-6 text-amber-400" />
                <span>The Socratic 1-on-1 &ldquo;Sunday Summit&rdquo; Agenda</span>
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Synthesizes each child&apos;s weekly self-reported Personal Bests, time-calibration roadblocks, and 3 Socratic discussion prompts for an intentional 10-minute Sunday family meeting.
              </p>
            </div>

            {/* 10-Minute Guided Summit Timer */}
            <div
              id="card-sunday-summit-timer"
              className="flex items-center gap-3 bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-2xl shrink-0"
            >
              <Timer className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-[10px] font-bold uppercase text-slate-400">
                  Summit Meeting Timer
                </div>
                <div
                  id="text-sunday-summit-countdown"
                  className="text-lg font-mono font-black text-white tabular-nums"
                >
                  {formatSummitTimer(summitSecondsLeft)}
                </div>
              </div>
              <button
                id="btn-toggle-sunday-summit-timer"
                type="button"
                onClick={() => setSummitTimerRunning((r) => !r)}
                className="min-h-[44px] px-3.5 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-1 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                {summitTimerRunning ? 'Pause' : 'Start 10m Summit'}
              </button>
            </div>
          </div>

          {/* Conversation Cards for Each Child */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {state.summitCommitments.map((card) => {
              const child = state.children.find((c) => c.id === card.childId);
              return (
                <article
                  key={card.id}
                  id={`card-sunday-summit-${card.childId}`}
                  data-testid={`sunday-summit-card-${card.childId}`}
                  className={`rounded-2xl border p-5 space-y-4 transition-all ${
                    card.completedInSummit
                      ? 'bg-emerald-950/20 border-emerald-500/40'
                      : 'bg-slate-950/90 border-slate-800 hover:border-amber-500/40'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{child?.avatarEmoji || '🌟'}</span>
                      <div>
                        <h3
                          id={`heading-summit-card-${card.childId}`}
                          className="text-base font-black text-white"
                        >
                          {card.childName} — Sunday Conversation Card
                        </h3>
                        <span className="text-[11px] text-teal-300 font-mono">
                          3-Part Guided Socratic Dialogue
                        </span>
                      </div>
                    </div>
                    <button
                      id={`btn-summit-complete-${card.childId}`}
                      type="button"
                      data-testid={`summit-complete-btn-${card.childId}`}
                      onClick={() => toggleSummitCommitmentComplete(card.id)}
                      className={`min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer border ${
                        card.completedInSummit
                          ? 'bg-emerald-500/25 text-emerald-200 border-emerald-400'
                          : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-teal-400'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {card.completedInSummit ? 'Summit Completed' : 'Mark Discussed'}
                    </button>
                  </div>

                  {/* Prompt 1: Celebration & Personal Best */}
                  <div
                    id={`summit-prompt-1-win-${card.childId}`}
                    className="rounded-xl bg-slate-900/90 border border-emerald-500/30 p-3.5"
                  >
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300">
                      1. Celebrate Self-Reported Personal Best
                    </div>
                    <p className="text-xs text-slate-100 mt-1 leading-relaxed">
                      {card.celebrationWin}
                    </p>
                  </div>

                  {/* Prompt 2: Roadblock & Socratic Question */}
                  <div
                    id={`summit-prompt-2-socratic-${card.childId}`}
                    className="rounded-xl bg-slate-900/90 border border-amber-500/30 p-3.5 space-y-1.5"
                  >
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300">
                      2. Logged Friction &amp; Socratic Discussion Prompt
                    </div>
                    <p className="text-xs text-slate-300">
                      <strong className="text-slate-100">Observed Pattern:</strong>{' '}
                      {card.roadblockIdentified}
                    </p>
                    <p className="text-xs font-bold text-amber-200 bg-amber-500/10 border border-amber-500/30 rounded-lg p-2.5">
                      💬 Ask {child?.name}: {card.socraticDiscussionPrompt}
                    </p>
                  </div>

                  {/* Prompt 3: Collaborative Next-Week Adjustment */}
                  <div
                    id={`summit-prompt-3-commitment-${card.childId}`}
                    className="rounded-xl bg-slate-900/90 border border-indigo-500/30 p-3.5 space-y-2"
                  >
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-300">
                      3. Collaborative Next-Week Schedule &amp; Support Pledge
                    </div>
                    <div>
                      <label
                        htmlFor={`input-summit-adjustment-${card.childId}`}
                        className="block text-[11px] text-slate-400 mb-1"
                      >
                        Child &amp; Parent Agreed Schedule Adjustment:
                      </label>
                      <input
                        id={`input-summit-adjustment-${card.childId}`}
                        type="text"
                        value={card.nextWeekAdjustment}
                        onChange={(e) =>
                          updateSummitAdjustment(
                            card.id,
                            e.target.value,
                            card.parentSupportPledge
                          )
                        }
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`input-summit-pledge-${card.childId}`}
                        className="block text-[11px] text-slate-400 mb-1"
                      >
                        Parent Support Pledge:
                      </label>
                      <input
                        id={`input-summit-pledge-${card.childId}`}
                        type="text"
                        value={card.parentSupportPledge}
                        onChange={(e) =>
                          updateSummitAdjustment(
                            card.id,
                            card.nextWeekAdjustment,
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-teal-300"
                      />
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-mono text-slate-400">
                        Auto-syncs to family schedule
                      </span>
                      <button
                        id={`btn-save-summit-pledge-${card.childId}`}
                        type="button"
                        onClick={() =>
                          setWebhookStatusBanner(
                            `Saved Sunday Summit Next-Week Commitment & Parent Pledge for ${card.childName}!`
                          )
                        }
                        className="min-h-[36px] px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[11px] font-bold hover:bg-indigo-500/30 cursor-pointer"
                      >
                        ✓ Save Next-Week Pledge
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* MODULE 2: PARENT COACHING & PRAISE SCRIPTING ENGINE (CRITICAL GAP #3) */}
      {(activeTab === 'ALL' || activeTab === 'SOCRATIC_COACH') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 7 Cols: Contextual Socratic Parent Scripts */}
          <section
            id="section-socratic-coaching-engine"
            aria-label="Socratic Parent Coaching Scripts"
            data-testid="socratic-coaching-section"
            className="lg:col-span-7 rounded-2xl bg-slate-900/75 border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4"
          >
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/40">
                Gap #3 Solution • Anti-Friction Parent Coaching Engine
              </span>
              <h2 className="text-lg font-black text-white mt-1.5 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-400" />
                <span>Contextual Socratic Parent Scripts</span>
              </h2>
              <p className="text-xs text-slate-400">
                Replaces outcome interrogation (&ldquo;Did you get an A?&rdquo;) with process-focused Socratic questions triggered by each child&apos;s reflections and mood dial.
              </p>
            </div>

            <div className="space-y-3.5">
              {state.coachingSuggestions.map((sug) => {
                const mood = MOOD_META[sug.childMood];
                return (
                  <article
                    key={sug.id}
                    id={`card-coaching-script-${sug.id}`}
                    className="rounded-2xl bg-slate-950 border border-slate-800 p-4 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-white">
                          {sug.childName} • {sug.taskTitle}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${mood?.colorClass}`}
                        >
                          {mood?.emoji} {mood?.label}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {sug.triggerReason}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="rounded-xl bg-rose-950/25 border border-rose-500/30 p-3">
                        <span className="text-[10px] font-extrabold uppercase text-rose-300 block">
                          ✗ Avoid Outcome / Friction Phrase
                        </span>
                        <p className="text-slate-300 mt-1">{sug.avoidPhrase}</p>
                      </div>

                      <div className="rounded-xl bg-teal-950/30 border border-teal-500/40 p-3">
                        <span className="text-[10px] font-extrabold uppercase text-teal-300 block">
                          ✓ Try This Socratic Coaching Script
                        </span>
                        <p className="text-white font-semibold mt-1">
                          {sug.socraticScript}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <span className="text-[11px] text-indigo-300">
                        Recommended Action: {sug.followUpAction}
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          id={`btn-sms-coaching-script-${sug.id}`}
                          type="button"
                          onClick={() =>
                            handleTriggerTwilioSms(sug.socraticScript, sug.childName)
                          }
                          className="min-h-[44px] px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-700 cursor-pointer"
                        >
                          <MessageSquareShare className="w-3.5 h-3.5 text-teal-400" />
                          Text Script to Phone
                        </button>
                        <button
                          id={`btn-dispatch-grit-kudos-${sug.id}`}
                          type="button"
                          onClick={() =>
                            dispatchParentKudos(
                              sug.childId,
                              'GRIT',
                              sug.socraticScript.replace(/^"|"$/g, ''),
                              sug.socraticScript,
                              sug.id
                            )
                          }
                          className={`min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer ${
                            sug.dispatched
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-teal-400 text-slate-950 hover:bg-teal-300'
                          }`}
                        >
                          <Send className="w-3.5 h-3.5" />
                          {sug.dispatched
                            ? 'Dispatched to Child!'
                            : 'Send as Grit Kudos'}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Right 5 Cols: Effort-Based Growth-Mindset Kudos Dispatcher */}
          <section
            id="section-kudos-dispatcher"
            aria-label="Effort-Based Kudos Dispatcher"
            className="lg:col-span-5 rounded-2xl bg-slate-900/75 border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4"
          >
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-rose-400" />
              <h2 className="text-lg font-black text-white">
                Effort-Based Kudos Dispatcher
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Send growth-mindset praise badges celebrating strategy, persistence, kindness, and calm transitions.
            </p>

            <div className="space-y-3">
              <div>
                <span className="block text-xs font-bold text-slate-300 mb-1.5">
                  Select Child Recipient
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {state.children.map((c) => (
                    <button
                      key={c.id}
                      id={`btn-kudos-recipient-${c.id}`}
                      type="button"
                      onClick={() => setSelectedChildForKudos(c.id)}
                      className={`min-h-[44px] py-2.5 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 cursor-pointer ${
                        selectedChildForKudos === c.id
                          ? 'bg-teal-500/25 text-white border-teal-400'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      <span>{c.avatarEmoji}</span>
                      <span>
                        {c.name} ({c.gradeLabel})
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="block text-xs font-bold text-slate-300 mb-1.5">
                  Growth-Mindset Badge Pillar
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {KUDOS_BADGE_OPTIONS.map((opt) => (
                    <button
                      key={opt.type}
                      id={`btn-kudos-badge-type-${opt.type}`}
                      type="button"
                      onClick={() => {
                        setSelectedBadge(opt.type);
                        setKudosMessage(opt.defaultMessage);
                      }}
                      className={`min-h-[40px] px-2.5 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                        selectedBadge === opt.type
                          ? 'bg-rose-500/25 text-rose-200 border-rose-400'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="textarea-kudos-message"
                  className="block text-xs font-bold text-slate-300 mb-1"
                >
                  Specific Effort Praise Note
                </label>
                <textarea
                  id="textarea-kudos-message"
                  rows={3}
                  value={kudosMessage}
                  onChange={(e) => setKudosMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="input-kudos-socratic-question"
                  className="block text-xs font-bold text-teal-300 mb-1"
                >
                  Optional Socratic Dinner Question
                </label>
                <input
                  id="input-kudos-socratic-question"
                  type="text"
                  value={kudosQuestion}
                  onChange={(e) => setKudosQuestion(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <button
                id="btn-submit-kudos-badge"
                type="button"
                onClick={() => {
                  dispatchParentKudos(
                    selectedChildForKudos,
                    selectedBadge,
                    kudosMessage,
                    kudosQuestion
                  );
                  setWebhookStatusBanner(
                    `Sent ${selectedBadge} Kudos Badge to ${
                      state.children.find((c) => c.id === selectedChildForKudos)
                        ?.name
                    }!`
                  );
                }}
                className="min-h-[44px] w-full py-3 rounded-xl bg-gradient-to-r from-rose-400 via-amber-400 to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Dispatch Growth-Mindset Kudos Badge
              </button>

              {/* Recent Dispatched Kudos History (Balances Column Height) */}
              <div
                id="container-recent-dispatched-kudos"
                className="pt-3 border-t border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    Recent Dispatched Effort Kudos
                  </span>
                  <span className="text-[10px] font-mono text-teal-300">
                    {state.kudos.length} Sent
                  </span>
                </div>
                <div className="space-y-2">
                  {state.kudos.slice(0, 2).map((k) => {
                    const recipient = state.children.find((c) => c.id === k.childId);
                    return (
                      <div
                        key={k.id}
                        id={`card-parent-kudos-history-${k.id}`}
                        className="rounded-xl bg-slate-950 border border-slate-800 p-3 space-y-1"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-white">
                            {recipient?.avatarEmoji} {recipient?.name} •{' '}
                            <span className="text-rose-300">
                              {k.badgeType.replace('_', ' ')}
                            </span>
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {k.createdAt}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 line-clamp-2">
                          {k.message}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* MODULE 3: MULTI-CHILD IPSATIVE RADAR CHARTS & PARENTAL EQUITY AUDIT */}
      {(activeTab === 'ALL' || activeTab === 'IPSATIVE_EQUITY') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Side-by-Side Ipsative Radar Charts (8 Cols) */}
          <section
            id="section-parent-ipsative-analytics"
            aria-label="Multi-Child Ipsative Growth Analytics"
            className="lg:col-span-8 rounded-2xl bg-slate-900/75 border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-teal-400" />
                  <span>Multi-Child Ipsative Growth Analytics (Self-Referenced)</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Each child is measured strictly against their own 30-day historical baseline across the 5 Life Pillars — eliminating sibling rivalry.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {state.children.map((child) => (
                <div
                  key={child.id}
                  id={`card-parent-ipsative-radar-${child.id}`}
                  className="rounded-2xl bg-slate-950/90 border border-slate-800 p-4"
                >
                  <IpsativeRadarChart
                    childId={`parent-view-${child.id}`}
                    childName={child.name}
                    gradeLabel={child.gradeLabel}
                    scores={child.ipsativeBaseline}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* 30-Day Parental Equity Audit (4 Cols) */}
          <section
            id="section-parental-equity-audit"
            aria-label="30-Day Parental Equity Audit"
            className="lg:col-span-4 rounded-2xl bg-slate-900/75 border border-slate-800 p-5 sm:p-6 shadow-xl flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-black text-white">
                  30-Day Parental Equity Audit
                </h2>
              </div>
              <p className="text-xs text-slate-400">
                Tracks the distribution of Kudos and 1-on-1 Coaching Check-ins across siblings over the past 30 days so no child feels overlooked.
              </p>

              <div className="space-y-4 pt-2">
                {state.children.map((child) => {
                  const sharePercent = Math.round(
                    (child.kudosCount30Days / Math.max(totalKudos30d, 1)) * 100
                  );
                  return (
                    <div
                      key={child.id}
                      id={`card-equity-audit-${child.id}`}
                      className="rounded-xl bg-slate-950 border border-slate-800 p-3.5 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{child.avatarEmoji}</span>
                          <span>
                            {child.name} ({child.gradeLabel})
                          </span>
                        </span>
                        <span className="text-xs font-mono font-bold text-teal-300">
                          {sharePercent}% Share
                        </span>
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-teal-400 to-indigo-400"
                          style={{ width: `${sharePercent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                        <span>{child.kudosCount30Days} Kudos Badges</span>
                        <span>{child.coachingCheckIns30Days} Coaching Check-Ins</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div
              id="card-equity-balance-nudge"
              className="rounded-xl bg-amber-950/30 border border-amber-500/40 p-3.5 space-y-2"
            >
              <div className="text-xs font-bold text-amber-300">
                Equity Insight: Maya has received 3 fewer kudos than Leo this month.
              </div>
              <button
                id="btn-send-equity-kudos-maya"
                type="button"
                onClick={() => {
                  dispatchParentKudos(
                    'child-2',
                    'CREATIVE_BREAKTHROUGH',
                    'Maya, your expressive storytelling in Puppet Theater and sounding out long-E words this week lit up our whole house!'
                  );
                  setWebhookStatusBanner(
                    'Balanced 30-Day Parental Equity by sending Maya a Creative Breakthrough Kudos Badge!'
                  );
                }}
                className="min-h-[44px] w-full py-2 rounded-xl bg-amber-400 text-slate-950 font-extrabold text-xs cursor-pointer hover:bg-amber-300"
              >
                1-Click Send Equity Kudos to Maya
              </button>
            </div>
          </section>
        </div>
      )}

      {/* MODULE 4: EXTERNAL INTEGRATIONS (.ICS CALENDAR, TWILIO SMS, RESEND EMAIL) */}
      {(activeTab === 'ALL' || activeTab === 'INTEGRATIONS') && (
        <section
          id="section-external-integrations"
          aria-label="External Calendar and Webhook Integrations"
          className="rounded-2xl bg-slate-900/75 border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400" />
                <span>
                  External Ecosystem Bridge (.ICS 2-Way Calendar Sync, Twilio SMS &amp; Resend Email)
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Syncs cognitive-tagged schedules with Google/Apple/Outlook calendars (including -PT10M and -PT3M Runway VALARMs) and dispatches Socratic parent nudges.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                id="btn-export-ics-calendar"
                type="button"
                onClick={handleDownloadIcs}
                className="min-h-[44px] px-3.5 py-2 rounded-xl bg-indigo-500/20 text-indigo-200 border border-indigo-500/40 text-xs font-bold flex items-center gap-1.5 hover:bg-indigo-500/30 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export .ICS Calendar
              </button>
              <button
                id="btn-sync-inbound-ics"
                type="button"
                onClick={handleSimulateIcsImport}
                className="min-h-[44px] px-3.5 py-2 rounded-xl bg-teal-500/20 text-teal-200 border border-teal-500/40 text-xs font-bold flex items-center gap-1.5 hover:bg-teal-500/30 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                Sync Inbound .ICS Event
              </button>
              <button
                id="btn-email-sunday-summit-resend"
                type="button"
                onClick={handleTriggerResendEmail}
                className="min-h-[44px] px-3.5 py-2 rounded-xl bg-amber-500/20 text-amber-200 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-500/30 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                Email Sunday Summit Digest (Resend)
              </button>
            </div>
          </div>

          {/* Integration Telemetry Feed */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {state.integrationLogs.slice(0, 3).map((log) => (
              <div
                key={log.id}
                id={`card-integration-log-${log.id}`}
                className="rounded-xl bg-slate-950 border border-slate-800 p-3.5 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded bg-slate-800 text-teal-300">
                    {log.channel} • {log.direction}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">
                    ● {log.status}
                  </span>
                </div>
                <div className="text-xs font-bold text-white">{log.subject}</div>
                <div className="text-[11px] text-slate-400 truncate">
                  To: {log.recipient}
                </div>
                <div className="text-[10px] font-mono text-slate-400 bg-slate-900 p-2 rounded border border-slate-800/80 line-clamp-2">
                  {log.payloadPreview}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
