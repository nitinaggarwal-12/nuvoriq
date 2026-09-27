'use client';

import React from 'react';
import { IpsativePillarScore } from '@/types/domain';

interface IpsativeRadarChartProps {
  childId?: string;
  childName: string;
  gradeLabel: string;
  scores: IpsativePillarScore[];
}

export function IpsativeRadarChart({
  childId,
  childName,
  gradeLabel,
  scores,
}: IpsativeRadarChartProps) {
  const safeSlug = (childId || childName).toLowerCase().replace(/[^a-z0-9-]+/g, '-');
  const width = 340;
  const height = 290;
  const centerX = width / 2;
  const centerY = height / 2 + 4;
  const radius = 92;
  const levels = [0.25, 0.5, 0.75, 1];

  const getCoordinates = (index: number, valuePercent: number) => {
    const angle = (Math.PI * 2 * index) / scores.length - Math.PI / 2;
    const r = (valuePercent / 100) * radius;
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle),
    };
  };

  const baselinePoints = scores
    .map((s, i) => {
      const pt = getCoordinates(i, s.previous30DayScore);
      return `${pt.x},${pt.y}`;
    })
    .join(' ');

  const currentPoints = scores
    .map((s, i) => {
      const pt = getCoordinates(i, s.currentScore);
      return `${pt.x},${pt.y}`;
    })
    .join(' ');

  return (
    <div id={`ipsative-radar-container-${safeSlug}`} className="flex flex-col items-center">
      <div
        id={`ipsative-radar-header-${safeSlug}`}
        className="w-full flex items-center justify-between gap-2 mb-2"
      >
        <div>
          <h4 id={`ipsative-radar-title-${safeSlug}`} className="text-sm font-bold text-slate-100">
            {childName} ({gradeLabel}) — Ipsative Growth Radar
          </h4>
          <p className="text-xs text-slate-400">
            Self-referenced vs. {childName}&apos;s own 30-day baseline (zero sibling comparison)
          </p>
        </div>
        <span
          id={`ipsative-radar-growth-badge-${safeSlug}`}
          className="text-[11px] font-mono font-extrabold px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/40 shrink-0"
        >
          +
          {Math.round(
            scores.reduce((acc, s) => acc + (s.currentScore - s.previous30DayScore), 0) /
              scores.length
          )}
          % Avg Growth
        </span>
      </div>

      <svg
        id={`svg-ipsative-radar-${safeSlug}`}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="max-w-full h-auto overflow-visible select-none"
        role="img"
        aria-label={`Ipsative 5-pillar growth radar chart for ${childName}`}
      >
        {/* Concentric pentagon rings */}
        {levels.map((lvl) => {
          const ringPts = scores
            .map((_, i) => {
              const pt = getCoordinates(i, lvl * 100);
              return `${pt.x},${pt.y}`;
            })
            .join(' ');
          return (
            <polygon
              key={lvl}
              id={`radar-ring-${safeSlug}-${lvl * 100}`}
              points={ringPts}
              fill="none"
              stroke="rgba(100, 116, 139, 0.35)"
              strokeWidth="1.2"
            />
          );
        })}

        {/* Axis spokes & labels */}
        {scores.map((s, i) => {
          const outer = getCoordinates(i, 100);
          const labelPt = getCoordinates(i, 128);
          return (
            <g key={s.pillar} id={`radar-axis-${safeSlug}-${s.pillar}`}>
              <line
                x1={centerX}
                y1={centerY}
                x2={outer.x}
                y2={outer.y}
                stroke="rgba(100, 116, 139, 0.4)"
                strokeWidth="1.2"
              />
              <text
                x={labelPt.x}
                y={labelPt.y - 4}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-slate-300 text-[11px] font-bold"
              >
                {s.label.split(' ')[0]}
              </text>
              <text
                x={labelPt.x}
                y={labelPt.y + 9}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-teal-300 text-[9.5px] font-mono font-extrabold"
              >
                {s.currentScore}% (was {s.previous30DayScore}%)
              </text>
            </g>
          );
        })}

        {/* Previous 30-day baseline polygon */}
        <polygon
          id={`radar-polygon-baseline-${safeSlug}`}
          points={baselinePoints}
          fill="rgba(99, 102, 241, 0.2)"
          stroke="#6366f1"
          strokeWidth="2"
          strokeDasharray="4 3"
        />

        {/* Current self-referenced polygon */}
        <polygon
          id={`radar-polygon-current-${safeSlug}`}
          points={currentPoints}
          fill="rgba(20, 184, 166, 0.32)"
          stroke="#0d9488"
          strokeWidth="2.5"
        />

        {/* Data vertices */}
        {scores.map((s, i) => {
          const pt = getCoordinates(i, s.currentScore);
          return (
            <circle
              key={s.pillar}
              id={`radar-vertex-${safeSlug}-${s.pillar}`}
              cx={pt.x}
              cy={pt.y}
              r={4.5}
              fill="#14b8a6"
              stroke="#0f172a"
              strokeWidth="1.5"
            />
          );
        })}
      </svg>

      <div
        id={`ipsative-radar-legend-${safeSlug}`}
        className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-300 mt-1"
      >
        <span className="flex items-center gap-1.5 font-semibold">
          <span className="w-3 h-3 rounded-sm bg-teal-500/40 border border-teal-500 inline-block" />
          Current 30-Day Self-Score
        </span>
        <span className="flex items-center gap-1.5 font-semibold">
          <span className="w-3 h-3 rounded-sm bg-indigo-500/25 border border-dashed border-indigo-500 inline-block" />
          Prior 30-Day Baseline
        </span>
      </div>
    </div>
  );
}
