import React, { useEffect, useState } from 'react';
import { useTranslations } from '../i18n/utils';
import { formatPrice as formatCurrency } from '../stores/currency';

interface OrderDetails {
  orderNumber: string;
  delivery: string;
  name: string;
  nip?: string;
  street: string;
  city: string;
  zip: string;
  phone: string;
  email: string;
  payment: string;
  total: number;
  hasDifferentShippingAddress?: boolean;
  shippingName?: string;
  shippingStreet?: string;
  shippingCity?: string;
  shippingZip?: string;
  shippingPhone?: string;
}

interface OrderSummaryProps {
  lang: string;
}

export default function OrderSummary({ lang }: OrderSummaryProps) {
  const { t } = useTranslations(lang);
  const [details, setDetails] = useState<OrderDetails | null>(null);
  const [backendStatus, setBackendStatus] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    let orderNum = '';
    let email = '';

    try {
      const stored = sessionStorage.getItem('last_order_details');
      if (stored) {
        const parsed = JSON.parse(stored);
        setDetails(parsed);
        orderNum = parsed.orderNumber;
        email = parsed.email;
      }
    } catch (e) {
      console.error('Failed to parse order details from sessionStorage', e);
    }

    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const urlNumber = searchParams.get('number');
      if (urlNumber) {
        orderNum = urlNumber;
        if (details) {
          setDetails((prev) => (prev ? { ...prev, orderNumber: urlNumber } : prev));
        }
      }
    }

    if (orderNum && email) {
      setIsVerifying(true);
      const apiUrl = import.meta.env.PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      fetch(`${apiUrl}/checkout/orders/${encodeURIComponent(orderNum)}?email=${encodeURIComponent(email)}`, {
        headers: { Accept: 'application/json', 'X-Order-Email': email },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.data?.order?.payment_status) {
            setBackendStatus(data.data.order.payment_status);
          }
        })
        .catch((err) => console.warn('Could not verify order status:', err))
        .finally(() => setIsVerifying(false));
    }
  }, []);

  if (!details) {
    return null;
  }

  const hasShippingAddress = !!(details.hasDifferentShippingAddress || details.shippingStreet);

  const getDeliveryLabel = (method: string) => {
    if (method === 'locker') return t.delivery_locker;
    if (method === 'courier') return t.delivery_courier;
    return method;
  };

  const getPaymentLabel = (method: string) => {
    if (method === 'blik') return t.payment_blik;
    if (method === 'card') return t.payment_card;
    if (method === 'transfer') return t.payment_transfer;
    return method;
  };

  const formatPrice = (amount: number) => {
    return formatCurrency(amount);
  };

  return (
    <div className="w-full max-w-xl mt-12 border border-[#E6DCC9] bg-[#FAF7F2] py-10 px-8 md:py-12 md:px-10 text-center md:text-left animate-fade-in">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b border-[#E6DCC9] pb-4 mb-8 space-y-2 md:space-y-0">
        <h2 className="text-lg font-semibold uppercase tracking-widest text-[#2C2119]">
          {t.summary_title}
        </h2>
        <span className="text-base font-semibold uppercase tracking-widest text-[#8C7C6D]">
          {details.orderNumber}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Column 1: Delivery & Address */}
        <div className="space-y-8">
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#8C7C6D] font-semibold mb-1">
              {t.summary_delivery}
            </h4>
            <p className="font-serif text-[#2C2119] text-lg">
              {getDeliveryLabel(details.delivery)}
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#8C7C6D] font-semibold mb-1">
              {hasShippingAddress ? t.summary_billing_address : t.summary_address}
            </h4>
            <p className="font-serif text-[#2C2119] text-lg leading-relaxed whitespace-pre-line">
              {details.name}
              {details.nip && `\nNIP: ${details.nip}`}
              {`\n${details.street}`}
              {`\n${details.zip} ${details.city}`}
              {details.phone && `\ntel: ${details.phone}`}
            </p>
          </div>

          {hasShippingAddress && (
            <div>
              <h4 className="text-xs uppercase tracking-widest text-[#8C7C6D] font-semibold mb-1">
                {t.summary_shipping_address}
              </h4>
              <p className="font-serif text-[#2C2119] text-lg leading-relaxed whitespace-pre-line">
                {details.shippingName || details.name}
                {`\n${details.shippingStreet}`}
                {`\n${details.shippingZip} ${details.shippingCity}`}
                {details.shippingPhone && `\ntel: ${details.shippingPhone}`}
              </p>
            </div>
          )}
        </div>

        {/* Column 2: Payment, Total & Time */}
        <div className="space-y-8">
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#8C7C6D] font-semibold mb-1">
              {t.summary_payment}
            </h4>
            <p className="font-serif text-[#2C2119] text-lg">
              {getPaymentLabel(details.payment)}
            </p>
            {isVerifying && (
              <span className="inline-block mt-2 text-xs font-serif text-[#8C7C6D]">
                {lang === 'pl' ? 'Weryfikacja statusu płatności...' : 'Verifying payment status...'}
              </span>
            )}
            {backendStatus === 'paid' && (
              <span className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200">
                ● {lang === 'pl' ? 'Płatność opłacona' : 'Payment confirmed'}
              </span>
            )}
            {backendStatus === 'awaiting_payment' && (
              <span className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200">
                ● {lang === 'pl' ? 'Oczekuje na płatność' : 'Awaiting payment'}
              </span>
            )}
            {backendStatus === 'failed' && (
              <span className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 text-xs font-medium text-rose-800 bg-rose-50 border border-rose-200">
                ● {lang === 'pl' ? 'Płatność nie powiodła się' : 'Payment failed'}
              </span>
            )}
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#8C7C6D] font-semibold mb-1">
              {t.summary_time}
            </h4>
            <p className="font-serif text-[#2C2119] text-lg">
              {t.summary_time_value}
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#8C7C6D] font-semibold mb-1">
              {t.summary_total}
            </h4>
            <p className="font-serif text-xl font-bold text-[#2C2119]">
              {formatPrice(details.total)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
