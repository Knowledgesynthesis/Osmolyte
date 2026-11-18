import { useEffect } from 'react';
import { clsx } from 'clsx';
import { href } from '@/hooks/useRoute';
import { CorrectionPlanner, FECalc, FreeWaterPlanner, FurstCalc, SoluteExplorer, TonicityCalc } from '@/components/interactives/Calculators';
import { CorrectionMonitor } from '@/components/interactives/CorrectionMonitor';
import { HypoNavigator } from '@/components/interactives/HypoNavigator';
import { PolyuriaLab } from '@/components/interactives/PolyuriaLab';

export const TOOLS = [
  { id: 'navigator', label: 'Hyponatremia navigator', C: HypoNavigator },
  { id: 'tonicity', label: 'Osmolality & corrected Na', C: TonicityCalc },
  { id: 'monitor', label: 'Correction monitor', C: CorrectionMonitor },
  { id: 'planner', label: 'Correction planner', C: CorrectionPlanner },
  { id: 'furst', label: 'Fluid restriction predictor', C: FurstCalc },
  { id: 'fe', label: 'Fractional excretion', C: FECalc },
  { id: 'freewater', label: 'Free-water planner', C: FreeWaterPlanner },
  { id: 'solute', label: 'Solute–water explorer', C: SoluteExplorer },
  { id: 'polyuria', label: 'Polyuria test bench', C: PolyuriaLab },
] as const;

export function Tools({ active }: { active?: string }) {
  const tool = TOOLS.find((t) => t.id === active) ?? TOOLS[0];
  useEffect(() => {
    if (active) document.getElementById('tool-panel')?.scrollIntoView({ block: 'start' });
  }, [active]);
  return (
    <div className="space-y-6">
      <header>
        <p className="label">Bedside tools</p>
        <h1 className="text-3xl font-bold tracking-tight">Calculators & decision aids</h1>
        <p className="mt-1 max-w-3xl text-slate-600 dark:text-slate-400">The same engines used in the course, standalone. Formulas plan the first step — serial measurements steer the rest.</p>
      </header>
      <div className="grid gap-6 lg:grid-cols-[230px_1fr]">
        <nav aria-label="Tools" className="scrollbar-none -mx-1 flex gap-1.5 overflow-x-auto px-1 lg:sticky lg:top-24 lg:mx-0 lg:flex-col lg:self-start lg:overflow-visible lg:px-0">
          {TOOLS.map((t) => (
            <a
              key={t.id}
              href={href(`tools/${t.id}`)}
              aria-current={tool.id === t.id ? 'page' : undefined}
              className={clsx(
                'shrink-0 rounded-lg px-3 py-2 text-sm whitespace-nowrap',
                tool.id === t.id ? 'bg-blue-600 font-semibold text-white' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
              )}
            >
              {t.label}
            </a>
          ))}
        </nav>
        <div id="tool-panel" className="min-w-0 scroll-mt-24">
          <tool.C />
        </div>
      </div>
    </div>
  );
}
