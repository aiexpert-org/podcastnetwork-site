"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { DARK_NODE_COLORS, type Keyframe } from "@/lib/entity-graph";
import { track } from "@/lib/track";
import { usePlayhead, FULL_DAY } from "./PlayheadContext";

const PAD = 24;
const VIEW_W = 800;
const VIEW_H = 96;
const TRACK_Y = 44;
const TRACK_W = VIEW_W - PAD * 2;

const MONTH_LABELS = [
  "01 Discovery",
  "02 Manuscript Kickoff",
  "03 Podcast Arc",
  "04 Pre-Sell Sequence",
  "05 Knowledge Panel",
  "06 Launch",
];

type SixMonthPlayheadProps = {
  keyframes: Keyframe[];
  /** "controller" syncs to the shared PlayheadContext; "preview" keeps
   * local state only (used on /the-package/). */
  variant?: "controller" | "preview";
  className?: string;
};

function dayToX(day: number) {
  return PAD + (day / FULL_DAY) * TRACK_W;
}

export function SixMonthPlayhead({
  keyframes,
  variant = "controller",
  className,
}: SixMonthPlayheadProps) {
  const shared = usePlayhead();
  const [localDay, setLocalDay] = useState(FULL_DAY);
  const day = variant === "controller" ? shared.day : localDay;
  const setDay = variant === "controller" ? shared.setDay : setLocalDay;

  const svgRef = useRef<SVGSVGElement>(null);
  const draggingRef = useRef(false);
  const [hoveredKeyframe, setHoveredKeyframe] = useState<Keyframe | null>(null);

  const activeKeyframe = useMemo(
    () =>
      keyframes.filter((kf) => kf.day <= day).sort((a, b) => b.day - a.day)[0] ??
      null,
    [keyframes, day],
  );

  const dayFromPointer = useCallback((clientX: number) => {
    const svg = svgRef.current;
    if (!svg) return 0;
    const rect = svg.getBoundingClientRect();
    const scale = VIEW_W / rect.width;
    const x = (clientX - rect.left) * scale;
    return Math.max(0, Math.min(FULL_DAY, ((x - PAD) / TRACK_W) * FULL_DAY));
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      draggingRef.current = true;
      (e.target as Element).setPointerCapture?.(e.pointerId);
      track("playhead_drag");
      setDay(dayFromPointer(e.clientX));
    },
    [dayFromPointer, setDay],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!draggingRef.current) return;
      setDay(dayFromPointer(e.clientX));
    },
    [dayFromPointer, setDay],
  );

  const onPointerUp = useCallback(() => {
    draggingRef.current = false;
  }, []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const step = e.shiftKey ? 30 : 10;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setDay(day + step);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setDay(day - step);
      } else if (e.key === "Home") {
        e.preventDefault();
        setDay(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setDay(FULL_DAY);
      }
    },
    [day, setDay],
  );

  const cursorX = dayToX(day);

  return (
    <div className={className}>
      <div
        className="rounded-xl border border-viz-border bg-viz-ink-raised/60 px-4 pt-4 pb-2"
        aria-label="Six-month engagement timeline. Drag or use arrow keys to scrub."
      >
        <div className="flex items-baseline justify-between px-2 pb-1">
          <span className="text-mono-tab text-foil" data-mono>
            Day {day}
          </span>
          <span className="text-caption hidden text-fog sm:block">
            {day >= FULL_DAY
              ? "Handoff to Legacy Publishing"
              : (activeKeyframe?.label ?? "Before kickoff")}
          </span>
        </div>

        <svg
          ref={svgRef}
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="w-full touch-none select-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {/* Empty track */}
          <line
            x1={PAD}
            y1={TRACK_Y}
            x2={VIEW_W - PAD}
            y2={TRACK_Y}
            stroke="#2a3352"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Progress fill */}
          <line
            x1={PAD}
            y1={TRACK_Y}
            x2={cursorX}
            y2={TRACK_Y}
            stroke="#4a90e2"
            strokeOpacity="0.45"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Keyframe milestone dots */}
          {keyframes.map((kf) => {
            const x = dayToX(kf.day);
            const passed = day >= kf.day;
            const color = passed
              ? DARK_NODE_COLORS[kf.milestone.type].fill
              : "#475569";
            return (
              <g key={kf.day}>
                <circle
                  cx={x}
                  cy={TRACK_Y}
                  r="7"
                  fill={color}
                  stroke={passed ? "#faf8f5" : "#2a3352"}
                  strokeWidth="1.5"
                  style={{ transition: "fill 200ms ease" }}
                  onPointerEnter={() => setHoveredKeyframe(kf)}
                  onPointerLeave={() => setHoveredKeyframe(null)}
                />
                <text
                  x={x}
                  y={TRACK_Y + 30}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#94a3b8"
                  className="pointer-events-none"
                >
                  Day {kf.day}
                </text>
              </g>
            );
          })}

          {/* Playhead cursor */}
          <line
            x1={cursorX}
            y1={TRACK_Y - 24}
            x2={cursorX}
            y2={TRACK_Y + 16}
            stroke="#c4a365"
            strokeWidth="2"
          />
          <circle
            cx={cursorX}
            cy={TRACK_Y}
            r="12"
            fill="#c4a365"
            stroke="#faf8f5"
            strokeWidth="2"
            style={{
              cursor: draggingRef.current ? "grabbing" : "grab",
              filter: "drop-shadow(0 0 10px rgba(196, 163, 101, 0.5))",
            }}
            role="slider"
            aria-valuemin={0}
            aria-valuemax={FULL_DAY}
            aria-valuenow={day}
            aria-valuetext={`Day ${day}. ${activeKeyframe?.label ?? "Before kickoff"}. ${activeKeyframe?.visibleNodes.length ?? 0} entities visible.`}
            aria-label="Timeline playhead"
            tabIndex={0}
            onKeyDown={onKeyDown}
          />
        </svg>

        {hoveredKeyframe && (
          <p className="text-caption px-2 pb-1 text-foil-bright">
            Day {hoveredKeyframe.day}: {hoveredKeyframe.milestone.description}
          </p>
        )}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-x-4 gap-y-1.5 px-1 sm:grid-cols-6">
        {MONTH_LABELS.map((label, i) => {
          const monthDay = (i + 1) * 30;
          const passed = day >= monthDay - 29;
          return (
            <button
              key={label}
              onClick={() => setDay(monthDay)}
              className={`text-caption text-left transition-colors focus-visible:outline-2 focus-visible:outline-foil ${
                passed ? "text-papyrus" : "text-fog/60"
              } hover:text-foil-bright`}
            >
              {label}
            </button>
          );
        })}
      </div>
      <p className="text-micro mt-2 px-1 text-fog">
        Terminal marker: Handoff to Legacy Publishing
      </p>
    </div>
  );
}
