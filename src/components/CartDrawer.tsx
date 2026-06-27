import React from 'react';
import { useStore } from '@nanostores/react';
import { ShoppingBag, X, MoveRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { navigate } from 'astro:transitions/client';
import { isCartOpen, cartItems, cartCount, removeFromCart } from '../stores/cart';
import { PRODUCTS } from '../data/products';
import { useTranslations } from '../i18n/utils';

interface CartDrawerProps {
  lang: string;
}

export default function CartDrawer({ lang }: CartDrawerProps) {
  const $isCartOpen = useStore(isCartOpen);
  const $cartItems = useStore(cartItems);
  const $cartCount = useStore(cartCount);
  const { t, l } = useTranslations(lang);

  const handleCheckoutClick = () => {
    isCartOpen.set(false);
    // Redirect to the localized checkout page
    navigate(l('checkout'));
  };

  return (
    <AnimatePresence>
      {$isCartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex justify-end"
        >
          <div
            className="absolute inset-0 bg-[#2C2119]/40 backdrop-blur-sm cursor-pointer"
            onClick={() => isCartOpen.set(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "tween",
              duration: 0.5,
              ease: [0.25, 1, 0.5, 1],
            }}
            className="relative w-full max-w-md bg-[#FAF7F2] h-full shadow-2xl flex flex-col p-8 md:p-12 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-16">
              <h3 className="text-sm font-medium tracking-[0.2em] uppercase">
                {t.cart}
              </h3>
              <button
                onClick={() => isCartOpen.set(false)}
                className="text-[#8C7C6D] hover:text-[#2C2119] transition-colors"
              >
                <X size={24} strokeWidth={1} />
              </button>
            </div>

            <div className="flex-grow flex flex-col justify-between">
              {$cartCount === 0 ? (
                <div className="space-y-6 flex flex-col items-center justify-center h-full w-full my-auto">
                  <ShoppingBag
                    size={48}
                    strokeWidth={1}
                    className="text-[#CBBFA8]"
                  />
                  <p className="text-[#8C7C6D] text-sm uppercase tracking-[0.2em]">
                    {t.empty_cart}
                  </p>
                  <button
                    onClick={() => isCartOpen.set(false)}
                    className="border-b border-[#2C2119] pb-1 text-sm font-semibold uppercase tracking-widest mt-6 hover:text-[#8C7C6D] hover:border-[#8C7C6D] transition-colors"
                  >
                    {t.continue_shopping}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col h-full w-full justify-between">
                  <div className="flex-1 overflow-y-auto mb-6 pr-2 no-scrollbar space-y-6 pt-4 max-h-[calc(100vh-280px)]">
                    {$cartItems.map((item) => {
                      const [productId, sizeId] = item.id.split("|");
                      const itemProduct = PRODUCTS.find(
                        (p) => p.id === productId,
                      );
                      const itemSize = itemProduct?.sizes.find(
                        (s) => s.id === sizeId,
                      );
                      if (!itemProduct || !itemSize) return null;

                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-6 border-b border-[#E6DCC9] pb-6 text-left"
                        >
                          <div className="w-24 h-32 bg-[#FAF7F2] overflow-hidden flex-shrink-0">
                            <img
                              src={itemProduct.images[0]}
                              alt="Habit22 Bag"
                              className="w-full h-full object-contain p-1 mix-blend-multiply opacity-90 grayscale-[10%]"
                            />
                          </div>
                          <div className="flex flex-col flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-serif text-[#2C2119] text-lg">
                                {t.product_section_title} -{" "}
                                {itemProduct.design[lang === 'pl' ? 'pl' : 'en']}
                              </h4>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-[#8C7C6D] hover:text-[#2C2119] ml-2"
                              >
                                <X size={16} />
                              </button>
                            </div>
                            <p className="text-sm text-[#8C7C6D] mb-4">
                              {itemSize.name[lang === 'pl' ? 'pl' : 'en']}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-[#5C4E43] font-serif pr-2">
                                {t.product_price}
                              </span>
                              <span className="text-sm text-[#8C7C6D] uppercase font-semibold">
                                {lang === "pl" ? "Ilość" : "Qty"}:{" "}
                                {item.quantity}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-auto pt-6 border-t border-[#E6DCC9]">
                    <div className="flex justify-between items-center font-serif text-xl mb-8 text-[#2C2119]">
                      <span>{t.order_total}</span>
                      <span>
                        {lang === "pl"
                          ? `${350 * $cartCount},00 zł`
                          : `€ ${(80 * $cartCount).toFixed(2)}`}
                      </span>
                    </div>
                    <button
                      onClick={handleCheckoutClick}
                      className="w-full py-5 bg-[#2C2119] text-[#F3EDE3] text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#1A140F] transition-colors flex items-center justify-center space-x-3 group relative overflow-hidden"
                    >
                      <span className="relative z-20">
                        {t.go_to_checkout}
                      </span>
                      <MoveRight
                        size={16}
                        className="opacity-0 group-hover:opacity-100 transition-all duration-300 -ml-8 group-hover:ml-0 relative z-20"
                      />

                      {/* Button shine effect */}
                      <span className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
