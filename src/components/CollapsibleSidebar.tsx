'use client';

import React from 'react';
import {
  Activity,
  Award,
  BookOpen,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Compass,
  Filter,
  HeartHandshake,
  Layers,
  Lock,
  MessageSquareHeart,
  Palette,
  Scale,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  Timer,
  X,
} from 'lucide-react';
import { useFamilyStore } from '@/context/FamilyStoreContext';
import { PILLAR_META, THEME_CATALOG } from '@/lib/seedData';
import { LifePillar, ThemeId } from '@/types/domain';

export function CollapsibleSidebar() {
  const {
    state,
    activeChild,
    isParentView,
    isKidIsolatedSession,
    visibleChildren,
    setActiveProfile,
    activeTheme,
    setActiveTheme,
    isSidebarCollapsed,
    toggleSidebarCollapsed,
    isMobileSidebarOpen,
    setMobileSidebarOpen,
    activePillarFilter,
    setActivePillarFilter,
  } = useFamilyStore();

  const targetChildId = activeChild?.id || state.children[0]?.id || 'child-1';

  const childNavItems = [
    {
      id: 'trackers',
      label: 'Trackers & Assignments',
      targetDomId: `section-child-trackers-${targetChildId}`,
      icon: Target,
    },
    {
      id: 'timeline',
      label: 'Energy Timeline',
      targetDomId: `section-daily-schedule-${targetChildId}`,
      icon: Calendar,
    },
    {
      id: 'time-audit',
      label: 'Time-Blindness Audit',
      targetDomId: `section-time-estimation-history-${targetChildId}`,
      icon: Timer,
    },
    {
      id: 'shields',
      label: 'Streak Shields & Badges',
      targetDomId: `section-resilience-shields-${targetChildId}`,
      icon: Award,
    },
    {
      id: 'radar',
      label: '5-Pillar Ipsative Radar',
      targetDomId: `section-ipsative-radar-${targetChildId}`,
      icon: Activity,
    },
    {
      id: 'portfolio',
      label: 'Evidence & Reflections',
      targetDomId: `section-metacognitive-journal-${targetChildId}`,
      icon: BookOpen,
    },
  ];

  const parentNavItems = [
    {
      id: 'roster',
      label: 'Kids, Trackers & Assignments',
      targetDomId: 'section-parent-kid-tracker-manager',
      icon: Target,
    },
    {
      id: 'summit',
      label: 'Sunday Family Summit',
      targetDomId: 'section-sunday-family-summit',
      icon: Sparkles,
    },
    {
      id: 'socratic',
      label: 'Socratic Praise Scripts',
      targetDomId: 'section-socratic-coaching-engine',
      icon: MessageSquareHeart,
    },
    {
      id: 'kudos',
      label: 'Effort Kudos Dispatcher',
      targetDomId: 'section-kudos-dispatcher',
      icon: HeartHandshake,
    },
    {
      id: 'equity',
      label: 'Ipsative & Equity Audit',
      targetDomId: 'section-parent-ipsative-analytics',
      icon: Scale,
    },
    {
      id: 'integrations',
      label: 'School & iCal Bridges',
      targetDomId: 'section-external-integrations',
      icon: Compass,
    },
  ];

  const activeNavItems = isParentView ? parentNavItems : childNavItems;

  const handleJumpToSection = (domId: string) => {
    const el = document.getElementById(domId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileSidebarOpen(false);
  };

  const pillarOptions: Array<{ key: LifePillar | 'ALL'; label: string; dotColor: string }> = [
    { key: 'ALL', label: 'All Pillars', dotColor: '#2dd4bf' },
    ...Object.entries(PILLAR_META).map(([k, v]) => ({
      key: k as LifePillar,
      label: v.shortLabel,
      dotColor: v.accentHex,
    })),
  ];

  return (
    <>
      {/* DESKTOP / TABLET COLLAPSIBLE LEFT SIDEBAR */}
      <aside
        id="aside-collapsible-sidebar"
        aria-label="Collapsible Left Navigation and Theme Studio"
        data-collapsed={isSidebarCollapsed ? 'true' : 'false'}
        className={`hidden md:flex flex-col shrink-0 border-r border-slate-800/90 bg-slate-950/95 backdrop-blur-xl transition-all duration-300 ease-in-out select-none ${
          isSidebarCollapsed ? 'w-20' : 'w-[296px]'
        }`}
      >
        <div
          id="sidebar-sticky-inner"
          className="sticky top-[65px] p-3 space-y-4"
        >
          <div id="sidebar-top-sections" className="space-y-4">
            {/* Collapse / Expand Toggle Bar */}
            <div
              id="sidebar-collapse-header"
              className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800/80"
            >
              {!isSidebarCollapsed && (
                <div id="sidebar-collapse-title-group" className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-teal-400 shrink-0" />
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300">
                    Navigation &amp; Themes
                  </span>
                </div>
              )}
              <button
                id="btn-sidebar-collapse-toggle"
                type="button"
                onClick={toggleSidebarCollapsed}
                aria-expanded={!isSidebarCollapsed}
                aria-label={
                  isSidebarCollapsed
                    ? 'Expand left navigation menu'
                    : 'Collapse left navigation menu'
                }
                title={
                  isSidebarCollapsed
                    ? 'Expand Left Menu'
                    : 'Collapse Left Menu'
                }
                className={`min-h-[38px] rounded-xl bg-slate-900 border border-slate-800 hover:border-teal-500/50 text-slate-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isSidebarCollapsed ? 'w-full px-2' : 'px-2.5 py-1.5 ml-auto'
                }`}
              >
                {isSidebarCollapsed ? (
                  <ChevronRight className="w-4 h-4 text-teal-400" />
                ) : (
                  <>
                    <ChevronLeft className="w-4 h-4 text-teal-400" />
                    <span className="text-[11px] font-bold">Collapse</span>
                  </>
                )}
              </button>
            </div>

            {/* 1. Multi-Theme Studio Switcher (6 Themes — Zero Text Truncation) */}
            <section
              id="section-sidebar-theme-studio"
              aria-label="Multi-Theme Studio Selector"
              className="space-y-2"
            >
              <div
                className={`flex items-center ${
                  isSidebarCollapsed ? 'justify-center' : 'justify-between px-1'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-teal-400 shrink-0" />
                  {!isSidebarCollapsed && (
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-300">
                      Theme Studio (6 Themes)
                    </span>
                  )}
                </div>
                {!isSidebarCollapsed && (
                  <span className="text-[10px] font-mono font-bold text-teal-300">
                    {THEME_CATALOG.find((t) => t.id === activeTheme)?.mode.toUpperCase()}
                  </span>
                )}
              </div>

              <div
                id="grid-sidebar-theme-buttons"
                className={
                  isSidebarCollapsed
                    ? 'flex flex-col items-center gap-1.5'
                    : 'grid grid-cols-2 gap-1.5'
                }
              >
                {THEME_CATALOG.map((theme) => {
                  const isSelected = activeTheme === theme.id;
                  const slug = theme.id.toLowerCase().replace(/_/g, '-');
                  return (
                    <button
                      key={theme.id}
                      id={`btn-sidebar-theme-${slug}`}
                      type="button"
                      data-testid={`theme-option-${theme.id}`}
                      onClick={() => setActiveTheme(theme.id as ThemeId)}
                      title={`${theme.name} — ${theme.tagline}`}
                      className={`min-h-[42px] rounded-xl border transition-all cursor-pointer flex items-center ${
                        isSidebarCollapsed
                          ? 'w-11 h-10 justify-center p-0'
                          : 'px-2 py-1.5 gap-1.5 text-left'
                      } ${
                        isSelected
                          ? 'bg-teal-500/20 border-teal-400 text-white shadow-sm'
                          : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {/* Dual Swatch Pill */}
                      <span
                        className="w-4 h-4 rounded-md border border-slate-500/40 flex items-center justify-center shrink-0 overflow-hidden relative"
                        style={{ backgroundColor: theme.swatchColors[0] }}
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: theme.swatchColors[1] }}
                        />
                      </span>

                      {!isSidebarCollapsed && (
                        <div className="min-w-0 flex-1">
                          <div className="text-[10.5px] font-bold leading-tight flex items-center justify-between gap-0.5">
                            <span className=" whitespace-nowrap">{theme.name}</span>
                            {isSelected && (
                              <Check className="w-3 h-3 text-teal-300 shrink-0" />
                            )}
                          </div>
                          <div className="text-[9px] text-slate-400 leading-tight flex items-center gap-1 mt-0.5">
                            {theme.mode === 'light' && (
                              <Sun className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                            )}
                            <span className="whitespace-nowrap">{theme.badgeText}</span>
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 2. Workspace Switcher (Isolated when Kid SSO Active) */}
            <nav
              id="nav-sidebar-workspaces"
              aria-label="Sidebar Workspace Switcher"
              className="pt-2 border-t border-slate-800/80 space-y-1.5"
            >
              {!isSidebarCollapsed && (
                <div className="px-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>{isKidIsolatedSession ? 'Private Kid Workspace' : 'Family Workspaces'}</span>
                  {isKidIsolatedSession && <Lock className="w-3 h-3 text-indigo-400" />}
                </div>
              )}
              {visibleChildren.map((child) => {
                const isSelected = !isParentView && activeChild?.id === child.id;
                return (
                  <button
                    key={child.id}
                    id={`btn-sidebar-profile-${child.id}`}
                    type="button"
                    onClick={() => setActiveProfile(child.id)}
                    title={`${child.name} (${child.gradeLabel})`}
                    className={`w-full min-h-[40px] rounded-xl px-2.5 py-1.5 text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-teal-500/20 text-white border-teal-400 shadow-sm'
                        : 'bg-slate-900/70 text-slate-300 border-slate-800/80 hover:border-slate-700'
                    } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
                  >
                    <span className="text-base shrink-0">{child.avatarEmoji}</span>
                    {!isSidebarCollapsed && (
                      <div className="text-left truncate">
                        <div className="truncate">
                          {child.name} • {child.gradeLabel}
                        </div>
                        <div className="text-[10px] font-normal text-teal-300 font-mono">
                          {child.streakDays}d Streak • {child.graceShieldsRemaining} Shields
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}

              {!isKidIsolatedSession && (
                <button
                  id="btn-sidebar-profile-parent"
                  type="button"
                  onClick={() => setActiveProfile('PARENT_COMMAND_CENTER')}
                  title="Parent Command Center"
                  className={`w-full min-h-[40px] rounded-xl px-2.5 py-1.5 text-xs font-extrabold flex items-center gap-2 border transition-all cursor-pointer ${
                    isParentView
                      ? 'bg-gradient-to-r from-amber-400/25 to-teal-400/25 text-white border-teal-400 shadow-sm'
                      : 'bg-slate-900/70 text-teal-300 border-slate-800/80 hover:border-teal-500/40'
                  } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
                >
                  <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
                  {!isSidebarCollapsed && (
                    <span className="truncate">Parent Command Hub</span>
                  )}
                </button>
              )}
            </nav>

            {/* 3. Quick Section Jump Links */}
            <nav
              id="nav-sidebar-quick-jump"
              aria-label="Quick Module Navigation"
              className="pt-2 border-t border-slate-800/80 space-y-1"
            >
              {!isSidebarCollapsed && (
                <div className="px-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Quick Jump Modules
                </div>
              )}
              {activeNavItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    id={`btn-sidebar-jump-${item.id}`}
                    type="button"
                    onClick={() => handleJumpToSection(item.targetDomId)}
                    title={item.label}
                    className={`w-full min-h-[38px] rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900/50 border border-slate-800/70 hover:border-teal-500/40 hover:text-white flex items-center gap-2 transition-all cursor-pointer ${
                      isSidebarCollapsed ? 'justify-center px-0' : ''
                    }`}
                  >
                    <IconComponent className="w-4 h-4 text-teal-400 shrink-0" />
                    {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </button>
                );
              })}
            </nav>

            {/* 4. 5 Life Pillars Filter (When in Child View) */}
            {!isParentView && (
              <nav
                id="nav-sidebar-pillar-filter"
                aria-label="5 Life Pillars Filter"
                className="pt-2 border-t border-slate-800/80 space-y-1.5"
              >
                {!isSidebarCollapsed && (
                  <div className="px-1 flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    <span>Filter by Life Pillar</span>
                    <Filter className="w-3 h-3 text-teal-400" />
                  </div>
                )}
                <div
                  id="grid-sidebar-pillar-buttons"
                  className={
                    isSidebarCollapsed
                      ? 'flex flex-col items-center gap-1'
                      : 'grid grid-cols-2 gap-1.5'
                  }
                >
                  {pillarOptions.map((pillar) => {
                    const isActive = activePillarFilter === pillar.key;
                    const slug = pillar.key.toLowerCase().replace(/_/g, '-');
                    return (
                      <button
                        key={pillar.key}
                        id={`btn-sidebar-pillar-${slug}`}
                        type="button"
                        onClick={() => setActivePillarFilter(pillar.key)}
                        title={`Filter: ${pillar.label}`}
                        className={`min-h-[36px] rounded-xl px-2 py-1 text-[11px] font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                          isActive
                            ? 'bg-teal-500/20 text-white border-teal-400'
                            : 'bg-slate-900/40 text-slate-300 border-slate-800/70 hover:border-slate-700'
                        } ${isSidebarCollapsed ? 'w-11 justify-center px-0' : ''}`}
                      >
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: pillar.dotColor }}
                        />
                        {!isSidebarCollapsed && (
                          <span className="truncate">{pillar.label}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </nav>
            )}
          </div>
        </div>
      </aside>

      {/* MOBILE SLIDE-OVER DRAWER FOR iOS & ANDROID */}
      {isMobileSidebarOpen && (
        <div
          id="modal-mobile-sidebar-backdrop"
          className="md:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex"
        >
          <aside
            id="aside-mobile-sidebar-drawer"
            aria-label="Mobile Navigation & Theme Drawer"
            className="w-80 max-w-[86vw] h-full bg-slate-950 border-r border-slate-800 p-4 overflow-y-auto flex flex-col justify-between space-y-5"
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-teal-400" />
                  <span className="text-sm font-black text-white">
                    Nuvoriq Menu &amp; Themes
                  </span>
                </div>
                <button
                  id="btn-mobile-sidebar-close"
                  type="button"
                  onClick={() => setMobileSidebarOpen(false)}
                  aria-label="Close mobile menu drawer"
                  className="min-h-[44px] min-w-[44px] rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Theme Studio */}
              <div id="mobile-drawer-theme-section" className="space-y-2">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-teal-300">
                  Select Visual Theme (6 Themes)
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {THEME_CATALOG.map((theme) => {
                    const isSelected = activeTheme === theme.id;
                    const slug = theme.id.toLowerCase().replace(/_/g, '-');
                    return (
                      <button
                        key={theme.id}
                        id={`btn-mobile-theme-${slug}`}
                        type="button"
                        onClick={() => setActiveTheme(theme.id as ThemeId)}
                        className={`min-h-[44px] rounded-xl p-2.5 border text-left flex items-center gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-teal-500/20 border-teal-400 text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-300'
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-lg border border-white/25 flex items-center justify-center shrink-0"
                          style={{ backgroundColor: theme.swatchColors[0] }}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: theme.swatchColors[1] }}
                          />
                        </span>
                        <span className="text-xs font-bold truncate">
                          {theme.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Quick Jump */}
              <div id="mobile-drawer-jump-section" className="space-y-1.5">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Jump to Section
                </div>
                {activeNavItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.id}
                      id={`btn-mobile-jump-${item.id}`}
                      type="button"
                      onClick={() => handleJumpToSection(item.targetDomId)}
                      className="w-full min-h-[44px] rounded-xl px-3 py-2 bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 flex items-center gap-2.5 cursor-pointer"
                    >
                      <IconComponent className="w-4 h-4 text-teal-400" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Mobile Pillar Filter */}
              {!isParentView && (
                <div id="mobile-drawer-pillar-section" className="space-y-1.5">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    Filter by Life Pillar
                  </div>
                  {pillarOptions.map((pillar) => {
                    const isActive = activePillarFilter === pillar.key;
                    const slug = pillar.key.toLowerCase().replace(/_/g, '-');
                    return (
                      <button
                        key={pillar.key}
                        id={`btn-mobile-pillar-${slug}`}
                        type="button"
                        onClick={() => {
                          setActivePillarFilter(pillar.key);
                          setMobileSidebarOpen(false);
                        }}
                        className={`w-full min-h-[44px] rounded-xl px-3 py-2 text-xs font-bold flex items-center gap-2.5 border cursor-pointer ${
                          isActive
                            ? 'bg-teal-500/20 border-teal-400 text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-300'
                        }`}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: pillar.dotColor }}
                        />
                        <span>{pillar.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
