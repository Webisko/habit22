/**
 * Bezpieczny klient API dla warstwy Astro 7.
 * Każde zapytanie jest zabezpieczone blokiem try...catch z obsługą awaryjną (fallback),
 * dzięki czemu brak działającego serwera backendu nie przerywa procesu budowania strony (astro build).
 */

import { PRODUCTS, type Product } from './products';
import type { ApiResponse, ApiCatalogResponse, ApiProduct, ApiFaqItem, ApiBlogPost, ApiQuoteResponse } from '../types/api';

const API_BASE_URL = import.meta.env.PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export async function fetchCatalogSafe(): Promise<ApiProduct[] | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const response = await fetch(`${API_BASE_URL}/catalog`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[API] Catalog endpoint zwrócił status: ${response.status}. Użycie fallbacku.`);
      return null;
    }

    const json = (await response.json()) as ApiResponse<ApiCatalogResponse>;
    return json.data?.products ?? null;
  } catch (error) {
    // Bezpieczne przechwycenie - brak działającego backendu nie wywala procesu budowania
    return null;
  }
}

export async function fetchFaqSafe(): Promise<ApiFaqItem[] | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const response = await fetch(`${API_BASE_URL}/faq`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });
    clearTimeout(timeoutId);

    if (!response.ok) return null;

    const json = (await response.json()) as ApiResponse<{ items: ApiFaqItem[] }>;
    return json.data?.items ?? null;
  } catch {
    return null;
  }
}

export async function fetchBlogPostsSafe(): Promise<ApiBlogPost[] | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const response = await fetch(`${API_BASE_URL}/blog/posts`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });
    clearTimeout(timeoutId);

    if (!response.ok) return null;

    const json = (await response.json()) as ApiResponse<{ posts: ApiBlogPost[] }>;
    return json.data?.posts ?? null;
  } catch {
    return null;
  }
}

export async function calculateQuoteSafe(
  items: Array<{ slug: string; quantity: number }>,
  couponCode?: string,
  shippingMethodCode?: string,
  deliveryPoint?: any
): Promise<ApiQuoteResponse | null> {
  try {
    const body: Record<string, any> = {
      items,
    };
    if (couponCode) body.coupon_code = couponCode;
    if (shippingMethodCode) body.shipping_method_code = shippingMethodCode;
    if (deliveryPoint) body.delivery_point = deliveryPoint;

    const response = await fetch(`${API_BASE_URL}/quote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.message || 'Błąd kalkulacji koszyka');
    }

    const json = await response.json();
    return json.data ?? null;
  } catch (error) {
    console.warn('[API] calculateQuoteSafe error:', error);
    throw error;
  }
}

export async function placeOrderSafe(
  payload: import('../types/api').ApiPlaceOrderPayload
): Promise<import('../types/api').ApiPlaceOrderResponse> {
  const response = await fetch(`${API_BASE_URL}/checkout/place`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.message || 'Nie udało się złożyć zamówienia.');
  }

  const json = await response.json();
  return json.data;
}

export async function initiatePaymentSessionSafe(
  orderNumber: string,
  customerEmail: string
): Promise<import('../types/api').ApiPaymentSessionResponse> {
  const response = await fetch(`${API_BASE_URL}/checkout/orders/${orderNumber}/payment-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Order-Email': customerEmail,
    },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.message || 'Nie udało się zainicjować płatności.');
  }

  const json = await response.json();
  return json.data;
}

