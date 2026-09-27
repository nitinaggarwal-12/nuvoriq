'use client';

import React, { useState } from 'react';
import { Lock, LogOut, ShieldCheck, Sparkles, UserCheck, X } from 'lucide-react';
import { useFamilyStore } from '@/context/FamilyStoreContext';

export function GoogleMarkSvg({ id }: { id: string }) {
  return (
    <svg
      id={id}
      className="w-4 h-4 shrink-0"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.8-5.5 3.8-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.4 14.6 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12s4.3 9.6 9.6 9.6c5.5 0 9.2-3.9 9.2-9.4 0-.6-.1-1.1-.2-1.6H12z"
      />
      <path
        fill="#34A853"
        d="M3.5 7.4l3.2 2.3C7.5 7.6 9.6 6 12 6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.4 14.6 2.4 12 2.4 8.3 2.4 5.1 4.5 3.5 7.4z"
      />
      <path
        fill="#FBBC05"
        d="M12 21.6c2.5 0 4.7-.8 6.2-2.3l-2.9-2.4c-.8.6-1.9 1-3.3 1-2.5 0-4.7-1.7-5.5-4.1l-3.2 2.5c1.6 3.1 4.9 5.3 8.7 5.3z"
      />
      <path
        fill="#4285F4"
        d="M21.2 12.2c0-.6-.1-1.1-.2-1.6H12v3.9h5.5c-.3 1.3-1 2.3-2.2 3.1l2.9 2.4c1.7-1.6 3-4.1 3-7.8z"
      />
    </svg>
  );
}

