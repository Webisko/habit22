# Habit22 – Backend & Filament CMS

Dedykowany backend e-commerce oraz zaawansowany panel administracyjny **Filament CMS v5** dla luksusowej marki **Habit22** ([habit22.eu](https://habit22.eu)). System został zaprojektowany w architekturze bezstanowego REST API, zintegrowanego z nowoczesnym frontendem w technologii **Astro 7 + React 19 Islands**.

---

## 🛠️ Stack Technologiczny Backendu

- **Framework**: Laravel 13 (PHP 8.3+)
- **Panel Administracyjny CMS**: Filament CMS v5.6 (26 modułów zarządzania sklepem, sprzedażą, treściami i systemem)
- **Komunikacja z Frontendem**: Bezstanowe REST API (JSON) zintegrowane pod kątem frontu w **Astro 7** (routing w `routes/api.php`)
- **Autentykacja Klientów**: Laravel Sanctum (tokeny Bearer API dla kont klientów i koszyka)
- **Baza Danych**: SQLite z trybem WAL (Write-Ahead Logging) na środowisku lokalnym i produkcyjnym, z pełną kompatybilnością z MySQL / MariaDB
- **Wielojęzyczność**: `spatie/laravel-translatable` (język polski `pl` oraz angielski `en`)
- **Płatności Online**: Stripe & Przelewy24 (z obsługą Direct BLIK 0-click oraz asynchronicznych webhooków)
- **Logistyka**: InPost ShipX (Paczkomaty i Kurier) oraz ORLEN Paczka (SOAP) z bezpośrednim generowaniem etykiet PDF
- **Fakturowanie**: `MinimalPdfGenerator` oraz `barryvdh/laravel-dompdf` (faktury VAT, proformy i split payment)
- **WebSockets / Real-Time**: Laravel Reverb (powiadomienia w czasie rzeczywistym w panelu administratora)

---

## 📋 Wymagania Systemowe

Przed uruchomieniem backendu upewnij się, że Twoje środowisko spełnia poniższe wymagania:

* **PHP**: `>= 8.3`
* **Rozszerzenia PHP**: `pdo_sqlite` / `sqlite3`, `bcmath` (do precyzyjnych kalkulacji cen i walut), `ctype`, `curl`, `dom`, `fileinfo`, `filter`, `hash`, `mbstring`, `openssl`, `pcre`, `session`, `xml`, `zip`
* **Composer**: `>= 2.7`
* **Node.js**: `>= 20.x` oraz **npm** (do kompilacji assetów panelu Filament z Tailwind v4)

---

## 🎛️ Główne Moduły CMS & Backend (Filament CMS)

Wbudowany panel administracyjny Filament CMS udostępnia zoptymalizowane pod kątem SEO i UX moduły operacyjne:

### 🛒 Obsługa Sprzedaży & Katalogu Habit22

* **Katalog Produktów (`Products`, `ProductCategories`, `ProductAttributes`, `ProductVariants`)**:
  * Pełna obsługa produktów fizycznych (torby lniane Habit22), wariantów rozmiarowych (`22`, `33`, `44`) oraz produktów cyfrowych lub usług.
  * Drzewiasta struktura kategorii oraz elastyczny system opcji i cech.
  * **Sortowanie kategorii (Sort Order)**: Wbudowane zarządzanie kolejnością kategorii w tabeli metodą drag-and-drop na podstawie pola `sort_order`.
  * **System wariantów (Product Options & Variants)**: Zarządzanie wariantami produktu (unikalne SKU, cena regularna/promocyjna, stawka VAT, stany magazynowe).
  * **Dynamiczna cena katalogowa**: Jeśli produkt posiada warianty, cena wyjściowa i najniższa cena z 30 dni są wyliczane dynamicznie z najtańszego dostępnego wariantu.
  * **Galeria zdjęć**: Obsługa wielu zdjęć WebP dla każdego produktu konfigurowana w panelu administratora.
  * **Dyrektywa Omnibus**: Automatyczna historia zmian cen regularnych i promocyjnych dla produktów i wariantów (`lowest_price_last_30_days`), wyliczająca najniższą cenę z ostatnich 30 dni przed obniżką.
  * **Wyróżniki marketingowe (Nowość / Bestseller)**: Przełączniki w panelu Filament nadające produktom statusy `is_new` oraz `is_bestseller`.
* **Procesy Zamówień, Wysyłek & Płatności (`Orders`, `Coupons`)**:
  * Rejestr zamówień z historią zmian statusów, szczegółami dostawy oraz podglądem płatności.
  * **Zakupy jako gość (Guest Checkout)**: Wbudowana opcja `allow_guest_checkout` w konfiguracji i panelu Ustawień Sklepu.
  * **Zakupy B2B & Autouzupełnianie NIP**: Weryfikacja NIP w GUS BIR oraz Białej Liście MF z 3-sekundowym limitem czasu i mechanizmem `timeout_fallback` (brak blokady koszyka w przypadku awarii rejestrów państwowych).
  * **Integracje Księgowe (Fakturownia, iFirma, inFakt, wFirma)**: Asynchroniczny system zdarzeń (`OrderPaid` -> `SendOrderToAccountingJob`) przesyłający dane opłaconych zamówień do zewnętrznych API księgowych.
  * **Logistyka InPost ShipX**: Integracja z API InPost bezpośrednio w widoku zamówienia w panelu Filament – akcje „Generuj etykietę InPost” (Paczkomaty i Kurier z wyborem gabarytu A/B/C) oraz „Pobierz etykietę PDF”.
  * **Logistyka ORLEN Paczka**: Integracja z API ORLEN Paczka (SOAP) w widoku zamówienia – generowanie i pobieranie etykiet PDF, przypisywanie numeru trackingu i aktualizacja statusu.
  * **Płatności Direct BLIK (0-click)**: API obsłuży bezpośrednie przetwarzanie 6-cyfrowego kodu BLIK na froncie Astro przez endpoint `/api/checkout/orders/{number}/payment-session`.
  * **Generowanie Faktur PDF**: Klasa `MinimalPdfGenerator` w czystym PHP bez zewnętrznych bibliotek generuje faktury VAT po opłaceniu zamówienia lub proformy dla statusu `pending`.
  * **Mechanizm Podzielonej Płatności (MPP / Split Payment)**: Automatyczna adnotacja na fakturze dla transakcji B2B w PLN od kwoty 15 000 zł.
  * **Wielowalutowość & VAT OSS**: Wsparcie dla PLN i EUR na podstawie kursów z Ustawień Sklepu oraz automatyczne nadpisywanie stawki VAT stawką kraju przeznaczenia w transakcjach wewnątrzunijnych B2C.
  * **Eksport Zamówień do CSV**: Dedykowana akcja eksportu zamówień optymalizowana pod polskie biura rachunkowe (UTF-8 BOM, separator średnik `;`).
  * **Wycena Koszyka (Quote API - `/api/quote`)**: Bezstanowy endpoint umożliwiający natychmiastowe przeliczenie cen, kuponów, podatków i kosztów wysyłki w jednym zapytaniu.
  * **Kody Rabatowe (`Coupons`)**: Kupony procentowe i kwotowe z progami minimalnymi i limitami użyć.
  * **Zwroty i Reklamacje (RMA - `OrderReturnResource`)**: Obsługa zgłoszeń zwrotu z zabezpieczeniem *Double Refund Protection* (weryfikacja sumy dotychczas zgłoszonych zwrotów względem zakupionej ilości) oraz trwałe potwierdzenia mailowe.
  * **Powiadomienia o dostępności (Back-in-Stock)**: Zapis na powiadomienia e-mail o powrocie wyprzedanego rozmiaru torby z automatyczną wysyłką maila po uzupełnieniu stanu magazynowego.
  * **Ręczne operacje w panelu**:
    * Tworzenie klientów ręcznie w panelu bez rejestracji przez front,
    * Tworzenie i edycja zamówień telefonicznych przez administratora (`ORD-YYYYMMDD-XXXXXX`),
    * Ręczne rejestrowanie zwrotów osobistych w panelu.

### 📝 Treści, Marketing i SEO

* **Zarządzanie Stronami Statycznymi (`ContentPages`)**: Podstrony (regulaminy, polityka prywatności, o marce) z wyborem szablonu i metadanych SEO.
* **Dziennik / Blog (`BlogPosts`)**: Artykuły z autorem (Adriana), bibliografią, linkami zewnętrznymi wspierającymi E-E-A-T oraz schematem JSON-LD `BlogPosting`.
* **Baza FAQ (`FaqItems`)**: Pytania i odpowiedzi z grupowaniem i sortowaniem drag-and-drop, generujące schemat JSON-LD `FAQPage`.
* **Formularze Kontaktowe (`ContactInquiries`)**: Przechowywanie zapytań kontaktowych z dynamicznym JSON payload i audytem RODO (IP, User Agent).
* **Newsletter z Double Opt-In (`NewsletterSubscribers`, `NewsletterCampaigns`)**:
  * Zapis przez API (`POST /api/newsletter/subscribe`) z automatyczną wysyłką linku aktywacyjnego,
  * Potwierdzenie subskrypcji (`GET /newsletter/confirm/{token}`) z logowaniem IP i czasu,
  * Bezpieczne wypisanie (Opt-Out) przez podpisany link w stopce maila (`GET /newsletter/unsubscribe/{email}`).
* **Baner Cookies & Rejestr Zgód RODO (`CookieConsents`)**: Zarządzanie banerem cookies, identyfikatorami GTM / GA / Pixel oraz rejestrowanie wyborów użytkownika w audytowej tabeli bazy danych (`POST /api/cookie-consents`).
* **Dynamiczna Sitemap XML & robots.txt**:
  * Automatycznie generowana mapa witryny `/sitemap.xml`,
  * Dynamiczny plik `/robots.txt` blokujący indeksowanie panelu `/admin`, koszyka `/cart` i checkoutu `/checkout`.
* **Wielojęzyczność (Multilingual)**: Wygodne zakładki PL/EN w formularzach Filamenta oraz middleware `SetLocaleMiddleware` parsujący nagłówek `Accept-Language`.

### 🔒 Bezpieczeństwo i Uprawnienia (RBAC)

* **Role użytkowników panelu**:
  * `admin` – Pełny dostęp techniczny (konfiguracja integracji, logi, kopie zapasowe, użytkownicy).
  * `manager` – Dostęp biznesowy (zarządzanie produktami, zamówieniami, zwrotami, klientami, blogiem, stronami). Brak dostępu do konfiguracji technicznej i logów.
  * `employee` – Dostęp operacyjny do realizacji zamówień i etykiet logistycznych (brak wglądu w statystyki finansowe, brak możliwości usuwania danych).
  * `customer` – Klient sklepu (dostęp wyłącznie przez API Sanctum).
* **Zabezpieczenia kont**: Blokada samousunięcia konta admina, ochrona ról nadrzędnych, uwierzytelnianie dwuskładnikowe 2FA (Filament Breezy).
* **Audyt Aktywności (`AdminActivityLogs`)**: Rejestr wszystkich akcji (tworzenie, edycja ze snapshotem zmian, usuwanie i przywracanie obiektów).
* **Bezpieczne usuwanie (SoftDeletes)**: Kosz systemowy dla zamówień, produktów, klientów, zwrotów i stron.
* **Kopie zapasowe (`spatie/laravel-backup`)**: Tworzenie archiwów bazy danych SQLite i plików (`php artisan backup:run`).

---

## 🚀 Szybki Start (Lokalne Środowisko Deweloperskie)

### 1. Instalacja zależności PHP
```bash
composer install
copy .env.example .env
php artisan key:generate
```

### 2. Przygotowanie bazy danych SQLite
```bash
# W Windows PowerShell:
New-Item -ItemType File -Path "database/database.sqlite" -Force
```

### 3. Migracje i Dedykowany Seeder Habit22
Uruchom migracje bazy danych wraz z dedykowanymi danymi marki **Habit22**:
```bash
php artisan migrate --seed --seeder=Habit22DatabaseSeeder
php artisan db:seed --class=EmailTemplateSeeder
```

Zasiane dane obejmują:
- **Konta dostępowe (Super Admin, Manager)**: Zdefiniowane w seederze (dane logowania w lokalnym pliku `CREDENTIALS_LOCAL.md`)
- **Produkty Habit22**: Kratka Vichy, Szałwiowa zieleń, Głęboki granat w rozmiarach `22`, `33`, `44` z ceną 350,00 zł
- **Kody rabatowe**: `HABIT10` (-10%) oraz `LATO50` (-50 zł przy zamówieniu od 200 zł)
- **Wpisy Dziennika**: Autorskie artykuły Adriany o pielęgnacji lnu i rytuałach codzienności
- **Metody wysyłki**: Paczkomat InPost (15 zł) oraz Kurier (20 zł)

### 4. Kompilacja assetów panelu Filament
```bash
npm install
npm run build
php artisan storage:link
```

### 5. Uruchomienie serwera deweloperskiego
```bash
php artisan serve
```
- Panel administracyjny: `http://127.0.0.1:8000/admin`
- REST API: `http://127.0.0.1:8000/api`

---

## 💻 Dedykowane Komendy CLI (Artisan)

Aplikacja udostępnia zestaw autorskich poleceń CLI wspierających zadania operacyjne i automatyzację:

* **Zarządzanie administratorami**:
  ```bash
  php artisan app:make-admin-user {email} --name="Nazwa" --password="Hasło" --promote-existing
  ```
  Tworzy nowe konto administratora lub promuje istniejącego użytkownika do roli admina.

* **Odzyskiwanie Porzuconych Koszyków**:
  ```bash
  php artisan app:recover-abandoned-carts
  ```
  Wyszukuje koszyki (szkice zamówień) porzucone na czas dłuższy niż zdefiniowany próg (domyślnie 2 godziny) i wysyła e-maile przypominające. Uruchamiane co godzinę w harmonogramie.

* **Czyszczenie Historii Cen (Omnibus)**:
  ```bash
  php artisan app:cleanup-price-history
  ```
  Usuwa wpisy z historii cen starsze niż 90 dni, w pełni zachowując 30-dniowy wymóg dyrektywy Omnibus.

* **Retencja Danych Newslettera (RODO)**:
  ```bash
  php artisan app:cleanup-pending-subscribers --days=14
  ```
  Usuwa niepotwierdzone subskrypcje Double Opt-In starsze niż 14 dni.

* **Czyszczenie Porzuconych Szkiców**:
  ```bash
  php artisan app:cleanup-abandoned-carts --days=30
  ```
  Usuwa z bazy niedokończone zamówienia o statusie `draft` starsze niż 30 dni.

* **Dobowa Agregacja Analityki**:
  ```bash
  php artisan app:aggregate-analytics-daily --date="2026-06-14"
  ```
  Generuje dobowe podsumowania wizyt, odsłon i konwersji z surowych zdarzeń analitycznych.

* **Masowy Import JSON**:
  ```bash
  php artisan app:import-shop-json {dataset} {sciezka/do/pliku.json} --dry-run
  ```
  Wspiera datasety: `products`, `product-categories`, `content-pages`, `blog-posts`, `faq-items`, `coupons`, `newsletter-subscribers`, `redirect-rules`, `customers`, `orders`.

---

## ⚙️ Kluczowa Konfiguracja (`.env`)

### Baza Danych SQLite (Tryb WAL)
```env
DB_CONNECTION=sqlite
DB_BUSY_TIMEOUT=5000
DB_JOURNAL_MODE=wal
DB_SYNCHRONOUS=normal
```

### Integracje Płatności
```env
# Stripe
STRIPE_ENABLED=true
STRIPE_KEY="pk_live_..."
STRIPE_SECRET="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Przelewy24
PRZELEWY24_ENABLED=true
PRZELEWY24_MERCHANT_ID=XXXXX
PRZELEWY24_POS_ID=XXXXX
PRZELEWY24_CRC="kod_crc"
PRZELEWY24_API_KEY="klucz_api"
PRZELEWY24_API_BASE_URL="https://secure.przelewy24.pl/api/v1"
```

### Integracje Logistyczne
```env
# InPost ShipX
INPOST_ORGANIZATION_ID="id_organizacji"
INPOST_TOKEN="token_api"
INPOST_SANDBOX=false

# ORLEN Paczka
ORLEN_PACZKA_PARTNER_ID="partner_id"
ORLEN_PACZKA_PARTNER_KEY="partner_key"
ORLEN_PACZKA_SANDBOX=false
```

### Bezpieczeństwo i CORS dla Frontendu Astro
```env
ALLOWED_ORIGINS="http://localhost:3000,https://habit22.eu"
FRONTEND_URL="https://habit22.eu"
STOREFRONT_URL="https://habit22.eu"
FILAMENT_PATH="admin"
SANCTUM_TOKEN_EXPIRATION=10080
ADD_SECURITY_HEADERS=true
```

---

## 🧪 Testy Automatyczne

Aplikacja posiada pełny pakiet 134+ testów jednostkowych i integracyjnych:

```bash
# Wszystkie testy
php artisan test

# Testy bezpieczeństwa, autoryzacji i tokenów Sanctum
php artisan test --filter=SecurityTest
```

---

## 📁 Architektura Domenowa (`app/Domain/`)

Kod logiki biznesowej został zorganizowany w przejrzyste domeny:
- **Commerce**: Wycena koszyka (`QuoteService`), silnik rabatów, warianty, checkout, obsługa płatności i zamówień.
- **Customers**: Profile klientów, książka adresowa, segmentacja lojalnościowa.
- **Logistics**: Integracje z przewoźnikami (InPost, ORLEN Paczka, kurierzy).
- **Communication**: Szablony mailowe, mechanizm Double Opt-In, wysyłka kampanii w kolejce.
- **Storefront**: Transformacje zasobów API dla frontendu Astro 7.
