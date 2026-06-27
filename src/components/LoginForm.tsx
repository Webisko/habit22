import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { User } from 'lucide-react';
import { motion } from 'motion/react';
import { navigate } from 'astro:transitions/client';
import { isLoggedIn, logIn } from '../stores/auth';
import { useTranslations } from '../i18n/utils';

interface LoginFormProps {
  lang: string;
}

export default function LoginForm({ lang }: LoginFormProps) {
  const $isLoggedIn = useStore(isLoggedIn);
  const { t, l } = useTranslations(lang);

  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistrationSuccess, setIsRegistrationSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if ($isLoggedIn) {
      navigate(l('account'));
    }
  }, [$isLoggedIn]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering) {
      setIsRegistrationSuccess(true);
    } else {
      logIn(email);
      // Redirect to account dashboard
      navigate(l('account'));
    }
  };

  return (
    <main className="flex-grow w-full min-h-screen pt-32 md:pt-48 lg:pt-28 pb-24 px-6 md:px-12 max-w-[1440px] mx-auto flex flex-col items-center justify-center relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md flex flex-col items-center bg-[#FAF7F2] p-8 md:p-12 border border-[#E6DCC9]"
      >
        <h1 className="text-2xl md:text-3xl font-serif text-[#2C2119] tracking-wider uppercase mb-12 text-center">
          {isRegistering ? t.register_btn : t.login_btn}
        </h1>

        {isRegistrationSuccess ? (
          <div className="w-full flex flex-col items-center text-center space-y-6">
            <p className="text-[#5C4E43] font-serif text-lg leading-relaxed">
              {t.register_verify_msg}
            </p>
            <button
              onClick={() => {
                setIsRegistrationSuccess(false);
                setIsRegistering(false);
              }}
              className="border-b border-[#2C2119] pb-1 text-sm font-semibold tracking-widest uppercase hover:text-[#8C7C6D] transition-colors mt-8"
            >
              {t.login_btn}
            </button>
          </div>
        ) : (
          <form className="w-full flex flex-col space-y-8" onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <label className="text-sm uppercase tracking-widest text-[#8C7C6D] mb-2">
                {t.login_email}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] transition-colors font-serif"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm uppercase tracking-widest text-[#8C7C6D] mb-2">
                {t.login_password}
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] transition-colors font-serif"
              />
            </div>
            <button className="w-full py-5 bg-[#2C2119] text-[#F3EDE3] text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#1A140F] transition-colors mt-4 flex items-center justify-center space-x-3 group relative overflow-hidden">
              <span className="relative z-20">
                {isRegistering ? t.register_btn : t.login_btn}
              </span>
              <User
                size={16}
                className="opacity-0 group-hover:opacity-100 transition-all duration-300 -ml-8 group-hover:ml-0 relative z-20"
              />
              <span className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
            </button>
          </form>
        )}

        {!isRegistrationSuccess && (
          <div className="mt-8 text-sm tracking-widest uppercase text-[#8C7C6D]">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="hover:text-[#2C2119] border-b border-transparent hover:border-[#2C2119] transition-all pb-1"
            >
              {isRegistering ? t.login_btn : t.register_btn}
            </button>
          </div>
        )}
      </motion.div>
    </main>
  );
}
