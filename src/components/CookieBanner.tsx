import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslations } from '../i18n/utils';

interface CookieBannerProps {
  lang: string;
}

export default function CookieBanner({ lang }: CookieBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { t, l } = useTranslations(lang);

  useEffect(() => {
    // Sprawdzamy localStorage na kliencie
    const consent = localStorage.getItem('habit22_cookie_consent');
    if (!consent) {
      // Pokazujemy baner z lekkim opóźnieniem dla lepszego efektu
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('habit22_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('habit22_cookie_consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2] border-t border-[#E6DCC9] shadow-[0_-8px_30px_rgb(44,33,25,0.04)] px-6 py-6 md:py-8"
        >
          <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm text-[#5C4E43] font-serif leading-relaxed text-center md:text-left max-w-3xl">
              {t.cookie_consent_text}{' '}
              <a
                href={l('privacy')}
                className="underline hover:text-[#2C2119] transition-colors"
              >
                {t.privacy.toLowerCase()}
              </a>
              .
            </p>
            <div className="flex items-center space-x-4 w-full md:w-auto shrink-0 justify-center">
              <button
                onClick={handleDecline}
                className="text-xs uppercase tracking-widest text-[#8C7C6D] hover:text-[#2C2119] py-3 px-4 transition-colors"
              >
                {t.cookie_decline}
              </button>
              <button
                onClick={handleAccept}
                className="bg-[#2C2119] text-[#F3EDE3] py-3 px-8 text-xs font-semibold uppercase tracking-widest hover:bg-[#1A140F] transition-colors shrink-0"
              >
                {t.cookie_accept}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
