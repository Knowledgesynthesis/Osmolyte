import { ButtonHTMLAttributes, ReactNode, useId } from 'react';
import { clsx } from 'clsx';
import { RichText } from './RichText';

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; size?: 'sm' | 'md' }) {
  return (
    <button
      {...props}
      className={clsx(
        'inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        size === 'sm' ? 'px-2.5 py-1 text-sm' : 'px-4 py-2 text-sm',
        variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-slate-950',
        variant === 'secondary' && 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800',
        variant === 'ghost' && 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
        variant === 'danger' && 'bg-rose-600 text-white hover:bg-rose-700',
        className,
      )}
    />
  );
}

export function LinkButton({ href, children, variant = 'primary', className }: { href: string; children: ReactNode; variant?: 'primary' | 'secondary'; className?: string }) {
  return (
    <a
      href={href}
      className={clsx(
        'inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
        variant === 'primary'
          ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:text-slate-950 dark:hover:bg-blue-400'
          : 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800',
        className,
      )}
    >
      {children}
    </a>
  );
}

export function Card({ children, className, as: As = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'section' | 'article' }) {
  return <As className={clsx('card', className)}>{children}</As>;
}

const toneStyles = {
  pearl: { box: 'border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/40', icon: '💡', label: 'Pearl' },
  pitfall: { box: 'border-rose-200 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/40', icon: '⚠️', label: 'Pitfall' },
  evidence: { box: 'border-violet-200 bg-violet-50 dark:border-violet-900 dark:bg-violet-950/40', icon: '📊', label: 'Evidence' },
  action: { box: 'border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/40', icon: '✅', label: 'Action' },
} as const;

export function Callout({ tone, title, children }: { tone: keyof typeof toneStyles; title: string; children: ReactNode }) {
  const t = toneStyles[tone];
  return (
    <aside className={clsx('rounded-xl border p-4', t.box)} aria-label={`${t.label}: ${title}`}>
      <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
        <span aria-hidden>{t.icon}</span>
        <span className="sr-only">{t.label}: </span>
        {title}
      </p>
      <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{children}</div>
    </aside>
  );
}

export function Badge({ children, tone = 'slate', className }: { children: ReactNode; tone?: 'slate' | 'blue' | 'amber' | 'rose' | 'emerald' | 'violet'; className?: string }) {
  const tones = {
    slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200',
    amber: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200',
    rose: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200',
    emerald: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
    violet: 'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200',
  };
  return <span className={clsx('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', tones[tone], className)}>{children}</span>;
}

export function NumberField({
  label,
  value,
  onChange,
  unit,
  min,
  max,
  step = 1,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
        {label}
      </label>
      <div className="flex items-center gap-1.5">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          className="input"
          value={Number.isFinite(value) ? value : ''}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(e.target.value === '' ? NaN : Number(e.target.value))}
        />
        {unit && <span className="shrink-0 text-xs text-slate-500 dark:text-slate-400">{unit}</span>}
      </div>
      {hint && <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{hint}</p>}
    </div>
  );
}

export function SliderField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  format,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  format?: (v: number) => string;
}) {
  const id = useId();
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-xs font-medium text-slate-600 dark:text-slate-400">
          {label}
        </label>
        <output htmlFor={id} className="num text-sm font-semibold text-slate-900 dark:text-slate-100">
          {format ? format(value) : value}
          {unit ? <span className="ml-0.5 text-xs font-normal text-slate-500"> {unit}</span> : null}
        </output>
      </div>
      <input id={id} type="range" className="w-full" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}

export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
  size = 'md',
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  size?: 'sm' | 'md';
}) {
  return (
    <fieldset>
      <legend className="mb-1 text-xs font-medium text-slate-600 dark:text-slate-400">{label}</legend>
      <div className="flex flex-wrap gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
            className={clsx(
              'flex-1 rounded-md font-medium whitespace-nowrap transition-colors',
              size === 'sm' ? 'px-2 py-1 text-xs' : 'px-2.5 py-1.5 text-sm',
              value === o.value ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-white' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white',
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function Check({ label, checked, onChange, hint }: { label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string }) {
  const id = useId();
  return (
    <div className="flex items-start gap-2">
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 h-4 w-4 rounded accent-blue-600" />
      <label htmlFor={id} className="text-sm leading-snug text-slate-700 dark:text-slate-300">
        {label}
        {hint && <span className="block text-[11px] text-slate-500 dark:text-slate-400">{hint}</span>}
      </label>
    </div>
  );
}

export function Stat({ label, value, sub, tone }: { label: string; value: ReactNode; sub?: ReactNode; tone?: 'ok' | 'warn' | 'bad' }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-950/60">
      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p
        className={clsx(
          'num text-lg font-semibold',
          tone === 'bad' ? 'text-rose-700 dark:text-rose-300' : tone === 'warn' ? 'text-amber-700 dark:text-amber-300' : 'text-slate-900 dark:text-white',
        )}
      >
        {value}
      </p>
      {sub && <p className="text-[11px] text-slate-500 dark:text-slate-400">{sub}</p>}
    </div>
  );
}

export function Text({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className}>
      <RichText text={text} />
    </span>
  );
}

export function ProgressRing({ value, size = 40, label }: { value: number; size?: number; label: string }) {
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(1, value));
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={label} className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={4} className="stroke-slate-200 dark:stroke-slate-800" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray={`${c * v} ${c}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className={v >= 1 ? 'stroke-emerald-500' : 'stroke-blue-600 dark:stroke-blue-400'}
      />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" className="fill-slate-700 text-[10px] font-semibold dark:fill-slate-200">
        {Math.round(v * 100)}%
      </text>
    </svg>
  );
}
