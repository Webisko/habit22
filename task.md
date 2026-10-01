# Zadania: Wdrożenie Produkcyjne Sklepu Habit22

## Faza 1: Weryfikacja Lokalna i Przygotowanie (Zakończona Sukcesem)
- [x] Testy automatyczne backendu Laravel 13 (`php artisan test` - 141/141 passed, 685 asercji) <!-- id: 201 -->
- [x] Budowa statyczna frontendu Astro 7 (`npm run build` - 42 strony wygenerowane bez błędów) <!-- id: 202 -->
- [x] Weryfikacja UX: sticky koszyk od dołu na desktopie, responsywna mapka InPost (bez tokena), dwujęzyczny CMS Filament 5 <!-- id: 203 -->
- [x] Rozpoznanie środowiska produkcyjnego przez SSH <!-- id: 204 -->

## Faza 2: Konfiguracja Domen i Środowiska na Serwerze (Wykonana)
- [x] Utworzenie subdomeny `panel.habit22.eu` w DirectAdmin (zweryfikowano katalog i serwer WWW LiteSpeed) <!-- id: 205 -->
- [x] Usunięcie starych plików z `admin.habit22.eu/app` <!-- id: 206 -->
- [x] Przygotowanie struktury katalogów na serwerze (`domains/panel.habit22.eu/app` oraz `public_html`) <!-- id: 207 -->
- [x] Konfiguracja produkcyjnego pliku `.env` backendu (`APP_URL=https://panel.habit22.eu`, `ALLOWED_ORIGINS=https://habit22.eu`, `DB_CONNECTION=sqlite`) <!-- id: 208 -->

## Faza 3: Wdrożenie Backendu (Laravel 13 + Filament 5 CMS) (Wykonana)
- [x] Wgranie paczki backendu na serwer i instalacja zoptymalizowanych pakietów Composer <!-- id: 209 -->
- [x] Utworzenie i zmigrowanie produkcyjnej bazy SQLite (`panel.habit22.eu/app/database/database.sqlite`) <!-- id: 210 -->
- [x] Uruchomienie seederów: konta administratora (`admin@webisko.pl`) i managera (`kontakt@habit22.eu`), produkty, warianty, wpisy Dziennika <!-- id: 211 -->
- [x] Optymalizacja produkcyjna Laravel (`config:cache`, `route:cache`, `view:cache`, link `storage`) <!-- id: 212 -->
- [x] Zweryfikowanie odpowiedzi panelu Filament (`HTTP 200` na `/admin/login`) oraz API (`HTTP 200` na `/api/catalog` i `/api/store/settings`) <!-- id: 213 -->

## Faza 4: Wdrożenie Frontendu (Astro 7 SSG) (Wykonana)
- [x] Budowa produkcyjna Astro z `PUBLIC_API_URL=https://panel.habit22.eu/api` <!-- id: 214 -->
- [x] Kopia zapasowa poprzedniej wersji `public_html` na serwerze <!-- id: 215 -->
- [x] Synchronizacja nowego katalogu `dist/` do `/home/srv82431/domains/habit22.eu/public_html` <!-- id: 216 -->
- [x] Weryfikacja działania na żywo: strona główna `https://habit22.eu` zwraca HTTP/2 200 z nowymi assetami <!-- id: 217 -->

## Faza 5: Certyfikat SSL dla Subdomeny Panelu
- [ ] Zmiana delegacji serwerów nazw (NS) dla domeny `habit22.eu` w panelu klienta na `ns1.seohost.pl` i `ns2.seohost.pl` <!-- id: 218 -->
- [ ] Wygenerowanie darmowego certyfikatu Let's Encrypt w DirectAdmin dla `panel.habit22.eu` <!-- id: 219 -->
