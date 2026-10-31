# 6-Stopniowy Audyt Projektu (project-audit-master) — Habit22

## Krok 0: Inwentaryzacja i Profil Projektu
- [x] Profil architektury: Typ A (Laravel 13 + FilamentPHP 5 + Astro 7 + React Islands) <!-- id: 200 -->
- [x] Zidentyfikowanie aktywnych modułów biznesowych (Sklep fizyczny, Stripe, InPost, Newsletter, Kontakt, i18n PL/EN, Cron) <!-- id: 201 -->

## Stopień 1: Cyberbezpieczeństwo Rdzenia, Anti-IDOR, Antyspam i Konfiguracja Serwera
- [x] Skan Anti-IDOR: weryfikacja publicznych tras pod kątem sekwencyjnego `{id}` i wycieku danych w `routes/api.php` i kontrolerach <!-- id: 202 -->
- [x] Skan ochrony antyspamowej: rate limiting (`throttle`), podwójny Honeypot, próg czasowy, silent 200 w formularzach kontaktowych i newslettera <!-- id: 203 -->
- [x] Skan serwera: weryfikacja `public/.htaccess`, routing `/api/*` i `/admin/*` do Laravela, blokady `.env`, `.sqlite`, `.git`, `Options -Indexes`, nagłówki HTTP <!-- id: 204 -->

## Stopień 2: Audyt Ścieżki Zakupowej: Koszyk Zero-Trust, Płatności, Magazyn i Dostawa InPost
- [x] Skan Zero-Trust Frontend: weryfikacja `src/` pod kątem cen zapasowych, hardkodowanych kuponów, fałszywych zamówień w catch <!-- id: 205 -->
- [x] Skan Płatności (Stripe): Fail-Closed na braku sekretu, porównanie sygnatur, idempotencja transakcyjna (`lockForUpdate`), weryfikacja powrotu ze statusem <!-- id: 206 -->
- [x] Skan Atomowości Magazynu i Kuponów: `lockForUpdate()` w transakcji zamówienia, uwalnianie towaru przez Cron po określonym czasie (`->withoutOverlapping()`) <!-- id: 207 -->
- [x] Skan Dostawy InPost: integracja Paczkomatów (Leaflet/OSM / ShipX), parsowanie adresu kurierskiego, dodanie funkcji `formatCityName()` <!-- id: 208 -->

## Stopień 3: Audyt Synchronizacji 5 Warstw (Baza ⇄ Model ⇄ Filament ⇄ API ⇄ Astro) oraz i18n
- [x] Skan migracji `order_items`: brak `cascadeOnDelete()` na `product_id`, obecność snapshotów cenowych i nazwy <!-- id: 209 -->
- [x] Skan modeli Eloquent i Filament: zgodność `$fillable` i `$casts`, ochrona `metadata` JSON przed nadpisaniem w `saving`, obsługa `SoftDeletes` dla kolumn `UNIQUE` <!-- id: 210 -->
- [x] Skan Wielojęzyczności (`i18n`): język panelu Filament (PL), spójność tłumaczeń PL/EN, wdrożenie tagów hreflang w nagłówku `<head>` <!-- id: 211 -->
- [x] Skan odporności na pusty katalog w CMS: zachowanie frontu przy braku produktów, brak wywrotki `npm run build` na pustych tablicach <!-- id: 212 -->
- [x] Podłączenie frontowych formularzy (Kontakt i Newsletter) do backendowego API z honeypotem i obsługą błędów <!-- id: 213b -->

## Stopień 4: Audyt Modułów Dodatkowych (Newsletter, CRM, Cron, Agenci AI)
- [x] Newsletter i CRM: Double Opt-In / zapis ze statusem, brak wycieku kluczy API na froncie, zgody marketingowe <!-- id: 213 -->
- [x] Zadania Cron i kolejki: `->withoutOverlapping()` w `routes/console.php`, brak publicznych skryptów w `public/` <!-- id: 214 -->
- [x] Weryfikacja reguły If-Present: brak modułów LMS, Lojalnościowych, Afiliacji, Quizów i AI (nieaktywne w projekcie — brak zgłaszania fałszywych braków) <!-- id: 215 -->

## Stopień 5: Audyt Prawny PL/UE (Cookieless, Baner RODO, Omnibus, GPSR), Mediów (.webp), SEO i UX/WCAG
- [x] Skan RODO Zero-Leak: brak zewnętrznych czcionek Google Fonts / zewnętrznych trackerów, lokalne `.woff2` <!-- id: 216 -->
- [x] Skan Banera Cookies: brak Dark Patterns (równa waga przycisków), integracja z rejestrem zgód <!-- id: 217 -->
- [x] Skan Prawny E-Commerce: wdrożenie obowiązkowego checkboxa akceptacji Regulaminu i Polityki Prywatności w koszyku, etykieta „Kupuję i płacę”, Omnibus, dane firmy <!-- id: 218 -->
- [x] Skan Mediów (.webp) i SEO: optymalizacja obrazów (100% WebP), preload LCP, dane strukturalne JSON-LD (`Product`, `Organization`), `noindex` na stronach prywatnych, sitemap i robots.txt <!-- id: 219 -->

## Stopień 6: Twarda Bramka Wykonawcza w Terminalu
- [x] Wykonanie zestawu testów backendu `php artisan test` (100% PASS, 145 testów, 696 asercji) <!-- id: 220 -->
- [x] Wykonanie kompilacji frontendu `npm run build` (kod wyjścia 0, 42 podstrony bez błędów) <!-- id: 221 -->
