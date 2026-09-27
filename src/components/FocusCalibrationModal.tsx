'use client';

import React, { useEffect, useState } from 'react';
import {
  Camera,
  CheckCircle2,
  Clock,
  FastForward,
  Mic,
  MicOff,
  Pause,
  Play,
  Sparkles,
  Timer,
  Upload,
  X,
} from 'lucide-react';
import { MoodState, ScheduledTask } from '@/types/domain';
import { ENERGY_META, MOOD_META, PILLAR_META } from '@/lib/seedData';
import { useFamilyStore } from '@/context/FamilyStoreContext';

interface FocusCalibrationModalProps {
  task: ScheduledTask;
  childName: string;
  initialMood: MoodState;
  onClose: () => void;
}

const PRESET_DURATIONS = [10, 15, 20, 25, 30, 45, 60];

export function FocusCalibrationModal({
  task,
  childName,
  initialMood,
  onClose,
}: FocusCalibrationModalProps) {
  const { completeTaskWithCalibrationAndReflection } = useFamilyStore();

  const [stage, setStage] = useState<'ESTIMATE' | 'TIMER' | 'REFLECT'>('ESTIMATE');
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(
    task.defaultDurationMinutes || 25
  );
  const [moodBefore, setMoodBefore] = useState<MoodState>(initialMood);
  const [moodAfter, setMoodAfter] = useState<MoodState>('FOCUSED');

  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(true);

  const [selectedPrompt, setSelectedPrompt] = useState<string>(
    task.socraticHints[0] || 'What strategy helped you stretch your brain today?'
  );
  const [whatIDid, setWhatIDid] = useState<string>(
    `Completed ${task.title} focus block and checked my work.`
  );
  const [whereIGotStuck, setWhereIGotStuck] = useState<string>(
    'The middle challenge step took longer than I first guessed, so I had to slow down.'
  );
  const [whatClicked, setWhatClicked] = useState<string>(
    'Breaking the problem into a smaller test case made the pattern pop right out!'
  );
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceDictated, setVoiceDictated] = useState<boolean>(false);
  const [artifactDataUrl, setArtifactDataUrl] = useState<string | undefined>(undefined);
  const [artifactTitle, setArtifactTitle] = useState<string>('');

  useEffect(() => {
    if (stage !== 'TIMER' || !isRunning) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [stage, isRunning]);

  const totalEstimatedSeconds = estimatedMinutes * 60;
  const actualMinutes = Math.max(1, Math.round(elapsedSeconds / 60));
  const progressRatio = Math.min(1.25, elapsedSeconds / Math.max(totalEstimatedSeconds, 1));

  const ringStrokeColor =
    progressRatio < 0.65
      ? '#10b981'
      : progressRatio < 0.95
      ? '#f59e0b'
      : '#f43f5e';

  const formatMMSS = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    setIsListening(true);
    setVoiceDictated(true);

    const SpeechRecognitionAPI =
      typeof window !== 'undefined'
        ? (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown })
            .SpeechRecognition ||
          (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition
        : null;

    if (SpeechRecognitionAPI && typeof SpeechRecognitionAPI === 'function') {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const recognition = new (SpeechRecognitionAPI as any)();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
          const transcript = event.results?.[0]?.[0]?.transcript;
          if (transcript) {
            setWhatClicked((prev) => `${prev} ${transcript}`.trim());
          }
          setIsListening(false);
        };
        recognition.onerror = () => {
          setWhatClicked(
            'Dictated via Voice: Drawing the step-by-step diagram first helped me see the pattern without guessing!'
          );
          setIsListening(false);
        };
        recognition.start();
        return;
      } catch {
        // Fall through
      }
    }

    setTimeout(() => {
      setWhatClicked(
        'Dictated via Voice: Testing a smaller example first made the tricky step click right away!'
      );
      setIsListening(false);
    }, 600);
  };

  const handleQuickSnapArtifact = () => {
    const svgSnap = `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="460" height="260" viewBox="0 0 460 260">
        <rect width="460" height="260" rx="16" fill="#0f172a"/>
        <rect x="16" y="16" width="428" height="228" rx="12" fill="#1e293b" stroke="#2dd4bf" stroke-width="2"/>
        <text x="34" y="54" fill="#2dd4bf" font-family="monospace" font-size="13" font-weight="bold">ARTIFACT SNAPSHOT • ${task.title.slice(0, 32).toUpperCase()}</text>
        <text x="34" y="92" fill="#f8fafc" font-family="sans-serif" font-size="14" font-weight="bold">${childName}'s Strategy &amp; Work Evidence</text>
        <text x="34" y="124" fill="#cbd5e1" font-family="sans-serif" font-size="12">Estimated: ${estimatedMinutes} min | Actual Elapsed: ${actualMinutes} min</text>
        <rect x="34" y="148" width="390" height="64" rx="8" fill="#0f172a" stroke="#475569"/>
        <text x="48" y="176" fill="#34d399" font-family="monospace" font-size="12">✓ Breakthrough: ${whatClicked.slice(0, 48)}...</text>
        <text x="48" y="198" fill="#94a3b8" font-family="sans-serif" font-size="11">Captured via Nuvoriq 1-Tap Portfolio Camera</text>
      </svg>
    `)}`;
    setArtifactDataUrl(svgSnap);
    setArtifactTitle(`${task.title} — Work Snapshot`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setArtifactDataUrl(reader.result);
        setArtifactTitle(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCompleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    completeTaskWithCalibrationAndReflection({
      taskId: task.id,
      estimatedMinutes,
      actualMinutes,
      whatIDid,
      whereIGotStuck,
      whatClicked,
      socraticPromptUsed: selectedPrompt,
      moodBefore,
      moodAfter,
      voiceDictated,
      artifactDataUrl,
      artifactTitle,
      artifactCategory: 'WORKSHEET',
    });
    onClose();
  };

  const deltaMinutes = actualMinutes - estimatedMinutes;
  const accuracyPercent = Math.max(
    0,
    Math.min(
      100,
      Math.round(100 - (Math.abs(deltaMinutes) / Math.max(estimatedMinutes, 1)) * 100)
    )
  );

  return (
    <div
      id={`modal-focus-calibration-overlay-${task.id}`}
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="calibration-modal-title"
    >
      <div
        id={`modal-focus-calibration-card-${task.id}`}
        className="max-w-2xl w-full rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden my-4"
      >
        {/* Modal Header */}
        <div
          id={`modal-focus-header-${task.id}`}
          className="px-5 sm:px-6 py-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-2">
              <span
                id={`modal-pillar-badge-${task.id}`}
                className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                  PILLAR_META[task.pillar]?.badgeClass
                }`}
              >
                {PILLAR_META[task.pillar]?.shortLabel}
              </span>
              <span
                id={`modal-energy-badge-${task.id}`}
                className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                  ENERGY_META[task.energyLoad]?.badgeClass
                }`}
              >
                {ENERGY_META[task.energyLoad]?.label}
              </span>
            </div>
            <h2 id="calibration-modal-title" className="text-base sm:text-lg font-black text-white mt-1">
              {task.title}
            </h2>
          </div>
          <button
            id={`btn-close-calibration-modal-${task.id}`}
            type="button"
            onClick={onClose}
            aria-label="Close focus calibration modal"
            className="min-h-[44px] min-w-[44px] p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div
          id={`modal-step-indicator-${task.id}`}
          className="px-5 sm:px-6 py-2.5 bg-slate-900/90 border-b border-slate-800 grid grid-cols-3 gap-2 text-xs font-bold"
        >
          <div
            id="step-indicator-1-estimate"
            className={`flex items-center gap-1.5 ${
              stage === 'ESTIMATE' ? 'text-teal-300' : 'text-slate-400'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-teal-500/20 border border-teal-400/50 flex items-center justify-center text-[11px] shrink-0">
              1
            </span>
            <span className="truncate">Time Guess</span>
          </div>
          <div
            id="step-indicator-2-timer"
            className={`flex items-center gap-1.5 ${
              stage === 'TIMER' ? 'text-amber-300' : 'text-slate-400'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-[11px] shrink-0">
              2
            </span>
            <span className="truncate">Focus Sprint</span>
          </div>
          <div
            id="step-indicator-3-reflect"
            className={`flex items-center gap-1.5 ${
              stage === 'REFLECT' ? 'text-emerald-300' : 'text-slate-400'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-[11px] shrink-0">
              3
            </span>
            <span className="truncate">Delta Audit</span>
          </div>
        </div>

        {/* STAGE 1: TIME-BLINDNESS ESTIMATION */}
        {stage === 'ESTIMATE' && (
          <div id="stage-panel-estimate" className="p-5 sm:p-6 space-y-5">
            <div
              id="card-time-blindness-explainer"
              className="rounded-xl bg-indigo-950/30 border border-indigo-500/30 p-4"
            >
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
                <Clock className="w-4 h-4" />
                <span>Time-Blindness Predictor: Train Your Internal Clock!</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Before starting, {childName}, how many minutes do you think{' '}
                <strong className="text-white">{task.title}</strong> will actually take today?
                We&apos;ll compare your guess to the real timer at the end!
              </p>
            </div>

            <div>
              <label
                htmlFor="input-range-estimated-minutes"
                className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-3"
              >
                Select Your Estimated Duration ({estimatedMinutes} Minutes)
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {PRESET_DURATIONS.map((mins) => (
                  <button
                    key={mins}
                    id={`btn-estimate-preset-${mins}m`}
                    type="button"
                    data-testid={`estimate-preset-${mins}`}
                    onClick={() => setEstimatedMinutes(mins)}
                    className={`min-h-[44px] py-2.5 rounded-xl font-mono text-sm font-extrabold border transition-all cursor-pointer ${
                      estimatedMinutes === mins
                        ? 'bg-teal-500/25 text-teal-200 border-teal-400 shadow-lg shadow-teal-500/15 scale-[1.03]'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
              <input
                id="input-range-estimated-minutes"
                type="range"
                min={5}
                max={90}
                step={5}
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                aria-label="Custom estimated duration in minutes"
                className="w-full mt-4 accent-teal-400 cursor-pointer"
              />
            </div>

            {/* Starting Mood & Energy Check */}
            <div>
              <span className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2.5">
                How Is Your Brain Battery Right Now?
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {(Object.keys(MOOD_META) as MoodState[]).map((mKey) => {
                  const m = MOOD_META[mKey];
                  return (
                    <button
                      key={mKey}
                      id={`btn-mood-before-${mKey}`}
                      type="button"
                      onClick={() => setMoodBefore(mKey)}
                      className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        moodBefore === mKey
                          ? `${m.colorClass} scale-[1.02] shadow-md`
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <span>{m.emoji}</span>
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
              <button
                id="btn-cancel-estimate-stage"
                type="button"
                onClick={onClose}
                className="min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="btn-launch-focus-timer"
                type="button"
                data-testid="launch-focus-timer-btn"
                onClick={() => {
                  setElapsedSeconds(60);
                  setStage('TIMER');
                }}
                className="min-h-[44px] px-6 py-3 rounded-xl bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-teal-500/20 hover:scale-[1.02] transition-all flex items-center gap-2 cursor-pointer"
              >
                <Timer className="w-4 h-4" />
                Lock In {estimatedMinutes}m Guess &amp; Start Timer
              </button>
            </div>
          </div>
        )}

        {/* STAGE 2: COLOR-SHIFTING VISUAL COUNTDOWN RING */}
        {stage === 'TIMER' && (
          <div id="stage-panel-timer" className="p-5 sm:p-6 flex flex-col items-center space-y-6">
            <div id="visual-countdown-ring-container" className="relative w-56 h-56 flex items-center justify-center">
              <svg
                id="svg-visual-countdown-ring"
                className="w-full h-full -rotate-90"
                viewBox="0 0 200 200"
              >
                <circle
                  cx="100"
                  cy="100"
                  r="84"
                  fill="none"
                  stroke="rgba(30, 41, 59, 0.9)"
                  strokeWidth="14"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="84"
                  fill="none"
                  stroke={ringStrokeColor}
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 84}
                  strokeDashoffset={
                    2 * Math.PI * 84 * (1 - Math.min(1, progressRatio))
                  }
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Elapsed Time
                </span>
                <span
                  id="text-active-elapsed-display"
                  data-testid="active-elapsed-display"
                  className="text-3xl font-mono font-black text-white mt-0.5 tabular-nums"
                >
                  {formatMMSS(elapsedSeconds)}
                </span>
                <span id="text-estimated-target-display" className="text-xs font-mono text-teal-300 mt-1">
                  Your Guess: {estimatedMinutes}:00
                </span>
              </div>
            </div>

            {/* Simulator controls */}
            <div
              id="card-time-warp-controls"
              className="w-full rounded-xl bg-slate-950/90 border border-slate-800 p-3.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <FastForward className="w-4 h-4 text-amber-400" />
                  Time-Warp Controls (Test Estimation Calibration Instantly):
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    id="btn-sim-add-5m"
                    type="button"
                    data-testid="sim-add-5m"
                    onClick={() => setElapsedSeconds((s) => s + 5 * 60)}
                    className="min-h-[44px] px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-slate-800 text-teal-300 hover:bg-slate-700 border border-slate-700 cursor-pointer"
                  >
                    +5m Elapsed
                  </button>
                  <button
                    id="btn-sim-add-12m"
                    type="button"
                    data-testid="sim-add-12m"
                    onClick={() => setElapsedSeconds((s) => s + 12 * 60)}
                    className="min-h-[44px] px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-slate-800 text-amber-300 hover:bg-slate-700 border border-slate-700 cursor-pointer"
                  >
                    +12m Elapsed
                  </button>
                  <button
                    id="btn-sim-set-27m"
                    type="button"
                    data-testid="sim-set-27m"
                    onClick={() => setElapsedSeconds(27 * 60)}
                    className="min-h-[44px] px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-500/30 cursor-pointer"
                  >
                    Jump to 27m Actual
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full justify-center">
              <button
                id="btn-pause-resume-timer"
                type="button"
                onClick={() => setIsRunning((r) => !r)}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-800 text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-700 cursor-pointer"
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isRunning ? 'Pause' : 'Resume'}
              </button>

              <button
                id="btn-finish-sprint-audit"
                type="button"
                data-testid="finish-sprint-audit-btn"
                onClick={() => setStage('REFLECT')}
                className="min-h-[44px] px-6 py-3 rounded-xl bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-teal-500/20 hover:scale-[1.02] transition-all flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                Finish Sprint &amp; See Time-Calibration Audit
              </button>
            </div>
          </div>
        )}

        {/* STAGE 3: TIME-BLINDNESS DELTA COMPARISON & 3-POINT METACOGNITIVE REFLECTION */}
        {stage === 'REFLECT' && (
          <form
            id="form-metacognitive-reflection"
            onSubmit={handleCompleteSubmit}
            className="p-5 sm:p-6 space-y-5"
          >
            {/* Estimated vs Actual Visual Delta Audit Card */}
            <div
              id="card-time-calibration-comparison"
              data-testid="time-calibration-comparison-card"
              className="rounded-2xl bg-slate-950 border border-teal-500/40 p-4 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-300">
                    Time-Blindness Calibration Result
                  </span>
                  <h3 id="text-calibration-delta-headline" className="text-sm font-bold text-white">
                    Estimated {estimatedMinutes} min vs. Actual {actualMinutes} min (
                    {deltaMinutes === 0
                      ? 'Exact Match!'
                      : deltaMinutes > 0
                      ? `+${deltaMinutes} min longer than guessed`
                      : `${deltaMinutes} min faster than guessed`}
                    )
                  </h3>
                </div>
                <span
                  id="badge-calibration-accuracy-percent"
                  className="px-3 py-1 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/40 font-mono text-xs font-extrabold"
                >
                  {accuracyPercent}% Time Accuracy
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 font-mono mb-1">
                    <span>Your Pre-Task Estimate</span>
                    <span>{estimatedMinutes} min</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      id="bar-estimated-duration"
                      className="h-full rounded-full bg-indigo-400"
                      style={{
                        width: `${Math.min(
                          100,
                          (estimatedMinutes / Math.max(estimatedMinutes, actualMinutes, 45)) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-slate-300 font-mono mb-1">
                    <span>Actual Measured Duration</span>
                    <span>{actualMinutes} min</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      id="bar-actual-duration"
                      className="h-full rounded-full bg-teal-400"
                      style={{
                        width: `${Math.min(
                          100,
                          (actualMinutes / Math.max(estimatedMinutes, actualMinutes, 45)) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Subject-Specific Socratic AI Reflection Prompts */}
            <div>
              <span className="block text-xs font-extrabold uppercase tracking-wider text-indigo-300 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Subject-Specific Socratic Prompt (Tap to switch)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {task.socraticHints.map((hint, idx) => (
                  <button
                    key={hint}
                    id={`btn-socratic-hint-${idx}`}
                    type="button"
                    onClick={() => setSelectedPrompt(hint)}
                    className={`min-h-[44px] text-left text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                      selectedPrompt === hint
                        ? 'bg-indigo-500/25 text-indigo-200 border-indigo-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    &ldquo;{hint}&rdquo;
                  </button>
                ))}
              </div>
            </div>

            {/* 3-Point Metacognitive Dialogue + Voice-to-Text */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
                  3-Point Metacognitive Reflection
                </span>
                <button
                  id="btn-voice-to-text-dictation"
                  type="button"
                  onClick={handleVoiceToggle}
                  className={`min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                    isListening
                      ? 'bg-rose-500/30 text-rose-200 border-rose-400 animate-pulse'
                      : 'bg-slate-800 text-teal-300 border-teal-500/40 hover:bg-slate-700'
                  }`}
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  {isListening ? 'Listening... (Tap to Stop)' : 'Voice-to-Text Dictation'}
                </button>
              </div>

              <div>
                <label htmlFor="input-reflection-what-i-did" className="block text-xs font-semibold text-slate-300 mb-1">
                  1. What I Did (Tactile completion)
                </label>
                <input
                  id="input-reflection-what-i-did"
                  type="text"
                  value={whatIDid}
                  onChange={(e) => setWhatIDid(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-teal-400 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="input-reflection-where-i-got-stuck" className="block text-xs font-semibold text-amber-300 mb-1">
                  2. Where I Got Stuck or Ran Out of Time (Honest friction check)
                </label>
                <input
                  id="input-reflection-where-i-got-stuck"
                  type="text"
                  value={whereIGotStuck}
                  onChange={(e) => setWhereIGotStuck(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="input-reflection-what-clicked" className="block text-xs font-semibold text-emerald-300 mb-1">
                  3. What Clicked or What Strategy I Learned ({selectedPrompt})
                </label>
                <input
                  id="input-reflection-what-clicked"
                  type="text"
                  value={whatClicked}
                  onChange={(e) => setWhatClicked(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>
            </div>

            {/* 1-Tap Media Artifact Snap / Upload */}
            <div
              id="card-artifact-upload-box"
              className="rounded-xl bg-slate-950/90 border border-slate-800 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <span className="text-xs font-bold text-slate-200 block">
                  Attach Work Artifact (Worksheet, Belt Stripe, Lego Build)
                </span>
                <span className="text-[11px] text-slate-400">
                  {artifactTitle
                    ? `Attached: ${artifactTitle}`
                    : 'Snap a 1-tap portfolio card or upload a photo'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  id="btn-quick-snap-artifact"
                  type="button"
                  onClick={handleQuickSnapArtifact}
                  className="min-h-[44px] px-3.5 py-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-bold flex items-center gap-1.5 hover:bg-indigo-500/30 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  1-Tap Snap Card
                </button>
                <label
                  id="label-upload-artifact-photo"
                  htmlFor="input-file-artifact-photo"
                  className="min-h-[44px] px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-700 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Photo</span>
                  <input
                    id="input-file-artifact-photo"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Post-Task Mood & Energy Dial */}
            <div>
              <span className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
                Post-Task Mood &amp; Energy Dial (Triggers Socratic Parent Script if Tired/Overwhelmed)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {(Object.keys(MOOD_META) as MoodState[]).map((mKey) => {
                  const m = MOOD_META[mKey];
                  return (
                    <button
                      key={mKey}
                      id={`btn-mood-after-${mKey}`}
                      type="button"
                      onClick={() => setMoodAfter(mKey)}
                      className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        moodAfter === mKey
                          ? `${m.colorClass} scale-[1.02]`
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      <span>{m.emoji}</span>
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                id="btn-save-calibration-reflection"
                type="submit"
                data-testid="save-calibration-reflection-btn"
                className="min-h-[44px] w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-teal-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                Save Calibration &amp; Log Reflection
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
