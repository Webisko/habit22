# Habit22 – Luksusowa Platforma E-commerce (Headless)

Oficjalna dokumentacja techniczna i projektowa platformy e-commerce **Habit22** – autorskiej marki projektującej i szyjącej luksusowe torby projektowe oraz akcesoria ze 100% naturalnego lnu, dedykowane dla dziewiarek, rękodzielników i pasjonatów rzemiosła.

---

## 📌 1. Podsumowanie Projektu i Informacje o Kliencie

| Parametr | Szczegóły |
|---|---|
| **Klient / Marka** | **Habit22** ([habit22.eu](https://habit22.eu)) |
| **Założycielka & Projektantka** | **Adriana** (`kontakt@habit22.eu`) |
| **Realizacja Techniczna & Dev** | **Webisko** (`admin@webisko.pl`) |
| **Profil Marki & Branża** | Premium Slow Craft, dziewiarstwo, akcesoria dziewiarskie, naturalny len |
| **Segment Rynkowy** | D2C (Direct to Consumer) oraz B2B (sprzedaż dla firm z NIP i walidacją GUS) |
| **Rynki Docelowe & Języki** | Polska i rynki zagraniczne Unii Europejskiej; pełna dwujęzyczność (**PL** / **EN**) |
| **Waluty** | **PLN** (domyślna) oraz **EUR** (wielowalutowość) |
| **Środowisko Produkcyjne** | Hosting współdzielony / dedykowany (serwer WWW LiteSpeed Enterprise / Apache, PHP 8.3 CLI) |
| **Adresy Produkcyjne** | Sklep główny: `https://habit22.eu` <br> Panel CMS & API: `https://panel.habit22.eu` |

### 🧶 Misja i Założenia Projektowe Marki
Habit22 powstało z fascynacji szlachetnymi, naturalnymi tkaninami oraz ideą świadomego projektowania przedmiotów codziennego użytku. Flagowymi produktami marki są **ręcznie szyte torby projektowe** z grubego, certyfikowanego lnu i bawełny:
- **Konstrukcja użytkowa**: Usztywniane dno pozwalające torbie stabilnie stać podczas nabierania oczek na druty, trzy pojemne kieszenie wewnętrzne na druty, żyłki, nożyczki, motki i notatki projektowe, mocne bawełniane taśmy nośne.
- **Kolekcje wzornicze**:
  - *Kratka Vichy* (Kolekcja Gingham / Vichy) – klasyczny wzór w kratkę,
  - *Szałwiowa zieleń* (Kolekcja Eucalyptus / Linen) – kojący, naturalny odcień szałwii,
  - *Głęboki granat* (Kolekcja Ginkgo / Navy) – szlachetny, rzemieślniczy granat.
- **System rozmiarów**: Każdy model oferowany jest w rozmiarach modułowych: `22` (kompaktowy), `33` (klasyczny), `44` (pojemny format podróżny).

---

## 🏗️ 2. Architektura Systemu (Headless E-commerce)

Projekt został zrealizowany w architekturze **zdekapitowanej (Headless / Decoupled)** w strukturze monorepo:

```
habit22-dev/
├── src/                      # [FRONTEND] Astro 7 + React 19 Islands + Tailwind v4
│   ├── components/           # Interaktywne wyspy React (Koszyk, Checkout, InPost Mapa)
│   ├── data/                 # Bezpieczny klient API (apiClient.ts) i fallback danych
│   ├── i18n/                 # Słowniki wielojęzyczne (PL/EN) i routing językowy
│   ├── layouts/              # Główny layout Astro (SEO, nagłówki, szum ziarna)
│   ├── pages/                # Statyczne trasy Astro (PL w root, EN w /en)
│   ├── stores/               # Stan globalny w Nanostores (koszyk, waluta, toasty)
│   ├── templates/            # Współdzielone szablony podstron (Sklep, O Marce, Dziennik)
│   └── types/                # Definicje typów TypeScript dla API i produktów
├── backend/                  # [BACKEND & CMS] Laravel 13 + Filament 5 CMS
│   ├── app/Domain/           # Domenowa logika biznesowa (Commerce, Customers, Logistics)
│   ├── app/Filament/         # Panel administracyjny Filament 5 (26 zasobów CRUD)
│   ├── app/Http/Controllers/ # Kontrolery REST API oraz webowe
│   ├── app/Http/Resources/   # Ustandaryzowane transformatory JsonResource
│   ├── app/Models/           # Modele Eloquent z Laravel 13 casts() i relacjami
│   ├── config/               # Konfiguracje (shop, cors, filesystems, accounting)
│   ├── database/             # Migracje (62 tabele) i dedykowane seedery Habit22
│   └── routes/               # Routing (api.php, web.php, console.php)
├── public/                   # Assety statyczne (zdjęcia toreb WebP, fonty, dokumenty prawne)
├── astro.config.mjs          # Konfiguracja Astro 7 (i18n, sitemap, Vite)
└── package.json              # Zależności frontendu
```

### ⚡ Kluczowe Zasady Architektury:
1. **Statyczny Frontend (SSG) z Wyspami Interaktywnymi**:
   Wszystkie podstrony informacyjne, katalogi produktów i wpisy na blogu są generowane do czystego HTML/CSS podczas budowania strony (`npm run build`), co zapewnia natychmiastowe ładowanie (Core Web Vitals) i perfekcyjną indeksację Google. Dynamiczne funkcje (koszyk, checkout, autouzupełnianie, mapa punktów InPost) są osadzone jako lekkie komponenty **React 19** hydratowane na żądanie (`client:load`, `client:visible`).
2. **Graceful Static Fallback (`apiClient.ts`)**:
   Frontend Astro komunikuje się z backendem za pośrednictwem bezpiecznego klienta z 2-sekundowym timeoutem i blokami `try...catch`. W przypadku braku uruchomionego serwera backendu lub w trakcie prac konserwacyjnych proces budowania (`astro build`) nie zostaje przerwany – strona korzysta z wbudowanego statycznego fallbacku (`src/data/products.ts`), gwarantując stuprocentową niezawodność witryny.
3. **Bezstanowe REST API**:
   Backend Laravel udostępnia ponad 35 punktów końcowych JSON zoptymalizowanych pod kątem narzutu sieciowego, z obsługą CORS, rate-limitera dla formularzy oraz autoryzacji tokenami **Laravel Sanctum**.

---

## 🛠️ 3. Zastosowany Stack Technologiczny

### Frontend
- **Framework bazowy**: [Astro 7.3](https://astro.build/) – Island Architecture, generowanie statyczne (SSG), natywne wsparcie dla i18n i sitemap XML.
- **Komponenty interaktywne**: [React 19.3](https://react.dev/) + React DOM.
- **Style & Design System**: [Tailwind CSS v4](https://tailwindcss.com/) z natywną integracją `@tailwindcss/vite` oraz niestandardową paletą kolorów (ciepłe beże, lniane brązy, akcenty natury).
- **Zarządzanie stanem (State Management)**: [Nanostores](https://github.com/nanostores/nanostores) & [@nanostores/persistent](https://github.com/nanostores/persistent) – zero boilerplate'u, pełna reaktywność z automatyczną synchronizacją z `localStorage`.
- **Mapy & Logistyka**: [Leaflet 1.9](https://leafletjs.com/) – autorska, responsywna mapa punktów odbioru Paczkomaty InPost z geolokalizacją i wyszukiwarką miast (niewymagająca płatnych tokenów API).
- **Animacje**: [Motion 12](https://motion.dev/) (Framer Motion) – mikroanimacje przejść, karuzele zdjęć i wysuwana szuflada koszyka.
- **Ikony**: [Lucide React](https://lucide.dev/).
- **Renderowanie treści**: [react-markdown](https://github.com/remarkjs/react-markdown) i `remark-gfm` (dynamiczne wyświetlanie regulaminów i polityk).

### Backend & CMS
- **Framework główny**: [Laravel 13](https://laravel.com/) (PHP 8.3+).
- **Panel Administracyjny CMS**: [Filament CMS v5.6](https://filamentphp.com/) – zaawansowany panel operacyjny z 26 modułami CRUD, obsługą ról RBAC, filtrami i podglądem na żywo.
- **Uwierzytelnianie & Bezpieczeństwo**: [Laravel Sanctum 4](https://laravel.com/docs/sanctum) (tokeny Bearer dla klientów) oraz [Filament Breezy](https://github.com/jeffgreco13/filament-breezy) (2FA – weryfikacja dwuetapowa dla administratorów).
- **Baza danych**: SQLite (z trybem WAL `journal_mode=wal` oraz `busy_timeout=5000` dla maksymalnej wydajności) na środowisku produkcyjnym i lokalnym, z pełną kompatybilnością z MySQL 8 / MariaDB.
- **Wielojęzyczność bazy**: [spatie/laravel-translatable 6](https://github.com/spatie/laravel-translatable) – przechowywanie tłumaczeń nazw, opisów i wpisów jako JSON.
- **Fakturowanie & Dokumenty PDF**: `MinimalPdfGenerator` oraz [barryvdh/laravel-dompdf 3](https://github.com/barryvdh/laravel-dompdf) (generowanie faktur VAT i proform w locie).
- **Kopie zapasowe**: [spatie/laravel-backup 10](https://github.com/spatie/laravel-backup).
- **Powiadomienia Real-time**: [Laravel Reverb 1.10](https://reverb.laravel.com/) – WebSockets dla natychmiastowych powiadomień o nowych zamówieniach w panelu Filament.

---

## 🌟 4. Szczegółowy Wykaz Funkcji Systemu

### 🛍️ Katalog Produktów i Zakupy
- **Warianty produktowe**: Obsługa modeli toreb z wariantami rozmiarów (`22`, `33`, `44`), odrębnymi SKU, stanami magazynowymi i cenami.
- **Wycena w locie (Quote API - `POST /api/quote`)**: Natychmiastowe przeliczanie wartości koszyka, rabatów z kuponów, podatków i kosztów wysyłki przed złożeniem zamówienia.
- **Dyrektywa Omnibus**: Automatyczna historia cen w bazie i wyliczanie najniższej ceny z ostatnich 30 dni dla każdego wariantu i produktu (`lowest_price_last_30_days`).
- **Powiadomienia o dostępności (Back-in-Stock)**: Zapis klienta na mailowe powiadomienie o powrocie wyprzedanego rozmiaru (`POST /api/catalog/products/back-in-stock-subscribe`) z automatyczną wysyłką powiadomienia po podniesieniu stanu magazynowego.
- **Rekomendacje produktowe**: Wbudowany moduł relacji produktów (podobne, up-sell, cross-sell) oraz dynamiczne rekomendacje oparte na historii zamówień.

### 💳 Ścieżka Zakupowa (Checkout) & Płatności
- **Zakupy bez rejestracji (Guest Checkout)**: Możliwość złożenia zamówienia bez konieczności zakładania konta.
- **B2B & Weryfikacja GUS BIR / Biała Lista MF**: Automatyczne pobieranie danych firmy (nazwa, adres) po wpisaniu numeru NIP (`GET /api/b2b/gus/{nip}`) z odpornością na awarie rejestrów (`timeout_fallback` z powrotem do wprowadzania ręcznego).
- **Status Przedsiębiorcy Uprzywilejowanego (JDG B2C)**: Obsługa oświadczenia jednoosobowych działalności gospodarczych o niezawodowym charakterze zakupu, chroniącego prawa konsumenckie przedsiębiorcy.
- **Bramki płatności**:
  - **Przelewy24** z obsługą płatności szybkimi przelewami bankowymi oraz bezpośrednim kodem **Direct BLIK (0-click)** na froncie sklepu,
  - **Stripe** z obsługą kart płatniczych, Apple Pay i Google Pay,
  - Bezpieczne webhooki asynchronicznie aktualizujące status płatności zamówienia (`paid`).
- **Automatyczne zwroty środków (Refunds)**: Integracja z API Stripe i P24 do bezpośredniego zwrotu wpłaconych środków przy anulowaniu opłaconego zamówienia.

### 📦 Logistyka i Dostawa
- **InPost Paczkomaty (Frontend)**: Interaktywne okno modalne z mapą Leaflet i geolokalizacją umożliwiające klientowi wybór najbliższego Paczkomatu z prezentacją adresu i godzin dostępności. Identyfikator punktu (`delivery_point.id`) jest walidowany i zapisywany w zamówieniu.
- **InPost ShipX (Backend Filament)**: Generowanie przesyłek i pobieranie etykiet adresowych PDF bezpośrednio z poziomu panelu administratora (obsługa Paczkomatów i Kuriera z wyborem gabarytu A/B/C).
- **ORLEN Paczka**: Integracja z protokołem SOAP do generowania etykiet i automatycznego nadawania numerów trackingowych.
- **Strefy wysyłkowe (Shipping Zones)**: Możliwość definiowania stawek dostawy dla wybranych krajów europejskich.

### ⚖️ Zgodność Prawna e-Commerce (Stan na 2026 Rok)
- **Elektroniczny przycisk odstąpienia od umowy (RMA - Dyrektywa 2023/2673)**: Dwuetapowy mechanizm zgłoszenia zwrotu online dla zalogowanych oraz gości (`POST /api/returns`) bez wymogu podawania przyczyny, z automatycznym wygenerowaniem potwierdzenia ze znacznikiem czasu na trwałym nośniku (e-mail) oraz ochroną przed wielokrotnym zwrotem tej samej sztuki (*Double Refund Protection*).
- **Zgody RODO i Regulaminów**: Rozdzielność zgód (*Unbundled Consents*), brak domyślnie zaznaczonych checkboxów, audytowy zapis akceptacji z wersją regulaminu, adresem IP i znacznikiem czasu w metadanych zamówienia.
- **Rejestr Zgód Cookies**: Dedykowany log audytowy (`POST /api/cookie-consents`) zapisujący wybory użytkownika (niezbędne, analityczne, marketingowe).
- **Zakaz geoblokowania**: Brak sztucznego blokowania klientów z innych krajów UE przy zachowaniu przejrzystych stref dostawy.
- **Podatki VAT OSS**: Automatyczne naliczanie stawki VAT kraju przeznaczenia dla konsumentów w UE.
- **Mechanizm Podzielonej Płatności (MPP)**: Automatyczna adnotacja na fakturze dla transakcji B2B w PLN od kwoty 15 000 zł.

### 👥 Konta Klientów (Sanctum API)
- Rejestracja i logowanie klientów z weryfikacją e-mail (podpisane linki kryptograficzne).
- Panel klienta z historią złożonych zamówień, statusami przesyłek oraz numerami śledzenia.
- Książka adresowa (`/api/account/addresses`) z możliwością zapisu wielu adresów wysyłkowych i rozliczeniowych.
- Lista życzeń / Ulubione (`/api/account/wishlist`).

### 🎛️ Panel Administracyjny Filament 5 CMS
Panel dostępny pod adresem `/admin` udostępnia 26 zasobów zorganizowanych w logiczne grupy:
1. **Sklep i sprzedaż**:
   - `Orders` (rejestr zamówień, generowanie etykiet InPost/Orlen, wystawianie faktur PDF, ręczne dodawanie zamówień telefonicznych, eksport do CSV dla księgowości).
   - `OrderReturns` (obsługa zgłoszeń RMA, zatwierdzanie zwrotów, generowanie korekt).
   - `AbandonedCarts` (monitorowanie i odzyskiwanie porzuconych koszyków).
   - `Coupons` (zarządzanie kodami rabatowymi kwotowymi i procentowymi).
2. **Katalog produktów**:
   - `Products` (karty produktów, galeria zdjęć, warianty rozmiarów 22/33/44, ceny, stany magazynowe, SEO/OG, flagi Bestseller/Nowość, zgodność GPSR).
   - `ProductCategories` (hierarchia kategorii z sortowaniem drag-and-drop).
   - `ProductAttributes` (cechy i opcje wariantowe).
   - `ProductReviews` (moderacja opinii o produktach).
   - `BackInStockSubscriptions` (rejestr oczekujących powiadomień magazynowych).
3. **Klienci i kontakt**:
   - `Customers` (baza klientów, segmentacja lojalnościowa i hurtowa z automatycznymi rabatami, eksport CSV).
   - `ContactInquiries` (formularze kontaktowe z dynamiczną tabelą pól JSON).
   - `NewsletterSubscribers` (baza subskrybentów z procedurą Double Opt-In).
   - `NewsletterCampaigns` (edytor kampanii e-mail z wysyłką asynchroniczną i linkami opt-out).
4. **Treści i marketing**:
   - `BlogPosts` (Dziennik – artykuły o pielęgnacji lnu, biogramy autorów, bibliografia E-E-A-T, JSON-LD).
   - `ContentPages` (strony statyczne, regulaminy, polityki z dynamicznym renderingiem).
   - `FaqItems` (baza FAQ z podziałem na kategorie i schematem `FAQPage`).
   - `StoreSettings` (globalne ustawienia sklepu, progi darmowej dostawy, waluty, stawki wysyłki, baner cookies, kody GTM/GA/Pixel, tryb konserwacji).
5. **System i logi**:
   - `Users` (użytkownicy panelu z rolami RBAC: `admin`, `manager`, `employee`).
   - `AdminActivityLogs` (rejestr audytowy wszystkich zmian w panelu CMS).
   - `CookieConsents` (przeglądarka zarejestrowanych zgód RODO).
   - `Invoices` (rejestr wygenerowanych faktur i proform PDF).
   - `IntegrationLogs` (logi komunikacji z bramkami płatności i API księgowości).
   - `TransactionalEmailLogs` (rejestr wysłanych wiadomości transakcyjnych).
   - `FailedJobs` (monitorowanie błędów w kolejce zadań).
   - `RedirectRules` (automatyczne i ręczne przekierowania 301).

---

## 🚀 5. Instrukcja Uruchomienia Lokalnego

### Wymagania wstępne
- **Node.js**: `>= 20.x` oraz **npm**
- **PHP**: `>= 8.3` (z rozszerzeniami `pdo_sqlite`, `bcmath`, `curl`, `mbstring`, `openssl`, `xml`, `zip`)
- **Composer**: `>= 2.7`

---

### Krok 1: Klonowanie i instalacja zależności frontendu
```bash
# Główny katalog projektu (habit22-dev)
npm install
```

### Krok 2: Konfiguracja zmiennych środowiskowych frontendu
Skopiuj plik `.env.example` do `.env.local`:
```bash
cp .env.example .env.local
```
Zawartość `.env.local`:
```env
PUBLIC_API_URL="http://127.0.0.1:8000/api"
APP_URL="http://localhost:3000"
```

### Krok 3: Przygotowanie backendu Laravel
Przejdź do podkatalogu `backend/`:
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Utwórz lokalną bazę SQLite i uruchom migracje z dedykowanymi danymi **Habit22**:
```bash
# Utworzenie pliku bazy (w Windows PowerShell):
New-Item -ItemType File -Path "database/database.sqlite" -Force

# Uruchomienie migracji i seederów marki Habit22:
php artisan migrate --seed --seeder=Habit22DatabaseSeeder
php artisan db:seed --class=EmailTemplateSeeder
```

Zbuduj assety panelu Filament:
```bash
npm install
npm run build
```

Utwórz symlink do pamięci masowej (zdjęcia, faktury):
```bash
php artisan storage:link
```

---

### Krok 4: Uruchomienie serwerów deweloperskich

**Terminal 1 – Backend Laravel (Port 8000):**
```bash
cd backend
php artisan serve
```
*Panel CMS dostępny pod adresem:* `http://127.0.0.1:8000/admin`  
*API REST dostępne pod adresem:* `http://127.0.0.1:8000/api`

**Dostęp do panelu CMS:**
Konta startowe administratora i menedżera są generowane przez seeder `Habit22DatabaseSeeder`. Szczegółowe dane dostępowe (loginy i hasła startowe) znajdują się w lokalnym pliku bezpieczeństwa `CREDENTIALS_LOCAL.md` (wykluczonym z gita i deploymentu).

**Terminal 2 – Frontend Astro (Port 3000):**
```bash
# W głównym katalogu habit22-dev:
npm run dev
```
*Sklep internetowy dostępny pod adresem:* `http://localhost:3000` (lub z subfolderem bazowym skonfigurowanym w `.env`).

---

## 🧪 6. Testy i Weryfikacja Jakości

Projekt posiada kompletny zestaw testów automatycznych backendu oraz kontrolę typów frontendu:

```bash
# 1. Testy jednostkowe i integracyjne backendu (134+ testów, 630+ asercji):
cd backend
php artisan test

# 2. Testy bezpieczeństwa i autoryzacji:
php artisan test --filter=SecurityTest

# 3. Weryfikacja typów TypeScript we frontendzie Astro:
npm run lint

# 4. Statyczny build produkcyjny Astro (weryfikacja 42 stron):
npm run build
```

---

## 🌐 7. Środowisko Produkcyjne i Deployment

Aplikacja jest przystosowana do wdrożenia na serwerze współdzielonym lub dedykowanym z panelem DirectAdmin i serwerem WWW LiteSpeed / Apache:

```
Hosting Produkcyjny
├── domains/
│   ├── habit22.eu/
│   │   └── public_html/              # Statyczny build Astro (katalog dist/)
│   │       ├── .htaccess             # Kompresja LiteSpeed i nagłówki cache
│   │       ├── _astro/               # Zoptymalizowany JS/CSS z hashami
│   │       └── index.html ...        # Wygenerowane strony HTML (PL & EN)
│   │
│   └── panel.habit22.eu/             # Backend Laravel 13 + Filament CMS
│       ├── app/                      # Kod źródłowy aplikacji (poza public docroot)
│       │   ├── database/database.sqlite
│       │   └── .env                  # Produkcyjny plik środowiskowy (poza kontrolą wersji)
│       └── public_html/              # Public DocumentRoot subdomeny
│           ├── index.php             # Punkt wejściowy Laravel
│           └── storage -> ../app/storage/app/public
```

---

## 📄 8. Spis Dokumentów Pomocniczych w Repozytorium

- [backend/API_REFERENCE.md](file:///d:/Projekty/_KLIENCI/Habit22/habit22-dev/backend/API_REFERENCE.md) – Pełna techniczna referencja wszystkich punktów końcowych REST API z przykładami zapytań i odpowiedzi.
- [backend/README.md](file:///d:/Projekty/_KLIENCI/Habit22/habit22-dev/backend/README.md) – Zaawansowany przewodnik architektoniczny backendu Laravel, domen biznesowych, konfiguracji integracji i komend CLI.
- [backend/raport-wymagan.md](file:///d:/Projekty/_KLIENCI/Habit22/habit22-dev/backend/raport-wymagan.md) – Kompleksowy raport prawno-techniczny zgodności e-commerce z unijnymi dyrektywami (Omnibus, RMA 2023/2673, EAA, RODO).
- [walkthrough.md](file:///d:/Projekty/_KLIENCI/Habit22/habit22-dev/walkthrough.md) – Raport z przeprowadzonego audytu technicznego i wdrożonych usprawnień.
