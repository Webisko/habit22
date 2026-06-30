import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from '../i18n/utils';
import { PRODUCTS } from '../data/products';
import { addToCart, isCartOpen } from '../stores/cart';

interface FeaturedProductProps {
  lang: string;
}

export default function FeaturedProduct({ lang }: FeaturedProductProps) {
  const product = PRODUCTS[0]; // Gingham Gingham/Vichy
  const [selectedSizeId, setSelectedSizeId] = useState(product.sizes[0].id);
  const desktopScrollRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);
  const { t, l } = useTranslations(lang);

  const currentSize = product.sizes.find((s) => s.id === selectedSizeId) || product.sizes[0];

  useEffect(() => {
    // Autoplay for main slider (horizontal)
    const desktopInterval = setInterval(() => {
      if (desktopScrollRef.current && !isHoveredRef.current) {
        const container = desktopScrollRef.current;
        container.scrollBy({
          left: container.clientWidth,
          behavior: "smooth",
        });
      }
    }, 4500);
    return () => clearInterval(desktopInterval);
  }, []);

  useEffect(() => {
    // Initialize scroll position for infinite scroll simulation
    const initScroll = () => {
      if (desktopScrollRef.current) {
        const container = desktopScrollRef.current;
        const itemWidth = container.clientWidth || window.innerWidth * 0.618;
        if (itemWidth > 0) {
          container.scrollTo({ left: itemWidth * 3, top: 0, behavior: "auto" });
        }
      }
    };
    initScroll();
    const timer = setTimeout(initScroll, 150);
    return () => clearTimeout(timer);
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    if (container.dataset.scrollTimeoutId) {
      clearTimeout(Number(container.dataset.scrollTimeoutId));
    }
    const timeoutId = window.setTimeout(() => {
      const itemWidth = container.clientWidth;
      if (itemWidth === 0) return;
      const N = 3;
      const scrollLeft = container.scrollLeft;

      if (scrollLeft >= (2 * N - 0.5) * itemWidth) {
        container.style.scrollBehavior = "auto";
        container.scrollLeft = scrollLeft - N * itemWidth;
        container.style.scrollBehavior = "smooth";
      } else if (scrollLeft <= (N - 0.5) * itemWidth) {
        container.style.scrollBehavior = "auto";
        container.scrollLeft = scrollLeft + N * itemWidth;
        container.style.scrollBehavior = "smooth";
      }
    }, 150);
    container.dataset.scrollTimeoutId = String(timeoutId);
  };

  const handleNext = () => {
    if (desktopScrollRef.current) {
      desktopScrollRef.current.scrollBy({
        left: desktopScrollRef.current.clientWidth,
        behavior: 'smooth',
      });
    }
  };

  const handlePrev = () => {
    if (desktopScrollRef.current) {
      desktopScrollRef.current.scrollBy({
        left: -desktopScrollRef.current.clientWidth,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="shop" className="w-full bg-[#FAF7F2]">
      <div className="flex flex-col lg:flex-row lg:h-[calc(100vh-5px)]">
        {/* Images Section (Left Side on Desktop) */}
        <div className="w-full lg:w-[61.8%] lg:h-full flex flex-col shrink-0 bg-[#FAF7F2]">
          <div
            className="relative w-full aspect-square lg:aspect-auto lg:h-full group/mainslider"
            onMouseEnter={() => (isHoveredRef.current = true)}
            onMouseLeave={() => (isHoveredRef.current = false)}
            onTouchStart={() => (isHoveredRef.current = true)}
            onTouchEnd={() => {
              setTimeout(() => (isHoveredRef.current = false), 3000);
            }}
          >
            {/* Desktop Left Button */}
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#FAF7F2] p-2 rounded-full shadow-md text-[#2C2119] opacity-0 group-hover/mainslider:opacity-100 transition-opacity z-10 hidden lg:block"
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} />
            </button>
            {/* Tablet Left Button */}
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#FAF7F2]/80 p-3 rounded-full text-[#2C2119] opacity-100 transition-opacity z-10 hidden sm:block lg:hidden shadow-sm"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Infinite Horizontal Scroll Container */}
            <div
              ref={desktopScrollRef}
              onScroll={handleScroll}
              className="w-full h-full bg-[#FAF7F2] flex overflow-x-auto lg:overflow-hidden hide-scrollbar snap-x snap-mandatory scroll-smooth relative"
            >
              {[
                ...product.images.slice(0, 3),
                ...product.images.slice(0, 3),
                ...product.images.slice(0, 3),
              ].map((img, idx) => (
                <div
                  key={idx}
                  className="w-full h-full flex-shrink-0 snap-start relative"
                >
                  <img
                    src={img}
                    alt={`${product.title[lang === 'pl' ? 'pl' : 'en']} - ${currentSize.name[lang === 'pl' ? 'pl' : 'en']}`}
                    className={`w-full h-full ${idx % 3 === 0 ? "object-contain py-[5px] px-2 md:px-8 object-center" : "object-cover"}`}
                    loading={idx % 3 === 0 ? "eager" : "lazy"}
                    draggable={false}
                  />
                </div>
              ))}
            </div>

            {/* Desktop Right Button */}
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#FAF7F2] p-2 rounded-full shadow-md text-[#2C2119] opacity-0 group-hover/mainslider:opacity-100 transition-opacity z-10 hidden lg:block"
              aria-label="Next slide"
            >
              <ChevronRight size={20} />
            </button>
            {/* Tablet Right Button */}
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#FAF7F2]/80 p-3 rounded-full text-[#2C2119] opacity-100 transition-opacity z-10 hidden sm:block lg:hidden shadow-sm"
              aria-label="Next slide"
            >
              <ChevronRight size={24} />
            </button>
            <div className="absolute top-0 right-0 w-[2px] h-full bg-[#FAF7F2] z-20 pointer-events-none hidden lg:block" />
          </div>

          {/* Mobile portrait-only arrows under the image */}
          <div className="flex sm:hidden lg:hidden justify-center items-center space-x-12 py-3 bg-[#FAF7F2]">
            <button
              onClick={handlePrev}
              className="text-[#2C2119] hover:text-[#8C7C6D] transition-colors focus:outline-none"
              aria-label="Previous image"
            >
              <ChevronLeft size={36} strokeWidth={1.5} />
            </button>
            <button
              onClick={handleNext}
              className="text-[#2C2119] hover:text-[#8C7C6D] transition-colors focus:outline-none"
              aria-label="Next image"
            >
              <ChevronRight size={36} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Product Info Section */}
        <div className="w-full lg:w-[38.2%] lg:h-full px-6 py-12 lg:px-12 lg:py-16 xl:py-24 flex flex-col justify-center relative lg:overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-xl mx-auto lg:mx-0 w-full"
          >
            <h2 className="text-2xl md:text-3xl font-serif text-[#2C2119] mb-3">
              {product.title[lang === 'pl' ? 'pl' : 'en']}
            </h2>
            <p className="text-lg font-serif text-[#5C4E43] italic mb-4">
              {product.design[lang === 'pl' ? 'pl' : 'en']}
            </p>

            <div className="text-lg font-serif text-[#5C4E43] mb-6">
              {t.product_price}
            </div>

            <div className="flex items-center gap-4 mb-6 text-xs tracking-[0.2em] uppercase text-[#8C7C6D] font-[400] border-b border-[#E6DCC9] pb-6 w-full">
              <span>{t.product_handmade}</span>
            </div>

            {/* Size Selector */}
            <div className="space-y-4 mb-8 w-full">
              <span className="block text-sm font-[400] uppercase tracking-widest text-[#2C2119]">
                {lang === "pl" ? "Rozmiar" : "Size"}
              </span>
              <div className="flex space-x-3">
                {product.sizes.map((size) => (
                  <motion.button
                    key={size.id}
                    onClick={() => setSelectedSizeId(size.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className={`w-12 h-12 border text-sm font-normal flex items-center justify-center transition-colors duration-150 ${
                      currentSize.id === size.id ? "border-[#2C2119] bg-[#2C2119] text-white" : "border-[#E6DCC9] text-[#2C2119] hover:border-[#8C7C6D]"
                    }`}
                  >
                    {size.name[lang === 'pl' ? 'pl' : 'en']}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col space-y-4 mb-8 lg:mb-16">
              <motion.button
                onClick={() => {
                  addToCart(product.id, currentSize.id, 1);
                  isCartOpen.set(true);
                }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#2C2119] text-white py-5 text-sm font-normal uppercase tracking-[0.2em] hover:bg-[#1A140F] transition-colors flex items-center justify-center space-x-3 group relative overflow-hidden"
              >
                <span className="relative z-20 transition-transform duration-300 translate-x-[14px] group-hover:translate-x-0">{t.add_to_cart}</span>
                <Plus
                  size={16}
                  className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[14px] group-hover:translate-x-0 relative z-20"
                />
                {/* Button shine effect */}
                <span className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
              </motion.button>

              <a
                href={l(`product/${product.slugs[lang as 'pl' | 'en']}`)}
                className="w-full border border-[#2C2119] text-[#2C2119] py-5 text-sm font-normal uppercase tracking-[0.2em] hover:bg-[#2C2119] hover:text-white transition-colors flex items-center justify-center space-x-3 group relative overflow-hidden text-center"
              >
                <span className="relative z-20 transition-transform duration-300 translate-x-[14px] group-hover:translate-x-0">{t.product_details}</span>
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
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
