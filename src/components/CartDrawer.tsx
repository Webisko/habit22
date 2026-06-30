import React from 'react';
import { useStore } from '@nanostores/react';
import { ShoppingBag, X } from 'lucide-react';
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
    if (!$isCartOpen) return;

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
  }, [$isCartOpen, $cartItems, checkScroll]);

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
            className="relative w-full max-w-md bg-[#FAF7F2] h-[100dvh] shadow-2xl flex flex-col p-6 md:p-12 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-8 md:mb-16 shrink-0">
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

            <div className="flex-grow flex flex-col min-h-0 justify-between">
              {$cartCount === 0 ? (
                <div className="space-y-6 flex flex-col items-center justify-center h-full w-full my-auto shrink-0">
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
                <div className="flex flex-col flex-grow min-h-0 justify-between">
                  <div className="flex-1 relative min-h-0 mb-6">
                    <div
                      ref={containerRef}
                      onScroll={checkScroll}
                      className="h-full overflow-y-auto -mr-6 pr-4 md:-mr-12 md:pr-10 custom-scrollbar space-y-6 pt-4 min-h-0"
                    >
                      {$cartItems.map((item, index) => {
                        const [productId, sizeId] = item.id.split("|");
                        const itemProduct = PRODUCTS.find(
                          (p) => p.id === productId,
                        );
                        const itemSize = itemProduct?.sizes.find(
                          (s) => s.id === sizeId,
                        );
                        if (!itemProduct || !itemSize) return null;

                        const productPath = l('product/' + itemProduct.slugs[lang === 'pl' ? 'pl' : 'en']);
                        const isLast = index === $cartItems.length - 1;

                        return (
                          <div
                            key={item.id}
                            className={`flex items-start gap-6 pb-6 text-left ${
                              isLast ? "" : "border-b border-[#E6DCC9]"
                            }`}
                          >
                            <a
                              href={productPath}
                              onClick={() => isCartOpen.set(false)}
                              className="w-24 h-24 overflow-hidden flex-shrink-0 aspect-square hover:opacity-80 transition-opacity"
                            >
                              <img
                                src={itemProduct.images[0]}
                                alt="Habit22 Bag"
                                className="w-full h-full object-cover opacity-90 grayscale-[10%]"
                              />
                            </a>
                            <div className="flex flex-col flex-1 min-h-[96px] justify-between">
                              <div className="flex justify-between items-start gap-2">
                                <a
                                  href={productPath}
                                  onClick={() => isCartOpen.set(false)}
                                  className="hover:text-[#8C7C6D] transition-colors flex-grow"
                                >
                                  <h4 className="font-serif text-[#2C2119] text-base leading-tight">
                                    {t.product_section_title} -{" "}
                                    {itemProduct.design[lang === 'pl' ? 'pl' : 'en']}
                                  </h4>
                                </a>
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-[#8C7C6D] hover:text-[#2C2119] shrink-0"
                                >
                                  <X size={16} />
                                </button>
                              </div>
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
                      className={`absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-[#FAF7F2] to-transparent pointer-events-none transition-opacity duration-300 ${
                        showTopShadow ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    {/* Bottom Shadow Gradient */}
                    <div
                      className={`absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#FAF7F2] to-transparent pointer-events-none transition-opacity duration-300 ${
                        showBottomShadow ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </div>

                  <div className="mt-auto pt-6 border-t border-[#E6DCC9] shrink-0">
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
                        className="opacity-0 group-hover:opacity-100 transition-all duration-300 -ml-8 group-hover:ml-0 relative z-20"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>

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
