'use client';

import React, { useState } from 'react';
import {
  BrainCircuit,
  Lock,
  Menu,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Unlock,
  Users,
} from 'lucide-react';
import { useFamilyStore } from '@/context/FamilyStoreContext';
import { MOOD_META, THEME_CATALOG } from '@/lib/seedData';
import { ThemeId } from '@/types/domain';

export function TopCommandHeader() {
  const {
    state,
    isParentView,
    setActiveProfile,
    toggleChildPinRequirement,
    resetDemoData,
    activeTheme,
    setActiveTheme,
    isSidebarCollapsed,
    toggleSidebarCollapsed,
    setMobileSidebarOpen,
  } = useFamilyStore();

  const [pendingChildId, setPendingChildId] = useState<string | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const handleProfileClick = (profileId: string) => {
    if (profileId === 'PARENT_COMMAND_CENTER') {
      setActiveProfile(profileId);
      return;
    }
    const child = state.children.find((c) => c.id === profileId);
    if (child?.pinRequired && state.activeProfileId !== profileId) {
      setPendingChildId(profileId);
      setPinInput('');
      setPinError(false);
    } else {
      setActiveProfile(profileId);
    }
  };

  const verifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    const target = state.children.find((c) => c.id === pendingChildId);
    if (target && (pinInput === (target.pinCode || '1234') || pinInput === '1234')) {
      setActiveProfile(target.id);
      setPendingChildId(null);
      setPinInput('');
    } else {
      setPinError(true);
    }
  };

  const unpaintedScriptsCount = state.coachingSuggestions.filter(
    (c) => !c.dispatched
  ).length;

  return (
    <>
      <header
        id="header-top-command-bar"
        className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl"
      >
        <div
          id="header-inner-container"
          className="max-w-[1920px] mx-auto px-4 sm:px-6 py-2.5 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-2.5"
        >
          {/* Brand Logo & Sidebar Toggle Row */}
          <div id="header-brand-row" className="flex items-center justify-between gap-2 min-w-0">
            <div id="header-brand-identity" className="flex items-center gap-2.5 min-w-0">
              {/* Mobile Left Drawer Trigger */}
              <button
                id="btn-mobile-sidebar-open"
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                aria-label="Open navigation and theme menu"
                className="md:hidden min-h-[44px] min-w-[44px] rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-teal-400 cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Desktop Left Sidebar Collapse/Expand Trigger */}
              <button
                id="btn-header-sidebar-toggle"
                type="button"
                onClick={toggleSidebarCollapsed}
                aria-label={
                  isSidebarCollapsed
                    ? 'Expand left navigation sidebar'
                    : 'Collapse left navigation sidebar'
                }
                title={
                  isSidebarCollapsed
                    ? 'Expand Left Menu'
                    : 'Collapse Left Menu'
                }
                className="hidden md:flex min-h-[40px] min-w-[40px] rounded-xl bg-slate-900 border border-slate-800 hover:border-teal-500/40 items-center justify-center text-teal-400 cursor-pointer shrink-0"
              >
                {isSidebarCollapsed ? (
                  <PanelLeftOpen className="w-4 h-4" />
                ) : (
                  <PanelLeftClose className="w-4 h-4" />
                )}
              </button>

              <div
                id="brand-logo-badge"
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 via-emerald-500 to-indigo-600 flex items-center justify-center shadow-md shadow-teal-500/20 shrink-0"
              >
                <BrainCircuit className="w-5 h-5 text-slate-950" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    id="brand-title-text"
                    className="text-base font-black tracking-tight text-white"
                  >
                    Nuvoriq
                  </span>
                  <span
                    id="brand-k12-pill"
                    className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/40 shrink-0"
                  >
                    K–12 Executive Hub
                  </span>
                </div>
                <p id="brand-subtitle-text" className="text-[11px] text-slate-400 truncate">
                  {state.familyName} • Time-Calibration &amp; Socratic Coaching
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 xl:hidden">
              <button
                id="btn-reset-demo-mobile"
                type="button"
                onClick={resetDemoData}
                title="Reset pre-seeded family data"
                className="min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Single-Row Desktop Switcher Bar (Zero Multi-Line Wrap) */}
          <nav
            id="nav-family-profile-switcher"
            aria-label="Family Profile Switcher"
            className="hidden md:flex flex-wrap xl:flex-nowrap items-center gap-2 shrink-0"
          >
            {state.children.map((child) => {
              const isSelected = state.activeProfileId === child.id;
              const moodInfo = MOOD_META[child.currentMood];
              return (
                <div
                  key={child.id}
                  id={`profile-switcher-group-${child.id}`}
                  className="flex items-center gap-1"
                >
                  <button
                    id={`tab-profile-switch-${child.id}`}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    data-testid={`profile-switch-${child.id}`}
                    onClick={() => handleProfileClick(child.id)}
                    className={`min-h-[42px] px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                      isSelected
                        ? 'bg-teal-500/20 text-white border-teal-400 shadow-sm'
                        : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <span className="text-base leading-none">{child.avatarEmoji}</span>
                    <div className="text-left">
                      <div className="flex items-center gap-1.5">
                        <span>{child.name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                          {child.gradeLabel}
                        </span>
                        {child.pinRequired && (
                          <Lock
                            className="w-3 h-3 text-amber-400"
                            aria-label="PIN Lock Enabled"
                          />
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-normal flex items-center gap-1">
                        <span>
                          {moodInfo.emoji} {moodInfo.label}
                        </span>
                        <span>•</span>
                        <span className="text-teal-300 font-mono">
                          {child.streakDays}d streak
                        </span>
                      </div>
                    </div>
                  </button>

                  {child.age >= 8 && (
                    <button
                      id={`btn-pin-toggle-${child.id}`}
                      type="button"
                      onClick={() => toggleChildPinRequirement(child.id)}
                      aria-label={
                        child.pinRequired
                          ? `Disable 4-digit sibling privacy PIN for ${child.name}`
                          : `Enable 4-digit sibling privacy PIN for ${child.name}`
                      }
                      title={
                        child.pinRequired
                          ? `Disable 4-digit sibling privacy PIN for ${child.name}`
                          : `Enable 4-digit sibling privacy PIN (1234) for ${child.name}`
                      }
                      className="min-h-[42px] min-w-[38px] p-2 rounded-xl bg-slate-900/70 border border-slate-800 text-slate-400 hover:text-amber-300 hover:border-amber-500/40 transition-colors flex items-center justify-center cursor-pointer"
                    >
                      {child.pinRequired ? (
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                      ) : (
                        <Unlock className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              );
            })}

            <button
              id="tab-profile-switch-parent"
              type="button"
              role="tab"
              aria-selected={isParentView}
              data-testid="profile-switch-parent"
              onClick={() => handleProfileClick('PARENT_COMMAND_CENTER')}
              className={`min-h-[42px] px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer border ${
                isParentView
                  ? 'bg-gradient-to-r from-amber-400 via-teal-400 to-emerald-400 text-slate-950 border-teal-300 shadow-md'
                  : 'bg-slate-900 text-teal-300 border-teal-500/40 hover:bg-slate-800/90'
              }`}
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Parent Hub</span>
              {unpaintedScriptsCount > 0 && (
                <span
                  id="badge-parent-scripts-count"
                  className="px-1.5 py-0.5 text-[10px] rounded-full bg-slate-950 text-amber-300 font-mono"
                >
                  {unpaintedScriptsCount} Scripts
                </span>
              )}
            </button>

            {/* Quick Theme Dropdown Pill */}
            <div
              id="header-theme-selector-pill"
              className="flex items-center gap-1.5 px-2.5 py-1.5 min-h-[42px] rounded-xl bg-slate-900/80 border border-slate-800"
            >
              <Palette className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <select
                id="select-header-theme-switcher"
                value={activeTheme}
                onChange={(e) => setActiveTheme(e.target.value as ThemeId)}
                aria-label="Select Nuvoriq Visual Theme"
                className="bg-transparent text-xs font-bold text-slate-200 focus:outline-none cursor-pointer"
              >
                {THEME_CATALOG.map((t) => (
                  <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                    {t.name} ({t.mode === 'light' ? 'Light' : 'Dark'})
                  </option>
                ))}
              </select>
            </div>

            <button
              id="btn-reset-demo-desktop"
              type="button"
              onClick={resetDemoData}
              title="Reset pre-seeded demo data"
              className="hidden xl:flex min-h-[42px] px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 bg-slate-900/70 border border-slate-800 hover:text-slate-200 hover:border-slate-700 items-center gap-1.5 cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Seed</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile iOS & Android Thumb-Zone Bottom Navigation Bar */}
      <nav
        id="nav-mobile-bottom-dock"
        aria-label="Mobile Bottom Quick Switcher"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 px-3 pt-2 bottom-nav-safe grid grid-cols-4 gap-1.5"
      >
        {state.children.map((child) => {
          const isSelected = state.activeProfileId === child.id;
          return (
            <button
              key={child.id}
              id={`btn-mobile-dock-${child.id}`}
              type="button"
              onClick={() => handleProfileClick(child.id)}
              className={`min-h-[46px] rounded-xl px-1.5 py-1.5 text-xs font-bold flex flex-col items-center justify-center border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-teal-500/25 text-teal-200 border-teal-400'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800'
              }`}
            >
              <span className="text-sm leading-none">{child.avatarEmoji}</span>
              <span className="text-[10px] mt-0.5 truncate">
                {child.name} ({child.gradeLabel.replace('Grade ', 'G')})
              </span>
            </button>
          );
        })}
        <button
          id="btn-mobile-dock-parent"
          type="button"
          onClick={() => handleProfileClick('PARENT_COMMAND_CENTER')}
          className={`min-h-[46px] rounded-xl px-1.5 py-1.5 text-xs font-extrabold flex flex-col items-center justify-center border transition-all cursor-pointer ${
            isParentView
              ? 'bg-gradient-to-r from-amber-400 to-teal-400 text-slate-950 border-teal-300'
              : 'bg-slate-900/80 text-teal-300 border-teal-500/40'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[10px] mt-0.5 truncate">Parent Hub</span>
        </button>
        <button
          id="btn-mobile-dock-themes"
          type="button"
          onClick={() => setMobileSidebarOpen(true)}
          className="min-h-[46px] rounded-xl px-1.5 py-1.5 text-xs font-bold flex flex-col items-center justify-center border bg-slate-900/80 text-slate-300 border-slate-800 cursor-pointer"
        >
          <Palette className="w-4 h-4 text-teal-400" />
          <span className="text-[10px] mt-0.5 truncate">Themes</span>
        </button>
      </nav>

      {/* Sibling Privacy 4-Digit PIN Modal */}
      {pendingChildId && (
        <div
          id="modal-sibling-pin-overlay"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            id="modal-sibling-pin-card"
            className="max-w-sm w-full rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl"
          >
            <div className="flex items-center gap-2.5 text-amber-300 mb-2">
              <Users className="w-5 h-5" />
              <h3 id="modal-sibling-pin-title" className="text-base font-bold text-white">
                Sibling Privacy PIN Required
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Older siblings can protect their personal metacognitive reflections with a 4-digit PIN (Demo PIN:{' '}
              <code className="text-teal-300 font-mono">1234</code>).
            </p>
            <form id="form-sibling-pin" onSubmit={verifyPin} className="space-y-3">
              <input
                id="input-sibling-pin-code"
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="Enter 4-digit PIN (1234)"
                aria-label="Enter 4-digit sibling privacy PIN"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-center text-lg font-mono tracking-widest text-white focus:outline-none focus:border-teal-400"
              />
              {pinError && (
                <p id="text-sibling-pin-error" className="text-xs text-rose-400 font-semibold">
                  Incorrect PIN. Try 1234.
                </p>
              )}
              <div className="flex items-center gap-2">
                <button
                  id="btn-sibling-pin-quick-unlock"
                  type="button"
                  onClick={() => {
                    setActiveProfile(pendingChildId);
                    setPendingChildId(null);
                  }}
                  className="min-h-[44px] flex-1 py-2 rounded-xl text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40 hover:bg-teal-500/30 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Quick Unlock (1234)
                </button>
                <button
                  id="btn-sibling-pin-submit"
                  type="submit"
                  className="min-h-[44px] flex-1 py-2 rounded-xl text-xs font-bold bg-teal-400 text-slate-950 hover:bg-teal-300 cursor-pointer"
                >
                  Unlock Profile
                </button>
                <button
                  id="btn-sibling-pin-cancel"
                  type="button"
                  onClick={() => setPendingChildId(null)}
                  className="min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
