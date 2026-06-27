import { atom, computed } from 'nanostores';
import { persistentAtom } from '@nanostores/persistent';

export interface CartItem {
  id: string; // "productId|sizeId"
  quantity: number;
}

// Persist cartItems as JSON in localStorage, defaults to empty array
export const cartItems = persistentAtom<CartItem[]>('habit22_cart', [], {
  encode: JSON.stringify,
  decode: JSON.parse
});

// Control cart drawer open state (client-side only, simple atom)
export const isCartOpen = atom<boolean>(false);

// Control mobile navigation menu state
export const isMenuOpen = atom<boolean>(false);

// Derived store to count total items in cart
export const cartCount = computed(cartItems, (items) => {
  if (!items || !Array.isArray(items)) return 0;
  return items.reduce((acc, item) => acc + item.quantity, 0);
});

// Helpers to modify cart state
export function addToCart(productId: string, sizeId: string, quantity: number) {
  const id = `${productId}|${sizeId}`;
  const current = cartItems.get();
  
  const existingIndex = current.findIndex(item => item.id === id);
  if (existingIndex > -1) {
    const updated = [...current];
    updated[existingIndex] = {
      ...updated[existingIndex],
      quantity: updated[existingIndex].quantity + quantity
    };
    cartItems.set(updated);
  } else {
    cartItems.set([...current, { id, quantity }]);
  }
  
  // Automatically open the cart drawer when adding an item
  isCartOpen.set(true);
}

export function removeFromCart(variantId: string) {
  const current = cartItems.get();
  cartItems.set(current.filter(item => item.id !== variantId));
}

export function updateCartQuantity(variantId: string, delta: number) {
  const current = cartItems.get();
  const updated = current.map(item => {
    if (item.id === variantId) {
      const newQty = item.quantity + delta;
      return { ...item, quantity: newQty > 0 ? newQty : 1 };
    }
    return item;
  });
  cartItems.set(updated);
}

export function clearCart() {
  cartItems.set([]);
}
