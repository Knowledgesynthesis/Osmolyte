import { useEffect, useState } from 'react';

export interface Route {
  /** path segments after "#/" */
  parts: string[];
  query: URLSearchParams;
}

function parse(): Route {
  const raw = window.location.hash.replace(/^#\/?/, '');
  const [path, qs = ''] = raw.split('?');
  return { parts: path.split('/').filter(Boolean), query: new URLSearchParams(qs) };
}

export function href(path: string): string {
  return `#/${path.replace(/^\//, '')}`;
}

export function navigate(path: string): void {
  window.location.hash = href(path);
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(parse);
  useEffect(() => {
    const on = () => {
      setRoute(parse());
    };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}
