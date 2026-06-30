import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '@nanostores/react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { addToCart } from '../stores/cart';
import { useTranslations } from '../i18n/utils';
import type { Product } from '../data/products';

interface ProductSelectorProps {
  product: Product;
  lang: string;
}

export default function ProductSelector({ product, lang }: ProductSelectorProps) {
  const [selectedSizeId, setSelectedSizeId] = useState(product.sizes[0].id);
  const [quantity, setQuantity] = useState(1);
  const [productImageIndex, setProductImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const { t } = useTranslations(lang);

  // States for thumbnail slider drag/scroll
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const currentSize = product.sizes.find((s) => s.id === selectedSizeId) || product.sizes[0];

  const handleNextImage = () => {
    setProductImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const handlePrevImage = () => {
    setProductImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  useEffect(() => {
    // Initialize thumbnail slider scroll position
    const initScroll = () => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const firstChild = container.firstElementChild?.firstElementChild as HTMLElement;
        if (firstChild) {
          const itemWidth = firstChild.getBoundingClientRect().width + 16;
          if (itemWidth > 0) {
            container.scrollTo({
              left: itemWidth * 3,
              top: 0,
              behavior: "auto",
            });
          }
        }
      }
    };
    initScroll();
    const timer = setTimeout(initScroll, 150);
    return () => clearTimeout(timer);
  }, [product, selectedSizeId]);

  // Synchronize thumbnail slider scroll position when active image changes
  useEffect(() => {
    const syncScroll = () => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const firstChild = container.firstElementChild?.firstElementChild as HTMLElement;
        if (firstChild) {
          const itemWidth = firstChild.getBoundingClientRect().width + 16;
          const containerWidth = container.getBoundingClientRect().width;
          if (itemWidth > 0 && containerWidth > 0) {
            const targetIndex = 3 + (productImageIndex % 3);
            const targetScrollLeft = targetIndex * itemWidth - (containerWidth / 2) + (itemWidth / 2) - 8;
            container.scrollTo({
              left: targetScrollLeft,
              top: 0,
              behavior: "smooth",
            });
          }
        }
      }
    };
    const timer = setTimeout(syncScroll, 50);
    return () => clearTimeout(timer);
  }, [productImageIndex]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.618fr_1fr] gap-8 lg:gap-16 2xl:gap-24 mb-16 w-full">
      {/* Product Images & Gallery */}
      <div className="w-full flex flex-col space-y-4 min-w-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full overflow-hidden relative group cursor-pointer"
          onClick={() => setIsLightboxOpen(true)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevImage();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#FAF7F2] p-2 rounded-full shadow-md text-[#2C2119] opacity-0 group-hover:opacity-100 transition-opacity z-10 hidden xl:block"
            aria-label="Previous image"
          >
            <ChevronLeft size={20} />
          </button>

          <img
            src={product.images[productImageIndex]}
            alt={t.product_section_title}
            className="w-full h-auto block mix-blend-multiply opacity-90"
          />

          {/* Desktop Right Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNextImage();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#FAF7F2] p-2 rounded-full shadow-md text-[#2C2119] opacity-0 group-hover:opacity-100 transition-opacity z-10 hidden xl:block"
            aria-label="Next image"
          >
            <ChevronRight size={20} />
          </button>
        </motion.div>

        {/* Mobile & Tablet carousel controls */}
        <div className="flex xl:hidden justify-center items-center space-x-12 py-2">
          <button
            onClick={handlePrevImage}
            className="text-[#2C2119] hover:text-[#8C7C6D] transition-colors focus:outline-none"
            aria-label="Previous image"
          >
            <ChevronLeft size={36} strokeWidth={1.5} />
          </button>
          <button
            onClick={handleNextImage}
            className="text-[#2C2119] hover:text-[#8C7C6D] transition-colors focus:outline-none"
            aria-label="Next image"
          >
            <ChevronRight size={36} strokeWidth={1.5} />
          </button>
        </div>

        {/* Thumbnails Gallery - 100% Identical Drag & Infinite Loop */}
        <div className="relative w-full group/slider">
          <button
            onClick={() => {
              if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollBy({
                  left: -200,
                  behavior: "smooth",
                });
              }
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-[#FAF7F2] p-2 rounded-full shadow-md text-[#2C2119] opacity-0 group-hover/slider:opacity-100 transition-opacity z-10 hidden xl:block"
            aria-label="Scroll thumbnails left"
          >
            <ChevronLeft size={20} />
          </button>

          <div
            ref={scrollContainerRef}
            onScroll={(e) => {
              const container = e.currentTarget;
              if (container.dataset.scrollTimeoutId) {
                clearTimeout(Number(container.dataset.scrollTimeoutId));
              }
              const timeoutId = window.setTimeout(() => {
                const firstChild = container.firstElementChild?.firstElementChild as HTMLElement;
                if (!firstChild) return;
                const itemWidth = firstChild.getBoundingClientRect().width + 16;
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
            }}
            className={`w-full overflow-x-auto hide-scrollbar snap-x snap-mandatory ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
            onMouseDown={(e) => {
              if (!scrollContainerRef.current) return;
              setIsDragging(true);
              setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
              setScrollLeftState(scrollContainerRef.current.scrollLeft);
            }}
            onMouseLeave={() => setIsDragging(false)}
            onMouseUp={() => setIsDragging(false)}
            onMouseMove={(e) => {
              if (!isDragging || !scrollContainerRef.current) return;
              e.preventDefault();
              const x = e.pageX - scrollContainerRef.current.offsetLeft;
              const walk = (x - startX) * 2;
              scrollContainerRef.current.scrollLeft = scrollLeftState - walk;
            }}
          >
            <div className="flex space-x-4 w-max">
              {[
                ...product.images.slice(0, 3),
                ...product.images.slice(0, 3),
                ...product.images.slice(0, 3),
              ].map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setProductImageIndex(idx % 3)}
                  className={`relative snap-start flex-shrink-0 w-24 h-24 md:w-32 md:h-32 overflow-hidden bg-[#EBE2D3] transition-all ${
                    (productImageIndex % 3) === (idx % 3) ? "opacity-100" : "opacity-50 hover:opacity-100"
                  }`}
                  draggable={false}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover mix-blend-multiply pointer-events-none"
                    draggable={false}
                  />
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollBy({
                  left: 200,
                  behavior: "smooth",
                });
              }
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-[#FAF7F2] p-2 rounded-full shadow-md text-[#2C2119] opacity-0 group-hover/slider:opacity-100 transition-opacity z-10 hidden xl:block"
            aria-label="Scroll thumbnails right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Product Customizer & Add-to-Cart Panel */}
      <div className="w-full flex flex-col justify-start pt-2 lg:pt-4 min-w-0">
        <h1 className="text-2xl md:text-3xl font-serif text-[#2C2119] mb-4">
          {product.title[lang === 'pl' ? 'pl' : 'en']}
        </h1>
        <p className="text-lg font-serif text-[#5C4E43] italic mb-6">
          {product.design[lang === 'pl' ? 'pl' : 'en']}
        </p>

        <div className="text-lg font-serif text-[#5C4E43] mb-6 tracking-wider">
          {t.product_price}
        </div>

        <div className="flex items-center gap-4 mb-8 text-xs tracking-[0.2em] uppercase text-[#8C7C6D] font-[400] border-b border-[#E6DCC9] pb-8 w-full">
          <span>{t.product_handmade}</span>
        </div>

        <p className="text-[#5C4E43] font-serif leading-relaxed mb-12 text-base">
          {t.product_desc(product.design[lang === 'pl' ? 'pl' : 'en'])}
        </p>

        {/* Size Selection */}
        <div className="flex items-center space-x-4 xl:space-x-6 mb-8 w-full">
          <span className="text-sm font-[400] uppercase tracking-widest text-[#2C2119] w-20 xl:w-28 shrink-0">
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

        {/* Quantity Controls */}
        <div className="flex items-center space-x-4 xl:space-x-6 mb-8 w-full">
          <span className="text-sm font-[400] uppercase tracking-widest text-[#2C2119] w-20 xl:w-28 shrink-0">
            {lang === "pl" ? "Ilość" : "Quantity"}
          </span>
          <div className="flex items-center border border-[#E6DCC9] py-2 px-2 space-x-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="text-[#8C7C6D] hover:text-[#2C2119] p-2 focus:outline-none"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-[#2C2119] font-medium w-4 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="text-[#8C7C6D] hover:text-[#2C2119] p-2 focus:outline-none"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <motion.button
          onClick={() => {
            addToCart(product.id, currentSize.id, quantity);
          }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-[#2C2119] text-white py-5 text-sm font-medium uppercase tracking-[0.2em] hover:bg-[#1A140F] transition-colors mb-0 flex items-center justify-center space-x-3 group relative overflow-hidden"
        >
          <span className="relative z-20 transition-transform duration-300 translate-x-[14px] group-hover:translate-x-0">{t.add_to_cart}</span>
          <Plus
            size={16}
            className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[14px] group-hover:translate-x-0 relative z-20"
          />
          {/* Shine effect */}
          <span className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
        </motion.button>
      </div>

      {/* Full Screen Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#FAF7F2] flex items-center justify-center pt-24 pb-12 px-6 md:px-12"
          >
            <div className="relative w-full h-full max-w-[1440px] mx-auto flex flex-col">
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-0 right-0 text-[#2C2119] hover:opacity-50 transition-opacity z-50 bg-[#EBE2D3] p-4 rounded-full shadow-lg"
              >
                <X size={24} />
              </button>

              <div className="flex-1 relative flex items-center justify-center w-full h-full">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={productImageIndex}
                    src={product.images[productImageIndex]}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    className="max-h-full max-w-full object-contain mix-blend-multiply drop-shadow-sm"
                  />
                </AnimatePresence>

                <button
                  onClick={handlePrevImage}
                  className="hidden xl:block absolute left-12 top-1/2 -translate-y-1/2 p-4 text-[#2C2119] bg-[#EBE2D3]/80 hover:bg-[#EBE2D3] rounded-full transition-colors backdrop-blur-sm z-30"
                >
                  <ChevronLeft size={32} strokeWidth={1.5} />
                </button>
                <button
                  onClick={handleNextImage}
                  className="hidden xl:block absolute right-12 top-1/2 -translate-y-1/2 p-4 text-[#2C2119] bg-[#EBE2D3]/80 hover:bg-[#EBE2D3] rounded-full transition-colors backdrop-blur-sm z-30"
                >
                  <ChevronRight size={32} strokeWidth={1.5} />
                </button>
              </div>

              {/* Lightbox Navigation below the image on mobile/tablet (< xl) */}
              <div className="flex xl:hidden justify-center items-center space-x-12 py-4 z-30">
                <button
                  onClick={handlePrevImage}
                  className="text-[#2C2119] hover:text-[#8C7C6D] transition-colors focus:outline-none bg-[#EBE2D3] p-4 rounded-full shadow-md"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={28} strokeWidth={1.5} />
                </button>
                <button
                  onClick={handleNextImage}
                  className="text-[#2C2119] hover:text-[#8C7C6D] transition-colors focus:outline-none bg-[#EBE2D3] p-4 rounded-full shadow-md"
                  aria-label="Next image"
                >
                  <ChevronRight size={28} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
