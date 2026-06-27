import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { navigate } from 'astro:transitions/client';
import { isLoggedIn, userProfile, logOut, updateProfile } from '../stores/auth';
import { useTranslations } from '../i18n/utils';

interface AccountDetailsProps {
  lang: string;
}

export default function AccountDetails({ lang }: AccountDetailsProps) {
  const $isLoggedIn = useStore(isLoggedIn);
  const $userProfile = useStore(userProfile);
  const { t, l } = useTranslations(lang);

  const [viewingOrder, setViewingOrder] = useState(false);
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  // Form states
  const [firstName, setFirstName] = useState($userProfile.firstName);
  const [lastName, setLastName] = useState($userProfile.lastName);
  const [email, setEmail] = useState($userProfile.email);
  const [phone, setPhone] = useState($userProfile.phone);
  const [street, setStreet] = useState($userProfile.street);
  const [city, setCity] = useState($userProfile.city);
  const [zip, setZip] = useState($userProfile.zip);
  const [companyName, setCompanyName] = useState($userProfile.companyName || '');
  const [companyNip, setCompanyNip] = useState($userProfile.companyNip || '');

  useEffect(() => {
    if (!$isLoggedIn) {
      navigate(l('login'));
    }
  }, [$isLoggedIn]);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      firstName,
      lastName,
      email,
      phone,
      street,
      city,
      zip,
      companyName,
      companyNip,
    });
    setIsEditingAccount(false);
  };

  const handleLogoutClick = () => {
    logOut();
    // Redirect to home page
    navigate(l(''));
  };

  return (
    <main className="flex-grow w-full min-h-screen pt-32 md:pt-48 lg:pt-28 pb-24 px-6 md:px-12 max-w-[1440px] mx-auto flex flex-col relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b border-[#E6DCC9] pb-8 gap-8">
          <h1 className="text-3xl md:text-5xl font-serif text-[#2C2119] tracking-wider uppercase">
            {t.account_title}
          </h1>
          <button
            onClick={handleLogoutClick}
            className="text-sm uppercase tracking-widest text-[#8C7C6D] hover:text-[#2C2119] border-b border-transparent hover:border-[#2C2119] pb-1 transition-colors"
          >
            {t.logout}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Order History column */}
          <div className="md:col-span-2 flex flex-col">
            <h2 className="text-sm uppercase tracking-widest text-[#8C7C6D] mb-8">
              {viewingOrder ? t.order_details : t.account_orders}
            </h2>
            {viewingOrder ? (
              <div className="flex flex-col border border-[#E6DCC9] p-8 bg-[#FAF7F2]">
                <button
                  onClick={() => setViewingOrder(false)}
                  className="self-start text-sm uppercase tracking-widest text-[#8C7C6D] border-b border-transparent hover:text-[#2C2119] hover:border-[#2C2119] pb-1 transition-all mb-8 flex items-center space-x-2"
                >
                  <ChevronLeft size={12} />
                  <span>{t.order_back}</span>
                </button>
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-lg font-serif text-[#2C2119]">
                    {t.order_str} #230894
                  </h3>
                  <span className="text-xs uppercase tracking-widest bg-[#EBE2D3] px-3 py-1 text-[#2C2119] border border-[#E6DCC9]">
                    {t.status_processing}
                  </span>
                </div>
                <p className="text-sm font-serif text-[#5C4E43] mb-8">
                  {t.order_date_str}
                </p>
                <div className="flex flex-col space-y-4 border-t border-[#E6DCC9] pt-6">
                  <div className="flex justify-between items-center text-base font-serif text-[#2C2119]">
                    <div className="flex items-center space-x-4">
                      <img
                        src={`${import.meta.env.BASE_URL || '/habit22/'}produkt__1-2.webp`}
                        className="w-12 h-16 object-cover bg-[#EBE2D3]"
                        alt=""
                      />
                      <span>Torba Projektowa - Kratka Vichy x 1</span>
                    </div>
                    <span>{lang === 'pl' ? '350,00 zł' : '€ 80.00'}</span>
                  </div>
                  <div className="flex justify-between items-center text-base font-serif text-[#2C2119] font-bold border-t border-[#E6DCC9] pt-4">
                    <span className="text-xs tracking-widest uppercase font-semibold">
                      {t.order_total}
                    </span>
                    <span>{lang === 'pl' ? '350,00 zł' : '€ 80.00'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-4">
                <div
                  onClick={() => setViewingOrder(true)}
                  className="flex justify-between items-center border border-[#E6DCC9] p-6 bg-[#FAF7F2] hover:bg-[#F3EDE3] transition-colors cursor-pointer group"
                >
                  <div className="flex flex-col">
                    <span className="text-base font-serif text-[#2C2119] font-medium mb-1">
                      {t.order_str} #230894
                    </span>
                    <span className="text-sm font-serif text-[#5C4E43]">
                      {t.order_date_short} • {lang === 'pl' ? '350,00 zł' : '€ 80.00'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-xs uppercase tracking-widest text-[#8C7C6D] hidden md:inline-block">
                      {t.status_processing}
                    </span>
                    <ChevronRight
                      size={16}
                      className="text-[#8C7C6D] group-hover:text-[#2C2119] transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Account details column */}
          <div className="flex flex-col">
            <h2 className="text-sm uppercase tracking-widest text-[#8C7C6D] mb-8">
              {t.account_details}
            </h2>

            {!isEditingAccount ? (
              <div className="flex flex-col space-y-6 text-[#2C2119] font-serif border border-[#E6DCC9] p-8 bg-[#FAF7F2]">
                <div>
                  <p className="font-semibold text-lg">{$userProfile.firstName} {$userProfile.lastName}</p>
                  <p className="text-base text-[#5C4E43]">
                    {$userProfile.email}
                  </p>
                </div>
                <div className="text-base space-y-1 text-[#5C4E43]">
                  <p>{$userProfile.phone}</p>
                  <p>{$userProfile.street}</p>
                  <p>{$userProfile.zip} {$userProfile.city}</p>
                </div>
                {$userProfile.companyName && (
                  <div className="text-base space-y-1 text-[#5C4E43] pt-4 border-t border-[#E6DCC9]">
                    <p className="font-semibold text-[#2C2119]">
                      {$userProfile.companyName}
                    </p>
                    <p>NIP: {$userProfile.companyNip}</p>
                  </div>
                )}
                <button
                  onClick={() => setIsEditingAccount(true)}
                  className="self-start text-sm uppercase tracking-widest font-semibold border-b border-[#2C2119] pb-1 hover:text-[#8C7C6D] hover:border-[#8C7C6D] mt-4 transition-colors"
                >
                  {t.account_edit_details}
                </button>
              </div>
            ) : (
              <form
                className="flex flex-col space-y-6 border border-[#E6DCC9] p-8 bg-[#FAF7F2]"
                onSubmit={handleProfileSubmit}
              >
                <div className="flex flex-col space-y-4">
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-1/2 bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] font-serif"
                      placeholder={t.checkout_first_name}
                    />
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-1/2 bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] font-serif"
                      placeholder={t.checkout_last_name}
                    />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] font-serif"
                    placeholder="E-mail"
                  />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] font-serif"
                    placeholder={t.checkout_phone}
                  />
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] font-serif"
                    placeholder={t.checkout_street}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] font-serif"
                      placeholder={t.checkout_zip}
                    />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] font-serif"
                      placeholder={t.checkout_city}
                    />
                  </div>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] font-serif"
                    placeholder={t.checkout_company_name}
                  />
                  <input
                    type="text"
                    value={companyNip}
                    onChange={(e) => setCompanyNip(e.target.value)}
                    className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] font-serif"
                    placeholder={t.checkout_company_nip}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-[#2C2119] text-[#F3EDE3] text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#3A2D23] transition-colors"
                >
                  {t.account_save_details}
                </button>
              </form>
            )}

            {!isEditingPassword ? (
              <button
                onClick={() => setIsEditingPassword(true)}
                className="self-start text-sm uppercase tracking-widest font-semibold text-[#8C7C6D] border-b border-transparent hover:border-[#8C7C6D] hover:text-[#2C2119] mt-8 transition-colors"
              >
                {t.account_change_password}
              </button>
            ) : (
              <form
                className="flex flex-col space-y-4 border border-[#E6DCC9] p-8 bg-[#FAF7F2] mt-8"
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsEditingPassword(false);
                }}
              >
                <input
                  type="password"
                  required
                  minLength={6}
                  className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] font-serif"
                  placeholder={t.account_new_password}
                />
                <button
                  type="submit"
                  className="w-full py-4 bg-[#2C2119] text-[#F3EDE3] text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#3A2D23] transition-colors"
                >
                  {t.account_save_password}
                </button>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </main>
  );
}
