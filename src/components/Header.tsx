import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { Menu, ShoppingBag, Globe, User, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { isMenuOpen, isCartOpen, cartCount } from '../stores/cart';
import { isLoggedIn } from '../stores/auth';
import { useTranslations } from '../i18n/utils';

interface HeaderProps {
  lang: string;
}

export default function Header({ lang }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const $isMenuOpen = useStore(isMenuOpen);
  const $isCartOpen = useStore(isCartOpen);
  const $cartCount = useStore(cartCount);
  const $isLoggedIn = useStore(isLoggedIn);
  const { t, l } = useTranslations(lang);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if ($isMenuOpen || $isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [$isMenuOpen, $isCartOpen]);

  // Handler to toggle language URL prefix
  const toggleLanguage = () => {
    const base = import.meta.env.BASE_URL || '/'; // e.g. "/habit22/"
    const currentPath = window.location.pathname; // e.g. "/habit22/en/about"
    
    let newPath = '';
    const enPrefix = `${base}en/`; // e.g. "/habit22/en/"
    
    if (currentPath.startsWith(enPrefix)) {
      // Toggle to PL: remove "en/" prefix
      newPath = base + currentPath.slice(enPrefix.length);
    } else if (currentPath.startsWith(base)) {
      // Toggle to EN: insert "en/" prefix
      newPath = base + 'en/' + currentPath.slice(base.length);
    } else {
      // Fallback
      newPath = lang === 'pl' ? `${base}en/` : base;
    }
    
    window.location.href = newPath;
  };

  const handleNewsletterClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    isMenuOpen.set(false);

    const currentPath = window.location.pathname;
    const base = import.meta.env.BASE_URL || '/';
    
    // Normalize paths to compare
    const normalize = (p: string) => p.replace(/\/$/, '') || '/';
    
    const isPlHome = normalize(currentPath) === normalize(base);
    const isEnHome = normalize(currentPath) === normalize(`${base}en/`);

    if (isPlHome || isEnHome) {
      e.preventDefault();
      
      const targetHash = '#newsletter';
      const newUrl = isPlHome ? `${base}${targetHash}` : `${base}en/${targetHash}`;
      window.history.pushState(null, '', newUrl);

      const el = document.getElementById('newsletter');
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 w-full ${
          isScrolled
            ? 'bg-[#FAF7F2]/90 backdrop-blur-md py-4 shadow-sm'
            : 'bg-transparent py-4 md:py-8'
        }`}
      >
        <div className="px-6 md:px-12 flex items-center justify-between">
          <div className="flex-1 flex space-x-6 items-center">
            <button
              onClick={() => isMenuOpen.set(true)}
              className="group flex items-center space-x-2 text-sm font-normal tracking-[0.2em] uppercase hover:text-[#8C7C6D] transition-colors"
              aria-label="Open menu"
            >
              <Menu size={18} strokeWidth={1.5} />
              <span className="hidden sm:inline-block">{t.menu}</span>
            </button>
            <button
              onClick={toggleLanguage}
              className="group hidden sm:flex items-center space-x-2 text-sm font-normal tracking-widest hover:text-[#8C7C6D] transition-colors"
            >
              <Globe size={18} strokeWidth={1.5} />
              <span>{t.lang_switch}</span>
            </button>
          </div>

          <div className="flex-1 text-center">
            <a
              href={l('')}
              className="text-xl md:text-3xl font-serif tracking-widest uppercase font-semibold transition-colors text-[#2C2119]"
            >
              Habit22
            </a>
          </div>

          <div className="flex-1 flex justify-end space-x-6 items-center">
            <a
              href={$isLoggedIn ? l('account') : l('login')}
              className="group hidden sm:flex items-center space-x-2 text-sm font-normal tracking-[0.2em] uppercase hover:text-[#8C7C6D] transition-colors"
            >
              <User size={18} strokeWidth={1.5} />
            </a>
            <button
              onClick={() => isCartOpen.set(true)}
              className="group flex items-center space-x-1.5 text-sm font-normal tracking-[0.2em] uppercase hover:text-[#8C7C6D] transition-colors"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              <span>({$cartCount})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out mobile menu overlay with exact motion transitions */}
      <AnimatePresence>
        {$isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex"
          >
            <div
              className="absolute inset-0 bg-[#2C2119]/40 backdrop-blur-sm cursor-pointer"
              onClick={() => isMenuOpen.set(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "tween",
                duration: 0.5,
                ease: [0.25, 1, 0.5, 1],
              }}
              className="relative w-full max-w-sm bg-[#FAF7F2] h-full shadow-2xl flex flex-col p-6 md:p-12 overflow-y-auto justify-between"
            >
              <div className="flex justify-start">
                <button
                  onClick={() => isMenuOpen.set(false)}
                  className="text-[#8C7C6D] hover:text-[#2C2119] transition-colors focus:outline-none"
                >
                  <X size={28} strokeWidth={1} />
                </button>
              </div>

              <div className="flex-1 flex flex-col justify-center my-auto py-4 md:py-8 space-y-6 md:space-y-12">
                <nav className="flex flex-col items-center md:items-start space-y-5 md:space-y-8 font-serif text-3xl md:text-4xl text-[#2C2119] uppercase text-center md:text-left">
                  <a
                    href={l('shop')}
                    onClick={() => isMenuOpen.set(false)}
                    className="hover:text-[#8C7C6D] transition-colors"
                  >
                    {t.shop}
                  </a>
                  <a
                    href={l('about')}
                    onClick={() => isMenuOpen.set(false)}
                    className="hover:text-[#8C7C6D] transition-colors"
                  >
                    {t.about}
                  </a>
                  <a
                    href={l('journal')}
                    onClick={() => isMenuOpen.set(false)}
                    className="hover:text-[#8C7C6D] transition-colors"
                  >
                    {t.journal}
                  </a>
                  <a
                    href={l('faq')}
                    onClick={() => isMenuOpen.set(false)}
                    className="hover:text-[#8C7C6D] transition-colors"
                  >
                    {t.faq}
                  </a>
                  <a
                    href={l('contact')}
                    onClick={() => isMenuOpen.set(false)}
                    className="hover:text-[#8C7C6D] transition-colors"
                  >
                    {t.contact}
                  </a>
                </nav>

                <div className="pt-8 border-t border-[#E6DCC9] text-sm uppercase tracking-[0.2em] text-[#8C7C6D] space-y-4 flex flex-col items-center md:items-start text-center md:text-left">
                  <a
                    href={l('#newsletter')}
                    onClick={handleNewsletterClick}
                    className="hover:text-[#2C2119] cursor-pointer block"
                  >
                    {t.newsletter}
                  </a>
                  <p className="hover:text-[#2C2119] cursor-pointer block">
                    Instagram
                  </p>

                  {/* Mobile-only Account and Language switcher (just icons side-by-side) */}
                  <div className="flex items-center justify-center sm:justify-start space-x-6 pt-4 sm:hidden">
                    <a
                      href={$isLoggedIn ? l('account') : l('login')}
                      onClick={() => isMenuOpen.set(false)}
                      className="hover:text-[#2C2119] text-[#8C7C6D] transition-colors focus:outline-none"
                      aria-label="Account"
                    >
                      <User size={20} strokeWidth={1.5} />
                    </a>
                    <button
                      onClick={() => {
                        isMenuOpen.set(false);
                        toggleLanguage();
                      }}
                      className="flex items-center space-x-2 hover:text-[#2C2119] text-[#8C7C6D] transition-colors focus:outline-none"
                      aria-label="Toggle language"
                    >
                      <Globe size={20} strokeWidth={1.5} />
                      <span className="text-sm font-normal tracking-widest">{t.lang_switch}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Empty div to visually balance the close button at the top */}
              <div className="h-8 w-full shrink-0 hidden sm:block" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
