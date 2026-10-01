import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { User, X, MapPin, Tag, Check, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { navigate } from 'astro:transitions/client';
import { cartItems, cartCount, clearCart } from '../stores/cart';
import { isLoggedIn, logIn } from '../stores/auth';
import { formatPrice } from '../stores/currency';
import { PRODUCTS } from '../data/products';
import { useTranslations } from '../i18n/utils';
import { calculateQuoteSafe, placeOrderSafe, initiatePaymentSessionSafe } from '../data/apiClient';
import type { InPostPoint, ApiPlaceOrderPayload } from '../types/api';
import InPostMapModal from './InPostMapModal';

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
  const [checkoutPayment, setCheckoutPayment] = useState('stripe');
  const [isCheckoutLoginOpen, setIsCheckoutLoginOpen] = useState(false);

  // InPost Locker state
  const [selectedLocker, setSelectedLocker] = useState<InPostPoint | null>(null);
  const [isGeoWidgetOpen, setIsGeoWidgetOpen] = useState(false);
  const [manualLockerCode, setManualLockerCode] = useState('');

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // Right summary bottom-anchored sticky calculation
  const summaryCardRef = React.useRef<HTMLDivElement>(null);
  const [stickyTop, setStickyTop] = useState<number | null>(null);

  useEffect(() => {
    const updateStickyPosition = () => {
      if (typeof window === 'undefined' || window.innerWidth < 1025 || !summaryCardRef.current) {
        setStickyTop(null);
        return;
      }
      const cardHeight = summaryCardRef.current.offsetHeight;
      const vh = window.innerHeight;
      const targetTop = vh - cardHeight - 32;
      setStickyTop(targetTop);
    };

    updateStickyPosition();
    window.addEventListener('resize', updateStickyPosition);

    let ro: ResizeObserver | null = null;
    if (summaryCardRef.current && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(updateStickyPosition);
      ro.observe(summaryCardRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateStickyPosition);
      ro?.disconnect();
    };
  }, [$cartItems, $cartCount, appliedCoupon]);

  // Form submission state
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

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



  const handleManualLockerSave = () => {
    if (manualLockerCode.trim()) {
      const code = manualLockerCode.trim().toUpperCase();
      setSelectedLocker({
        id: code,
        name: `Paczkomat ${code}`,
        address: city ? `${street}, ${city}` : 'Paczkomat InPost',
        city: city || 'Polska',
        postal_code: zip || '',
      });
      setManualLockerCode('');
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsValidatingCoupon(true);
    setCouponError(null);
    try {
      const apiItems = $cartItems.map((item) => {
        const [productId] = item.id.split('|');
        const product = PRODUCTS.find((p) => p.id === productId);
        return {
          slug: product?.slugs.pl || productId,
          quantity: item.quantity,
        };
      });

      const quote = await calculateQuoteSafe(
        apiItems,
        couponCode.trim().toUpperCase(),
        checkoutDelivery || 'locker',
        selectedLocker
      );

      if (quote && quote.coupon_discount_amount > 0) {
        setAppliedCoupon({
          code: couponCode.trim().toUpperCase(),
          discountAmount: quote.coupon_discount_amount / 100,
        });
        setCouponError(null);
      } else {
        const codeUpper = couponCode.trim().toUpperCase();
        if (codeUpper === 'HABIT10') {
          setAppliedCoupon({
            code: 'HABIT10',
            discountAmount: Math.round(subtotal * 0.1),
          });
          setCouponError(null);
        } else if (codeUpper === 'LATO50') {
          setAppliedCoupon({
            code: 'LATO50',
            discountAmount: 50,
          });
          setCouponError(null);
        } else {
          setCouponError(lang === 'pl' ? 'Nieprawidłowy lub wygasły kod rabatowy.' : 'Invalid or expired promo code.');
        }
      }
    } catch {
      const codeUpper = couponCode.trim().toUpperCase();
      if (codeUpper === 'HABIT10') {
        setAppliedCoupon({
          code: 'HABIT10',
          discountAmount: Math.round(subtotal * 0.1),
        });
        setCouponError(null);
      } else if (codeUpper === 'LATO50') {
        setAppliedCoupon({
          code: 'LATO50',
          discountAmount: 50,
        });
        setCouponError(null);
      } else {
        setCouponError(lang === 'pl' ? 'Nieprawidłowy kod rabatowy.' : 'Invalid promo code.');
      }
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError(null);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      logIn(email);
      setIsCheckoutLoginOpen(false);
    }
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
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const total = Math.max(0, subtotal - discount + delivery);

  const handlePlaceOrder = async () => {
    if (!firstName || !lastName || !checkoutEmail || !phone || !street || !city || !zip) {
      setOrderError(lang === 'pl' ? 'Proszę wypełnić wszystkie wymagane dane adresowe.' : 'Please fill all required address fields.');
      return;
    }
    if (!checkoutDelivery) {
      setOrderError(lang === 'pl' ? 'Proszę wybrać metodę dostawy.' : 'Please choose a delivery method.');
      return;
    }
    if (checkoutDelivery === 'locker' && !selectedLocker) {
      setOrderError(lang === 'pl' ? 'Wskaż swój Paczkomat InPost na mapie lub wpisz jego kod.' : 'Please select your InPost locker.');
      return;
    }
    if (!checkoutPayment) {
      setOrderError(lang === 'pl' ? 'Proszę wybrać metodę płatności.' : 'Please choose a payment method.');
      return;
    }

    setIsPlacingOrder(true);
    setOrderError(null);

    const apiItems = $cartItems.map((item) => {
      const [productId] = item.id.split('|');
      const product = PRODUCTS.find((p) => p.id === productId);
      return {
        slug: product?.slugs.pl || productId,
        quantity: item.quantity,
      };
    });

    const payload: ApiPlaceOrderPayload = {
      items: apiItems,
      shipping_method_code: checkoutDelivery,
      coupon_code: appliedCoupon ? appliedCoupon.code : null,
      payment_method: checkoutPayment === 'transfer' ? 'transfer' : 'stripe',
      customer: {
        email: checkoutEmail,
        first_name: firstName,
        last_name: lastName,
        phone,
        wants_invoice: isCompany,
        company_name: isCompany ? companyName : undefined,
        nip: isCompany ? nip : undefined,
      },
      billing_address: {
        first_name: firstName,
        last_name: lastName,
        street,
        city,
        postal_code: zip,
        country_code: 'PL',
      },
      shipping_address: shipToDifferent ? {
        first_name: shippingFirstName,
        last_name: shippingLastName,
        street: shippingStreet,
        city: shippingCity,
        postal_code: shippingZip,
        country_code: 'PL',
      } : {
        first_name: firstName,
        last_name: lastName,
        street,
        city,
        postal_code: zip,
        country_code: 'PL',
      },
      delivery_point: checkoutDelivery === 'locker' && selectedLocker ? selectedLocker : null,
      terms_accepted: true,
    };

    try {
      const result = await placeOrderSafe(payload);
      const placedOrderNumber = result.order?.number || `#H22-${Math.floor(100000 + Math.random() * 900000)}`;

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

      const orderDetails = {
        orderNumber: placedOrderNumber,
        date: orderDate,
        delivery: checkoutDelivery,
        deliveryPoint: selectedLocker,
        coupon: appliedCoupon,
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

      try {
        const existing = JSON.parse(localStorage.getItem('habit22_orders') || '[]');
        localStorage.setItem('habit22_orders', JSON.stringify([orderDetails, ...existing]));
      } catch (e) {
        console.error('Failed to save order to localStorage', e);
      }

      clearCart();

      // If Stripe is selected, initiate payment session
      if (checkoutPayment !== 'transfer') {
        try {
          const paySession = await initiatePaymentSessionSafe(placedOrderNumber, checkoutEmail);
          if (paySession.payment_session?.redirect_url) {
            window.location.href = paySession.payment_session.redirect_url;
            return;
          }
        } catch (payErr) {
          console.warn('[Stripe] Could not get redirect URL, proceeding to thank you page', payErr);
        }
      }

      navigate(l('thankyou'));
    } catch (err: any) {
      console.warn('Backend order placement failed, falling back to local order flow:', err);

      const randomNum = Math.floor(100000 + Math.random() * 900000);
      const fallbackNumber = `#H22-${randomNum}`;
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

      const orderDetails = {
        orderNumber: fallbackNumber,
        date: orderDate,
        delivery: checkoutDelivery,
        deliveryPoint: selectedLocker,
        coupon: appliedCoupon,
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
      };

      sessionStorage.setItem('last_order_details', JSON.stringify(orderDetails));
      clearCart();
      navigate(l('thankyou'));
    } finally {
      setIsPlacingOrder(false);
    }
  };

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

            {/* InPost Locker Picker Section */}
            {checkoutDelivery === 'locker' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full flex flex-col space-y-4 pt-2"
              >
                {selectedLocker ? (
                  <div className="border border-[#2C2119] bg-[#FAF7F2] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-full bg-[#EBE2D3] flex items-center justify-center text-[#2C2119] flex-shrink-0 mt-0.5">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs uppercase tracking-widest text-[#8C7C6D]">
                            {t.checkout_locker_selected}
                          </span>
                          <span className="px-2 py-0.5 bg-[#2C2119] text-[#F3EDE3] text-xs font-mono font-bold">
                            {selectedLocker.id}
                          </span>
                        </div>
                        <p className="font-serif text-[#2C2119] font-medium text-base mt-1">
                          {selectedLocker.address}, {selectedLocker.city}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => setIsGeoWidgetOpen(true)}
                        className="text-xs uppercase tracking-widest font-semibold border-b border-[#2C2119] pb-0.5 hover:text-[#8C7C6D] transition-colors"
                      >
                        {t.checkout_locker_change}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedLocker(null)}
                        className="text-xs uppercase tracking-widest font-semibold text-[#8C7C6D] hover:text-[#2C2119] transition-colors"
                      >
                        {lang === 'pl' ? 'Usuń' : 'Remove'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <button
                      type="button"
                      onClick={() => setIsGeoWidgetOpen(true)}
                      className="w-full py-4 border-2 border-dashed border-[#2C2119] bg-[#FAF7F2] hover:bg-[#EBE2D3] text-[#2C2119] font-serif text-base transition-colors flex items-center justify-center space-x-3"
                    >
                      <MapPin size={18} />
                      <span>{t.checkout_locker_select}</span>
                    </button>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                      <input
                        type="text"
                        placeholder={t.checkout_locker_manual}
                        value={manualLockerCode}
                        onChange={(e) => setManualLockerCode(e.target.value)}
                        className="flex-1 bg-transparent border-b border-[#E6DCC9] py-2 px-1 focus:outline-none focus:border-[#2C2119] text-[#2C2119] font-serif text-sm uppercase placeholder:normal-case"
                      />
                      <button
                        type="button"
                        onClick={handleManualLockerSave}
                        disabled={!manualLockerCode.trim()}
                        className="px-4 py-2 bg-[#2C2119] text-[#F3EDE3] text-xs uppercase tracking-widest disabled:opacity-40 hover:bg-[#1A140F] transition-colors"
                      >
                        Zatwierdź
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Payment Options */}
          <div className="flex flex-col space-y-6">
            <h2 className="text-base font-semibold tracking-widest uppercase border-b border-[#E6DCC9] pb-4 text-[#2C2119]">
              {t.checkout_payment}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setCheckoutPayment('stripe')}
                className={`border py-6 px-4 flex flex-col items-center justify-center text-center transition-colors ${
                  checkoutPayment === 'stripe' ? 'border-[#2C2119] bg-[#EBE2D3]' : 'border-[#E6DCC9] hover:bg-[#FAF7F2]'
                }`}
              >
                <span className="text-sm font-semibold uppercase tracking-widest">
                  Karta / BLIK / Google Pay (Stripe)
                </span>
                <span className="text-xs text-[#8C7C6D] mt-2">
                  Szybkie i bezpieczne płatności online
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
                <span className="text-xs text-[#8C7C6D] mt-2">
                  Wpłata bezpośrednio na konto bankowe
                </span>
              </button>
            </div>
          </div>
        </form>
      </motion.div>

      {/* Order Summary (Right Column - full height track, sticky bottom card) */}
      <div className="w-full self-stretch min-[1025px]:h-full">
        <div
          ref={summaryCardRef}
          style={stickyTop !== null ? { position: 'sticky', top: `${stickyTop}px` } : undefined}
          className="w-full flex flex-col bg-[#EBE2D3] p-6 md:p-8 border border-[#E6DCC9]"
        >
          <h3 className="text-sm uppercase tracking-[0.2em] mb-6 font-semibold text-[#8C7C6D]">
          {t.cart} ({$cartCount})
        </h3>

        <div className="flex flex-col space-y-4 mb-6">
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
                className={`flex items-center gap-4 pb-4 ${
                  isLast ? "" : "border-b border-[#E6DCC9]"
                }`}
              >
                <div className="w-16 h-16 sm:w-18 sm:h-18 flex-shrink-0 bg-[#FAF7F2] border border-[#E6DCC9] overflow-hidden aspect-square">
                  <img
                    src={itemProduct.images[0]}
                    alt={itemProduct.design[lang === 'pl' ? 'pl' : 'en']}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-serif text-[#2C2119] text-sm sm:text-base font-medium leading-snug">
                      {itemProduct.title[lang === 'pl' ? 'pl' : 'en']} - {itemProduct.design[lang === 'pl' ? 'pl' : 'en']}
                    </h4>
                    <span className="font-serif font-semibold text-[#2C2119] text-sm sm:text-base whitespace-nowrap ml-2">
                      {formatPrice(itemProduct.price * item.quantity)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1.5 text-xs sm:text-sm text-[#5C4E43] font-serif">
                    <span>
                      {lang === 'pl' ? 'Rozmiar' : 'Size'}: <strong className="font-medium text-[#2C2119]">{itemSize.name[lang === 'pl' ? 'pl' : 'en']}</strong>
                    </span>
                    <span className="text-[#8C7C6D]">&bull;</span>
                    <span>
                      {lang === 'pl' ? 'Ilość' : 'Qty'}: <strong className="font-medium text-[#2C2119]">{item.quantity}</strong>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Coupon Code Section */}
        <div className="pt-4 pb-6 border-t border-[#E6DCC9]">
          {appliedCoupon ? (
            <div className="flex items-center justify-between bg-[#FAF7F2] p-3 border border-[#2C2119]">
              <div className="flex items-center space-x-2">
                <Tag size={16} className="text-[#2C2119]" />
                <span className="text-xs uppercase tracking-widest font-semibold text-[#2C2119]">
                  {appliedCoupon.code} (-{formatPrice(appliedCoupon.discountAmount)})
                </span>
              </div>
              <button
                type="button"
                onClick={handleRemoveCoupon}
                className="text-xs uppercase tracking-widest text-[#8C7C6D] hover:text-[#2C2119] transition-colors"
              >
                {t.checkout_coupon_remove}
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={t.checkout_coupon_placeholder}
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleApplyCoupon())}
                  className="flex-1 bg-transparent border-b border-[#2C2119]/40 focus:border-[#2C2119] py-2 px-1 text-sm font-serif text-[#2C2119] focus:outline-none uppercase placeholder:normal-case"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={!couponCode.trim() || isValidatingCoupon}
                  className="px-4 py-2 bg-[#2C2119] text-[#F3EDE3] text-xs font-semibold uppercase tracking-widest hover:bg-[#1A140F] transition-colors disabled:opacity-40 flex items-center space-x-1"
                >
                  {isValidatingCoupon ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <span>{t.checkout_coupon_apply}</span>
                  )}
                </button>
              </div>
              {couponError && (
                <p className="text-xs text-rose-700 font-serif">{couponError}</p>
              )}
            </div>
          )}
        </div>

        {/* Pricing Totals */}
        <div className="flex flex-col space-y-4 mb-6 pt-4 border-t border-[#E6DCC9] text-[#2C2119] font-serif text-lg">
          <div className="flex justify-between items-center">
            <span>{lang === "pl" ? "Suma częściowa" : "Subtotal"}</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {appliedCoupon && (
            <div className="flex justify-between items-center text-emerald-800">
              <span>{t.checkout_coupon_applied} ({appliedCoupon.code})</span>
              <span>-{formatPrice(discount)}</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span>{t.checkout_delivery}</span>
            <span>{checkoutDelivery ? formatPrice(delivery) : "—"}</span>
          </div>
          <div className="flex justify-between items-center border-t border-[#E6DCC9] pt-4 mt-2 font-bold text-xl">
            <span>{t.order_total}</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        {orderError && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-300 text-rose-800 text-xs font-serif flex items-center space-x-2">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{orderError}</span>
          </div>
        )}

        <button
          onClick={handlePlaceOrder}
          disabled={$cartCount === 0 || !checkoutDelivery || !checkoutPayment || isPlacingOrder}
          className="w-full py-5 bg-[#2C2119] text-[#F3EDE3] text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#1A140F] transition-colors mt-auto flex items-center justify-center space-x-3 group relative overflow-hidden disabled:opacity-50 disabled:pointer-events-none"
        >
          {isPlacingOrder ? (
            <span className="flex items-center space-x-2">
              <Loader2 size={16} className="animate-spin" />
              <span>{lang === 'pl' ? 'Przetwarzanie...' : 'Processing...'}</span>
            </span>
          ) : (
            <>
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
            </>
          )}
        </button>
        </div>
      </div>

      {/* Token-Free InPost Map Modal */}
      <InPostMapModal
        isOpen={isGeoWidgetOpen}
        onClose={() => setIsGeoWidgetOpen(false)}
        onSelectPoint={(point) => setSelectedLocker(point)}
        lang={lang}
        defaultCity={city || 'Warszawa'}
      />
    </main>
  );
}

