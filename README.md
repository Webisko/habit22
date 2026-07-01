# Habit22

A premium e-commerce platform crafted with **Astro 5** and **React 19** for **Habit22** – a brand specializing in high-quality project bags and accessories made of natural linen, designed specifically for knitters and craft enthusiasts.

---

## 🌟 Key Features

Habit22 is built as a highly performant, SEO-optimized, static-first web application featuring interactive "islands" for dynamic client-side functionality.

### 🛍️ Store & Product Customization
- **Interactive Product Catalog**: Grid layout displaying premium linen bags with smooth hover effects, localized details, and dynamic pricing.
- **Product Details & Gallery**: Individual product pages featuring responsive image carousels (using `motion/react`), dynamic size selection (`22`, `33`, `44`), and price calculations.
- **Persistent Shopping Cart**: A slide-out Cart Drawer managed globally using `nanostores` and `@nanostores/persistent` to save selected items in localStorage across pages and visits.

### 💳 Checkout & Order Simulation
- **Detailed Checkout Form**: Robust form validation supporting personal information, company invoicing (NIP validation), and customizable shipping/billing addresses.
- **Order Placement**: Fully simulated client-side order creation resulting in localized success feedback and generated order numbers.
- **Dynamic Order Summary**: Real-time recalculation of prices, shipping costs, and grand totals inside the checkout layout.

### 👤 Simulated User Accounts
- **Account Dashboard**: An interface displaying mock profile data (name, email, shipping information).
- **Authentication Simulation**: Mock login/logout controls, form validation, and simulated password resets with instant UI state updates stored persistently in the browser.

### 🌍 Advanced Internationalization (i18n)
- **Multi-lingual Architecture**: Out-of-the-box support for Polish (`pl`) and English (`en`).
- **Localized Routing**: Built-in routing helpers (`src/i18n/utils.ts`) that translate URL paths dynamically (e.g., `/pl/kolekcja` mapping to `/en/shop`).
- **Language Switcher**: Dynamic alternate link headers (`hreflang` tags) and an elegant navbar language toggle.

### 📄 Brand Pages & Legal Sections
- **Journal (Blog)**: Articles page displaying craft-related stories with dynamic content rendering.
- **About the Brand**: Story behind Habit22, illustrating details of craftsmanship and linen-based products.
- **FAQ Page**: Expandable list of questions and answers regarding shipping, materials, and care instructions.
- **Privacy & Terms**: Policy documents rendered dynamically in a polished Markdown view loaded directly from source files in the `public/` directory.

### 🎨 Visuals & Aesthetics
- **Premium Design Style**: Elegant background noise grain overlay, serif typography accents, custom beige-and-brown color palette, and tailored visual transitions.
- **Toast Notifications**: Reusable notification popups triggered by adding items to the cart, profile updates, and login status.
- **Responsive Layout**: Fluid grids and menus fully optimized for mobile, tablet, and desktop viewing.

---

## 🛠️ Technology Stack

- **Framework**: [Astro 5](https://astro.build/) – leveraging Island Architecture for minimal client-side JavaScript.
- **UI Architecture**: [React 19](https://react.dev/) – utilized for dynamic components requiring state synchronization.
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) – using the new Vite integration (`@tailwindcss/vite`).
- **Global State**: [Nanostores](https://github.com/nanostores/nanostores) & [Nanostores Persistent](https://github.com/nanostores/persistent) – lightweight, fast, framework-agnostic state management.
- **Animations**: [Motion](https://motion.dev/) – for fluid, hardware-accelerated animations and page transitions.
- **Icons**: [Lucide React](https://lucide.dev/) – clean, modular SVG icons.
- **Markdown Handling**: `react-markdown` and `remark-gfm` for rendering terms, privacy policies, and articles.

---

## 📂 Directory Structure

```
habit22-dev/
├── public/                 # Static assets (images, legal markdown documents)
├── src/
│   ├── components/         # Interactive React and static Astro components
│   │   ├── CartDrawer.tsx  # Slide-out persistent cart drawer
│   │   ├── Header.tsx      # Multi-lingual navigation header
│   │   ├── CheckoutForm.tsx# Multi-step checkout validation form
│   │   └── ...
│   ├── data/               # Local data definitions (products, etc.)
│   ├── i18n/               # Localization assets and routing utils
│   ├── layouts/            # Base Astro layout (metadata, grain noise, portals)
│   ├── pages/              # Astro routing (PL pages root, EN pages inside /en)
│   │   ├── dziennik/       # Polish blog pages
│   │   ├── produkt/        # Polish product pages
│   │   └── en/             # English translations for all pages
│   ├── stores/             # Nanostores state models (auth, cart, toast, currency)
│   ├── templates/          # Base Astro templates shared by PL/EN routes
│   └── index.css           # Global Tailwind and custom theme styles
├── astro.config.mjs        # Astro framework configuration (i18n, site metadata)
└── package.json            # Dependencies and npm script runner
```

---

## 🚀 Run Locally

### Prerequisites
- **Node.js** (version 18 or higher recommended)
- **npm** (comes packaged with Node.js)

### 1. Install dependencies:
```bash
npm install
```

### 2. Configure Environment Variables:
Copy `.env.example` to `.env.local` and set the application base URL:
```bash
# On Windows/Unix, copy the example:
cp .env.example .env.local
```
Inside `.env.local`, specify your hosting URL (defaults to `/habit22/` for subfolder routing or root):
```env
APP_URL="http://localhost:3000"
```

### 3. Available Scripts:

Run the development server locally:
```bash
npm run dev
```
The application will start on `http://localhost:3000/habit22/` (or similar base path).

Build the production-ready static bundle:
```bash
npm run build
```
The output files will be written to the `dist/` directory.

Preview the production build locally:
```bash
npm run preview
```

Clean the build output:
```bash
npm run clean
```

Run TypeScript verification:
```bash
npm run lint
```

---

## 🌐 SEO & Schema Optimization

Habit22 is optimized for search engines:
- **Semantic HTML**: Standard elements (`<header>`, `<main>`, `<footer>`, `<section>`) are used throughout.
- **Dynamic Meta Tags**: Automated resolution of OpenGraph (Facebook) and Twitter metadata based on locale.
- **JSON-LD Schema**: Structured data automatically generated for the Homepage to aid Google Rich Results representation.
- **Alternating Hreflangs**: Automated language mapping to ensure correct search indexing across translation domains.
