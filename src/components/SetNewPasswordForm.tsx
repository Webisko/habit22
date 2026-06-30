import React, { useState } from 'react';
import { Lock, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from '../i18n/utils';

interface SetNewPasswordFormProps {
  lang: string;
}

export default function SetNewPasswordForm({ lang }: SetNewPasswordFormProps) {
  const { t, l } = useTranslations(lang);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t.passwords_dont_match);
      return;
    }

    // Wykonaj atrapę akcji zapisu hasła
    setIsSuccess(true);
  };

  return (
    <main className="flex-grow w-full min-h-screen pt-32 md:pt-40 lg:pt-44 pb-24 px-6 md:px-12 max-w-[1440px] mx-auto flex flex-col items-center justify-center relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md flex flex-col items-center bg-[#FAF7F2] p-8 md:p-12 border border-[#E6DCC9]"
      >
        <h1 className="text-2xl md:text-3xl font-serif text-[#2C2119] tracking-wider uppercase mb-12 text-center">
          {t.set_new_password_title}
        </h1>

        {isSuccess ? (
          <div className="w-full flex flex-col items-center text-center space-y-6">
            <div className="text-[#2C2119]">
              <CheckCircle size={48} className="stroke-1" />
            </div>
            <p className="text-[#5C4E43] font-serif text-lg leading-relaxed">
              {t.set_new_password_success_msg}
            </p>
            <a
              href={l('login')}
              className="w-full py-5 bg-[#2C2119] text-[#F3EDE3] text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#1A140F] transition-colors mt-8 flex items-center justify-center"
            >
              {t.login_btn}
            </a>
          </div>
        ) : (
          <form className="w-full flex flex-col space-y-8" onSubmit={handleSubmit}>
            {error && (
              <div className="text-sm font-semibold text-red-700 bg-red-50 border border-red-200 p-4 text-center">
                {error}
              </div>
            )}
            
            <div className="flex flex-col">
              <label className="text-sm uppercase tracking-widest text-[#8C7C6D] mb-2">
                {t.account_new_password}
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

            <div className="flex flex-col">
              <label className="text-sm uppercase tracking-widest text-[#8C7C6D] mb-2">
                {t.confirm_new_password}
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] transition-colors font-serif"
              />
            </div>

            <button className="w-full py-5 bg-[#2C2119] text-[#F3EDE3] text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#1A140F] transition-colors mt-4 flex items-center justify-center space-x-3 group relative overflow-hidden">
              <span className="relative z-20 transition-transform duration-300 translate-x-[14px] group-hover:translate-x-0">
                {t.account_save_password}
              </span>
              <Lock
                size={16}
                className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[14px] group-hover:translate-x-0 relative z-20"
              />
              <span className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
            </button>
          </form>
        )}
      </motion.div>
    </main>
  );
}
