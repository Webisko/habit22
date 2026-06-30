export type Lang = "pl" | "en";

export interface FAQItem {
  q: string;
  a: string;
}

export interface FAQCategory {
  title: string;
  items: FAQItem[];
}

export interface ContentSection {
  title: string;
  text: string;
}

export interface JournalPost {
  id: number;
  slug: string;
  date: string;
  title: string;
  excerpt: string;
  content: string[];
}

export interface TranslationSchema {
  menu: string;
  cart: string;
  shop: string;
  about: string;
  journal: string;
  contact: string;
  shortcuts: string;
  terms: string;
  privacy: string;
  cookies: string;
  faq: string;
  faq_title: string;
  faq_page_content: FAQCategory[];
  terms_content: ContentSection[];
  privacy_content: ContentSection[];
  hero_title: string;
  hero_subtitle: string;
  contact_title: string;
  contact_name: string;
  contact_email: string;
  contact_message: string;
  contact_send: string;
  discover: string;
  discover_collection: string;
  about_title: string;
  about_text: string[];
  about_material_title: string;
  about_material_text: string;
  about_values_title: string;
  about_values_text: string;
  about_conclusion: string;
  aboutme_title: string;
  aboutme_paragraphs: string[];
  product_section_title: string;
  product_price: string;
  product_handmade: string;
  product_details: string;
  product_desc: (designName: string) => string;
  product_long_desc: (designName: string) => string;
  product_dimensions_title: string;
  product_dimensions: string;
  product_materials_title: string;
  product_materials: string;
  add_to_cart: string;
  color: string;
  newsletter: string;
  empty_cart: string;
  continue_shopping: string;
  back_to_home: string;
  back_to_shop: string;
  checkout: string;
  checkout_details: string;
  checkout_shipping_address: string;
  checkout_ship_to_different: string;
  checkout_delivery: string;
  checkout_payment: string;
  checkout_first_name: string;
  checkout_last_name: string;
  newsletter_title: string;
  newsletter_desc: string;
  newsletter_placeholder: string;
  newsletter_submit: string;
  newsletter_consent: string;
  newsletter_success_title: string;
  newsletter_success_desc: string;
  contact_consent: string;
  checkout_street: string;
  checkout_city: string;
  checkout_zip: string;
  checkout_phone: string;
  checkout_method_courier: string;
  checkout_method_locker: string;
  checkout_payment_card: string;
  checkout_payment_blik: string;
  checkout_payment_transfer: string;
  checkout_submit: string;
  go_to_checkout: string;
  login_title: string;
  login_email: string;
  login_password: string;
  login_btn: string;
  register_btn: string;
  register_verify_msg: string;
  checkout_register_info: string;
  account_title: string;
  account_orders: string;
  account_details: string;
  logout: string;
  checkout_login_prompt: string;
  checkout_login_link: string;
  forgot_password_link: string;
  remember_me: string;
  reset_password_title: string;
  reset_password_btn: string;
  reset_password_success_msg: string;
  no_account_prompt: string;
  have_account_prompt: string;
  set_new_password_title: string;
  confirm_new_password: string;
  set_new_password_success_msg: string;
  passwords_dont_match: string;
  checkout_create_account: string;
  checkout_buy_as_company: string;
  checkout_company_nip: string;
  checkout_company_name: string;
  account_edit_details: string;
  account_save_details: string;
  account_change_password: string;
  account_new_password: string;
  account_save_password: string;
  order_details: string;
  order_status: string;
  order_product: string;
  order_total: string;
  order_back: string;
  order_str: string;
  order_date_str: string;
  order_date_short: string;
  status_processing: string;
  explore: string;
  all_rights_reserved: string;
  thank_you_title: string;
  thank_you_message: string;
  thank_you_order_number: string;
  summary_title: string;
  summary_delivery: string;
  summary_address: string;
  summary_billing_address: string;
  summary_shipping_address: string;
  summary_time: string;
  summary_time_value: string;
  summary_payment: string;
  summary_total: string;
  delivery_locker: string;
  delivery_courier: string;
  payment_blik: string;
  payment_card: string;
  payment_transfer: string;
  no_orders: string;
  footer_p1: string;
  lang_switch: string;
  developed_by: string;
  page_not_found: string;
  page_not_found_desc: string;
  cookie_consent_text: string;
  cookie_accept: string;
  cookie_decline: string;
  contact_success_toast: string;
  added_to_cart_toast: string;
  simulation_link: string;
  faq_items: FAQItem[];
  journal_section_title: string;
  journal_read_more: string;
  show_more: string;
  journal_posts: JournalPost[];
  back_to_journal: string;
  all_posts: string;
}

