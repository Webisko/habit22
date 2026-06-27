import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { User, X, MoveRight } from 'lucide-react';
import { motion } from 'motion/react';
import { navigate } from 'astro:transitions/client';
import { cartItems, cartCount, clearCart } from '../stores/cart';
import { isLoggedIn, logIn } from '../stores/auth';
import { PRODUCTS } from '../data/products';
import { useTranslations } from '../i18n/utils';

interface CheckoutFormProps {
  lang: string;
}

export default function CheckoutForm({ lang }: CheckoutFormProps) {
  const $cartItems = useStore(cartItems);
  const $cartCount = useStore(cartCount);
  const $isLoggedIn = useStore(isLoggedIn);
  const { t, l } = useTranslations(lang);

  const [isCompany, setIsCompany] = useState(false);
  const [createAccountChecked, setCreateAccountChecked] = useState(false);
  const [checkoutDelivery, setCheckoutDelivery] = useState('locker');
  const [checkoutPayment, setCheckoutPayment] = useState('blik');
  const [isCheckoutLoginOpen, setIsCheckoutLoginOpen] = useState(false);

  // Form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      logIn(email);
      setIsCheckoutLoginOpen(false);
    }
  };

  const handlePlaceOrder = () => {
    // Clear cart on successful order submission
    clearCart();
    // Redirect to the localized thank you page
    navigate(l('thankyou'));
  };

  return (
    <main className="flex-grow w-full min-h-screen pt-32 md:pt-48 lg:pt-28 pb-24 px-6 md:px-12 max-w-[1440px] mx-auto flex flex-col md:flex-row gap-12 md:gap-24 items-start relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full md:w-3/5 flex flex-col pt-0 md:pt-12"
      >
        <h1 className="text-3xl md:text-5xl font-serif text-[#2C2119] tracking-wider uppercase mb-16">
          {t.checkout}
        </h1>

        <form
          className="flex flex-col space-y-16 w-full"
          onSubmit={(e) => e.preventDefault()}
        >
          {!$isLoggedIn && (
            <div className="w-full flex flex-col border border-[#E6DCC9] p-6 md:p-8 bg-[#FAF7F2]">
              {!isCheckoutLoginOpen ? (
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <p className="text-base font-serif text-[#5C4E43]">
                    {t.checkout_login_prompt}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsCheckoutLoginOpen(true)}
                    className="text-sm font-semibold uppercase tracking-widest border-b border-[#2C2119] pb-1 hover:text-[#8C7C6D] transition-colors"
                  >
                    {t.checkout_login_link}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col w-full">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-[#2C2119]">
                      {t.login_btn}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsCheckoutLoginOpen(false)}
                      className="text-[#8C7C6D] hover:text-[#2C2119]"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <label className="text-sm uppercase tracking-widest text-[#8C7C6D] mb-2">
                        {t.login_email}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] font-serif"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm uppercase tracking-widest text-[#8C7C6D] mb-2">
                        {t.login_password}
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] font-serif"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleLoginSubmit}
                      className="w-full py-4 bg-[#2C2119] text-[#F3EDE3] text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#1A140F] transition-colors mt-6 flex items-center justify-center space-x-3 group relative overflow-hidden"
                    >
                      <span className="relative z-20">{t.login_btn}</span>
                      <User
                        size={16}
                        className="opacity-0 group-hover:opacity-100 transition-all duration-300 -ml-8 group-hover:ml-0 relative z-20"
                      />
                      <span className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Customer Details */}
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#E6DCC9] pb-4 gap-4">
              <h2 className="text-base font-semibold tracking-widest uppercase text-[#2C2119]">
                {t.checkout_details}
              </h2>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="buy-as-company"
                  checked={isCompany}
                  onChange={(e) => setIsCompany(e.target.checked)}
                  className="w-4 h-4 accent-[#2C2119] bg-transparent border-[#E6DCC9]"
                />
                <label
                  htmlFor="buy-as-company"
                  className="text-sm font-serif uppercase tracking-widest text-[#5C4E43] cursor-pointer selection:bg-transparent"
                >
                  {t.checkout_buy_as_company}
                </label>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-12 md:gap-y-8">
              {isCompany ? (
                <>
                  <div className="flex flex-col">
                    <label className="text-sm uppercase tracking-widest text-[#8C7C6D] mb-2">
                      {t.checkout_company_name}
                    </label>
                    <input
                      type="text"
                      className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] transition-colors font-serif"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm uppercase tracking-widest text-[#8C7C6D] mb-2">
                      {t.checkout_company_nip}
                    </label>
                    <input
                      type="text"
                      className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] transition-colors font-serif"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col">
                    <label className="text-sm uppercase tracking-widest text-[#8C7C6D] mb-2">
                      {t.checkout_first_name}
                    </label>
                    <input
                      type="text"
                      className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] transition-colors font-serif"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm uppercase tracking-widest text-[#8C7C6D] mb-2">
                      {t.checkout_last_name}
                    </label>
                    <input
                      type="text"
                      className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] transition-colors font-serif"
                    />
                  </div>
                </>
              )}
              <div className="flex flex-col">
                <label className="text-sm uppercase tracking-widest text-[#8C7C6D] mb-2">
                  {t.contact_email}
                </label>
                <input
                  type="email"
                  className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] transition-colors font-serif"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm uppercase tracking-widest text-[#8C7C6D] mb-2">
                  {t.checkout_phone}
                </label>
                <input
                  type="tel"
                  className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] transition-colors font-serif"
                />
              </div>
              <div className="flex flex-col md:col-span-2">
                <label className="text-sm uppercase tracking-widest text-[#8C7C6D] mb-2">
                  {t.checkout_street}
                </label>
                <input
                  type="text"
                  className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] transition-colors font-serif"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm uppercase tracking-widest text-[#8C7C6D] mb-2">
                  {t.checkout_city}
                </label>
                <input
                  type="text"
                  className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] transition-colors font-serif"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm uppercase tracking-widest text-[#8C7C6D] mb-2">
                  {t.checkout_zip}
                </label>
                <input
                  type="text"
                  className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] transition-colors font-serif"
                />
              </div>
            </div>
            {!$isLoggedIn && (
              <div className="flex flex-col space-y-3 pt-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="create-account"
                    className="w-4 h-4 accent-[#2C2119] bg-transparent border-[#E6DCC9]"
                    checked={createAccountChecked}
                    onChange={(e) => setCreateAccountChecked(e.target.checked)}
                  />
                  <label
                    htmlFor="create-account"
                    className="text-base font-serif text-[#5C4E43] cursor-pointer selection:bg-transparent"
                  >
                    {t.checkout_create_account}
                  </label>
                </div>
                {createAccountChecked && (
                  <p className="text-sm text-[#8C7C6D] leading-relaxed pl-7">
                    {t.checkout_register_info}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Delivery Options */}
          <div className="flex flex-col space-y-6">
            <h2 className="text-base font-semibold tracking-widest uppercase border-b border-[#E6DCC9] pb-4 text-[#2C2119]">
              {t.checkout_delivery}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setCheckoutDelivery('locker')}
                className={`border p-6 flex flex-col items-start gap-4 transition-colors ${
                  checkoutDelivery === 'locker' ? 'border-[#2C2119] bg-[#EBE2D3]' : 'border-[#E6DCC9] hover:bg-[#FAF7F2]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    checkoutDelivery === 'locker' ? 'border-[#2C2119]' : 'border-[#CBBFA8]'
                  }`}
                >
                  {checkoutDelivery === 'locker' && (
                    <div className="w-2 h-2 bg-[#2C2119] rounded-full" />
                  )}
                </div>
                <span className="text-sm font-semibold uppercase tracking-widest">
                  {t.checkout_method_locker}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setCheckoutDelivery('courier')}
                className={`border p-6 flex flex-col items-start gap-4 transition-colors ${
                  checkoutDelivery === 'courier' ? 'border-[#2C2119] bg-[#EBE2D3]' : 'border-[#E6DCC9] hover:bg-[#FAF7F2]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    checkoutDelivery === 'courier' ? 'border-[#2C2119]' : 'border-[#CBBFA8]'
                  }`}
                >
                  {checkoutDelivery === 'courier' && (
                    <div className="w-2 h-2 bg-[#2C2119] rounded-full" />
                  )}
                </div>
                <span className="text-sm font-semibold uppercase tracking-widest">
                  {t.checkout_method_courier}
                </span>
              </button>
            </div>
          </div>

          {/* Payment Options */}
          <div className="flex flex-col space-y-6">
            <h2 className="text-base font-semibold tracking-widest uppercase border-b border-[#E6DCC9] pb-4 text-[#2C2119]">
              {t.checkout_payment}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setCheckoutPayment('blik')}
                className={`border py-6 px-4 flex flex-col items-center justify-center text-center transition-colors ${
                  checkoutPayment === 'blik' ? 'border-[#2C2119] bg-[#EBE2D3]' : 'border-[#E6DCC9] hover:bg-[#FAF7F2]'
                }`}
              >
                <span className="text-sm font-semibold uppercase tracking-widest">
                  {t.checkout_payment_blik}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setCheckoutPayment('card')}
                className={`border py-6 px-4 flex flex-col items-center justify-center text-center transition-colors ${
                  checkoutPayment === 'card' ? 'border-[#2C2119] bg-[#EBE2D3]' : 'border-[#E6DCC9] hover:bg-[#FAF7F2]'
                }`}
              >
                <span className="text-sm font-semibold uppercase tracking-widest">
                  {t.checkout_payment_card}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setCheckoutPayment('transfer')}
                className={`border py-6 px-4 flex flex-col items-center justify-center text-center transition-colors ${
                  checkoutPayment === 'transfer' ? 'border-[#2C2119] bg-[#EBE2D3]' : 'border-[#E6DCC9] hover:bg-[#FAF7F2]'
                }`}
              >
                <span className="text-sm font-semibold uppercase tracking-widest leading-relaxed">
                  {t.checkout_payment_transfer}
                </span>
              </button>
            </div>
          </div>
        </form>
      </motion.div>

      {/* Order Summary (Right Sticky Panel) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full md:w-2/5 flex flex-col bg-[#EBE2D3] p-8 md:p-12 md:sticky md:top-32"
      >
        <h3 className="text-sm uppercase tracking-[0.2em] mb-8 font-semibold text-[#8C7C6D]">
          {t.cart}
        </h3>

        <div className="flex flex-col mb-8 border-b border-[#E6DCC9] pb-8 space-y-6 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
          {$cartItems.map((item) => {
            const [productId, sizeId] = item.id.split("|");
            const itemProduct = PRODUCTS.find((p) => p.id === productId);
            const itemSize = itemProduct?.sizes.find(
              (s) => s.id === sizeId,
            );
            if (!itemProduct || !itemSize) return null;
            return (
              <div key={item.id} className="flex items-center gap-6">
                <div className="w-24 h-32 bg-[#FAF7F2] overflow-hidden flex-shrink-0">
                  <img
                    src={itemProduct.images[0]}
                    alt="Habit22 Bag"
                    className="w-full h-full object-contain p-1 mix-blend-multiply opacity-90 grayscale-[10%]"
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <h4 className="font-serif text-[#2C2119] text-xl mb-2">
                    {t.product_section_title} - {itemProduct.design[lang === 'pl' ? 'pl' : 'en']}
                  </h4>
                  <p className="text-sm text-[#8C7C6D] mb-4">
                    {itemSize.name[lang === 'pl' ? 'pl' : 'en']}
                  </p>
                  <div className="flex justify-between items-center">
                    <p className="text-[#5C4E43] font-serif">
                      {t.product_price}
                    </p>
                    <span className="text-sm text-[#8C7C6D] uppercase font-semibold">
                      {lang === "pl" ? "Ilość" : "Qty"}: {item.quantity}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col space-y-4 mb-8 text-base">
          <div className="flex justify-between items-center text-[#5C4E43]">
            <span className="font-serif italic">
              {lang === "pl" ? "Suma" : "Subtotal"}
            </span>
            <span className="font-serif">
              {lang === "pl"
                ? `${350 * $cartCount},00 zł`
                : `€ ${(80 * $cartCount).toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between items-center text-[#5C4E43]">
            <span className="font-serif italic">{t.checkout_delivery}</span>
            <span className="font-serif text-sm uppercase tracking-widest">
              0,00
            </span>
          </div>
          <div className="flex justify-between items-center font-serif text-xl border-t border-[#E6DCC9] pt-6 mt-2 text-[#2C2119]">
            <span>{t.order_total}</span>
            <span>
              {lang === "pl"
                ? `${350 * $cartCount},00 zł`
                : `€ ${(80 * $cartCount).toFixed(2)}`}
            </span>
          </div>
        </div>
        <button
          onClick={handlePlaceOrder}
          disabled={$cartCount === 0}
          className="w-full py-5 bg-[#2C2119] text-[#F3EDE3] text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#1A140F] transition-colors mt-auto flex items-center justify-center space-x-3 group relative overflow-hidden disabled:opacity-50 disabled:pointer-events-none"
        >
          <span className="relative z-20">{t.checkout_submit}</span>
          <MoveRight
            size={16}
            className="opacity-0 group-hover:opacity-100 transition-all duration-300 -ml-8 group-hover:ml-0 relative z-20"
          />
          <span className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
        </button>
      </motion.div>
    </main>
  );
}
