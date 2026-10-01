# Dokumentacja Referencyjna API REST: Habit22 E-commerce

Niniejszy dokument stanowi pełną specyfikację techniczną punktów końcowych (endpoints) API REST platformy **Habit22**, wystawianych przez silnik **Laravel 13** i konsumowanych przez frontend **Astro 7 + React 19** oraz zewnętrznych partnerów.

> [!NOTE]
> Wszystkie przykłady zapytań i odpowiedzi posługują się wyłącznie przykładowymi danymi testowymi. Wszelkie rzeczywiste dane uwierzytelniające i klucze API środowisk produkcyjnych są przechowywane poza repozytorium w plikach `.env` oraz w lokalnym pliku bezpieczeństwa.

---

## 1. Architektura API i Konwencje

* **Format danych:** Wszystkie żądania wysyłające dane w formacie JSON muszą posiadać nagłówek `Content-Type: application/json` oraz `Accept: application/json`. Odpowiedzi są zawsze zwracane w formacie JSON.
* **Autoryzacja Klienta:** Wykorzystuje mechanizm **Laravel Sanctum**. Token należy przekazywać w nagłówku jako Bearer Token:
  ```http
  Authorization: Bearer <twoj_token_sanctum>
  ```
* **Waluta i kwoty:** Wszystkie ceny i kwoty w API (katalog, koszyk, zamówienia, dostawa) są reprezentowane jako **liczby całkowite w najmniejszej jednostce walutowej** (grosze dla PLN, centy dla EUR). Kwota `35000` oznacza `350,00 PLN`.
* **Wielojęzyczność:** API obsługuje nagłówek `Accept-Language` (np. `pl` lub `en`), automatycznie zwracając przetłumaczone nazwy, opisy i treści.

---

## 2. Globalne Punkty Końcowe i Ustawienia Sklepu

### 2.1. Stan Aplikacji (Health Check)
Służy do szybkiej weryfikacji zdrowia systemu przez frontend lub systemy monitorujące.
* **Adres:** `GET /api/health`
* **Autoryzacja:** Brak
* **Odpowiedź (200 OK):**
  ```json
  {
    "status": "ok",
    "app": "Habit22"
  }
  ```

### 2.2. Ustawienia Sklepu (Store Settings)
Pobieranie konfiguracji wyświetlania, metod dostawy, włączonych bramek oraz ustawień banera RODO/Cookies.
* **Adres:** `GET /api/store/settings`
* **Odpowiedź (200 OK):**
  ```json
  {
    "store_name": "Habit22",
    "currency": "PLN",
    "free_shipping_threshold": 30000,
    "allow_guest_checkout": true,
    "cookie_banner_enabled": true,
    "cookie_banner_title": "Szanujemy Twoją prywatność",
    "cookie_banner_description": "Używamy plików cookie w celach funkcjonalnych, analitycznych oraz marketingowych...",
    "announcement_enabled": true,
    "announcement_text": "Darmowa dostawa od 300 zł!",
    "shipping_methods": [
      {
        "code": "locker",
        "name": "Paczkomat InPost",
        "amount": 1500,
        "requires_delivery_point": true
      },
      {
        "code": "courier",
        "name": "Kurier",
        "amount": 2000,
        "requires_delivery_point": false
      }
    ]
  }
  ```

### 2.3. Zapisywanie Zgód RODO (Cookie Consent)
Rejestrowanie granularnych zgód użytkownika na pliki cookies w bazie danych (wymóg prawny UODO/RODO).
* **Adres:** `POST /api/cookie-consents`
* **Zapytanie (Payload JSON):**
  ```json
  {
    "consent_token": "usr_cookie_session_abc123",
    "consent_choices": {
      "necessary": true,
      "analytics": true,
      "functional": true,
      "marketing": false
    },
    "banner_version": "1.0.0"
  }
  ```
* **Odpowiedź (201 Created):**
  ```json
  {
    "message": "Consent recorded",
    "id": 142
  }
  ```

### 2.4. Zapis do Newslettera (Double Opt-In)
Rejestruje subskrybenta o statusie `pending` i automatycznie wysyła e-mail z linkiem aktywacyjnym.
* **Adres:** `POST /api/newsletter/subscribe`
* **Zapytanie (Payload JSON):**
  ```json
  {
    "email": "dziewiarka@example.com",
    "first_name": "Anna",
    "source": "footer"
  }
  ```
