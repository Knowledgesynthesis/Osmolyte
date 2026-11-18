import { useEffect, useMemo, useRef, useState } from 'react';

export interface Series {
  id: string;
  label: string;
  /** CSS colour (use var(--viz-*) tokens) */
  color: string;
  points: { x: number; y: number }[];
  /** de-emphasised comparison series */
  muted?: boolean;
}

export interface RefLine {
  y: number;
  x0?: number;
  x1?: number;
  label: string;
  tone?: 'critical' | 'good' | 'neutral';
}

interface Props {
  series: Series[];
  refLines?: RefLine[];
  xLabel: string;
  yLabel: string;
  yUnit?: string;
  height?: number;
  xDomain?: [number, number];
  yDomain?: [number, number];
  xTicks?: number[];
  /** tooltip value format */
  formatY?: (y: number) => string;
  /** axis tick format */
  formatTick?: (y: number) => string;
  ariaLabel: string;
}

function niceTicks(min: number, max: number, count = 5): number[] {
  const span = max - min || 1;
  const raw = span / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => span / s <= count) ?? 10 * mag;
  const start = Math.ceil(min / step) * step;
  const ticks: number[] = [];
  for (let v = start; v <= max + 1e-9; v += step) ticks.push(Math.round(v * 1000) / 1000);
  return ticks;
}