export function GoogleSSOAuthModal() {
  const {
    state,
    authSession,
    isGoogleSSOModalOpen,
    setGoogleSSOModalOpen,
    signInWithGoogleSSO,
    signOutGoogleSSO,
  } = useFamilyStore();

  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [customRole, setCustomRole] = useState<'PARENT' | 'CHILD'>('CHILD');
  const [selectedChildId, setSelectedChildId] = useState<string>(
    state.children[0]?.id || 'child-1'
  );

  // If user explicitly signed out (`authSession === null`), keep modal open as an auth gate
  const shouldShowModal = isGoogleSSOModalOpen || authSession === null;
  if (!shouldShowModal) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = customEmail.trim().toLowerCase();
    if (!trimmedEmail) return;

    const matchedByEmail = state.children.find(
      (c) => (c.googleEmail || '').toLowerCase() === trimmedEmail
    );

    if (matchedByEmail) {
      signInWithGoogleSSO({
        email: trimmedEmail,
        displayName: `${matchedByEmail.name} (${matchedByEmail.gradeLabel})`,
        role: 'CHILD',
        linkedChildId: matchedByEmail.id,
        avatarEmoji: matchedByEmail.avatarEmoji,
      });
      return;
    }

    const targetChild = state.children.find((c) => c.id === selectedChildId);
    signInWithGoogleSSO({
      email: trimmedEmail,
      displayName:
        customName.trim() ||
        (customRole === 'PARENT'
          ? 'Parent Google User'
          : targetChild
          ? `${targetChild.name} (${targetChild.gradeLabel})`
          : 'Kid Google User'),
      role: customRole,
      linkedChildId: customRole === 'CHILD' ? selectedChildId : undefined,
      avatarEmoji: customRole === 'PARENT' ? '🛡️' : targetChild?.avatarEmoji || '🌟',
    });
  };

  return (
    <div
      id="modal-google-sso-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="heading-google-sso-modal"
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        id="card-google-sso-modal"
        className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-700/90 shadow-2xl p-6 space-y-5 my-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div
              id="badge-google-sso-icon"
              className="w-11 h-11 rounded-2xl bg-slate-950 border border-slate-700 flex items-center justify-center shadow-inner"
            >
              <GoogleMarkSvg id="svg-google-sso-modal-logo" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="heading-google-sso-modal"
                  className="text-lg font-black text-white"
                >
                  Google SSO Sign-In &amp; Kid Privacy Isolation
                </h2>
                <span
                  id="badge-oauth-verified"
                  className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40"
                >
                  OAuth 2.0 RBAC
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                When a <strong className="text-teal-300">Kid signs in via Google SSO</strong>, they
                strictly see <strong>only their own schedule, trackers, assignments &amp; radar</strong>.
                Sibling tabs and Parent Hub are locked and hidden.
              </p>
            </div>
          </div>

          {authSession && (
            <button
              id="btn-close-google-sso-modal"
              type="button"
              onClick={() => setGoogleSSOModalOpen(false)}
              aria-label="Close Google SSO modal"
              className="min-h-[40px] min-w-[40px] rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Active Session Status Bar */}
        {authSession && (
          <div
            id="banner-active-google-session"
            className="rounded-2xl bg-teal-950/30 border border-teal-500/40 p-3.5 flex flex-wrap items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl">{authSession.avatarEmoji || '🛡️'}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-white">
                    Signed in as {authSession.displayName}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/40">
                    {authSession.role === 'PARENT'
                      ? 'PARENT ADMIN (ALL KIDS + ASSIGNMENTS)'
                      : 'KID PRIVATE SESSION (ISOLATED)'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-mono">
                  {authSession.email}
                </p>
              </div>
            </div>

            <button
              id="btn-signout-google-sso"
              type="button"
              onClick={signOutGoogleSSO}
              className="min-h-[38px] px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-200 border border-rose-500/40 hover:bg-rose-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        )}

        {/* 1-Tap Google Account Picker (Parent + Each Registered Child) */}
        <div className="space-y-2.5">
          <div className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>1-Click Google SSO Account Switcher (Instant RBAC Test)</span>
          </div>

          <div id="grid-google-sso-quick-accounts" className="grid grid-cols-1 gap-2.5">
            {/* Parent Google SSO Account */}
            <button
              id="btn-google-sso-parent-account"
              type="button"
              onClick={() =>
                signInWithGoogleSSO({
                  email: state.principalParentEmail || 'nitin.aggarwal@gmail.com',
                  displayName: `${state.principalParentName} (Parent Admin)`,
                  role: 'PARENT',
                  avatarEmoji: '🛡️',
                })
              }
              className={`w-full text-left rounded-2xl p-3.5 border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                authSession?.role === 'PARENT'
                  ? 'bg-teal-500/15 border-teal-400 shadow-sm'
                  : 'bg-slate-950/90 border-slate-800 hover:border-teal-500/50'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                  <GoogleMarkSvg id="svg-google-parent-acct" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-black text-white">
                      {state.principalParentName}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Parent Admin • Add Kids, Trackers &amp; Assignments
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono truncate">
                    {state.principalParentEmail || 'nitin.aggarwal@gmail.com'} • Sees all {state.children.length} kids &amp; Parent Command Center
                  </p>
                </div>
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-teal-500 text-slate-950 text-xs font-black shrink-0">
                {authSession?.role === 'PARENT' ? 'Active ✓' : 'Sign in with Google'}
              </span>
            </button>

            {/* Each Kid's Isolated Google SSO Account */}
            {state.children.map((child) => {
              const isThisKidLogged =
                authSession?.role === 'CHILD' && authSession?.linkedChildId === child.id;
              const childEmail =
                child.googleEmail ||
                `${child.name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`;

              return (
                <button
                  key={child.id}
                  id={`btn-google-sso-kid-${child.id}`}
                  type="button"
                  onClick={() =>
                    signInWithGoogleSSO({
                      email: childEmail,
                      displayName: `${child.name} (${child.gradeLabel})`,
                      role: 'CHILD',
                      linkedChildId: child.id,
                      avatarEmoji: child.avatarEmoji,
                    })
                  }
                  className={`w-full text-left rounded-2xl p-3.5 border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    isThisKidLogged
                      ? 'bg-indigo-500/20 border-indigo-400 shadow-sm'
                      : 'bg-slate-950/90 border-slate-800 hover:border-indigo-500/50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-lg shrink-0">
                      {child.avatarEmoji}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-black text-white">
                          {child.name} ({child.gradeLabel})
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" />
                          Isolated Kid View • Sees ONLY {child.name}&apos;s Details
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono truncate">
                        {childEmail} • Hides siblings &amp; Parent Hub
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1.5 rounded-xl bg-indigo-500 text-white text-xs font-black shrink-0">
                    {isThisKidLogged ? 'Active ✓' : `Sign in as ${child.name}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Google Email OAuth Sign-In Form */}
        <form
          id="form-google-sso-custom-login"
          onSubmit={handleCustomSubmit}
          className="rounded-2xl bg-slate-950 border border-slate-800 p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-teal-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sign In with Any Custom Google Account</span>
            </span>
            <span className="text-[11px] text-slate-400">
              Auto-matches registered kid emails
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label
                htmlFor="input-google-sso-email"
                className="block text-[11px] font-bold text-slate-300 mb-1"
              >
                Google Email Address
              </label>
              <input
                id="input-google-sso-email"
                type="email"
                required
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="e.g. leo.sharma@gmail.com"
                className="w-full min-h-[40px] rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white focus:border-teal-400 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="input-google-sso-name"
                className="block text-[11px] font-bold text-slate-300 mb-1"
              >
                Display Name (Optional)
              </label>
              <input
                id="input-google-sso-name"
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Leo Sharma"
                className="w-full min-h-[40px] rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white focus:border-teal-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 items-end">
            <div>
              <label
                htmlFor="select-google-sso-role"
                className="block text-[11px] font-bold text-slate-300 mb-1"
              >
                Account Role
              </label>
              <select
                id="select-google-sso-role"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value as 'PARENT' | 'CHILD')}
                className="w-full min-h-[40px] rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white focus:border-teal-400 focus:outline-none"
              >
                <option value="CHILD">Kid Account (Isolated to 1 Child)</option>
                <option value="PARENT">Parent Admin (Full Family &amp; Assignment Hub)</option>
              </select>
            </div>

            {customRole === 'CHILD' && (
              <div>
                <label
                  htmlFor="select-google-sso-child-profile"
                  className="block text-[11px] font-bold text-slate-300 mb-1"
                >
                  Link to Kid Profile
                </label>
                <select
                  id="select-google-sso-child-profile"
                  value={selectedChildId}
                  onChange={(e) => setSelectedChildId(e.target.value)}
                  className="w-full min-h-[40px] rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white focus:border-teal-400 focus:outline-none"
                >
                  {state.children.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.avatarEmoji} {c.name} ({c.gradeLabel})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <button
            id="btn-submit-custom-google-sso"
            type="submit"
            className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-white text-slate-950 hover:bg-slate-100 font-black text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <GoogleMarkSvg id="svg-google-btn-custom" />
            <span>Continue with Google SSO</span>
          </button>
        </form>
      </div>
    </div>
  );
}
