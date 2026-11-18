import type { InteractiveId } from '@/data/types';
import { PRESETS } from '@/lib/fluidLab';
import { href } from '@/hooks/useRoute';
import { CorrectionPlanner, FreeWaterPlanner, FurstCalc, SoluteExplorer, TonicityCalc } from './Calculators';
import { CorrectionMonitor } from './CorrectionMonitor';
import { HypoNavigator } from './HypoNavigator';
import { PolyuriaLab } from './PolyuriaLab';

function FluidLabLink({ preset }: { preset?: string }) {
  const p = PRESETS.find((x) => x.patient.id === preset) ?? PRESETS[0];
  return (
    <a
      href={href(`lab?preset=${p.patient.id}`)}
      className="group flex items-center gap-4 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-white p-4 transition-colors hover:border-blue-400 dark:border-blue-900 dark:from-blue-950/50 dark:to-slate-900 dark:hover:border-blue-700"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-lg text-white" aria-hidden>
        ⚗
      </span>
      <span className="min-w-0">
        <span className="block text-[11px] font-semibold tracking-wide text-blue-700 uppercase dark:text-blue-300">Open in Fluid Lab</span>
        <span className="block font-semibold text-slate-900 dark:text-white">{p.patient.label}</span>
        <span className="block text-sm text-slate-600 dark:text-slate-400">{p.lesson}</span>
      </span>
      <span className="ml-auto text-blue-600 transition-transform group-hover:translate-x-1 dark:text-blue-300" aria-hidden>
        →
      </span>
    </a>
  );
}

export function Interactive({ id, preset }: { id: InteractiveId; preset?: string }) {
  switch (id) {
    case 'solute-explorer':
      return <SoluteExplorer />;
    case 'tonicity-calc':
      return <TonicityCalc />;
    case 'hypo-navigator':
      return <HypoNavigator />;
    case 'correction-planner':
      return <CorrectionPlanner />;
    case 'correction-monitor':
      return <CorrectionMonitor />;
    case 'furst':
      return <FurstCalc />;
    case 'polyuria-lab':
      return <PolyuriaLab />;
    case 'free-water':
      return <FreeWaterPlanner />;
    case 'fluid-lab-link':
      return <FluidLabLink preset={preset} />;
  }
}
