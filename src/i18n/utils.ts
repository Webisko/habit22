import { getTranslations, TRANSLATIONS } from './translations';
import { PRODUCTS } from '../data/products';

const ROUTE_MAP: Record<string, { pl: string; en: string }> = {
  'about': { pl: 'o-marce', en: 'about' },
  'shop': { pl: 'kolekcja', en: 'shop' },
  'account': { pl: 'konto', en: 'account' },
  'login': { pl: 'logowanie', en: 'login' },
  'reset-password': { pl: 'ustaw-nowe-haslo', en: 'set-new-password' },
  'contact': { pl: 'kontakt', en: 'contact' },
  'journal': { pl: 'dziennik', en: 'journal' },
  'product': { pl: 'produkt', en: 'product' },
  'terms': { pl: 'regulamin', en: 'terms' },
  'privacy': { pl: 'polityka-prywatnosci', en: 'privacy' },
  'cookies': { pl: 'polityka-cookies', en: 'cookies' },
  'checkout': { pl: 'zamowienie', en: 'checkout' },
  'thankyou': { pl: 'podziekowanie', en: 'thankyou' },
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

export function getAlternatePath(currentPath: string, currentLang: string): string {
  const base = import.meta.env.BASE_URL || '/';
  let cleanPath = currentPath;
  
  if (cleanPath.startsWith(base)) {
    cleanPath = cleanPath.slice(base.length);
  }
  if (cleanPath.startsWith('/')) {
    cleanPath = cleanPath.slice(1);
  }
  cleanPath = cleanPath.replace(/\/$/, '');

  const isEn = currentLang.startsWith('en');
  
  if (isEn) {
    // Current page is English, target is Polish
    if (cleanPath.startsWith('en/')) {
      cleanPath = cleanPath.slice(3);
    } else if (cleanPath === 'en') {
      cleanPath = '';
    }
    
    if (!cleanPath) {
      return base;
    }

    const segments = cleanPath.split('/');
    const firstSegment = segments[0];
    const entry = Object.entries(ROUTE_MAP).find(([_, langs]) => langs.en === firstSegment);
    
    if (entry) {
      segments[0] = entry[1].pl;
      
      // Dynamic route translations
      if (entry[0] === 'product' && segments[1]) {
        const prod = PRODUCTS.find(p => p.slugs.en === segments[1]);
        if (prod) {
          segments[1] = prod.slugs.pl;
        }
      } else if (entry[0] === 'journal' && segments[1]) {
        const enPost = TRANSLATIONS.en.journal_posts.find(p => p.slug === segments[1]);
        if (enPost) {
          const plPost = TRANSLATIONS.pl.journal_posts.find(p => p.id === enPost.id);
          if (plPost) {
            segments[1] = plPost.slug;
          }
        }
      }
    }
    
    return `${base}${segments.join('/')}`;
  } else {
    // Current page is Polish, target is English
    if (!cleanPath) {
      return `${base}en/`;
    }

    const segments = cleanPath.split('/');
    const firstSegment = segments[0];
    const entry = Object.entries(ROUTE_MAP).find(([_, langs]) => langs.pl === firstSegment);
    
    if (entry) {
      segments[0] = entry[1].en;
      
      // Dynamic route translations
      if (entry[0] === 'product' && segments[1]) {
        const prod = PRODUCTS.find(p => p.slugs.pl === segments[1]);
        if (prod) {
          segments[1] = prod.slugs.en;
        }
      } else if (entry[0] === 'journal' && segments[1]) {
        const plPost = TRANSLATIONS.pl.journal_posts.find(p => p.slug === segments[1]);
        if (plPost) {
          const enPost = TRANSLATIONS.en.journal_posts.find(p => p.id === plPost.id);
          if (enPost) {
            segments[1] = enPost.slug;
          }
        }
      }
    }
    
    return `${base}en/${segments.join('/')}`;
  }
}

export function useTranslations(lang: string | undefined) {
  const t = getTranslations(lang);
  return {
    t,
    l: (path: string) => getLocalizedPath(path, lang || 'pl')
  };
}
