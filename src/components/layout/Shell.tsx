import { ReactNode, useState } from 'react';
import { clsx } from 'clsx';
import { href } from '@/hooks/useRoute';
import { useTheme } from '@/hooks/useTheme';
import { useProgress } from '@/store/progress';

const NAV = [
  { to: '', label: 'Course', match: ['', 'learn'] },
  { to: 'lab', label: 'Fluid Lab', match: ['lab'] },
  { to: 'cases', label: 'Cases', match: ['cases'] },
  { to: 'practice', label: 'Practice', match: ['practice'] },
  { to: 'cards', label: 'Cards', match: ['cards'] },
  { to: 'tools', label: 'Tools', match: ['tools'] },
  { to: 'reference', label: 'Reference', match: ['reference'] },
];

export function Shell({ section, children }: { section: string; children: ReactNode }) {
  const { theme, toggle } = useTheme();
  const reset = useProgress((s) => s.reset);
  const [confirm, setConfirm] = useState(false);
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-sm" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }}>
        Skip to content
      </a>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2.5 sm:px-6">
          <a href={href('')} className="flex shrink-0 items-center gap-2" aria-label="Osmolyte home">
            <img src="/favicon.svg" alt="" className="h-8 w-8" />
            <span className="text-lg font-bold tracking-tight">Osmolyte</span>
          </a>
          <nav aria-label="Main" className="scrollbar-none hidden flex-1 items-center gap-0.5 overflow-x-auto md:flex">
            {NAV.map((n) => (
              <a
                key={n.to}
                href={href(n.to)}
                aria-current={n.match.includes(section) ? 'page' : undefined}
                className={clsx(
                  'rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors',
                  n.match.includes(section) ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white',
                )}
              >
                {n.label}
              </a>
            ))}
          </nav>
          <button
            onClick={toggle}
            className="ml-auto rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
              </svg>
            )}
          </button>
        </div>
        <nav aria-label="Main (mobile)" className="scrollbar-none flex gap-1 overflow-x-auto border-t border-slate-100 px-3 py-1.5 md:hidden dark:border-slate-900">
          {NAV.map((n) => (
            <a
              key={n.to}
              href={href(n.to)}
              aria-current={n.match.includes(section) ? 'page' : undefined}
              className={clsx('shrink-0 rounded-md px-2.5 py-1 text-sm font-medium', n.match.includes(section) ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-slate-600 dark:text-slate-400')}
            >
              {n.label}
            </a>
          ))}
        </nav>
      </header>

      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 outline-none sm:px-6">
        {children}
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:text-slate-400">
          <p>
            Made by <span className="font-semibold text-slate-700 dark:text-slate-300">Bashar Hasan, MD</span> · Evidence reviewed November 2026 · A learning resource — confirm doses and limits against local protocols.
          </p>
          <div className="flex items-center gap-3">
            {confirm ? (
              <>
                <span>Erase all progress?</span>
                <button
                  className="font-medium text-rose-600 hover:underline"
                  onClick={() => {
                    reset();
                    setConfirm(false);
                  }}
                >
                  Erase
                </button>
                <button className="hover:underline" onClick={() => setConfirm(false)}>
                  Cancel
                </button>
              </>
            ) : (
              <button className="hover:underline" onClick={() => setConfirm(true)}>
                Reset progress
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
