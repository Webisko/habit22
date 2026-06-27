export interface ProductSize {
  id: string;
  name: {
    pl: string;
    en: string;
  };
}

export interface Product {
  id: string;
  title: {
    pl: string;
    en: string;
  };
  design: {
    pl: string;
    en: string;
  };
  images: string[];
  sizes: ProductSize[];
}

export const PRODUCTS: Product[] = [
  {
    id: "floral",
    title: { pl: "Kratka Vichy", en: "Vichy Check" },
    design: {
      pl: "Kolekcja Gingham / Vichy",
      en: "Gingham / Vichy Collection",
    },
    images: [
      `${import.meta.env.BASE_URL || '/habit22/'}produkt__1-1.webp`,
      `${import.meta.env.BASE_URL || '/habit22/'}produkt__1-2.webp`,
      `${import.meta.env.BASE_URL || '/habit22/'}produkt__1-3.webp`,
      `${import.meta.env.BASE_URL || '/habit22/'}produkt__1-1.webp`,
      `${import.meta.env.BASE_URL || '/habit22/'}produkt__1-2.webp`,
      `${import.meta.env.BASE_URL || '/habit22/'}produkt__1-3.webp`,
    ],
    sizes: [
      { id: "size_22", name: { pl: "22", en: "22" } },
      { id: "size_33", name: { pl: "33", en: "33" } },
      { id: "size_44", name: { pl: "44", en: "44" } },
    ],
  },
  {
    id: "len",
    title: { pl: "Szałwiowa zieleń", en: "Sage Green" },
    design: {
      pl: "Kolekcja Eucalyptus / Linen",
      en: "Eucalyptus / Linen Collection",
    },
    images: [
      `${import.meta.env.BASE_URL || '/habit22/'}produkt__2-1.webp`,
      `${import.meta.env.BASE_URL || '/habit22/'}produkt__2-2.webp`,
      `${import.meta.env.BASE_URL || '/habit22/'}produkt__2-3.webp`,
      `${import.meta.env.BASE_URL || '/habit22/'}produkt__2-1.webp`,
      `${import.meta.env.BASE_URL || '/habit22/'}produkt__2-2.webp`,
      `${import.meta.env.BASE_URL || '/habit22/'}produkt__2-3.webp`,
    ],
    sizes: [
      { id: "size_22", name: { pl: "22", en: "22" } },
      { id: "size_33", name: { pl: "33", en: "33" } },
      { id: "size_44", name: { pl: "44", en: "44" } },
    ],
  },
  {
    id: "oliwa",
    title: { pl: "Głęboki granat", en: "Deep Navy" },
    design: { pl: "Kolekcja Ginkgo / Navy", en: "Ginkgo / Navy Collection" },
    images: [
      `${import.meta.env.BASE_URL || '/habit22/'}produkt__3-1.webp`,
      `${import.meta.env.BASE_URL || '/habit22/'}produkt__3-2.webp`,
      `${import.meta.env.BASE_URL || '/habit22/'}produkt__3-3.webp`,
      `${import.meta.env.BASE_URL || '/habit22/'}produkt__3-1.webp`,
      `${import.meta.env.BASE_URL || '/habit22/'}produkt__3-2.webp`,
      `${import.meta.env.BASE_URL || '/habit22/'}produkt__3-3.webp`,
    ],
    sizes: [
      { id: "size_22", name: { pl: "22", en: "22" } },
      { id: "size_33", name: { pl: "33", en: "33" } },
      { id: "size_44", name: { pl: "44", en: "44" } },
    ],
  },
];