export const TRANSLATIONS: Record<Lang, TranslationSchema> = {
  pl: {
    menu: "Menu",
    cart: "Koszyk",
    shop: "Kolekcja",
    about: "O marce",
    journal: "Dziennik",
    contact: "Kontakt",
    shortcuts: "Na skróty",
    terms: "Regulamin sklepu",
    privacy: "Polityka prywatności i cookies",
    cookies: "Polityka cookies",
    faq: "FAQ",
    faq_title: "Często zadawane pytania",
    faq_page_content: [
      {
        title: "Nasze produkty",
        items: [
          {
            q: "Z jakich materiałów są uszyte torby?",
            a: "Każda z toreb jest szyta z najwyższej jakości naturalnych tkanin. Tkanina zewnętrzna i wewnętrzna to w 100% bawełna.",
          },
          {
            q: "Jakie są wymiary torby i jej wnętrze?",
            a: "Wymiary toreb to: wysokość 25 cm, szerokość 36 cm, głębokość 18 cm. W środku każda ma trzy pojemne kieszenie i rączki z bawełnianej taśmy.",
          },
          {
            q: "Do czego najlepiej sprawdzają się torby?",
            a: "Tworzę je głównie z myślą o projektach dziewiarskich. Z łatwością na boku i bez plątania włóczki pomieszczą robótki. Torba jest super funkcjonalna podczas pracy - włóczka rozwija się na bieżąco, miękko układając.",
          },
          {
            q: "Jak powinnam dbać o torbę?",
            a: "Zalecamy delikatne pranie ręczne w niskich temperaturach lub czyszczenie miejscowe z pomocą wilgotnej ściereczki. Wtedy posłuży przez lata.",
          },
          {
            q: "Czy torba pomieści duży projekt np. sweter?",
            a: "Tak, nasze torby są zaprojektowane tak, aby pomieścić do 4-5 motków wełny, potrzebne druty i sam projekt w dość zaawansowanym stadium.",
          },
          {
            q: "Gdzie są produkowane torby?",
            a: "Wszystkie nasze torby są krojone i szyte ręcznie w Polsce, w naszej małej rzemieślniczej pracowni.",
          },
        ],
      },
      {
        title: "Dostawa, płatności, zwroty",
        items: [
          {
            q: "Jakie są formy płatności?",
            a: "Możesz opłacić zamówienie za pomocą Blik, przelewem tradycyjnym, kartą płatniczą lub szybkimi przelewami online poprzez bramkę Przelewy24.",
          },
          {
            q: "Jaki jest czas i koszt dostawy?",
            a: "Zamówienia realizujemy w ciągu 2-3 dni roboczych. Koszt dostawy na terenie Polski wynosi 15 zł (paczkomat InPost) lub 20 zł (kurier). Dostawa powyżej 400 zł jest darmowa.",
          },
          {
            q: "Czy wysyłacie zamówienia zagranicę?",
            a: "Tak, wysyłamy na terenie Unii Europejskiej. Koszt dostawy jest obliczany w koszyku po podaniu adresu doręczenia i zwykle wynosi ok. 15-20 EUR.",
          },
          {
            q: "Jak mogę dokonać zwrotu?",
            a: "Produkty można zwrócić do 14 dni od momentu odebrania przesyłki, bez podawania przyczyny. Upewnij się, że torba nie nosi śladów użytkowania i ma oryginalnie przypięte metki. Skontaktuj się z nami na adres habitworld22@gmail.com, a my prześlemy formularz zwrotu.",
          },
          {
            q: "Ile mam czasu na opłacenie zamówienia?",
            a: "Na wpłatę czekamy 3 dni robocze od momentu złożenia zamówienia. Jeśli opłacasz zamówienie przelewem tradycyjnym, pamiętaj że czasem księgowanie trwa 1-2 dni.",
          },
          {
            q: "Kiedy otrzymam zwrot pieniędzy za odesłany towar?",
            a: "Zwrot środków następuje w ciągu 14 dni roboczych od momentu w którym otrzymamy i zweryfikujemy zwrócony produkt.",
          },
          {
            q: "Czy można zamienić produkt po złożeniu zamówienia?",
            a: "Tak, pod warunkiem, że zamówienie nie zostało jeszcze wysłane. W takiej sytuacji prosimy o jak najszybszy kontakt mailowy.",
          },
        ],
      },
    ],
    terms_content: [
      {
        title: "1. Postanowienia ogólne",
        text: "Regulamin określa zasady korzystania ze sklepu internetowego Habit22 oraz warunki zawierania umów sprzedaży produktów.",
      },
      {
        title: "2. Składanie zamówień",
        text: "Zamówienia można składać przez całą dobę. Przez złożenie zamówienia rozumie się wybór produktów oraz realizację płatności za pośrednictwem dostępnych bramek płatniczych.",
      },
      {
        title: "3. Dostawa",
        text: "Wysyłka towaru następuje w terminie określonym na stronach produktów. Koszty dostawy widoczne są w koszyku w trakcie procesu zakupowego.",
      },
      {
        title: "4. Zwroty i reklamacje",
        text: "Konsument ma prawo do zwrotu pełnowartościowego produktu w przeciągu 14 dni od momentu odebrania paczki, bez podania przyczyny.",
      },
      {
        title: "5. Prawa autorskie",
        text: "Wszystkie zdjęcia oraz treści dostępne na stronie są własnością intelektualną marki Habit22.",
      },
    ],
    privacy_content: [
      {
        title: "1. Administrator danych",
        text: "Administratorem Państwa danych osobowych jest marka Habit22.",
      },
      {
        title: "2. Cel przetwarzania",
        text: "Dane wykorzystywane są wyłącznie do realizacji zamówień, kontaktu z klientami oraz wysyłki newslettera (o ile została wyrażona zgoda).",
      },
      {
        title: "3. Udostępnianie danych",
        text: "Państwa dane nie są przekazywane osobom trzecim, za wyjątkiem operatorów płatności i firm kurierskich w celu sprawnej realizacji zamówienia.",
      },
      {
        title: "4. Pliki cookies",
        text: "Serwis wykorzystuje pliki cookies (tzw. ciasteczka), aby ułatwić Państwu korzystanie ze strony www oraz w celach statystycznych.",
      },
    ],
    hero_title: "Habit22",
    hero_subtitle:
      "Ręcznie szyte z naturalnych tkanin.\nPrzeznaczone do projektów dziewiarskich.",
    contact_title: "Kontakt",
    contact_name: "Imię i nazwisko",
    contact_email: "Adres e-mail",
    contact_message: "Wiadomość",
    contact_send: "Wyślij wiadomość",
    discover: "Odkryj Habit22",
    discover_collection: "Odkryj kolekcję",
    about_title: "O MARCE",
    about_text: [
      "Nie interesuje mnie podążanie za trendami. Znacznie bliższe jest mi kolekcjonowanie rzeczy ponadczasowych — tworzonych powoli i z intencją.",
      "Odkryj piękno codziennych rytuałów z rzeczami, które mają znaczenie.",
    ],
    about_material_title: "NATURALNOŚĆ",
    about_material_text:
      "Ręcznie szyte z najwyższej jakości naturalnej bawełny. Zaprojektowane z myślą o dziewiarkach, by pomieścić i uporządkować projekty, włóczki oraz druty.",
    about_values_title: "UWAŻNOŚĆ",
    about_values_text:
      "Bliskie jest mi myślenie o rzeczach, które zostają z nami na długo — pięknych, funkcjonalnych i stworzonych z intencją.",
    about_conclusion:
      "Zaprojektowane, by porządkować twórczy chaos i wiernie towarzyszyć Ci w odkrywaniu nowych splotów.",
    aboutme_title: "O MARCE",
    aboutme_paragraphs: [
      "Nie interesuje mnie podążanie za trendami. Znacznie bliższe jest mi kolekcjonowanie rzeczy ponadczasowych — dobrze zaprojektowanych, tworzonych powoli i z intencją.",
      "Od lat fascynują mnie tkaniny — ich struktura, ciężar, sposób w jaki pracują w świetle, opowiadają historię wzorem i kolorem. To niezwykłe w jaki sposób materiał potrafi budować atmosferę wnętrza, codzienności, chwili.",
      "Wierzę, że przedmioty, którymi się otaczamy, mają znaczenie. Wpływają na rytm codzienności, na nastrój, na to jak przeżywamy zwykłe momenty.",
      "Z tej fascynacji powstały torby projektowe — ręcznie szyte z naturalnych tkanin, przeznaczone do przechowywania projektów dziewiarskich i wszystkiego, co towarzyszy procesowi tworzenia - włóczek, drutów, wzorów, notatek...",
      "To przedmioty użytkowe, ale również część przestrzeni, którą świadomie budujemy wokół siebie. Bliskie jest mi myślenie o rzeczach, które zostają z nami na długo — pięknych, funkcjonalnych i stworzonych z uważnością.",
      "Moje torby projektuję z myślą o osobach, które — tak jak ja — cenią świadome wybory, jakość i estetykę ukrytą w codziennych rytuałach.",
      "Mają po prostu naturalnie wpisywać się w życie, potrzeby i przestrzeń. Budzić uśmiech na twarzy. Funkcjonalne i jednocześnie piękne.",
    ],
    product_section_title: "Torba Projektowa",
    product_price: "350,00 zł",
    product_handmade: "Handmade • 100% Naturalne",
    product_details: "Szczegóły produktu",
    product_desc: (designName: string) =>
      `Pojemna i niezwykle funkcjonalna torba, stworzona by towarzyszyć Ci podczas ulubionych projektów dziewiarskich. Uszyta w 100% ręcznie z dbałością o każdy detal, by wygodnie pomieścić włóczki, druty i notatki w jednym miejscu.`,
    product_long_desc: (designName: string) =>
      `Na początek wybrałam wzór, który uwielbiam od lat — ${designName}. Jest dla mnie absolutnie ponadczasowy.\n\nKażda z toreb jest szyta z najwyższej jakości naturalnych tkanin, dbając o detale i funkcjonalność.\n\nW środku ma trzy pojemne kieszenie i rączki z bawełnianej taśmy.\n\nTworzę je z myślą o przechowywaniu projektów, włóczek, drutów i wszystkiego co warto mieć podczas tworzenia blisko siebie. Torba jest także super funkcjonalna podczas dziergania - jest w niej dużo miejsca na włóczki, które swobodnie się rozwijają leżąc grzecznie i wygodnie:)`,
    product_dimensions_title: "Wymiary",
    product_dimensions: "Wysokość: 25 cm\nSzerokość: 36 cm\nGłębokość: 18 cm",
    product_materials_title: "Materiały & Pielęgnacja",
    product_materials:
      "Materiał wierzchni: 100% bawełna\nPodszewka: 100% bawełna\nUsztywnienie: gruba bawełna 100%",
    add_to_cart: "Dodaj do koszyka",
    color: "Kolor",
    newsletter: "Newsletter",
    empty_cart: "Twój koszyk jest pusty.",
    continue_shopping: "Kontynuuj zakupy",
    back_to_home: "Wróć na stronę główną",
    back_to_shop: "Wróć do kolekcji",
    checkout: "Zamówienie",
    checkout_details: "Dane klienta",
    checkout_shipping_address: "Adres wysyłki",
    checkout_ship_to_different: "Wysyłka na inny adres",
    checkout_delivery: "Dostawa",
    checkout_payment: "Płatność",
    checkout_first_name: "Imię",
    checkout_last_name: "Nazwisko",
    newsletter_title: "Bądźmy w kontakcie",
    newsletter_desc:
      "Zapisz się do newslettera, by otrzymywać informacje o nowych wzorach i limitowanych edycjach toreb.",
    newsletter_placeholder: "Twój adres e-mail",
    newsletter_submit: "Zapisz się",
    newsletter_consent:
      "Zgadzam się na przetwarzanie moich danych osobowych w celu przesyłania newslettera. Szczegóły w ",
    newsletter_success_title: "Dziękujemy za zapis!",
    newsletter_success_desc: "Wysłaliśmy e-mail z linkiem potwierdzającym. Kliknij go, aby potwierdzić zapis i odebrać prezent powitalny.",
    contact_consent:
      "Administratorem Twoich danych jest Habit22. Dane będą przetwarzane w celu obsługi zapytania. Więcej informacji w ",
    checkout_street: "Ulica i numer domu/mieszkania",
    checkout_city: "Miasto",
    checkout_zip: "Kod pocztowy",
    checkout_phone: "Numer telefonu",
    checkout_method_courier: "Kurier (InPost/DPD)",
    checkout_method_locker: "Paczkomat InPost",
    checkout_payment_card: "Karta płatnicza",
    checkout_payment_blik: "BLIK",
    checkout_payment_transfer: "Przelew tradycyjny",
    checkout_submit: "Kupuję i płacę",
    go_to_checkout: "Przejdź do kasy",
    login_title: "Logowanie / Rejestracja",
    login_email: "Adres e-mail",
    login_password: "Hasło",
    login_btn: "Zaloguj się",
    register_btn: "Załóż konto",
    register_verify_msg:
      "Link weryfikacyjny został wysłany na podany adres e-mail. Kliknij w niego, aby aktywować swoje konto.",
    checkout_register_info:
      "Na podany adres e-mail zostanie wysłany link weryfikacyjny. Kliknij w niego, aby aktywować swoje konto.",
    account_title: "Twoje konto",
    account_orders: "Historia zamówień",
    account_details: "Dane konta",
    logout: "Wyloguj",
    checkout_login_prompt: "Masz już konto?",
    checkout_login_link: "Zaloguj się przed zakupem",
    forgot_password_link: "Nie pamiętam hasła",
    remember_me: "Zapamiętaj mnie",
    reset_password_title: "Resetowanie hasła",
    reset_password_btn: "Wyślij link do resetu",
    reset_password_success_msg: "Link do resetowania hasła został wysłany na podany adres e-mail.",
    no_account_prompt: "Nie masz jeszcze konta?",
    have_account_prompt: "Masz już konto?",
    set_new_password_title: "Ustaw nowe hasło",
    confirm_new_password: "Potwierdź nowe hasło",
    set_new_password_success_msg: "Twoje hasło zostało zmienione pomyślnie. Możesz się teraz zalogować.",
    passwords_dont_match: "Hasła nie są identyczne.",
    checkout_create_account: "Chcę założyć konto",
    checkout_buy_as_company: "Kupuję na firmę",
    checkout_company_nip: "NIP",
    checkout_company_name: "Nazwa firmy",
    account_edit_details: "Edytuj dane",
    account_save_details: "Zapisz",
    account_change_password: "Zmień hasło",
    account_new_password: "Nowe hasło",
    account_save_password: "Zapisz hasło",
    order_details: "Szczegóły zamówienia",
    order_status: "Status",
    order_product: "Produkt",
    order_total: "Łącznie",
    order_back: "Wróć do listy zamówień",
    order_str: "Zamówienie",
    order_date_str: "Data złożenia: 24 Maj 2026",
    order_date_short: "24 Maj 2026",
    status_processing: "W realizacji",
    explore: "Odkrywaj",
    all_rights_reserved: "Wszelkie prawa zastrzeżone",
    thank_you_title: "Dziękujemy za zamówienie",
    thank_you_message:
      "Twoje zamówienie zostało przyjęte do realizacji.\nPotwierdzenie zostało wysłane na adres e-mail.",
    thank_you_order_number: "Numer zamówienia: #230894",
    summary_title: "Podsumowanie zamówienia",
    summary_delivery: "Sposób dostawy",
    summary_address: "Adres dostawy",
    summary_billing_address: "Dane rozliczeniowe",
    summary_shipping_address: "Adres dostawy",
    summary_time: "Przewidywany czas realizacji",
    summary_time_value: "2–3 dni robocze",
    summary_payment: "Metoda płatności",
    summary_total: "Łączna kwota",
    delivery_locker: "Paczkomat InPost",
    delivery_courier: "Kurier",
    payment_blik: "BLIK",
    payment_card: "Karta płatnicza",
    payment_transfer: "Przelew tradycyjny",
    no_orders: "Brak historii zamówień.",
    footer_p1:
      "Rzemieślnicze torby, które organizują Twoją pasję i wspierają twórczy proces.",
    lang_switch: "EN",
    developed_by: "Realizacja:",
    page_not_found: "Strona nie znaleziona",
    page_not_found_desc: "Przepraszamy, ale strona, której szukasz, nie istnieje lub została przeniesiona.",
    cookie_consent_text: "Ta strona używa ciasteczek w celu świadczenia usług na najwyższym poziomie. Dalsze korzystanie ze strony oznacza, że zgadzasz się na ich użycie.",
    cookie_accept: "Akceptuję",
    cookie_decline: "Odrzucam",
    contact_success_toast: "Dziękujemy! Wiadomość została wysłana pomyślnie.",
    added_to_cart_toast: "Dodano produkt do koszyka.",
    simulation_link: "Symuluj kliknięcie w link z e-maila",
    faq_items: [
      {
        q: "Z jakich materiałów są uszyte torby?",
        a: "Każda z toreb jest szyta z najwyższej jakości naturalnych tkanin. Tkanina zewnętrzna i wewnętrzna to w 100% bawełna.",
      },
      {
        q: "Jakie są wymiary torby i jej wnętrze?",
        a: "Wymiary toreb to: wysokość 25 cm, szerokość 36 cm, głębokość 18 cm. W środku każda ma trzy pojemne kieszenie i rączki z bawełnianej taśmy.",
      },
      {
        q: "Do czego sprawdzą się najlepiej?",
        a: "Tworzę je z myślą o projektach dziewiarskich. Mieszczą włóczki, druty i notatki. Torba jest super funkcjonalna podczas dziergania – włóczki swobodnie się rozwijają leżąc wygodnie.",
      },
      {
        q: "Jak powinnam dbać o produkt?",
        a: "Zalecamy delikatne pranie ręczne w niskich temperaturach lub czyszczenie punktowe miejscowych zabrudzeń wilgotną szmatką, by materiał służył latami.",
      },
    ],
    journal_section_title: "Dziennik",
    journal_read_more: "Czytaj dalej",
    show_more: "Pokaż więcej",
    journal_posts: [
      {
        id: 1,
        slug: "pielegnacja-naturalnego-lnu",
        date: "24 Maj 2026",
        title: "Pielęgnacja naturalnego lnu",
        excerpt:
          "Odpowiednia dbałość i miłość do naturalnych materiałów sprawi, że zostaną z Tobą na lata.",
        content: [
          "Naturalny len to tkanina, która szlachetnieje z każdym praniem i użyciem. Odpowiednia pielęgnacja jest jednak kluczowa, by zachować jego miękkość i trwałość.",
          "Przede wszystkim unikajmy wysokich temperatur. Pranie w 30 lub 40 stopniach Celsjusza jest w zupełności wystarczające. Pamiętajmy, aby używać delikatnych detergentów, najlepiej płynów, które nie osiadają na włóknach.",
          "Suszenie lnu na świeżym powietrzu to dla niego najlepsze rozwiązanie. Unikajmy suszarek bębnowych, które mogą przesuszyć włókna i spowodować ich łamliwość. Len najlepiej prasować lekko wilgotny, co ułatwi wygładzenie naturalnych zagnieceń, choć to właśnie one nadają mu ten uroczy, nieformalny charakter.",
        ],
      },
      {
        id: 2,
        slug: "rytualy-codziennosci",
        date: "10 Kwi 2026",
        title: "Rytuały codzienności",
        excerpt:
          "Dlaczego to czym się otaczamy ma znaczenie i jak z uważnością budować swoją przestrzeń.",
        content: [
          "Poranna kawa w ulubionym kubku, kilka stron książki przed pracą, chwila z robótką ręczną po południu – to właśnie te momenty budują nasz dzień.",
          "Często zapominamy, że przestrzeń, w której żyjemy, kształtuje nasze myśli i emocje. Wybór przedmiotów codziennego użytku to nie tylko kwestia estetyki, ale przede wszystkim tego, jak dana rzecz na nas wpływa. Zwracanie uwagi na detale, materiały z których wykonane są rzeczy, z którymi obcujemy na co dzień, może przynieść niespodziewaną ulgę ze stresu.",
          "Budujmy naszą przestrzeń z intencją. Rezygnujmy z rzeczy, których nie używamy i zostawmy to, co piękne i użyteczne.",
        ],
      },
      {
        id: 3,
        slug: "wybor-ma-znaczenie",
        date: "22 Mar 2026",
        title: "Wybór ma znaczenie",
        excerpt:
          "Proces wyboru odpowiednich tkanin i rzemieślnicze podejście do każdego detalu naszej torby.",
        content: [
          "Kiedy projektowałam pierwsze torby dziewiarskie, wiedziałam jedno: materiał musi być w 100% naturalny i wytrzymały.",
          "Testowanie tkanin zajęło wiele tygodni. Sztywna bawełna z odpowiednim splotem okazała się idealna, aby torba mogła samodzielnie stać, podczas gdy my wygodnie nabieramy kolejne oczka. Detale takie jak szwy, taśmy czy wykończenie kieszeni wewnątrz były dopracowywane we współpracy z zaprzyjaźnioną rzemieślniczką.",
          "Każdy element musi mieć swoje miejsce i cel, by ułatwiać pracę nad Twoimi projektami.",
        ],
      },
    ],
    back_to_journal: "Wróć do dziennika",
    all_posts: "Wszystkie wpisy",
  },
  en: {
    menu: "Menu",
    cart: "Cart",
    shop: "Collection",
    about: "About",
    journal: "Journal",
    contact: "Contact",
    shortcuts: "Shortcuts",
    terms: "Terms of Service",
    privacy: "Privacy & Cookies Policy",
    cookies: "Cookie Policy",
    faq: "FAQ",
    faq_title: "Frequently Asked Questions",
    faq_page_content: [
      {
        title: "About the product",
        items: [
          {
            q: "What materials do you use?",
            a: "Each bag is sewn from the highest quality natural fabrics. Both the outer and inner lining are 100% cotton.",
          },
          {
            q: "What are the dimensions and inner features?",
            a: "The dimensions are: height 25 cm, width 36 cm, depth 18 cm. Inside, there are three spacious pockets and cotton webbing handles.",
          },
          {
            q: "What are they best used for?",
            a: "I create them specifically for knitting projects. They easily hold yarn, needles, and notes. The bag is super functional while knitting—yarn unwinds smoothly and comfortably.",
          },
          {
            q: "How should I care for my bag?",
            a: "We recommend gentle hand washing at low temperatures or spot cleaning with a damp cloth so the fabric will last for years.",
          },
          {
            q: "Can the bag fit a large project, e.g., a sweater?",
            a: "Yes, our bags are designed to hold up to 4-5 skeins of yarn, necessary needles, and the project itself even in a rather advanced stage.",
          },
          {
            q: "Where are the bags produced?",
            a: "All our bags are cut and sewn by hand in Poland, in our small artisanal studio.",
          },
        ],
      },
      {
        title: "Delivery, Payments, Returns",
        items: [
          {
            q: "What payment methods are accepted?",
            a: "You can pay for your order using BLIK, standard bank transfer, payment card, or fast online transfers via the Przelewy24 gateway.",
          },
          {
            q: "What is the delivery time and cost?",
            a: "We process orders within 2-3 business days. Delivery within Poland costs PLN 15 (InPost locker) or PLN 20 (courier). Delivery for orders over PLN 400 is free.",
          },
          {
            q: "Do you ship internationally?",
            a: "Yes, we ship across the European Union. Shipping costs are calculated at checkout upon entering your delivery address and typically cost around 15-20 EUR.",
          },
          {
            q: "How can I make a return?",
            a: "Products can be returned within 14 days of receiving your package without giving a reason. Please ensure the bag shows no signs of use and has the original tags intact. Contact us at habitworld22@gmail.com and we will send you a return form.",
          },
          {
            q: "How much time do I have to pay for the order?",
            a: "We wait 3 business days for payment from the moment the order is placed. If you pay via standard bank transfer, keep in mind clearance can sometimes take 1-2 days.",
          },
          {
            q: "When will I receive my refund for returned items?",
            a: "Refunds are processed within 14 business days from the moment we receive and verify the returned product.",
          },
          {
            q: "Can I swap a product after placing an order?",
            a: "Yes, provided the order has not been dispatched yet. In such a situation, please contact us by email as quickly as possible.",
          },
        ],
      },
    ],
    terms_content: [
      {
        title: "1. General Provisions",
        text: "These terms outline the rules and regulations for using the Habit22 store and conditions covering the sale of our products.",
      },
      {
        title: "2. Orders & Payments",
        text: "Orders can be placed anytime. By confirming an order, you commit to purchase and pay through our designated secure payment providers.",
      },
      {
        title: "3. Shipping",
        text: "Items are shipped based on estimated times displayed on product pages. Shipping costs are calculated at checkout.",
      },
      {
        title: "4. Returns & Complaints",
        text: "You have the right to return any intact, unused item within 14 days of receipt without providing a reason.",
      },
      {
        title: "5. Intellectual Property",
        text: "All content, designs, and photographs shown on the website are the intellectual property of Habit22.",
      },
    ],
    privacy_content: [
      {
        title: "1. Data Controller",
        text: "The administrator of your personal data is the Habit22 brand.",
      },
      {
        title: "2. Purpose of Processing",
        text: "Your data is used solely for order processing, client communication, and sending newsletters (if you opted in).",
      },
      {
        title: "3. Data Sharing",
        text: "We do not share your data with third parties, except for payment processors and delivery services strictly required to fulfill your order.",
      },
      {
        title: "4. Cookies",
        text: "Our website uses cookies to provide a better browsing experience and for analytical purposes.",
      },
    ],
    hero_title: "Habit22",
    hero_subtitle:
      "Hand-sewn from natural fabrics.\nDesigned for your knitting projects.",
    contact_title: "Contact",
    contact_name: "Name",
    contact_email: "Email address",
    contact_message: "Message",
    contact_send: "Send message",
    discover: "Discover Habit22",
    discover_collection: "Discover the collection",
    about_title: "THE BRAND",
    about_text: [
      "I am not interested in following trends. I am drawn to timeless things — created slowly and with intention.",
      "Discover the beauty of everyday rituals with objects that truly matter.",
    ],
    about_material_title: "NATURALNESS",
    about_material_text:
      "Hand-sewn from the highest quality natural cotton. Designed with knitters in mind to store and organize projects, yarn, and needles.",
    about_values_title: "MINDFULNESS",
    about_values_text:
      "I am drawn to thinking about things that stay with us for a long time — beautiful, functional, and mindful.",
    about_conclusion:
      "Designed to organize creative chaos and faithfully accompany you in discovering new stitches.",
    aboutme_title: "ABOUT ME",
    aboutme_paragraphs: [
      "I'm not interested in following trends. What draws me instead are timeless pieces — thoughtfully designed, made slowly and with intention.",
      "For years, I've been fascinated by textiles — their texture, weight, the way they catch the light and tell stories through pattern and colour. There is something extraordinary about how fabric can shape the atmosphere of a home, a moment, an everyday ritual.",
      "I truly believe the objects we surround ourselves with matter. They influence the rhythm of our days, our mood, the way we experience ordinary moments.",
      "My project bags grew from this fascination — carefully handmade using natural fabrics, designed to hold knitting projects and all the small things that accompany the creative process: yarn, needles, patterns, notes...",
      "They are practical objects, but also part of the spaces we consciously create around ourselves.",
      "I'm drawn to things that stay with us for years — beautiful, functional and made with care. I design my bags for people who, like me, value thoughtful choices, quality, and the quiet beauty hidden within everyday rituals.",
      "Pieces that naturally become part of life, of personal spaces, of daily routines. Objects that bring a small sense of pleasure each time they are used.",
    ],
    product_section_title: "The Project Bag",
    product_price: "€ 80.00",
    product_handmade: "Handmade • 100% Natural",
    product_details: "Product Details",
    product_desc: (designName: string) =>
      `A spacious and highly functional project bag, designed to accompany you during your favorite knitting sessions. 100% handmade with attention to detail, keeping your yarn, needles, and notes perfectly organized.`,
    product_long_desc: (designName: string) =>
      `To begin with, I chose a pattern I've loved for years — ${designName}. To me, it feels entirely timeless.\n\nEach bag is carefully handmade using the highest quality natural fabrics, with close attention paid to both detail and functionality.\n\nInside, there are three spacious pockets and soft cotton webbing handles.\n\nI create these bags to hold knitting projects, yarn, needles, and all the little essentials worth keeping close while making. They're also wonderfully practical to knit from — roomy enough for yarn to unwind freely while staying neatly in place.`,
    product_dimensions_title: "Dimensions",
    product_dimensions: "Height: 25 cm\nWidth: 36 cm\nDepth: 18 cm",
    product_materials_title: "Materials & Care",
    product_materials:
      "Outer fabric: 100% cotton\nLining: 100% cotton\nInterfacing: 100% heavy cotton",
    add_to_cart: "Add to cart",
    color: "Color",
    newsletter: "Newsletter",
    empty_cart: "Your bag is empty.",
    continue_shopping: "Continue shopping",
    back_to_home: "Back to home page",
    back_to_shop: "Back to collection",
    checkout: "Checkout",
    checkout_details: "Customer details",
    checkout_shipping_address: "Shipping address",
    checkout_ship_to_different: "Ship to a different address",
    checkout_delivery: "Delivery",
    checkout_payment: "Payment",
    checkout_first_name: "First name",
    checkout_last_name: "Last name",
    newsletter_title: "Let's stay connected",
    newsletter_desc:
      "Subscribe to our newsletter to receive updates on new designs and limited edition bags.",
    newsletter_placeholder: "Your email address",
    newsletter_submit: "Subscribe",
    newsletter_consent:
      "I agree to the processing of my personal data for the purpose of sending the newsletter. Details in ",
    newsletter_success_title: "Thank you for subscribing!",
    newsletter_success_desc: "We've sent a confirmation email. Please click the link inside to confirm your subscription and claim your welcome gift.",
    contact_consent:
      "The data administrator is Habit22. Data will be processed to handle your inquiry. More information in ",
    checkout_street: "Street address",
    checkout_city: "City",
    checkout_zip: "Postal code",
    checkout_phone: "Phone number",
    checkout_method_courier: "Courier delivery",
    checkout_method_locker: "Parcel locker",
    checkout_payment_card: "Credit / Debit Card",
    checkout_payment_blik: "BLIK",
    checkout_payment_transfer: "Bank transfer",
    checkout_submit: "Place order and pay",
    go_to_checkout: "Go to checkout",
    login_title: "Log In / Register",
    login_email: "Email address",
    login_password: "Password",
    login_btn: "Log in",
    register_btn: "Create account",
    register_verify_msg:
      "A verification link has been sent to the provided email address. Click it to activate your account.",
    checkout_register_info:
      "A verification link will be sent to the provided email address. Click it to activate your account.",
    account_title: "Your Account",
    account_orders: "Order history",
    account_details: "Account details",
    logout: "Log out",
    checkout_login_prompt: "Already have an account?",
    checkout_login_link: "Log in",
    forgot_password_link: "Forgot password",
    remember_me: "Remember me",
    reset_password_title: "Reset Password",
    reset_password_btn: "Send reset link",
    reset_password_success_msg: "A password reset link has been sent to your email address.",
    no_account_prompt: "Don't have an account?",
    have_account_prompt: "Already have an account?",
    set_new_password_title: "Set new password",
    confirm_new_password: "Confirm new password",
    set_new_password_success_msg: "Your password has been successfully changed. You can now log in.",
    passwords_dont_match: "Passwords do not match.",
    checkout_create_account: "I want to create an account",
    checkout_buy_as_company: "I'm buying as a company",
    checkout_company_nip: "NIP / VAT ID",
    checkout_company_name: "Company name",
    account_edit_details: "Edit details",
    account_save_details: "Save",
    account_change_password: "Change password",
    account_new_password: "New password",
    account_save_password: "Save password",
    order_details: "Order details",
    order_status: "Status",
    order_product: "Product",
    order_total: "Total",
    order_back: "Back to orders",
    order_str: "Order",
    order_date_str: "Date placed: May 24, 2026",
    order_date_short: "May 24, 2026",
    status_processing: "In progress",
    explore: "Explore",
    all_rights_reserved: "All rights reserved",
    thank_you_title: "Thank you for your order",
    thank_you_message:
      "Your order has been received and is being processed.\nA confirmation has been sent to your email address.",
    thank_you_order_number: "Order number: #230894",
    summary_title: "Order summary",
    summary_delivery: "Delivery method",
    summary_address: "Shipping address",
    summary_billing_address: "Billing details",
    summary_shipping_address: "Shipping address",
    summary_time: "Estimated processing time",
    summary_time_value: "2–3 business days",
    summary_payment: "Payment method",
    summary_total: "Total amount",
    delivery_locker: "InPost Locker",
    delivery_courier: "Courier",
    payment_blik: "BLIK",
    payment_card: "Credit card",
    payment_transfer: "Bank transfer",
    no_orders: "No order history.",
    footer_p1:
      "Artisanal bags that organize your passion and support the creative process.",
    lang_switch: "PL",
    developed_by: "Developed by:",
    page_not_found: "Page Not Found",
    page_not_found_desc: "We are sorry, but the page you are looking for does not exist or has been moved.",
    cookie_consent_text: "This website uses cookies to ensure you get the best experience on our website. By continuing to browse, you agree to their use.",
    cookie_accept: "Accept",
    cookie_decline: "Decline",
    contact_success_toast: "Thank you! Your message has been sent successfully.",
    added_to_cart_toast: "Added product to cart.",
    simulation_link: "Simulate clicking the email link",
    faq_items: [
      {
        q: "What materials do you use?",
        a: "Each bag is sewn from the highest quality natural fabrics. Both the outer and inner lining are 100% cotton.",
      },
      {
        q: "What are the dimensions and inner features?",
        a: "The dimensions are: height 25 cm, width 36 cm, depth 18 cm. Inside, there are three spacious pockets and cotton webbing handles.",
      },
      {
        q: "What are they best used for?",
        a: "I create them specifically for knitting projects. They easily hold yarn, needles, and notes. The bag is super functional while knitting—yarn unwinds smoothly and comfortably.",
      },
      {
        q: "How should I care for my bag?",
        a: "We recommend gentle hand washing at low temperatures or spot cleaning with a damp cloth so the fabric will last for years.",
      },
    ],
    journal_section_title: "Journal",
    journal_read_more: "Read more",
    show_more: "Show more",
    journal_posts: [
      {
        id: 1,
        slug: "caring-for-natural-linen",
        date: "May 24, 2026",
        title: "Caring for natural linen",
        excerpt:
          "Proper care and love for natural materials will ensure they stay with you for years to come.",
        content: [
          "Natural linen is a fabric that becomes nobler with every wash and use. Proper care, however, is key to maintaining its softness and durability.",
          "Above all, we should avoid high temperatures. Washing at 30 or 40 degrees Celsius is perfectly sufficient. Remember to use gentle detergents, preferably liquids, which do not settle on the fibers.",
          "Drying linen in the fresh air is the best solution. We avoid tumble dryers, which can overdry the fibers and cause them to break. Linen is best ironed while slightly damp, making it easier to smooth out natural creases, although they are what gives it that charming, informal character.",
        ],
      },
      {
        id: 2,
        slug: "everyday-rituals",
        date: "Apr 10, 2026",
        title: "Everyday rituals",
        excerpt:
          "Why the things we surround ourselves with matter, and how to mindfully build your space.",
        content: [
          "Morning coffee in your favorite mug, a few pages of a book before work, a moment with handcrafting in the afternoon - these are the moments that build our day.",
          "We often forget that the space we live in shapes our thoughts and emotions. Choosing everyday items is not just a matter of aesthetics, but above all how a given thing affects us. Paying attention to details, to the materials from which the things we interact with every day are made, can bring unexpected relief from stress.",
          "Let's build our space with intention. Let's give up things we don't use and leave what is beautiful and useful.",
        ],
      },
      {
        id: 3,
        slug: "choices-matter",
        date: "Mar 22, 2026",
        title: "Choices matter",
        excerpt:
          "The process of selecting the right fabrics and our artisanal approach to every detail.",
        content: [
          "When designing the first knitting bags, I knew one thing: the material must be 100% natural and durable.",
          "Testing fabrics took many weeks. Stiff cotton with the right weave turned out to be perfect so that the bag could stand on its own while we comfortably cast on consecutive stitches. Details such as seams, tapes, or inner pocket finishes were refined in cooperation with a friendly artisan.",
          "Every element must have its place and purpose to make working on your projects easier.",
        ],
      },
    ],
    back_to_journal: "Back to journal",
    all_posts: "All posts",
  },
};

export const getTranslations = (lang: string | undefined): TranslationSchema => {
  if (lang === "en" || lang === "en-US") return TRANSLATIONS.en;
  return TRANSLATIONS.pl;
};
