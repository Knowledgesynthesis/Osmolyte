import { useEffect } from 'react';
import { useRoute } from '@/hooks/useRoute';
import { MODULE_INDEX } from '@/data/modules';
import { CASE_INDEX } from '@/data/cases';
import { Shell } from '@/components/layout/Shell';
import { Home } from '@/components/home/Home';
import { ModulePage } from '@/components/learn/ModulePage';
import { FluidLab } from '@/components/lab/FluidLab';
import { CaseList, CasePlayer } from '@/components/cases/Cases';
import { Practice } from '@/components/practice/Practice';
import { Flashcards } from '@/components/cards/Flashcards';
import { Tools } from '@/components/tools/Tools';
import { ReferencePage } from '@/components/reference/Reference';
import { LinkButton } from '@/components/ui/primitives';

const TITLES: Record<string, string> = {
  '': 'Sodium & Water Disorders',
  lab: 'Fluid Lab',
  cases: 'Clinical cases',
  practice: 'Question bank',
  cards: 'Flashcards',
  tools: 'Tools',
  reference: 'Reference',
};

function NotFound() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <LinkButton href="#/" className="mt-4">
        Back to the course
      </LinkButton>
    </div>
  );
}

export default function App() {
  const { parts, query } = useRoute();
  const [section = '', id] = parts;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [section, id]);

  let page;
  let title = TITLES[section] ?? 'Osmolyte';
  switch (section) {
    case '':
      page = <Home />;
      break;
    case 'learn': {
      const m = id ? MODULE_INDEX[id] : undefined;
      page = m ? <ModulePage key={m.id} m={m} /> : <NotFound />;
      if (m) title = `${m.number}. ${m.title}`;
      break;
    }
    case 'lab':
      page = <FluidLab key={query.get('preset') ?? 'default'} initialPreset={query.get('preset') ?? undefined} />;
      break;
    case 'cases': {
      const c = id ? CASE_INDEX[id] : undefined;
      page = id ? c ? <CasePlayer key={c.id} c={c} /> : <NotFound /> : <CaseList />;
      if (c) title = c.title;
      break;
    }
    case 'practice':
      page = <Practice />;
      break;
    case 'cards':
      page = <Flashcards />;
      break;
    case 'tools':
      page = <Tools active={id} />;
      break;
    case 'reference':
      page = <ReferencePage key={id ?? 'all'} focus={id} />;
      break;
    default:
      page = <NotFound />;
  }

  useEffect(() => {
    document.title = `${title} — Osmolyte`;
  }, [title]);

  return <Shell section={section}>{page}</Shell>;
}
