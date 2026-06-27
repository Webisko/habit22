import { getTranslations } from './translations';

export function getLocalizedPath(path: string, lang: string): string {
  const base = import.meta.env.BASE_URL || '/';
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  if (lang === 'en') {
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