* **Odpowiedź (201 Created):**
  ```json
  {
    "data": {
      "subscriber": {
        "email": "dziewiarka@example.com",
        "status": "pending",
        "is_active": false
      }
    }
  }
  ```

---

## 3. Katalog Produktów & Warianty Habit22

### 3.1. Lista Produktów w Katalogu
* **Adres:** `GET /api/catalog`
* **Parametry query:** `?search={query}&category={slug}&price_min={min}&price_max={max}&is_bestseller=1&is_new=1&sort={price_asc|price_desc|newest}`
* **Odpowiedź (200 OK):**
  ```json
  {
    "data": {
      "products": [
        {
          "id": 1,
          "slug": "kratka-vichy",
          "sku": "H22-VICHY",
          "name": "Kratka Vichy",
          "short_description": "Kolekcja Gingham / Vichy",
          "regular_price_amount": 35000,
          "sale_price_amount": null,
          "lowest_price_last_30_days": 35000,
          "featured_image_path": "/habit22/produkt__1-1.webp",
          "gallery_image_paths": [
            "/habit22/produkt__1-1.webp",
            "/habit22/produkt__1-2.webp",
            "/habit22/produkt__1-3.webp"
          ],
          "variants": [
            { "id": 1, "sku": "H22-VICHY-22", "size": "22", "regular_price_amount": 35000, "in_stock": true },
            { "id": 2, "sku": "H22-VICHY-33", "size": "33", "regular_price_amount": 35000, "in_stock": true },
            { "id": 3, "sku": "H22-VICHY-44", "size": "44", "regular_price_amount": 35000, "in_stock": true }
          ]
        }
      ],
      "pagination": {
        "current_page": 1,
        "total_items": 3,
        "total_pages": 1
      }
    }
  }
  ```

### 3.2. Szczegóły Produktu
* **Adres:** `GET /api/catalog/products/{slug}`
* **Odpowiedź (200 OK):** Zwraca pełną kartę produktu z opisem materiałowym (100% naturalny len), wymiarami, historią cen Omnibus oraz schematem JSON-LD `Product`.

### 3.3. Powiadomienia o Dostępności (Back-in-Stock)
Rejestracja zapisu na powiadomienie o powrocie wyprzedanego rozmiaru:
* **Adres:** `POST /api/catalog/products/back-in-stock-subscribe`
* **Zapytanie (Payload JSON):**
  ```json
  {
    "product_id": 1,
    "variant_id": 2,
    "email": "klient@example.com"
  }
  ```

---

## 4. Koszyk, Wycena (Quote) i Checkout

### 4.1. Wycena Koszyka w Locie (Quote API)
Bezstanowy endpoint kalkulatora koszyka wyliczający kwoty, rabaty z kuponów oraz koszty wysyłki.
* **Adres:** `POST /api/quote`
* **Zapytanie (Payload JSON):**
  ```json
  {
    "items": [
      { "slug": "kratka-vichy", "quantity": 1, "variant_sku": "H22-VICHY-22" }
    ],
    "shipping_method_code": "locker",
    "coupon_code": "HABIT10",
    "delivery_point": {
      "id": "KRA01M",
      "name": "Paczkomat InPost KRA01M",
      "address": "ul. Długa 10, Kraków"
    }
  }
  ```
* **Odpowiedź (200 OK):**
  ```json
  {
    "data": {
      "subtotal_amount": 35000,
      "discount_amount": 3500,
      "shipping_amount": 1500,
      "total_amount": 33000,
      "free_shipping_applied": false,
      "applied_coupon": {
        "code": "HABIT10",
        "discount_type": "percentage",
        "value": 10
      }
    }
  }
  ```

