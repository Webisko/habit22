import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { User, Mail } from 'lucide-react';
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
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isResetSuccess, setIsResetSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if ($isLoggedIn) {
      navigate(l('account'));
    }
  }, [$isLoggedIn]);

  // Reset fields and errors when switching views
  useEffect(() => {
    setError('');
    setPassword('');
    setConfirmPassword('');
  }, [isRegistering, isResettingPassword]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegistering) {
      if (password !== confirmPassword) {
        setError(t.passwords_dont_match);
        return;
      }
      setIsRegistrationSuccess(true);
    } else {
      logIn(email);
      // Redirect to account dashboard
      navigate(l('account'));
    }
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetSuccess(true);
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
          {isResettingPassword
            ? t.reset_password_title
            : isRegistering
            ? t.register_btn
            : t.login_btn}
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
        ) : isResettingPassword ? (
          isResetSuccess ? (
            <div className="w-full flex flex-col items-center text-center space-y-6">
              <p className="text-[#5C4E43] font-serif text-lg leading-relaxed">
                {t.reset_password_success_msg}
              </p>
              <button
                onClick={() => {
                  setIsResetSuccess(false);
                  setIsResettingPassword(false);
                }}
                className="w-full py-5 bg-[#2C2119] text-[#F3EDE3] text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#1A140F] transition-colors mt-8 flex items-center justify-center"
              >
                {t.login_btn}
              </button>
            </div>
          ) : (
            <form className="w-full flex flex-col space-y-8" onSubmit={handleResetSubmit}>
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
              <button className="w-full py-5 bg-[#2C2119] text-[#F3EDE3] text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#1A140F] transition-colors mt-4 flex items-center justify-center space-x-3 group relative overflow-hidden">
                <span className="relative z-20 transition-transform duration-300 translate-x-[14px] group-hover:translate-x-0">
                  {t.reset_password_btn}
                </span>
                <Mail
                  size={16}
                  className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[14px] group-hover:translate-x-0 relative z-20"
                />
                <span className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
              </button>
              <div className="text-center mt-6">
                <button
                  type="button"
                  onClick={() => setIsResettingPassword(false)}
                  className="text-xs uppercase tracking-widest text-[#8C7C6D] hover:text-[#2C2119] border-b border-transparent hover:border-[#2C2119] transition-colors pb-0.5"
                >
                  {t.login_btn}
                </button>
              </div>
            </form>
          )
        ) : (
          <>
            <form className="w-full flex flex-col space-y-8" onSubmit={handleSubmit}>
              {error && (
                <div className="text-sm font-semibold text-red-700 bg-red-50 border border-red-200 p-4 text-center">
                  {error}
                </div>
              )}
              
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

              {isRegistering && (
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
              )}

              {!isRegistering && (
                <div className="flex items-center justify-between text-xs tracking-widest uppercase mt-2">
                  <label className="flex items-center space-x-2 cursor-pointer text-[#8C7C6D] hover:text-[#2C2119] transition-colors select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 accent-[#2C2119] border-[#E6DCC9] rounded-none focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                    <span>{t.remember_me}</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsResettingPassword(true)}
                    className="text-[#8C7C6D] hover:text-[#2C2119] border-b border-transparent hover:border-[#2C2119] transition-colors pb-0.5"
                  >
                    {t.forgot_password_link}
                  </button>
                </div>
              )}

              <button className="w-full py-5 bg-[#2C2119] text-[#F3EDE3] text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#1A140F] transition-colors mt-4 flex items-center justify-center space-x-3 group relative overflow-hidden">
                <span className="relative z-20 transition-transform duration-300 translate-x-[14px] group-hover:translate-x-0">
                  {isRegistering ? t.register_btn : t.login_btn}
                </span>
                <User
                  size={16}
                  className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[14px] group-hover:translate-x-0 relative z-20"
                />
                <span className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
              </button>
            </form>

            <div className="w-full border-t border-[#E6DCC9] mt-10 pt-8 flex flex-col items-center">
              <p className="text-xs uppercase tracking-widest text-[#8C7C6D] mb-4">
                {isRegistering ? t.have_account_prompt : t.no_account_prompt}
              </p>
              <button
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                className="w-full py-5 border border-[#2C2119] text-[#2C2119] text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#2C2119] hover:text-[#F3EDE3] transition-colors flex items-center justify-center"
              >
                {isRegistering ? t.login_btn : t.register_btn}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </main>
  );
}
