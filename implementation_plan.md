# Plan Porządków w Repozytorium Habit22

Plan całościowego uporządkowania repozytorium projektu **Habit22**, usunięcia plików tymczasowych, pozostałości po procesach migracji oraz wyczyszczenia nieużywanych fragmentów kodu.

---

## 1. Wykryte Zbędne Pliki i Artefakty

Po przeprowadzeniu szczegółowej analizy drzewa plików projektu zidentyfikowano następujące grupy elementów do usunięcia lub optymalizacji:

### Kategoria A: Śmieciowe pliki tymczasowe i skrypty robocze (100% Bezpieczne do usunięcia)
* **`counts.txt`** (0 B) – pusty plik tekstowy w katalogu głównym.
* **`keys.txt`** (4.6 KB) – stary zrzut kluczy tłumaczeniowych i18n po refaktoryzacji słowników.
* **`tmp.txt`** (7.6 KB) – tymczasowy zrzut wyników przeszukiwania handlerów zdarzeń `onClick`.
* **`replace_fonts.js`** (289 B) – skrypt z wczesnego etapu migracji odwołujący się do dawno nieistniejącego pliku `src/App.tsx`.

### Kategoria B: Pozostałości po starej architekturze Single Page App (SPA)
* **`backup-spa/`** (~180 KB) – kopia zapasowa pierwotnego, monolitycznego prototypu React SPA (`App.tsx` liczący 173 KB, `main.tsx`, `index.html`, `vite.config.ts`). Projekt w pełni przeszedł na architekturę **Astro 7 SSG** (`src/`), a pliki z `backup-spa` nie biorą żadnego udziału w kompilacji ani działaniu aplikacji.

### Kategoria C: Niepotrzebne i obcojęzyczne seedery w backendzie
* **`backend/database/seeders/DevCmsReviewSeeder.php`** (52 KB, 1151 linii) – stary seeder demonstracyjny z ogólnego szablonu e-commerce (tworzący produkty ze sklepu z ziołami i herbatami: `admin@genericshop.local`, `ziolowe-mieszanki`). W projekcie Habit22 domyślnym i oficjalnym seederem jest `Habit22DatabaseSeeder.php` (wywoływany w `DatabaseSeeder.php`). `DevCmsReviewSeeder` jest całkowicie martwym kodem.

### Kategoria D: Artefakty zewnętrznych narzędzi AI w backendzie
* **`backend/.kilo/`** – katalog konfiguracyjny zewnętrznego asystenta Kilo (zawierający własny `node_modules`, `package.json`, `package-lock.json`, `agent-manager.json`), niepowiązany z kodem źródłowym sklepu.

### Kategoria E: Naprawa wykrytego błędu w kodzie komponentów frontendu
* **[src/templates/ShopTemplate.astro](file:///d:/Projekty/_KLIENCI/Habit22/habit22-dev/src/templates/ShopTemplate.astro)**: W linii 50 wykryto literówkę: `<ProductPrice client:load prices={prod.prices} />`. Obiekt produktu posiada pole `price` (nie `prices`), przez co do komponentu przekazywana była wartość `undefined`. Należy poprawić na: `<ProductPrice client:load price={prod.price} />`.

---

## 2. Proponowane Działania Krok po Kroku

| Krok | Akcja | Zakres | Ryzyko |
|---|---|---|---|
| **Krok 1** | Usunięcie plików tymczasowych z roota | `counts.txt`, `keys.txt`, `tmp.txt`, `replace_fonts.js` | Zerowe |
| **Krok 2** | Usunięcie przestarzałego folderu `backup-spa/` | Cały katalog `backup-spa/` | Zerowe (kod w `src/`) |
| **Krok 3** | Usunięcie martwego seedera z backendu | `backend/database/seeders/DevCmsReviewSeeder.php` | Zerowe |
| **Krok 4** | Usunięcie zbędnego katalogu `backend/.kilo/` | Cały katalog `backend/.kilo/` | Zerowe |
| **Krok 5** | Poprawka literówki w `ShopTemplate.astro` | Linia 50: `prices={prod.prices}` -> `price={prod.price}` | Zerowe / Fix buga |
| **Krok 6** | Weryfikacja integralności i testy | `npm run lint`, `npm run build`, `cd backend && php artisan test` | Walidacja |

---

## 3. Pytanie do Użytkownika / Decyzja

Czy akceptujesz powyższy plan porządków w całości, czy któreś z powyższych elementów (np. `backup-spa/` lub `scratch/`) wolisz zachować na dysku lokalnym?
