import React from 'react';
import { formatPrice } from '../stores/currency';

interface ProductPriceProps {
  price: number;
}

export default function ProductPrice({ price }: ProductPriceProps) {
  return <>{formatPrice(price)}</>;
}
