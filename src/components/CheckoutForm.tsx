import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { User, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { navigate } from 'astro:transitions/client';
import { cartItems, cartCount, clearCart } from '../stores/cart';
import { isLoggedIn, logIn } from '../stores/auth';
import { formatPrice } from '../stores/currency';
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

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [showTopShadow, setShowTopShadow] = React.useState(false);
  const [showBottomShadow, setShowBottomShadow] = React.useState(false);

  const checkScroll = React.useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const hasScroll = el.scrollHeight > el.clientHeight;
    setShowTopShadow(hasScroll && el.scrollTop > 5);
    setShowBottomShadow(hasScroll && el.scrollTop + el.clientHeight < el.scrollHeight - 5);
  }, []);

  React.useEffect(() => {
    checkScroll();

    const resizeObserver = new ResizeObserver(() => {
      checkScroll();
    });

    const el = containerRef.current;
    if (el) {
      resizeObserver.observe(el);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [$cartItems, checkScroll]);

  const [isCompany, setIsCompany] = useState(false);
  const [createAccountChecked, setCreateAccountChecked] = useState(false);
  const [checkoutDelivery, setCheckoutDelivery] = useState('');
  const [checkoutPayment, setCheckoutPayment] = useState('');
  const [isCheckoutLoginOpen, setIsCheckoutLoginOpen] = useState(false);

  // Form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Customer address details inputs
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [nip, setNip] = useState('');
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');

  // Shipping address details inputs
  const [shipToDifferent, setShipToDifferent] = useState(false);
  const [shippingFirstName, setShippingFirstName] = useState('');
  const [shippingLastName, setShippingLastName] = useState('');
  const [shippingStreet, setShippingStreet] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingZip, setShippingZip] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      logIn(email);
      setIsCheckoutLoginOpen(false);
    }
  };

  const handlePlaceOrder = () => {
    // Generate a random order number
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `#H22-${randomNum}`;

    const orderDate = new Date().toLocaleDateString(lang === 'pl' ? 'pl-PL' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const itemsDetails = $cartItems.map((item) => {
      const [productId, sizeId] = item.id.split('|');
      const product = PRODUCTS.find((p) => p.id === productId);
      const size = product?.sizes.find((s) => s.id === sizeId);
      return {
        id: item.id,
        productId,
        sizeId,
        title: product ? product.title[lang === 'pl' ? 'pl' : 'en'] : '',
        design: product ? product.design[lang === 'pl' ? 'pl' : 'en'] : '',
        image: product ? product.images[0] : '',
        sizeName: size ? size.name[lang === 'pl' ? 'pl' : 'en'] : '',
        quantity: item.quantity,
        price: product ? product.price : 0
      };
    });

    // Store details for thank you page
    const orderDetails = {
      orderNumber,
      date: orderDate,
      delivery: checkoutDelivery,
      name: isCompany ? companyName : `${firstName} ${lastName}`,
      nip: isCompany ? nip : '',
      street,
      city,
      zip,
      phone,
      email: checkoutEmail,
      payment: checkoutPayment,
      total: total,
      items: itemsDetails,
      shipToDifferent,
      shippingName: `${shippingFirstName} ${shippingLastName}`,
      shippingStreet,
      shippingCity,
      shippingZip,
      shippingPhone,
    };
    sessionStorage.setItem('last_order_details', JSON.stringify(orderDetails));

    // Save to localStorage list of orders
    try {
      const existing = JSON.parse(localStorage.getItem('habit22_orders') || '[]');
      localStorage.setItem('habit22_orders', JSON.stringify([orderDetails, ...existing]));
    } catch (e) {
      console.error('Failed to save order to localStorage', e);
    }

    // Clear cart on successful order submission
    clearCart();
    // Redirect to the localized thank you page
    navigate(l('thankyou'));
  };

  const getDeliveryCost = () => {
    if (checkoutDelivery === 'locker') return 15;
    if (checkoutDelivery === 'courier') return 20;
    return 0;
  };

  const calculateSubtotal = () => {
    return $cartItems.reduce((acc, item) => {
      const [productId] = item.id.split('|');
      const product = PRODUCTS.find((p) => p.id === productId);
      if (!product) return acc;
      return acc + product.price * item.quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const delivery = getDeliveryCost();
  const total = subtotal + delivery;

  return (
    <main className="flex-grow w-full min-h-screen pt-32 md:pt-40 lg:pt-44 pb-24 px-6 md:px-12 max-w-[1440px] mx-auto grid grid-cols-1 min-[1025px]:grid-cols-[3fr_2fr] gap-12 min-[1025px]:gap-24 items-start relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full flex flex-col"
      >
        <h1 className="text-3xl md:text-5xl font-serif text-[#2C2119] tracking-wider uppercase mb-16">
          {t.checkout}
        </h1>

        <form
          className="flex flex-col space-y-16 w-full"
          onSubmit={(e) => e.preventDefault()}
        >
          {!$isLoggedIn && (
            <div className="flex flex-col w-full">
              <AnimatePresence>
                {!createAccountChecked && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                    animate={{ height: 'auto', opacity: 1, marginBottom: 64 }}
                    exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="w-full overflow-hidden"
                  >
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
                              <span className="relative z-20 transition-transform duration-300 translate-x-[14px] group-hover:translate-x-0">{t.login_btn}</span>
                              <User
                                size={16}
                                className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[14px] group-hover:translate-x-0 relative z-20"
                              />
                              <span className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="create-account"
                    className="w-5 h-5 accent-[#2C2119] bg-transparent border-[#E6DCC9]"
                    checked={createAccountChecked}
                    onChange={(e) => setCreateAccountChecked(e.target.checked)}
                  />
                  <label
                    htmlFor="create-account"
                    className="text-base font-serif font-medium text-[#5C4E43] cursor-pointer selection:bg-transparent"
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
                  className="w-5 h-5 accent-[#2C2119] bg-transparent border-[#E6DCC9]"
                />
                <label
                  htmlFor="buy-as-company"
                  className="text-base font-serif font-medium text-[#5C4E43] cursor-pointer selection:bg-transparent"
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
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] transition-colors font-serif"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm uppercase tracking-widest text-[#8C7C6D] mb-2">
                      {t.checkout_company_nip}
                    </label>
                    <input
                      type="text"
                      value={nip}
                      onChange={(e) => setNip(e.target.value)}
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
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] transition-colors font-serif"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm uppercase tracking-widest text-[#8C7C6D] mb-2">
                      {t.checkout_last_name}
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
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
                  value={checkoutEmail}
                  onChange={(e) => setCheckoutEmail(e.target.value)}
                  className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] transition-colors font-serif"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm uppercase tracking-widest text-[#8C7C6D] mb-2">
                  {t.checkout_phone}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] transition-colors font-serif"
                />
              </div>
              <div className="flex flex-col md:col-span-2">
                <label className="text-sm uppercase tracking-widest text-[#8C7C6D] mb-2">
                  {t.checkout_street}
                </label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] transition-colors font-serif"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm uppercase tracking-widest text-[#8C7C6D] mb-2">
                  {t.checkout_city}
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] transition-colors font-serif"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm uppercase tracking-widest text-[#8C7C6D] mb-2">
                  {t.checkout_zip}
                </label>
                <input
                  type="text"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] transition-colors font-serif"
                />
              </div>
            </div>
            <div className="flex flex-col space-y-3 pt-6">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="ship-to-different"
                  className="w-5 h-5 accent-[#2C2119] bg-transparent border-[#E6DCC9]"
                  checked={shipToDifferent}
                  onChange={(e) => setShipToDifferent(e.target.checked)}
                />
                <label
                  htmlFor="ship-to-different"
                  className="text-base font-serif font-medium text-[#5C4E43] cursor-pointer selection:bg-transparent"
                >
                  {t.checkout_ship_to_different}
                </label>
              </div>
            </div>

            {shipToDifferent && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full flex flex-col space-y-6 pt-6 border-t border-[#E6DCC9]"
              >
                <h3 className="text-base font-semibold tracking-widest uppercase text-[#2C2119]">
                  {t.checkout_shipping_address}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-12 md:gap-y-8">
                  <div className="flex flex-col">
                    <label className="text-sm uppercase tracking-widest text-[#8C7C6D] mb-2">
                      {t.checkout_first_name}
                    </label>
                    <input
                      type="text"
                      value={shippingFirstName}
                      onChange={(e) => setShippingFirstName(e.target.value)}
                      className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] transition-colors font-serif"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm uppercase tracking-widest text-[#8C7C6D] mb-2">
                      {t.checkout_last_name}
                    </label>
                    <input
                      type="text"
                      value={shippingLastName}
                      onChange={(e) => setShippingLastName(e.target.value)}
                      className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] transition-colors font-serif"
                    />
                  </div>
                  <div className="flex flex-col md:col-span-2">
                    <label className="text-sm uppercase tracking-widest text-[#8C7C6D] mb-2">
                      {t.checkout_street}
                    </label>
                    <input
                      type="text"
                      value={shippingStreet}
                      onChange={(e) => setShippingStreet(e.target.value)}
                      className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] transition-colors font-serif"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm uppercase tracking-widest text-[#8C7C6D] mb-2">
                      {t.checkout_city}
                    </label>
                    <input
                      type="text"
                      value={shippingCity}
                      onChange={(e) => setShippingCity(e.target.value)}
                      className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] transition-colors font-serif"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm uppercase tracking-widest text-[#8C7C6D] mb-2">
                      {t.checkout_zip}
                    </label>
                    <input
                      type="text"
                      value={shippingZip}
                      onChange={(e) => setShippingZip(e.target.value)}
                      className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] transition-colors font-serif"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm uppercase tracking-widest text-[#8C7C6D] mb-2">
                      {t.checkout_phone}
                    </label>
                    <input
                      type="tel"
                      value={shippingPhone}
                      onChange={(e) => setShippingPhone(e.target.value)}
                      className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] transition-colors font-serif"
                    />
                  </div>
                </div>
              </motion.div>
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
                className={`border py-6 px-4 flex flex-col items-center justify-center text-center transition-colors ${
                  checkoutDelivery === 'locker' ? 'border-[#2C2119] bg-[#EBE2D3]' : 'border-[#E6DCC9] hover:bg-[#FAF7F2]'
                }`}
              >
                <span className="text-sm font-semibold uppercase tracking-widest">
                  {t.checkout_method_locker}
                </span>
                <span className="text-xl text-[#2C2119] mt-2 font-serif">
                  {lang === 'pl' ? '15,00 zł' : '€ 3.50'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setCheckoutDelivery('courier')}
                className={`border py-6 px-4 flex flex-col items-center justify-center text-center transition-colors ${
                  checkoutDelivery === 'courier' ? 'border-[#2C2119] bg-[#EBE2D3]' : 'border-[#E6DCC9] hover:bg-[#FAF7F2]'
                }`}
              >
                <span className="text-sm font-semibold uppercase tracking-widest">
                  {t.checkout_method_courier}
                </span>
                <span className="text-xl text-[#2C2119] mt-2 font-serif">
                  {lang === 'pl' ? '20,00 zł' : '€ 5.00'}
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
        className="w-full flex flex-col bg-[#EBE2D3] p-8 md:p-12 min-[1025px]:sticky min-[1025px]:top-32 min-[1025px]:max-h-[calc(100vh-160px)] no-scrollbar"
      >
        <h3 className="text-sm uppercase tracking-[0.2em] mb-8 font-semibold text-[#8C7C6D]">
          {t.cart}
        </h3>

        <div className="relative min-[1025px]:flex-1 flex flex-col min-h-0 mb-8">
          <div
            ref={containerRef}
            onScroll={checkScroll}
            className="min-[1025px]:overflow-y-auto overflow-y-visible min-[1025px]:-mr-6 min-[1025px]:pr-4 custom-scrollbar space-y-6 pt-4 pb-4 min-h-0 min-[1025px]:flex-1"
          >
            {$cartItems.map((item, index) => {
              const [productId, sizeId] = item.id.split("|");
              const itemProduct = PRODUCTS.find((p) => p.id === productId);
              const itemSize = itemProduct?.sizes.find(
                (s) => s.id === sizeId,
              );
              if (!itemProduct || !itemSize) return null;
              const isLast = index === $cartItems.length - 1;
              return (
                <div
                  key={item.id}
                  className={`flex items-start gap-6 pb-6 ${
                    isLast ? "" : "border-b border-[#E6DCC9]"
                  }`}
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 overflow-hidden flex-shrink-0 aspect-square">
                    <img
                      src={itemProduct.images[0]}
                      alt="Habit22 Bag"
                      className="w-full h-full object-cover opacity-90 grayscale-[10%]"
                    />
                  </div>
                  <div className="flex flex-col flex-1 min-h-[80px] md:min-h-[96px] justify-between">
                    <h4 className="font-serif text-[#2C2119] text-base leading-tight">
                      {t.product_section_title} - {itemProduct.design[lang === 'pl' ? 'pl' : 'en']}
                    </h4>
                    <div className="flex flex-col gap-1 mt-3 text-base text-[#8C7C6D] font-serif">
                      <div>
                        {lang === 'pl' ? 'Rozmiar' : 'Size'}: {itemSize.name[lang === 'pl' ? 'pl' : 'en']}
                      </div>
                      <div className="flex items-center justify-between w-full">
                        <span>
                          {lang === 'pl' ? 'Ilość' : 'Qty'}: {item.quantity}
                        </span>
                        <span className="text-[#5C4E43] font-serif font-semibold">
                          {t.product_price}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Top Shadow Gradient */}
          <div
            className={`absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-[#EBE2D3] to-transparent pointer-events-none transition-opacity duration-300 ${
              showTopShadow ? "opacity-100" : "opacity-0"
            }`}
          />
          {/* Bottom Shadow Gradient */}
          <div
            className={`absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#EBE2D3] to-transparent pointer-events-none transition-opacity duration-300 ${
              showBottomShadow ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        <div className="flex flex-col space-y-4 mb-8 pt-8 border-t border-[#E6DCC9] text-[#2C2119] font-serif text-xl">
          <div className="flex justify-between items-center">
            <span>
              {lang === "pl" ? "Suma" : "Subtotal"}
            </span>
            <span>
              {formatPrice(subtotal)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>{t.checkout_delivery}</span>
            <span>
              {checkoutDelivery ? formatPrice(delivery) : "—"}
            </span>
          </div>
          <div className="flex justify-between items-center border-t border-[#E6DCC9] pt-6 mt-2 font-bold">
            <span>{t.order_total}</span>
            <span>
              {formatPrice(total)}
            </span>
          </div>
        </div>
        <button
          onClick={handlePlaceOrder}
          disabled={$cartCount === 0 || !checkoutDelivery || !checkoutPayment}
          className="w-full py-5 bg-[#2C2119] text-[#F3EDE3] text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#1A140F] transition-colors mt-auto flex items-center justify-center space-x-3 group relative overflow-hidden disabled:opacity-50 disabled:pointer-events-none"
        >
          <span className="relative z-20 transition-transform duration-300 translate-x-[14px] group-hover:translate-x-0">{t.checkout_submit}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[14px] group-hover:translate-x-0 relative z-20"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
          <span className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
        </button>
      </motion.div>
    </main>
  );
}
