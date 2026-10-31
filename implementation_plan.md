# Plan Implementacji: 4-Stopniowy Audyt i Naprawa Błędów (project-audit-master)

Niniejszy dokument przedstawia wyniki inżynieryjnego audytu projektu Habit22 (Astro 7 + React Islands + Laravel 13 + FilamentPHP 5) przeprowadzonego zgodnie z procedurą **`project-audit-master`**, wraz z planem naprawczym.

---

## 1. Raport z Audytu (Klasyfikacja Wykrytych Podatności)

### 🔴 Błędy Krytyczne (Blokery bezpieczeństwa / finansowe / integralności danych):
1. **Fałszywy sukces zamówienia (`Fake Fallback Order Flow`) na Froncie:**
   - **Plik:** [`src/components/CheckoutForm.tsx`](file:///d:/Projekty/_KLIENCI/Habit22/habit22-dev/src/components/CheckoutForm.tsx#L367-L416)
   - **Diagnoza:** W bloku `catch (err)` przy niepowodzeniu złożenia zamówienia w backendzie (np. brak stanu magazynowego, awaria bazy, błąd walidacji), frontend generuje losowy numer `#H22-${randomNum}`, czyści koszyk i przekierowuje klienta na `/podziekowanie`. Klient uważa, że kupił towar, a w systemie nie ma zamówienia ani płatności.
2. **Hardkodowane kody rabatowe w kodzie przeglądarki (`Zero-Trust Frontend`):**
   - **Plik:** [`src/components/CheckoutForm.tsx`](file:///d:/Projekty/_KLIENCI/Habit22/habit22-dev/src/components/CheckoutForm.tsx#L147-L180)
   - **Diagnoza:** Kody `HABIT10` (-10%) i `LATO50` (-50 zł) są wklejone w logice JS formularza w gałęzi `else` oraz w `catch`, omijając reguły backendu (ważność, minimalna kwota koszyka, limit użyć).
3. **Brak Fail-Closed i brak blokady transakcyjnej (`lockForUpdate`) w webhooku Stripe:**
   - **Plik:** [`backend/app/Http/Controllers/Api/StripePaymentCallbackController.php`](file:///d:/Projekty/_KLIENCI/Habit22/habit22-dev/backend/app/Http/Controllers/Api/StripePaymentCallbackController.php#L28-L105)
   - **Diagnoza:** Brak sprawdzenia, czy `webhook_secret` nie jest pusty (`blank`) przed konstrukcją zdarzenia. Ponadto brak `lockForUpdate()` na obiekcie zamówienia i brak weryfikacji, czy status już nie wynosi `paid` — przy równoległych webhookach Stripe wyzwala wielokrotne generowanie faktur PDF i wysyłkę e-maili.
4. **Brak atomowości limitu użyć kuponu rabatowego:**
   - **Plik:** [`backend/app/Domain/Commerce/Checkout/CheckoutOrderService.php`](file:///d:/Projekty/_KLIENCI/Habit22/habit22-dev/backend/app/Domain/Commerce/Checkout/CheckoutOrderService.php#L280-L355)
   - **Diagnoza:** Magazyn towarów korzysta z `lockForUpdate()`, ale kupon rabatowy (`Coupon`) nie jest blokowany wewnątrz `DB::transaction()` i nie re-waliduje `usage_limit` pod blokadą zapisu. Dwa równoległe zamówienia mogą wykorzystać ten sam jednorazowy kupon.
5. **Brak zadania Cron zwalniającego nieopłacone zamówienia i rezerwacje:**
   - **Plik:** [`backend/routes/console.php`](file:///d:/Projekty/_KLIENCI/Habit22/habit22-dev/backend/routes/console.php#L239-L265)
   - **Diagnoza:** Brak zaplanowanego zadania anulującego zamówienia ze statusem `placed` i `payment_status: awaiting_payment` po upływie terminu (np. 48h) z `->withoutOverlapping()`. Nieopłacone zamówienia bezterminowo blokują stany magazynowe.

---

### 🟠 Błędy Ważne (Logika biznesowa, CMS, dostawa, formularze):
1. **Błąd składniowy JSON-LD na stronach produktów:**
   - **Plik:** [`src/templates/ProductTemplate.astro`](file:///d:/Projekty/_KLIENCI/Habit22/habit22-dev/src/templates/ProductTemplate.astro#L31-L55)
   - **Diagnoza:** Tag `<script type="application/ld+json" is:inline define:vars={{...}}>` kompiluje kod JavaScript (IIFE closure `function(){const name = ...}`) wewnątrz tagu JSON, co unieważnia dane strukturalne w Google Rich Results.
2. **Dostawa InPost Kurier — hardkodowany numer budynku `'1'`:**
   - **Plik:** [`backend/app/Domain/Commerce/Logistics/InPostService.php`](file:///d:/Projekty/_KLIENCI/Habit22/habit22-dev/backend/app/Domain/Commerce/Logistics/InPostService.php#L194-L214)
   - **Diagnoza:** Jeśli regex nie dopasuje numeru budynku z ciągu adresu, parser domyślnie wstawia `'building_number' => '1'` zamiast zgłosić błąd lub odczytać jawne pole `building_number`.
3. **Brak Honeypota i progu czasowego w formularzu kontaktowym i newsletterze:**
   - **Pliki:** [`backend/app/Http/Controllers/Api/ContactInquiryController.php`](file:///d:/Projekty/_KLIENCI/Habit22/habit22-dev/backend/app/Http/Controllers/Api/ContactInquiryController.php), [`backend/app/Http/Controllers/Api/NewsletterSubscribeController.php`](file:///d:/Projekty/_KLIENCI/Habit22/habit22-dev/backend/app/Http/Controllers/Api/NewsletterSubscribeController.php)
   - **Diagnoza:** Brak ukrytego pola honeypot, brak limitu długości treści zapytania, brak walidacji RFC/DNS dla e-maili.
4. **Brak ochrony kolumny `metadata` (JSON) w modelach:**
   - **Pliki:** [`backend/app/Models/Product.php`](file:///d:/Projekty/_KLIENCI/Habit22/habit22-dev/backend/app/Models/Product.php), [`backend/app/Models/Order.php`](file:///d:/Projekty/_KLIENCI/Habit22/habit22-dev/backend/app/Models/Order.php)
   - **Diagnoza:** Zapis modelu z niepełną tablicą pól formularza Filamentu nadpisuje całe drzewo JSON metadanych.

---

### 🟡 Optymalizacje (SEO, RODO Zero-Leak, Apache):
1. **RODO Zero-Leak — Zewnętrzne Google Fonts ładowane przed zgodą:**
   - **Plik:** [`src/layouts/Layout.astro`](file:///d:/Projekty/_KLIENCI/Habit22/habit22-dev/src/layouts/Layout.astro#L73-L78)
   - **Diagnoza:** Wywołania do `fonts.googleapis.com` i `fonts.gstatic.com` przesyłają adresy IP użytkowników do Google bez ich zgody. Fonty `Jost` i `Playfair Display` należy zadeklarować lokalnie w CSS za pomocą fontów systemowych / lokalnych webfontów.
2. **RODO / Dark Pattern w Banerze Cookies:**
   - **Plik:** [`src/components/CookieBanner.astro`](file:///d:/Projekty/_KLIENCI/Habit22/habit22-dev/src/components/CookieBanner.astro#L28-L42)
   - **Diagnoza:** Nierówna waga wizualna przycisku odrzucenia (słaby link tekstowy) i akceptacji (wypełniony przycisk w mocnym kolorze). Zgoda nie jest logowana do API backendu `/api/cookie-consents`.
3. **Indeksacja stron prywatnych i koszyka:**
   - **Pliki:** [`astro.config.mjs`](file:///d:/Projekty/_KLIENCI/Habit22/habit22-dev/astro.config.mjs), [`src/layouts/Layout.astro`](file:///d:/Projekty/_KLIENCI/Habit22/habit22-dev/src/layouts/Layout.astro)
   - **Diagnoza:** Strony kasy (`/zamowienie`), podziękowania (`/podziekowanie`), konta i logowania pojawiają się w mapie witryny `sitemap-0.xml` i nie mają nagłówka `noindex, nofollow`.
4. **Zabezpieczenie pliku `.htaccess`:**
   - **Plik:** [`public/.htaccess`](file:///d:/Projekty/_KLIENCI/Habit22/habit22-dev/public/.htaccess)
   - **Diagnoza:** Brak blokowania plików wrażliwych (`.env`, `.sqlite`, `.log`, `.git`), brak reguły `Options -Indexes`.

---

## 2. Proponowane Zmiany w Kodzie (Plan Naprawczy)

### Krok 1: Bezpieczeństwo i Zero-Trust na Frontendzie (`src/components/CheckoutForm.tsx`)
- Całkowite usunięcie fallbacku generującego fejkowe zamówienie `#H22-...` w bloku `catch`. Przy błędzie API checkoutu wyświetlany jest czytelny komunikat błędu (np. wyczerpanie stanu magazynowego, błąd płatności), a koszyk pozostaje nienaruszony, umożliwiając klientowi korektę.
- Usunięcie sztywnych kodów kuponów `HABIT10` i `LATO50` z frontendu — wycena koszyka opiera się wyłącznie na endpointzie `/api/quote`.
- Obsługa ponownego sprawdzenia statusu w `OrderSummary.tsx`: przy wejściu na `/podziekowanie` komponent odpytuje endpoint `/api/checkout/orders/{number}` i wyświetla rzeczywisty status (`Opłacone`, `Oczekuje na płatność`, `Niepowodzenie`).

### Krok 2: Backend — Webhook Stripe, Atomowość Kuponów i Cron (`backend/`)
- **Stripe Webhook:** W [`StripePaymentCallbackController.php`](file:///d:/Projekty/_KLIENCI/Habit22/habit22-dev/backend/app/Http/Controllers/Api/StripePaymentCallbackController.php) dodanie warunku Fail-Closed (`if (blank($webhookSecret)) abort(500)`), transakcji z `lockForUpdate()` na obiekcie `$order` oraz ignorowania powtórnych powiadomień, jeśli zamówienie ma już status `paid`.
- **Atomowość Kuponów:** W [`CheckoutOrderService.php`](file:///d:/Projekty/_KLIENCI/Habit22/habit22-dev/backend/app/Domain/Commerce/Checkout/CheckoutOrderService.php) wewnątrz `DB::transaction()` dodanie blokady `Coupon::query()->lockForUpdate()->find(...)` i ponowna weryfikacja limitu użycia `usage_limit`.
- **Cron Zwalniający:** Utworzenie komendy Artisan `app:cancel-unpaid-orders` zwalniającej zamówienia ze statusem `placed` starsze niż 48h (z przywróceniem stanów magazynowych przez model `Order`) i zarejestrowanie jej w `routes/console.php` z `->withoutOverlapping()`.
- **Antyspam:** W [`ContactInquiryController.php`](file:///d:/Projekty/_KLIENCI/Habit22/habit22-dev/backend/app/Http/Controllers/Api/ContactInquiryController.php) dodanie obsługi honeypota (`hp_name` / `website` — cichy powrót 200 dla bota), limitu długości wiadomości `max:5000` i walidacji `email:rfc,dns`.

### Krok 3: Synchronizacja Warstw i Model Metadata
- W [`InPostService.php`](file:///d:/Projekty/_KLIENCI/Habit22/habit22-dev/backend/app/Domain/Commerce/Logistics/InPostService.php) obsługa dedykowanych kluczy `building_number` i `flat_number` oraz rzucenie wyjątku walidacyjnego zamiast sztucznego `'1'`, gdy brak numeru budynku.
- W modelach [`Product.php`](file:///d:/Projekty/_KLIENCI/Habit22/habit22-dev/backend/app/Models/Product.php) i [`Order.php`](file:///d:/Projekty/_KLIENCI/Habit22/habit22-dev/backend/app/Models/Order.php) wpięcie zdarzenia `saving` łączącego istniejące `metadata` z nowymi za pomocą `array_replace_recursive`.

### Krok 4: SEO, RODO Zero-Leak i `.htaccess`
- **JSON-LD:** W [`ProductTemplate.astro`](file:///d:/Projekty/_KLIENCI/Habit22/habit22-dev/src/templates/ProductTemplate.astro) zamiana `define:vars` na poprawny `<script type="application/ld+json" set:html={JSON.stringify(productJsonLd)} />`.
- **RODO Czcionki:** W [`Layout.astro`](file:///d:/Projekty/_KLIENCI/Habit22/habit22-dev/src/layouts/Layout.astro) usunięcie zewnętrznych linków `fonts.googleapis.com` i `fonts.gstatic.com` — dodanie lokalnych reguł `@font-face` z nowoczesnym fallbackiem systemowym dla zachowania 100% Zero-Leak.
- **Baner Cookies:** W [`CookieBanner.astro`](file:///d:/Projekty/_KLIENCI/Habit22/habit22-dev/src/components/CookieBanner.astro) ujednolicenie stylów przycisków akceptacji i odrzucenia do identycznej wagi wizualnej (ramka, font, rozmiar) oraz wysyłanie zdarzenia do `/api/cookie-consents`.
- **Robots / Sitemap:** Dodanie w [`Layout.astro`](file:///d:/Projekty/_KLIENCI/Habit22/habit22-dev/src/layouts/Layout.astro) parametru `noindex` dla stron koszyka, kasy i konta oraz konfiguracja filtra wykluczającego te strony w `astro.config.mjs` dla sitemapy.
- **`.htaccess`:** Wzbogacenie [`public/.htaccess`](file:///d:/Projekty/_KLIENCI/Habit22/habit22-dev/public/.htaccess) o `Options -Indexes` oraz blokadę dostępu do plików `.env`, `.sqlite`, `.log`, `.git`.

### Krok 5: Weryfikacja Wykonawcza (Stopień 4)
- Rozbudowa testów automatycznych w `backend/tests/Feature/Api/SecurityTest.php` oraz `StripePaymentTest.php` o:
  - Weryfikację fail-closed webhooka Stripe przy pustym sekrecie,
  - Weryfikację atomowości limitu kuponu,
  - Weryfikację zwalniania nieopłaconych zamówień komendą `app:cancel-unpaid-orders`.
- Uruchomienie `php artisan test` i potwierdzenie 100% zdanych testów.
- Uruchomienie `npm run build` i potwierdzenie bezbłędnej kompilacji oraz wygenerowania poprawnego JSON-LD i sitemapy.

---

## 3. Plan Weryfikacji (Bramka Stopnia 4)
Po uzyskaniu Twojej zgody przeprowadzimy modyfikacje, a następnie wykonamy weryfikację:
1. `Set-Location backend; php artisan test` — weryfikacja wszystkich 141+ testów regresyjnych.
2. `npm run build` — weryfikacja statycznej kompilacji Astro bez błędów.
3. Inspekcja wygenerowanego `dist/produkt/kratka-vichy/index.html` pod kątem czystego tagu `<script type="application/ld+json">`.
4. Inspekcja wygenerowanego `dist/sitemap-0.xml` pod kątem wykluczenia stron prywatnych.
