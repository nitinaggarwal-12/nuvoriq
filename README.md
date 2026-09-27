# Nuvoriq — Enterprise Family Executive-Functioning & Socratic Parent Coaching Platform

**Nuvoriq** (`NQ`) is a full-stack Next.js (App Router) + TypeScript + Tailwind CSS executive-functioning, time-calibration, and Socratic parent-coaching platform designed for Grades K–12.

Unlike standard commercial family displays (*Hearth Display*, *Skylight*, *Cozi*, *Maple*), gamified habit trackers (*Finch*, *Habitica*, *Joon*), or student planners (*Tiimo*, *MyStudyLife*), **Nuvoriq** bridges the **6 Critical Developmental & Behavioral Gaps**:

---

## The 6 Core Capabilities in Nuvoriq

1. **"Time-Blindness" Predictor & Estimation Calibration (`FocusCalibrationModal.tsx`)**
   - Before starting any task, children lock in a **Duration Estimate** (`5m` to `90m`).
   - Runs a color-shifting visual countdown ring (Emerald $\rightarrow$ Amber $\rightarrow$ Rose) with a `10x` simulation toggle and logs **Estimated vs. Actual Elapsed Time** to compute a rolling **Time-Sense Accuracy %**.
2. **Energy-Aware Scheduling & Transition Runway Buffers (`ChildExecutiveWorkspace.tsx` & `icsEngine.ts`)**
   - Tags every block as `High-Cognitive`, `Physical / Creative`, or `Restorative`, enforces **2-Stage Transition Runway Alerts** (`10-min` Heads-Up & `3-min` Wrap-Up), and flags **Cognitive Over-Scheduling** when $>2$ high-cognitive blocks are stacked back-to-back without a restorative buffer.
3. **Socratic Parent Coaching & Low-Friction Reconnection (`ParentCommandCenter.tsx`)**
   - Auto-generates **Weekly 10-Minute "Sunday Family Summit" Agendas**, **Contextual Socratic Praise Scripts** (triggered when a child finishes a hard task or logs `Frustrated`/`Tired`), and **1-Tap Effort-Based Kudos** that celebrate strategy over raw scores.
4. **Graduated Autonomy Ladder — Grades K–12 (`TopCommandHeader.tsx` & `ChildExecutiveWorkspace.tsx`)**
   - **Level 1 (`Guided` — Grades K–2):** Visual picture/icon sequence with parent-guided check-ins.
   - **Level 2 (`Co-Pilot` — Grades 3–6):** Child reorders afternoon tasks and submits **Schedule Negotiation Proposals** for parent approval.
   - **Level 3 (`Architect` — Grades 7–12):** Self-directed weekly sprint planning with independent deadline decomposition.
5. **Low-Stakes Resilience & Grace-Period Streaks (`ChildExecutiveWorkspace.tsx`)**
   - Replaces anxiety-inducing binary streaks with **2 Automatic Monthly Grace Shields** and **"Comeback Kid" Bounce-Back Badges**.
6. **Whole-Child 5-Pillar Ipsative Balance & Evidence Portfolio (`IpsativeRadarChart.tsx`)**
   - Tracks **Academic Mastery**, **Disciplines & Arts**, **Unstructured Free Play**, **Mind/Body Restoration**, and **Executive Habits** on a **Self-Referenced (Ipsative) Radar Chart** (comparing each child strictly against their own 4-week baseline, never against siblings), paired with a **3-Point Metacognitive Journal** (`What Clicked`, `What Blocked Me`, `Next Strategy`) and work artifact snapshots.

---

## Multi-Theme Studio & Navigation Architecture

- **Collapsible Left Sidebar (`CollapsibleSidebar.tsx`):**
  - Toggles between a full `296px` command rail and a compact `80px` icon rail on desktop, plus a slide-over drawer and 4-tab thumb-zone dock on iOS Safari & Android Chrome.
- **6 Multi-Mode Themes (`globals.css`):**
  - **Dark Atmospheric Themes:** `Obsidian Teal` (Default), `Cosmic Aurora`, `Evergreen Dojo`, `Warm Sunset`
  - **High-Contrast Daylight Themes:** `Solar Daylight`, `Oceanic Breeze`
- **100% Deterministic Unique DOM IDs:**
  - Every landmark, interactive control, button, link, input, tab, modal, and SVG chart node carries a globally unique `id` verified via automated Puppeteer E2E inspection (`scripts/verify_e2e_delivery.mjs`).

---

## Getting Started

```bash
npm install
npm run dev -- -p 3045
```

Open **`http://localhost:3045`** in your browser.