### 4.2. Wyszukiwanie Kontrahenta B2B po NIP (GUS BIR)
Pobieranie danych firmy z GUS i Białej Listy MF podczas uzupełniania danych do faktury:
* **Adres:** `GET /api/b2b/gus/{nip}`
* **Odpowiedź (200 OK):**
  ```json
  {
    "status": "success",
    "company": {
      "nip": "1234567890",
      "name": "Przykładowa Firma Sp. z o.o.",
      "street": "ul. Rękodzielnicza 5",
      "city": "Warszawa",
      "postal_code": "00-001"
    }
  }
  ```
  *(W przypadku braku odpowiedzi rejestru w ciągu 3s, endpoint zwraca `status: "timeout_fallback"` bez błędu 500).*

### 4.3. Złożenie Zamówienia (Checkout Place)
* **Adres:** `POST /api/checkout/place`
* **Zapytanie (Payload JSON):**
  ```json
  {
    "items": [
      { "slug": "kratka-vichy", "quantity": 1, "variant_sku": "H22-VICHY-22" }
    ],
    "customer": {
      "first_name": "Anna",
      "last_name": "Kowalska",
      "email": "anna@example.com",
      "phone": "+48500100200",
      "wants_invoice": false
    },
    "shipping_method_code": "locker",
    "delivery_point": {
      "id": "WAW10A",
      "name": "Paczkomat InPost WAW10A",
      "address": "ul. Marszałkowska 1, Warszawa"
    },
    "payment_method": "p24",
    "terms_accepted": true,
    "marketing_accepted": true
  }
  ```
* **Odpowiedź (201 Created):**
  ```json
  {
    "data": {
      "order_number": "ORD-20261001-A1B2C3",
      "total_amount": 35000,
      "status": "placed",
      "payment_status": "awaiting_payment"
    }
  }
  ```

### 4.4. Inicjacja Płatności (Payment Session)
Generowanie sesji bramki płatniczej (Stripe lub Przelewy24 / Direct BLIK):
* **Adres:** `POST /api/checkout/orders/{orderNumber}/payment-session`
* **Nagłówek:** `X-Order-Email: anna@example.com`
* **Zapytanie (Opcjonalny BLIK):**
  ```json
  {
    "blik_code": "123456"
  }
  ```
* **Odpowiedź (200 OK):**
  ```json
  {
    "data": {
      "payment_url": "https://secure.przelewy24.pl/trnRequest/...",
      "session_id": "sess_test_123"
    }
  }
  ```

---

## 5. Odstąpienie od Umowy i Zwroty (RMA - Dyrektywa 2023/2673)

Elektroniczny mechanizm zwrotu dostępny dla klientów zarejestrowanych oraz gości bez konta:
* **Adres:** `POST /api/returns`
* **Zapytanie (Payload JSON):**
  ```json
  {
    "order_number": "ORD-20261001-A1B2C3",
    "email": "anna@example.com",
    "reason": "Zły rozmiar torby (zamieniam na 33)",
    "items": [
      {
        "sku": "H22-VICHY-22",
        "quantity": 1
      }
    ]
  }
  ```
* **Odpowiedź (201 Created):**
  ```json
  {
    "data": {
      "return_number": "RET-20261001-9988",
      "status": "pending_approval",
      "message": "Zgłoszenie zwrotu zostało zarejestrowane. Potwierdzenie zostało wysłane na podany adres e-mail."
    }
  }
  ```

---

## 6. Treści CMS (Strony, Blog, FAQ)

* **Lista i szczegóły stron CMS:** `GET /api/content/pages` oraz `GET /api/content/pages/{slug}`
* **Dziennik / Artykuły blogowe:** `GET /api/blog/posts` oraz `GET /api/blog/posts/{slug}`
* **Baza Pytań i Odpowiedzi:** `GET /api/faq`
* **Mapa witryny i struktura nawigacji:** `GET /api/content/map`

---

## 7. Autentykacja Klientów (Sanctum)

* **Rejestracja:** `POST /api/auth/register`
* **Logowanie:** `POST /api/auth/login` (zwraca token Sanctum)
* **Wylogowanie:** `POST /api/auth/logout` (wymaga `Authorization: Bearer <token>`)
* **Dane zalogowanego klienta:** `GET /api/account/me`
* **Historia zamówień:** `GET /api/account/orders`
* **Książka adresowa:** `GET|POST|PUT|DELETE /api/account/addresses`
* **Lista życzeń:** `GET|POST|DELETE /api/account/wishlist`
