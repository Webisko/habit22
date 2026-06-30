import { getTranslations } from './translations';

const ROUTE_MAP: Record<string, { pl: string; en: string }> = {
  'journal': { pl: 'dziennik', en: 'journal' },
  'product': { pl: 'produkt', en: 'product' },
  'terms': { pl: 'regulamin', en: 'terms' },
  'privacy': { pl: 'polityka-prywatnosci', en: 'privacy' },
  'cookies': { pl: 'polityka-cookies', en: 'cookies' },
  'checkout': { pl: 'zamowienie', en: 'checkout' },
};

export function getLocalizedPath(path: string, lang: string): string {
  const base = import.meta.env.BASE_URL || '/';
  let cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  const isEn = lang.startsWith('en');
  const targetLang = isEn ? 'en' : 'pl';

  const segments = cleanPath.split('/');
  const firstSegment = segments[0];
  
  if (ROUTE_MAP[firstSegment]) {
    segments[0] = ROUTE_MAP[firstSegment][targetLang];
    cleanPath = segments.join('/');
  }
  
  if (isEn) {
    return `${base}en/${cleanPath}`;
  }
  return `${base}${cleanPath}`;
}

export function useTranslations(lang: string | undefined) {
  const t = getTranslations(lang);
  return {
    t,
    l: (path: string) => getLocalizedPath(path, lang || 'pl')
  };
}
