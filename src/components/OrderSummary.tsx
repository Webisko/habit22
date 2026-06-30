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

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('last_order_details');
      if (stored) {
        setDetails(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse order details from sessionStorage', e);
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
