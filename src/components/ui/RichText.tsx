import { Fragment, ReactNode } from 'react';
import { REF_INDEX, REF_NUMBER } from '@/data/references';
import { href } from '@/hooks/useRoute';

/** Renders **bold**, *italic* and [@refId] citation markers. */
export function RichText({ text }: { text: string }) {
  const out: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|\[@[\w-]+\])/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(<Fragment key={k++}>{text.slice(last, m.index)}</Fragment>);
    const tok = m[0];
    if (tok.startsWith('**')) out.push(<strong key={k++} className="font-semibold text-slate-900 dark:text-white">{tok.slice(2, -2)}</strong>);
    else if (tok.startsWith('[@')) out.push(<Cite key={k++} id={tok.slice(2, -1)} />);
    else out.push(<em key={k++}>{tok.slice(1, -1)}</em>);
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(<Fragment key={k}>{text.slice(last)}</Fragment>);
  return <>{out}</>;
}

export function Cite({ id }: { id: string }) {
  const ref = REF_INDEX[id];
  if (!ref) return null;
  return (
    <sup className="ml-0.5">
      <a
        href={href(`reference/${id}`)}
        title={ref.citation}
        className="rounded px-0.5 text-[0.7em] font-semibold text-blue-700 no-underline hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-950"
        aria-label={`Reference ${REF_NUMBER[id]}: ${ref.citation}`}
      >
        [{REF_NUMBER[id]}]
      </a>
    </sup>
  );
}