export function LineChart({ series, refLines = [], xLabel, yLabel, yUnit = '', height = 260, xDomain, yDomain, xTicks, formatY = (y) => y.toFixed(1), formatTick = (y) => String(y), ariaLabel }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(640);
  const [hoverX, setHoverX] = useState<number | null>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => setWidth(Math.max(280, entries[0].contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const all = series.flatMap((s) => s.points);
  const [x0, x1] = xDomain ?? [Math.min(...all.map((p) => p.x)), Math.max(...all.map((p) => p.x))];
  const [y0, y1] = useMemo(() => {
    if (yDomain) return yDomain;
    const ys = [...all.map((p) => p.y), ...refLines.map((r) => r.y)].filter(Number.isFinite);
    const lo = Math.min(...ys);
    const hi = Math.max(...ys);
    const pad = Math.max(1, (hi - lo) * 0.12);
    return [Math.floor(lo - pad), Math.ceil(hi + pad)];
  }, [all, refLines, yDomain]);

  const m = { top: 14, right: 16, bottom: 38, left: 48 };
  const w = width - m.left - m.right;
  const h = height - m.top - m.bottom;
  const sx = (x: number) => m.left + ((x - x0) / (x1 - x0 || 1)) * w;
  const sy = (y: number) => m.top + (1 - (y - y0) / (y1 - y0 || 1)) * h;
  const yt = niceTicks(y0, y1, 5);
  const xt = xTicks ?? niceTicks(x0, x1, Math.min(8, Math.floor(w / 70)));

  const path = (pts: { x: number; y: number }[]) => pts.filter((p) => Number.isFinite(p.y)).map((p, i) => `${i ? 'L' : 'M'}${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`).join('');

  const nearest = (s: Series, x: number) => s.points.reduce((b, p) => (Math.abs(p.x - x) < Math.abs(b.x - x) ? p : b), s.points[0]);

  const onMove = (clientX: number) => {
    const rect = wrap.current?.getBoundingClientRect();
    if (!rect) return;
    const px = clientX - rect.left;
    const x = x0 + ((px - m.left) / w) * (x1 - x0);
    setHoverX(Math.max(x0, Math.min(x1, x)));
  };

  const hover = hoverX === null ? null : series.map((s) => ({ s, p: nearest(s, hoverX) }));
  const hx = hover?.[0]?.p.x;
  const tipLeft = hx !== undefined ? sx(hx) : 0;

  const toneColor = (t?: RefLine['tone']) => (t === 'critical' ? 'var(--viz-critical)' : t === 'good' ? 'var(--viz-good)' : 'var(--viz-axis)');

  return (
    <div className="relative" ref={wrap}>
      {series.length > 1 && (
        <ul className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-300" aria-label="Legend">
          {series.map((s) => (
            <li key={s.id} className="flex items-center gap-1.5">
              <span className="inline-block h-0.5 w-4 rounded" style={{ background: s.color, opacity: s.muted ? 0.9 : 1 }} />
              {s.label}
            </li>
          ))}
        </ul>
      )}
      <svg
        width={width}
        height={height}
        role="img"
        aria-label={ariaLabel}
        className="block touch-none select-none"
        onPointerMove={(e) => onMove(e.clientX)}
        onPointerDown={(e) => onMove(e.clientX)}
        onPointerLeave={() => setHoverX(null)}
        tabIndex={0}
        onKeyDown={(e) => {
          const step = (x1 - x0) / 48;
          if (e.key === 'ArrowRight') setHoverX((v) => Math.min(x1, (v ?? x0) + step));
          if (e.key === 'ArrowLeft') setHoverX((v) => Math.max(x0, (v ?? x0) - step));
          if (e.key === 'Escape') setHoverX(null);
        }}
      >
        {/* grid */}
        {yt.map((t) => (
          <g key={`y${t}`}>
            <line x1={m.left} x2={m.left + w} y1={sy(t)} y2={sy(t)} stroke="var(--viz-grid)" strokeWidth={1} />
            <text x={m.left - 8} y={sy(t)} dy="0.32em" textAnchor="end" fontSize={11} fill="var(--viz-text)" className="num">
              {formatTick(t)}
            </text>
          </g>
        ))}
        {xt.map((t) => (
          <text key={`x${t}`} x={sx(t)} y={m.top + h + 16} textAnchor="middle" fontSize={11} fill="var(--viz-text)" className="num">
            {t}
          </text>
        ))}
        <line x1={m.left} x2={m.left + w} y1={m.top + h} y2={m.top + h} stroke="var(--viz-axis)" strokeWidth={1} />
        <text x={m.left + w / 2} y={height - 4} textAnchor="middle" fontSize={11} fill="var(--viz-text)">
          {xLabel}
        </text>
        <text transform={`translate(12 ${m.top + h / 2}) rotate(-90)`} textAnchor="middle" fontSize={11} fill="var(--viz-text)">
          {yLabel}
        </text>

        {/* reference lines */}
        {refLines.map((r, i) => {
          const xa = sx(r.x0 ?? x0);
          const xb = sx(r.x1 ?? x1);
          return (
            <g key={`r${i}`}>
              <line x1={xa} x2={xb} y1={sy(r.y)} y2={sy(r.y)} stroke={toneColor(r.tone)} strokeWidth={1.5} strokeDasharray="5 4" />
              <text x={xb - 4} y={sy(r.y) - 5} textAnchor="end" fontSize={10.5} fill="var(--viz-text)" fontWeight={600}>
                {r.label}
              </text>
            </g>
          );
        })}

        {/* series: muted first */}
        {[...series].sort((a, b) => Number(b.muted ?? false) - Number(a.muted ?? false)).map((s) => (
          <path key={s.id} d={path(s.points)} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" opacity={s.muted ? 0.85 : 1} />
        ))}

        {/* end labels for primary series */}
        {series
          .filter((s) => !s.muted && s.points.length)
          .map((s) => {
            const p = s.points[s.points.length - 1];
            return <circle key={`e${s.id}`} cx={sx(p.x)} cy={sy(p.y)} r={4} fill={s.color} stroke="var(--viz-surface)" strokeWidth={2} />;
          })}

        {/* hover */}
        {hover && hx !== undefined && (
          <g pointerEvents="none">
            <line x1={sx(hx)} x2={sx(hx)} y1={m.top} y2={m.top + h} stroke="var(--viz-axis)" strokeWidth={1} />
            {hover.map(({ s, p }) => (
              <circle key={`h${s.id}`} cx={sx(p.x)} cy={sy(p.y)} r={4.5} fill={s.color} stroke="var(--viz-surface)" strokeWidth={2} />
            ))}
          </g>
        )}
      </svg>
      {hover && hx !== undefined && (
        <div
          className="pointer-events-none absolute top-6 z-10 min-w-36 rounded-lg border border-slate-200 bg-white/95 px-2.5 py-1.5 text-xs shadow-lg dark:border-slate-700 dark:bg-slate-900/95"
          style={{ left: Math.min(Math.max(tipLeft + 10, 0), width - 170) }}
          role="status"
          aria-live="polite"
        >
          <p className="mb-0.5 font-semibold text-slate-700 dark:text-slate-200">
            {xLabel.replace(/\s*\(.*\)/, '')}: {hx}
          </p>
          {hover.map(({ s, p }) => (
            <p key={s.id} className="flex items-center justify-between gap-3 text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full" style={{ background: s.color }} />
                {s.label}
              </span>
              <span className="num font-semibold text-slate-900 dark:text-white">
                {formatY(p.y)}
                {yUnit && <span className="font-normal text-slate-500"> {yUnit}</span>}
              </span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
