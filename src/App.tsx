import React, { useState, useEffect, useRef } from 'react';
import { Menu, ShoppingBag, X, ChevronRight, ChevronLeft, Plus, MoveRight, ArrowUp, ArrowDown, ChevronUp, ChevronDown, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Lang = 'pl' | 'en';

const TRANSLATIONS = {
  pl: {
    menu: "Menu",
    cart: "Koszyk",
    shop: "Kolekcja",
    about: "O mnie",
    journal: "Dziennik",
    contact: "Kontakt",
    shortcuts: "Na skróty",
    terms: "Regulamin sklepu",
    privacy: "Polityka prywatności",
    cookies: "Polityka cookies",
    terms_content: [
      { title: "1. Postanowienia ogólne", text: "Regulamin określa zasady korzystania ze sklepu internetowego Habit22 oraz warunki zawierania umów sprzedaży produktów." },
      { title: "2. Składanie zamówień", text: "Zamówienia można składać przez całą dobę. Przez złożenie zamówienia rozumie się wybór produktów oraz realizację płatności za pośrednictwem dostępnych bramek płatniczych." },
      { title: "3. Dostawa", text: "Wysyłka towaru następuje w terminie określonym na stronach produktów. Koszty dostawy widoczne są w koszyku w trakcie procesu zakupowego." },
      { title: "4. Zwroty i reklamacje", text: "Konsument ma prawo do zwrotu pełnowartościowego produktu w przeciągu 14 dni od momentu odebrania paczki, bez podania przyczyny." },
      { title: "5. Prawa autorskie", text: "Wszystkie zdjęcia oraz treści dostępne na stronie są własnością intelektualną marki Habit22." }
    ],
    privacy_content: [
      { title: "1. Administrator danych", text: "Administratorem Państwa danych osobowych jest marka Habit22." },
      { title: "2. Cel przetwarzania", text: "Dane wykorzystywane są wyłącznie do realizacji zamówień, kontaktu z klientami oraz wysyłki newslettera (o ile została wyrażona zgoda)." },
      { title: "3. Udostępnianie danych", text: "Państwa dane nie są przekazywane osobom trzecim, za wyjątkiem operatorów płatności i firm kurierskich w celu sprawnej realizacji zamówienia." },
      { title: "4. Pliki cookies", text: "Serwis wykorzystuje pliki cookies (tzw. ciasteczka), aby ułatwić Państwu korzystanie ze strony www oraz w celach statystycznych." }
    ],
    hero_title: "Habit 22",
    hero_subtitle: "Ręcznie szyte z naturalnych tkanin.\nPrzeznaczone do projektów dziewiarskich.",
    contact_title: "Kontakt",
    contact_name: "Imię i nazwisko",
    contact_email: "Adres e-mail",
    contact_message: "Wiadomość",
    contact_send: "Wyślij wiadomość",
    discover: "Odkryj kolekcję",
    about_title: "O MARCE",
    about_text: [
      "Nie interesuje mnie podążanie za trendami. Znacznie bliższe jest mi kolekcjonowanie rzeczy ponadczasowych — tworzonych powoli i z intencją.",
      "Odkryj piękno codziennych rytuałów z rzeczami, które mają znaczenie."
    ],
    about_material_title: "NATURALNOŚĆ",
    about_material_text: "Ręcznie szyte z najwyższej jakości naturalnej bawełny. Zaprojektowane z myślą o dziewiarkach, by pomieścić i uporządkować projekty, włóczki oraz druty.",
    about_values_title: "UWAŻNOŚĆ",
    about_values_text: "Bliskie jest mi myślenie o rzeczach, które zostają z nami na długo — pięknych, funkcjonalnych i stworzonych z intencją.",
    about_conclusion: "Zaprojektowane, by porządkować twórczy chaos i wiernie towarzyszyć Ci w odkrywaniu nowych splotów.",
    aboutme_title: "O MNIE",
    aboutme_paragraphs: [
      "Nie interesuje mnie podążanie za trendami. Znacznie bliższe jest mi kolekcjonowanie rzeczy ponadczasowych — dobrze zaprojektowanych, tworzonych powoli i z intencją.",
      "Od lat fascynują mnie tkaniny — ich struktura, ciężar, sposób w jaki pracują w świetle, opowiadają historię wzorem i kolorem. To niezwykłe w jaki sposób materiał potrafi budować atmosferę wnętrza, codzienności, chwili.",
      "Wierzę, że przedmioty, którymi się otaczamy, mają znaczenie. Wpływają na rytm codzienności, na nastrój, na to jak przeżywamy zwykłe momenty.",
      "Z tej fascynacji powstały torby projektowe — ręcznie szyte z naturalnych tkanin, przeznaczone do przechowywania projektów dziewiarskich i wszystkiego, co towarzyszy procesowi tworzenia - włóczek, drutów, wzorów, notatek...",
      "To przedmioty użytkowe, ale również część przestrzeni, którą świadomie budujemy wokół siebie. Bliskie jest mi myślenie o rzeczach, które zostają z nami na długo — pięknych, funkcjonalnych i stworzonych z uważnością.",
      "Moje torby projektuję z myślą o osobach, które — tak jak ja — cenią świadome wybory, jakość i estetykę ukrytą w codziennych rytuałach.",
      "Mają po prostu naturalnie wpisywać się w życie, potrzeby i przestrzeń. Budzić uśmiech na twarzy. Funkcjonalne i jednocześnie piękne."
    ],
    product_section_title: "Torba Projektowa",
    product_price: "350,00 zł",
    product_handmade: "Handmade • 100% Naturalne",
    add_to_cart: "Dodaj do koszyka",
    color: "Kolor",
    newsletter: "Newsletter",
    empty_cart: "Twój koszyk jest pusty.",
    continue_shopping: "Kontynuuj zakupy",
    checkout: "Zamówienie",
    checkout_details: "Dane klienta",
    checkout_delivery: "Dostawa",
    checkout_payment: "Płatność",
    checkout_first_name: "Imię",
    checkout_last_name: "Nazwisko",
    newsletter_title: "Bądźmy w kontakcie",
    newsletter_desc: "Zapisz się do newslettera, by otrzymywać informacje o nowych wzorach i limitowanych edycjach toreb.",
    newsletter_placeholder: "Twój adres e-mail",
    newsletter_submit: "Zapisz się",
    newsletter_consent: "Zgadzam się na przetwarzanie moich danych osobowych w celu przesyłania newslettera. Szczegóły w ",
    contact_consent: "Administratorem Twoich danych jest Habit22. Dane będą przetwarzane w celu obsługi zapytania. Więcej informacji w ",
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
    account_title: "Twoje konto",
    account_orders: "Historia zamówień",
    account_details: "Dane konta",
    logout: "Wyloguj",
    checkout_login_prompt: "Masz już konto?",
    checkout_login_link: "Zaloguj się przed zakupem.",
    checkout_create_account: "Chcę założyć konto (opcjonalnie)",
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
    order_total: "Suma",
    order_back: "Wróć do listy zamówień",
    order_str: "Zamówienie",
    order_date_str: "Data złożenia: 24 Maj 2026",
    order_date_short: "24 Maj 2026",
    status_processing: "W realizacji",
    explore: "Odkrywaj",
    all_rights_reserved: "Wszelkie prawa zastrzeżone.",
    thank_you_title: "Dziękujemy za zamówienie",
    thank_you_message: "Twoje zamówienie zostało przyjęte do realizacji. Potwierdzenie zostało wysłane na adres e-mail.",
    thank_you_order_number: "Numer zamówienia: #230894",
    back_to_home: "Wróć na stronę główną",
    no_orders: "Brak historii zamówień.",
    footer_p1: "Rzemieślnicze torby, które organizują Twoją pasję i wspierają twórczy proces.",
    lang_switch: "EN",
    developed_by: "Realizacja:",
    faq_title: "Często zadawane pytania",
    faq_items: [
      { q: "Z jakich materiałów są uszyte torby?", a: "Każda z toreb jest szyta z najwyższej jakości naturalnych tkanin. Tkanina zewnętrzna i wewnętrzna to w 100% bawełna." },
      { q: "Jakie są wymiary torby i jej wnętrze?", a: "Wymiary toreb to: wysokość 25 cm, szerokość 36 cm, głębokość 18 cm. W środku każda ma trzy pojemne kieszenie i rączki z bawełnianej taśmy." },
      { q: "Do czego sprawdzą się najlepiej?", a: "Tworzę je z myślą o projektach dziewiarskich. Mieszczą włóczki, druty i notatki. Torba jest super funkcjonalna podczas dziergania – włóczki swobodnie się rozwijają leżąc wygodnie." },
      { q: "Jak powinnam dbać o produkt?", a: "Zalecamy delikatne pranie ręczne w niskich temperaturach lub czyszczenie punktowe miejscowych zabrudzeń wilgotną szmatką, by materiał służył latami." }
    ],
    journal_section_title: "Dziennik",
    journal_read_more: "Czytaj dalej",
    journal_posts: [
      { id: 1, date: "24 Maj 2026", title: "Pielęgnacja naturalnego lnu", excerpt: "Odpowiednia dbałość i miłość do naturalnych materiałów sprawi, że zostaną z Tobą na lata.", content: ["Naturalny len to tkanina, która szlachetnieje z każdym praniem i użyciem. Odpowiednia pielęgnacja jest jednak kluczowa, by zachować jego miękkość i trwałość.", "Przede wszystkim unikajmy wysokich temperatur. Pranie w 30 lub 40 stopniach Celsjusza jest w zupełności wystarczające. Pamiętajmy, aby używać delikatnych detergentów, najlepiej płynów, które nie osiadają na włóknach.", "Suszenie lnu na świeżym powietrzu to dla niego najlepsze rozwiązanie. Unikajmy suszarek bębnowych, które mogą przesuszyć włókna i spowodować ich łamliwość. Len najlepiej prasować lekko wilgotny, co ułatwi wygładzenie naturalnych zagnieceń, choć to właśnie one nadają mu ten uroczy, nieformalny charakter."] },
      { id: 2, date: "10 Kwi 2026", title: "Rytuały codzienności", excerpt: "Dlaczego to czym się otaczamy ma znaczenie i jak z uważnością budować swoją przestrzeń.", content: ["Poranna kawa w ulubionym kubku, kilka stron książki przed pracą, chwila z robótką ręczną po południu – to właśnie te momenty budują nasz dzień.", "Często zapominamy, że przestrzeń, w której żyjemy, kształtuje nasze myśli i emocje. Wybór przedmiotów codziennego użytku to nie tylko kwestia estetyki, ale przede wszystkim tego, jak dana rzecz na nas wpływa. Zwracanie uwagi na detale, materiały z których wykonane są rzeczy, z którymi obcujemy na co dzień, może przynieść niespodziewaną ulgę ze stresu.", "Budujmy naszą przestrzeń z intencją. Rezygnujmy z rzeczy, których nie używamy i zostawmy to, co piękne i użyteczne."] },
      { id: 3, date: "22 Mar 2026", title: "Wybór ma znaczenie", excerpt: "Proces wyboru odpowiednich tkanin i rzemieślnicze podejście do każdego detalu naszej torby.", content: ["Kiedy projektowałam pierwsze torby dziewiarskie, wiedziałam jedno: materiał musi być w 100% naturalny i wytrzymały.", "Testowanie tkanin zajęło wiele tygodni. Sztywna bawełna z odpowiednim splotem okazała się idealna, aby torba mogła samodzielnie stać, podczas gdy my wygodnie nabieramy kolejne oczka. Detale takie jak szwy, taśmy czy wykończenie kieszeni wewnątrz były dopracowywane we współpracy z zaprzyjaźnioną rzemieślniczką.", "Każdy element musi mieć swoje miejsce i cel, by ułatwiać pracę nad Twoimi projektami."] }
    ],
    back_to_journal: "Wróć do archiwum",
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
    privacy: "Privacy Policy",
    cookies: "Cookie Policy",
    terms_content: [
      { title: "1. General Provisions", text: "These terms outline the rules and regulations for using the Habit22 store and conditions covering the sale of our products." },
      { title: "2. Orders & Payments", text: "Orders can be placed anytime. By confirming an order, you commit to purchase and pay through our designated secure payment providers." },
      { title: "3. Shipping", text: "Items are shipped based on estimated times displayed on product pages. Shipping costs are calculated at checkout." },
      { title: "4. Returns & Complaints", text: "You have the right to return any intact, unused item within 14 days of receipt without providing a reason." },
      { title: "5. Intellectual Property", text: "All content, designs, and photographs shown on the website are the intellectual property of Habit22." }
    ],
    privacy_content: [
      { title: "1. Data Controller", text: "The administrator of your personal data is the Habit22 brand." },
      { title: "2. Purpose of Processing", text: "Your data is used solely for order processing, client communication, and sending newsletters (if you opted in)." },
      { title: "3. Data Sharing", text: "We do not share your data with third parties, except for payment processors and delivery services strictly required to fulfill your order." },
      { title: "4. Cookies", text: "Our website uses cookies to provide a better browsing experience and for analytical purposes." }
    ],
    hero_title: "Habit 22",
    hero_subtitle: "Hand-sewn from natural fabrics.\nDesigned for your knitting projects.",
    contact_title: "Contact",
    contact_name: "Name",
    contact_email: "Email address",
    contact_message: "Message",
    contact_send: "Send message",
    discover: "Discover the collection",
    about_title: "THE BRAND",
    about_text: [
      "I am not interested in following trends. I am drawn to timeless things — created slowly and with intention.",
      "Discover the beauty of everyday rituals with objects that truly matter."
    ],
    about_material_title: "NATURALNESS",
    about_material_text: "Hand-sewn from the highest quality natural cotton. Designed with knitters in mind to store and organize projects, yarn, and needles.",
    about_values_title: "MINDFULNESS",
    about_values_text: "I am drawn to thinking about things that stay with us for a long time — beautiful, functional, and mindful.",
    about_conclusion: "Designed to organize creative chaos and faithfully accompany you in discovering new stitches.",
    aboutme_title: "ABOUT ME",
    aboutme_paragraphs: [
      "I'm not interested in following trends. What draws me instead are timeless pieces — thoughtfully designed, made slowly and with intention.",
      "For years, I've been fascinated by textiles — their texture, weight, the way they catch the light and tell stories through pattern and colour. There is something extraordinary about how fabric can shape the atmosphere of a home, a moment, an everyday ritual.",
      "I truly believe the objects we surround ourselves with matter. They influence the rhythm of our days, our mood, the way we experience ordinary moments.",
      "My project bags grew from this fascination — carefully handmade using natural fabrics, designed to hold knitting projects and all the small things that accompany the creative process: yarn, needles, patterns, notes...",
      "They are practical objects, but also part of the spaces we consciously create around ourselves.",
      "I'm drawn to things that stay with us for years — beautiful, functional and made with care. I design my bags for people who, like me, value thoughtful choices, quality, and the quiet beauty hidden within everyday rituals.",
      "Pieces that naturally become part of life, of personal spaces, of daily routines. Objects that bring a small sense of pleasure each time they are used."
    ],
    product_section_title: "The Project Bag",
    product_price: "€ 80.00",
    product_handmade: "Handmade • 100% Natural",
    add_to_cart: "Add to bag",
    color: "Color",
    newsletter: "Newsletter",
    empty_cart: "Your bag is empty.",
    continue_shopping: "Continue shopping",
    checkout: "Checkout",
    checkout_details: "Customer details",
    checkout_delivery: "Delivery",
    checkout_payment: "Payment",
    checkout_first_name: "First name",
    checkout_last_name: "Last name",
    newsletter_title: "Let's stay connected",
    newsletter_desc: "Subscribe to our newsletter to receive updates on new designs and limited edition bags.",
    newsletter_placeholder: "Your email address",
    newsletter_submit: "Subscribe",
    newsletter_consent: "I agree to the processing of my personal data for the purpose of sending the newsletter. Details in ",
    contact_consent: "The data administrator is Habit22. Data will be processed to handle your inquiry. More information in ",
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
    account_title: "Your Account",
    account_orders: "Order history",
    account_details: "Account details",
    logout: "Log out",
    checkout_login_prompt: "Already have an account?",
    checkout_login_link: "Log in.",
    checkout_create_account: "I want to create an account (optional)",
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
    all_rights_reserved: "All rights reserved.",
    thank_you_title: "Thank you for your order",
    thank_you_message: "Your order has been received and is being processed. A confirmation has been sent to your email address.",
    thank_you_order_number: "Order number: #230894",
    back_to_home: "Back to home",
    no_orders: "No order history.",
    footer_p1: "Artisanal bags that organize your passion and support the creative process.",
    lang_switch: "PL",
    developed_by: "Developed by:",
    faq_title: "Frequently Asked Questions",
    faq_items: [
      { q: "What materials do you use?", a: "Each bag is sewn from the highest quality natural fabrics. Both the outer and inner lining are 100% cotton." },
      { q: "What are the dimensions and inner features?", a: "The dimensions are: height 25 cm, width 36 cm, depth 18 cm. Inside, there are three spacious pockets and cotton webbing handles." },
      { q: "What are they best used for?", a: "I create them specifically for knitting projects. They easily hold yarn, needles, and notes. The bag is super functional while knitting—yarn unwinds smoothly and comfortably." },
      { q: "How should I care for my bag?", a: "We recommend gentle hand washing at low temperatures or spot cleaning with a damp cloth so the fabric will last for years." }
    ],
    journal_section_title: "Journal",
    journal_read_more: "Read more",
    journal_posts: [
      { id: 1, date: "May 24, 2026", title: "Caring for natural linen", excerpt: "Proper care and love for natural materials will ensure they stay with you for years to come.", content: ["Natural linen is a fabric that becomes nobler with every wash and use. Proper care, however, is key to maintaining its softness and durability.", "Above all, we should avoid high temperatures. Washing at 30 or 40 degrees Celsius is perfectly sufficient. Remember to use gentle detergents, preferably liquids, which do not settle on the fibers.", "Drying linen in the fresh air is the best solution. We avoid tumble dryers, which can overdry the fibers and cause them to break. Linen is best ironed while slightly damp, making it easier to smooth out natural creases, although they are what gives it that charming, informal character."] },
      { id: 2, date: "Apr 10, 2026", title: "Everyday rituals", excerpt: "Why the things we surround ourselves with matter, and how to mindfully build your space.", content: ["Morning coffee in your favorite mug, a few pages of a book before work, a moment with handcrafting in the afternoon - these are the moments that build our day.", "We often forget that the space we live in shapes our thoughts and emotions. Choosing everyday items is not just a matter of aesthetics, but above all how a given thing affects us. Paying attention to details, to the materials from which the things we interact with every day are made, can bring unexpected relief from stress.", "Let's build our space with intention. Let's give up things we don't use and leave what is beautiful and useful."] },
      { id: 3, date: "Mar 22, 2026", title: "Choices matter", excerpt: "The process of selecting the right fabrics and our artisanal approach to every detail.", content: ["When designing the first knitting bags, I knew one thing: the material must be 100% natural and durable.", "Testing fabrics took many weeks. Stiff cotton with the right weave turned out to be perfect so that the bag could stand on its own while we comfortably cast on consecutive stitches. Details such as seams, tapes, or inner pocket finishes were refined in cooperation with a friendly artisan.", "Every element must have its place and purpose to make working on your projects easier."] }
    ],
    back_to_journal: "Back to journal",
    all_posts: "All posts",
  }
};

const PRODUCT = {
  variants: [
    {
      id: "floral",
      name: { pl: "Szlachetny burgund", en: "Noble Burgundy" },
      design: { pl: "Złodziej Truskawek", en: "Strawberry Thief" },
      hex: "#63272e", // Dark red / maroon matching the floral bag
      images: [
        "./produkt__1-1.webp",
        "./produkt__1-2.webp",
        "./produkt__1-3.webp",
      ]
    },
    {
      id: "len",
      name: { pl: "Szałwiowa zieleń", en: "Sage Green" },
      design: { pl: "Gałązki Eukaliptusa", en: "Eucalyptus Branches" },
      hex: "#8A9A86", // Sage green
      images: [
        "./produkt__2-1.webp",
        "./produkt__2-2.webp",
        "./produkt__2-3.webp",
      ]
    },
    {
      id: "oliwa",
      name: { pl: "Głęboki granat", en: "Deep Navy" },
      design: { pl: "Japoński Ginkgo", en: "Japanese Ginkgo" },
      hex: "#1a2b4c", // Deep navy blue
      images: [
        "./produkt__3-1.webp",
        "./produkt__3-2.webp",
        "./produkt__3-3.webp",
      ]
    }
  ]
};

const MarkdownPage = ({ url, title }: { url: string; title: string }) => {
  const [content, setContent] = useState('');
  useEffect(() => {
    fetch(url).then(r => r.text()).then(setContent);
  }, [url]);
  return (
    <main className="flex-grow w-full min-h-screen pt-32 md:pt-48 pb-24 px-6 md:px-12 max-w-4xl mx-auto flex flex-col">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <h1 className="text-3xl md:text-5xl font-serif text-[#2C2119] tracking-wider uppercase mb-16 text-center">{title}</h1>
        <div className="prose prose-[#5C4E43] font-serif prose-lg max-w-none">
           <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({node, ...props}) => null, // Hide H1 as we already display it
                h2: ({node, ...props}) => <h2 className="text-xl md:text-2xl text-[#2C2119] mt-12 mb-4 font-medium" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-lg md:text-xl text-[#2C2119] mt-8 mb-4 font-medium" {...props} />,
                p: ({node, ...props}) => <p className="leading-relaxed mb-6" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc list-inside mb-6 space-y-2 text-[#5C4E43]" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-6 space-y-2 text-[#5C4E43]" {...props} />,
                li: ({node, ...props}) => <li className="leading-relaxed" {...props} />,
                a: ({node, ...props}) => <a className="underline hover:text-[#8C7C6D] transition-colors text-[#2C2119]" {...props} />,
                strong: ({node, ...props}) => <strong className="font-medium text-[#2C2119]" {...props} />,
                blockquote: ({node, ...props}) => <blockquote className="border-l-2 border-[#E6DCC9] pl-4 italic my-6 text-[#8C7C6D]" {...props} />,
                table: ({node, ...props}) => <div className="overflow-x-auto my-8"><table className="w-full text-left border-collapse" {...props} /></div>,
                th: ({node, ...props}) => <th className="border-b border-[#E6DCC9] py-3 px-4 font-medium text-[#2C2119]" {...props} />,
                td: ({node, ...props}) => <td className="border-b border-[#E6DCC9] py-3 px-4 text-[#5C4E43]" {...props} />,
              }}
           >
              {content}
           </ReactMarkdown>
        </div>
      </motion.div>
    </main>
  );
};

export default function App() {
  const [lang, setLang] = useState<Lang>('pl');
  const [currentPage, setCurrentPage] = useState<'home' | 'about' | 'contact' | 'checkout' | 'login' | 'account' | 'thankyou' | 'journal' | 'post' | 'terms' | 'privacy' | 'cookies'>('home');
  const [currentPostId, setCurrentPostId] = useState<number | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState(PRODUCT.variants[0].id);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckoutLoginOpen, setIsCheckoutLoginOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [checkoutDelivery, setCheckoutDelivery] = useState('locker');
  const [checkoutPayment, setCheckoutPayment] = useState('blik');
  const [isCompany, setIsCompany] = useState(false);
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [viewingOrder, setViewingOrder] = useState(false);
  const desktopScrollRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);

  const t = TRANSLATIONS[lang];
  const selectedVariant = PRODUCT.variants.find(v => v.id === selectedVariantId) || PRODUCT.variants[0];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setCurrentImageIndex(0);
    if (desktopScrollRef.current) {
      desktopScrollRef.current.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [selectedVariantId]);

  useEffect(() => {
    // Autoplay for mobile carousel
    const mobileInterval = setInterval(() => {
      if (!isHoveredRef.current && window.innerWidth < 768) {
         setCurrentImageIndex((prev) => (prev + 1) % selectedVariant.images.length);
      }
    }, 4000);
    
    return () => clearInterval(mobileInterval);
  }, [selectedVariant]);

  useEffect(() => {
    // Autoplay for desktop vertical scroll
    const desktopInterval = setInterval(() => {
      if (desktopScrollRef.current && !isHoveredRef.current) {
        const container = desktopScrollRef.current;
        if (window.innerWidth >= 768) { // Only run on md screens and up
           const currentScroll = container.scrollTop;
           const maxScroll = container.scrollHeight - container.clientHeight;
           
           if (currentScroll >= maxScroll - 10) {
              container.scrollTo({ top: 0, behavior: 'smooth' });
           } else {
              container.scrollBy({ top: container.clientHeight, behavior: 'smooth' });
           }
        }
      }
    }, 4500);
    return () => clearInterval(desktopInterval);
  }, [selectedVariant]);

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % selectedVariant.images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + selectedVariant.images.length) % selectedVariant.images.length);
  };

  const toggleLang = () => {
    setLang(lang === 'pl' ? 'en' : 'pl');
  };

  const scrollToSection = (id: string) => {
    if (currentPage !== 'home') {
      setCurrentPage('home');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C2119] selection:bg-[#E6DCC9] font-sans relative">
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.02]" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />
      
      {/* Navigation */}
      <header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 w-full ${
          isScrolled ? 'bg-[#FAF7F2]/90 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-4 md:py-8'
        }`}
      >
        <div className="px-6 md:px-12 flex items-center justify-between">
          <div className="flex-1 flex space-x-6 items-center">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="group flex items-center space-x-2 text-sm font-medium tracking-[0.2em] uppercase hover:text-[#8C7C6D] transition-colors"
            >
              <Menu size={18} strokeWidth={1.5} />
              <span className="hidden sm:inline-block">{t.menu}</span>
            </button>
            <button 
              onClick={toggleLang}
              className="text-sm font-semibold tracking-widest hover:text-[#8C7C6D] transition-colors hidden sm:block"
            >
              {t.lang_switch}
            </button>
          </div>
          
          <div className="flex-1 text-center">
            <a href="#" 
               onClick={(e) => { e.preventDefault(); setCurrentPage('home'); window.scrollTo(0, 0); }}
               className={`text-xl md:text-3xl font-serif tracking-widest uppercase font-semibold transition-colors ${
              isScrolled || currentPage !== 'home' ? 'text-[#2C2119]' : 'text-white md:text-[#2C2119]'
            }`}>
              Habit22
            </a>
          </div>

          <div className="flex-1 flex justify-end space-x-6 items-center">
             <button 
              onClick={toggleLang}
              className="text-sm font-semibold tracking-widest hover:text-[#8C7C6D] transition-colors sm:hidden"
            >
              {t.lang_switch}
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="group flex items-center space-x-2 text-sm font-medium tracking-[0.2em] uppercase hover:text-[#8C7C6D] transition-colors"
            >
              <span className="hidden sm:inline-block">{t.cart} ({cartCount})</span>
              <ShoppingBag size={18} strokeWidth={1.5} />
            </button>
            <button 
              onClick={() => {
                if (isLoggedIn) setCurrentPage('account');
                else setCurrentPage('login');
                window.scrollTo(0,0);
              }}
              className="group flex items-center space-x-2 text-sm font-medium tracking-[0.2em] uppercase hover:text-[#8C7C6D] transition-colors"
            >
               <User size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {currentPage === 'about' ? (
        <main className="flex-grow pt-32 md:pt-48 pb-24 px-6 md:px-12 w-full max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <h1 className="text-3xl md:text-5xl font-serif text-[#2C2119] tracking-wider uppercase mb-16 md:mb-24">{t.aboutme_title}</h1>
            
            <div className="flex flex-col md:flex-row gap-12 md:gap-24 items-start w-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="w-full md:w-5/12 aspect-[4/5] md:sticky md:top-32 overflow-hidden bg-[#EBE2D3]"
              >
                <img src="./Adriana.webp" className="w-full h-full object-cover mix-blend-multiply opacity-90 grayscale-[10%]" alt="Habit22 About" />
              </motion.div>

              <div className="flex flex-col w-full md:w-7/12 space-y-8 text-lg md:text-xl text-[#5C4E43] font-serif leading-relaxed text-left pt-0 md:pt-8">
                {t.aboutme_paragraphs.map((p, idx) => (
                  <motion.p 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    {p}
                  </motion.p>
                ))}
                
                {/* CTA Link to Collection */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="pt-12"
                >
                  <button 
                    onClick={() => {
                      setCurrentPage('home');
                      setTimeout(() => {
                        const el = document.getElementById('shop');
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth' });
                        }
                      }, 100);
                    }}
                    className="group flex flex-col items-start gap-4 text-[#2C2119] hover:text-[#8C7C6D] transition-colors"
                  >
                    <span className="text-base font-semibold tracking-[0.2em] uppercase border-b border-[#2C2119] pb-1 group-hover:border-[#8C7C6D] transition-colors">
                      {t.discover}
                    </span>
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
          
          <div className="mt-24 md:mt-32 w-full">
             <motion.div
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               className="w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-[#EBE2D3]"
             >
               <img src="./produkt__1-2.webp" className="w-full h-full object-cover mix-blend-multiply opacity-90" alt="Habit22 Studio" />
             </motion.div>
          </div>
        </main>
      ) : currentPage === 'contact' ? (
        <main className="flex-grow w-full min-h-screen pt-32 md:pt-48 pb-24 px-6 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row gap-12 md:gap-24 items-start">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="w-full md:w-1/2 aspect-[4/5] overflow-hidden bg-[#EBE2D3]"
          >
            <img src="./produkt__2-2.webp" className="w-full h-full object-cover mix-blend-multiply opacity-90" alt="Habit22 Contact" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full md:w-1/2 flex flex-col pt-0 md:pt-12"
          >
            <h1 className="text-3xl md:text-5xl font-serif text-[#2C2119] tracking-wider uppercase mb-12">{t.contact_title}</h1>
            
            <form className="flex flex-col space-y-8 w-full max-w-md" onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-col">
                <label className="text-sm uppercase tracking-widest text-[#8C7C6D] mb-2">{t.contact_name}</label>
                <input type="text" className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] transition-colors font-serif" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm uppercase tracking-widest text-[#8C7C6D] mb-2">{t.contact_email}</label>
                <input type="email" className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] transition-colors font-serif" />
              </div>
              <div className="flex flex-col pb-6">
                <label className="text-sm uppercase tracking-widest text-[#8C7C6D] mb-2">{t.contact_message}</label>
                <textarea rows={4} className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] resize-none transition-colors font-serif"></textarea>
              </div>
              <p className="text-xs text-[#8C7C6D] mb-6 leading-relaxed">
                {t.contact_consent}
                <button type="button" onClick={() => { setCurrentPage('privacy'); window.scrollTo(0,0); }} className="underline hover:text-[#2C2119] transition-colors">{t.privacy.toLowerCase()}</button>.
              </p>
              <button className="self-start text-sm font-semibold tracking-widest uppercase border-b border-[#2C2119] pb-1 hover:text-[#8C7C6D] hover:border-[#8C7C6D] transition-colors">
                {t.contact_send}
              </button>
            </form>

            <div className="mt-20 pt-8 border-t border-[#E6DCC9] w-full max-w-md">
              <p className="text-sm uppercase tracking-widest text-[#8C7C6D] mb-4">SOCIAL MEDIA</p>
              <div className="flex space-x-6 text-[#2C2119]">
                <a href="#" className="hover:text-[#8C7C6D] transition-colors text-base font-serif">Instagram</a>
                <a href="#" className="hover:text-[#8C7C6D] transition-colors text-base font-serif">Pinterest</a>
                <a href="#" className="hover:text-[#8C7C6D] transition-colors text-base font-serif">Facebook</a>
              </div>
            </div>
          </motion.div>
        </main>
      ) : currentPage === 'checkout' ? (
        <main className="flex-grow w-full min-h-screen pt-32 md:pt-48 pb-24 px-6 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row gap-12 md:gap-24 items-start">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-3/5 flex flex-col pt-0 md:pt-12"
          >
            <h1 className="text-3xl md:text-5xl font-serif text-[#2C2119] tracking-wider uppercase mb-16">{t.checkout}</h1>
            
            <form className="flex flex-col space-y-16 w-full" onSubmit={(e) => e.preventDefault()}>
              
              {!isLoggedIn && (
                 <div className="w-full flex flex-col border border-[#E6DCC9] p-6 md:p-8 bg-[#FAF7F2]">
                   {!isCheckoutLoginOpen ? (
                       <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                          <p className="text-base font-serif text-[#5C4E43]">{t.checkout_login_prompt}</p>
                          <button type="button" onClick={() => setIsCheckoutLoginOpen(true)} className="text-sm font-semibold uppercase tracking-widest border-b border-[#2C2119] pb-1 hover:text-[#8C7C6D] transition-colors">{t.checkout_login_link}</button>
                       </div>
                   ) : (
                       <div className="flex flex-col w-full max-w-sm">
                           <div className="flex justify-between items-center mb-6">
                             <h3 className="text-sm font-semibold uppercase tracking-widest">{t.login_btn}</h3>
                             <button type="button" onClick={() => setIsCheckoutLoginOpen(false)} className="text-[#8C7C6D] hover:text-[#2C2119]"><X size={16} /></button>
                           </div>
                           <div className="space-y-4">
                              <div className="flex flex-col">
                                 <label className="text-xs uppercase tracking-widest text-[#8C7C6D] mb-2">{t.login_email}</label>
                                 <input type="email" className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] font-serif" />
                              </div>
                              <div className="flex flex-col">
                                 <label className="text-xs uppercase tracking-widest text-[#8C7C6D] mb-2">{t.login_password}</label>
                                 <input type="password" className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] font-serif" />
                              </div>
                              <button type="button" onClick={(e) => { e.preventDefault(); setIsLoggedIn(true); setIsCheckoutLoginOpen(false); }} className="w-full py-4 bg-[#2C2119] text-[#F3EDE3] text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#3A2D23] transition-colors mt-6">
                                 {t.login_btn}
                              </button>
                           </div>
                       </div>
                   )}
                 </div>
              )}

              {/* Customer Details */}
              <div className="flex flex-col space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#E6DCC9] pb-4 gap-4">
                   <h2 className="text-base font-semibold tracking-widest uppercase text-[#2C2119]">{t.checkout_details}</h2>
                   <div className="flex items-center space-x-3">
                     <input type="checkbox" id="buy-as-company" checked={isCompany} onChange={(e) => setIsCompany(e.target.checked)} className="w-4 h-4 accent-[#2C2119] bg-transparent border-[#E6DCC9]" />
                     <label htmlFor="buy-as-company" className="text-sm font-serif uppercase tracking-widest text-[#5C4E43] cursor-pointer selection:bg-transparent">
                       {t.checkout_buy_as_company}
                     </label>
                   </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-12 md:gap-y-8">
                  {isCompany ? (
                    <>
                      <div className="flex flex-col">
                        <label className="text-xs uppercase tracking-widest text-[#8C7C6D] mb-2">{t.checkout_company_name}</label>
                        <input type="text" className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] transition-colors font-serif" />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-xs uppercase tracking-widest text-[#8C7C6D] mb-2">{t.checkout_company_nip}</label>
                        <input type="text" className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] transition-colors font-serif" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col">
                        <label className="text-xs uppercase tracking-widest text-[#8C7C6D] mb-2">{t.checkout_first_name}</label>
                        <input type="text" className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] transition-colors font-serif" />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-xs uppercase tracking-widest text-[#8C7C6D] mb-2">{t.checkout_last_name}</label>
                        <input type="text" className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] transition-colors font-serif" />
                      </div>
                    </>
                  )}
                  <div className="flex flex-col">
                    <label className="text-xs uppercase tracking-widest text-[#8C7C6D] mb-2">{t.contact_email}</label>
                    <input type="email" className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] transition-colors font-serif" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs uppercase tracking-widest text-[#8C7C6D] mb-2">{t.checkout_phone}</label>
                    <input type="tel" className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] transition-colors font-serif" />
                  </div>
                  <div className="flex flex-col md:col-span-2">
                    <label className="text-xs uppercase tracking-widest text-[#8C7C6D] mb-2">{t.checkout_street}</label>
                    <input type="text" className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] transition-colors font-serif" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs uppercase tracking-widest text-[#8C7C6D] mb-2">{t.checkout_city}</label>
                    <input type="text" className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] transition-colors font-serif" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs uppercase tracking-widest text-[#8C7C6D] mb-2">{t.checkout_zip}</label>
                    <input type="text" className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] transition-colors font-serif" />
                  </div>
                </div>
                {!isLoggedIn && (
                  <div className="flex items-center space-x-3 pt-4">
                    <input type="checkbox" id="create-account" className="w-4 h-4 accent-[#2C2119] bg-transparent border-[#E6DCC9]" />
                    <label htmlFor="create-account" className="text-base font-serif text-[#5C4E43] cursor-pointer selection:bg-transparent">
                      {t.checkout_create_account}
                    </label>
                  </div>
                )}
              </div>

              {/* Delivery */}
              <div className="flex flex-col space-y-6">
                <h2 className="text-base font-semibold tracking-widest uppercase border-b border-[#E6DCC9] pb-4 text-[#2C2119]">{t.checkout_delivery}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button type="button" onClick={() => setCheckoutDelivery('locker')} className={`border p-6 flex flex-col items-start gap-4 transition-colors ${checkoutDelivery === 'locker' ? 'border-[#2C2119] bg-[#EBE2D3]' : 'border-[#E6DCC9] hover:bg-[#FAF7F2]'}`}>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${checkoutDelivery === 'locker' ? 'border-[#2C2119]' : 'border-[#CBBFA8]'}`}>
                       {checkoutDelivery === 'locker' && <div className="w-2 h-2 bg-[#2C2119] rounded-full"></div>}
                    </div>
                    <span className="text-sm font-semibold uppercase tracking-widest">{t.checkout_method_locker}</span>
                  </button>
                  <button type="button" onClick={() => setCheckoutDelivery('courier')} className={`border p-6 flex flex-col items-start gap-4 transition-colors ${checkoutDelivery === 'courier' ? 'border-[#2C2119] bg-[#EBE2D3]' : 'border-[#E6DCC9] hover:bg-[#FAF7F2]'}`}>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${checkoutDelivery === 'courier' ? 'border-[#2C2119]' : 'border-[#CBBFA8]'}`}>
                       {checkoutDelivery === 'courier' && <div className="w-2 h-2 bg-[#2C2119] rounded-full"></div>}
                    </div>
                    <span className="text-sm font-semibold uppercase tracking-widest">{t.checkout_method_courier}</span>
                  </button>
                </div>
              </div>

              {/* Payment */}
              <div className="flex flex-col space-y-6">
                <h2 className="text-base font-semibold tracking-widest uppercase border-b border-[#E6DCC9] pb-4 text-[#2C2119]">{t.checkout_payment}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button type="button" onClick={() => setCheckoutPayment('blik')} className={`border py-6 px-4 flex flex-col items-center justify-center text-center transition-colors ${checkoutPayment === 'blik' ? 'border-[#2C2119] bg-[#EBE2D3]' : 'border-[#E6DCC9] hover:bg-[#FAF7F2]'}`}>
                    <span className="text-xs font-semibold uppercase tracking-widest">{t.checkout_payment_blik}</span>
                  </button>
                  <button type="button" onClick={() => setCheckoutPayment('card')} className={`border py-6 px-4 flex flex-col items-center justify-center text-center transition-colors ${checkoutPayment === 'card' ? 'border-[#2C2119] bg-[#EBE2D3]' : 'border-[#E6DCC9] hover:bg-[#FAF7F2]'}`}>
                    <span className="text-xs font-semibold uppercase tracking-widest">{t.checkout_payment_card}</span>
                  </button>
                  <button type="button" onClick={() => setCheckoutPayment('transfer')} className={`border py-6 px-4 flex flex-col items-center justify-center text-center transition-colors ${checkoutPayment === 'transfer' ? 'border-[#2C2119] bg-[#EBE2D3]' : 'border-[#E6DCC9] hover:bg-[#FAF7F2]'}`}>
                     <span className="text-xs font-semibold uppercase tracking-widest leading-relaxed">{t.checkout_payment_transfer}</span>
                  </button>
                </div>
              </div>
            </form>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full md:w-2/5 flex flex-col bg-[#EBE2D3] p-8 md:p-12 md:sticky md:top-32"
          >
            <h3 className="text-sm uppercase tracking-[0.2em] mb-8 font-semibold text-[#8C7C6D]">{t.cart}</h3>
            
            <div className="flex items-center gap-6 mb-8 border-b border-[#E6DCC9] pb-8">
              <div className="w-24 h-32 bg-[#FAF7F2] overflow-hidden flex-shrink-0">
                <img src={selectedVariant.images[0]} alt="Habit22 Bag" className="w-full h-full object-contain p-1 mix-blend-multiply opacity-90 grayscale-[10%]" />
              </div>
              <div className="flex flex-col flex-1">
                <h4 className="font-serif text-[#2C2119] text-xl mb-2">{t.product_section_title} - {selectedVariant.design[lang]}</h4>
                <p className="text-xs uppercase tracking-widest text-[#8C7C6D] mb-4">{selectedVariant.name[lang]}</p>
                <p className="text-[#5C4E43] font-serif">{t.product_price}</p>
              </div>
            </div>

            <div className="flex flex-col space-y-4 mb-8 text-base">
              <div className="flex justify-between items-center text-[#5C4E43]">
                <span className="font-serif italic">Suma / Subtotal</span>
                <span className="font-serif">{t.product_price}</span>
              </div>
              <div className="flex justify-between items-center text-[#5C4E43]">
                <span className="font-serif italic">{t.checkout_delivery}</span>
                <span className="font-serif text-sm uppercase tracking-widest">0,00</span>
              </div>
              <div className="flex justify-between items-center font-serif text-xl border-t border-[#E6DCC9] pt-6 mt-2 text-[#2C2119]">
                <span>Total</span>
                <span>{t.product_price}</span>
              </div>
            </div>

            <button 
              onClick={() => { setCurrentPage('thankyou'); window.scrollTo(0, 0); }}
              className="w-full py-5 bg-[#2C2119] text-[#F3EDE3] text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#3A2D23] transition-colors mt-auto"
            >
              {t.checkout_submit}
            </button>
          </motion.div>
        </main>
      ) : currentPage === 'login' ? (
        <main className="flex-grow w-full min-h-screen pt-32 md:pt-48 pb-24 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center justify-center">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
               className="w-full max-w-md flex flex-col items-center bg-[#FAF7F2] p-8 md:p-12 border border-[#E6DCC9]"
            >
                <h1 className="text-2xl md:text-3xl font-serif text-[#2C2119] tracking-wider uppercase mb-12 text-center">
                   {isRegistering ? t.register_btn : t.login_btn}
                </h1>
                <form className="w-full flex flex-col space-y-8" onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); setCurrentPage('account'); window.scrollTo(0, 0); }}>
                    <div className="flex flex-col">
                        <label className="text-xs uppercase tracking-widest text-[#8C7C6D] mb-2">{t.login_email}</label>
                        <input type="email" required className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] transition-colors font-serif" />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs uppercase tracking-widest text-[#8C7C6D] mb-2">{t.login_password}</label>
                        <input type="password" required minLength={6} className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] transition-colors font-serif" />
                    </div>
                    <button className="w-full py-5 bg-[#2C2119] text-[#F3EDE3] text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#3A2D23] transition-colors mt-4">
                        {isRegistering ? t.register_btn : t.login_btn}
                    </button>
                </form>
                <div className="mt-8 text-xs tracking-widest uppercase text-[#8C7C6D]">
                    <button onClick={() => setIsRegistering(!isRegistering)} className="hover:text-[#2C2119] border-b border-transparent hover:border-[#2C2119] transition-all pb-1">
                        {isRegistering ? t.login_btn : t.register_btn}
                    </button>
                </div>
            </motion.div>
        </main>
      ) : currentPage === 'account' ? (
        <main className="flex-grow w-full min-h-screen pt-32 md:pt-48 pb-24 px-6 md:px-12 max-w-5xl mx-auto flex flex-col">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b border-[#E6DCC9] pb-8 gap-8">
               <h1 className="text-3xl md:text-5xl font-serif text-[#2C2119] tracking-wider uppercase">{t.account_title}</h1>
               <button onClick={() => { setIsLoggedIn(false); setCurrentPage('home'); window.scrollTo(0,0); }} className="text-sm uppercase tracking-widest text-[#8C7C6D] hover:text-[#2C2119] border-b border-transparent hover:border-[#2C2119] pb-1 transition-colors">
                   {t.logout}
               </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              <div className="md:col-span-2 flex flex-col">
                 <h2 className="text-sm uppercase tracking-widest text-[#8C7C6D] mb-8">
                   {viewingOrder ? t.order_details : t.account_orders}
                 </h2>
                 {viewingOrder ? (
                    <div className="flex flex-col border border-[#E6DCC9] p-8 bg-[#FAF7F2]">
                       <button onClick={() => setViewingOrder(false)} className="self-start text-xs uppercase tracking-widest text-[#8C7C6D] border-b border-transparent hover:text-[#2C2119] hover:border-[#2C2119] pb-1 transition-all mb-8 flex items-center space-x-2">
                          <ChevronLeft size={12} /><span>{t.order_back}</span>
                       </button>
                       <div className="flex justify-between items-start mb-6">
                          <h3 className="text-lg font-serif text-[#2C2119]">{t.order_str} #230894</h3>
                          <span className="text-xs uppercase tracking-widest bg-[#EBE2D3] px-3 py-1 text-[#2C2119] border border-[#E6DCC9]">{t.status_processing}</span>
                       </div>
                       <p className="text-base font-serif text-[#5C4E43] mb-8">{t.order_date_str}</p>
                       <div className="flex flex-col space-y-4 border-t border-[#E6DCC9] pt-6">
                          <div className="flex justify-between items-center text-base font-serif text-[#2C2119]">
                             <div className="flex items-center space-x-4">
                                <img src="./produkt__1-2.webp" className="w-12 h-12 object-cover bg-[#EBE2D3]" />
                                <span>Habit22 Daily Bag (Oat) x 1</span>
                             </div>
                             <span>890 PLN</span>
                          </div>
                          <div className="flex justify-between items-center text-base font-serif text-[#2C2119] font-bold border-t border-[#E6DCC9] pt-4">
                             <span className="text-sm tracking-widest uppercase font-semibold">{t.order_total}</span>
                             <span>890 PLN</span>
                          </div>
                       </div>
                    </div>
                 ) : (
                    <div className="flex flex-col space-y-4">
                       <div 
                          onClick={() => setViewingOrder(true)} 
                          className="flex justify-between items-center border border-[#E6DCC9] p-6 bg-[#FAF7F2] hover:bg-[#F3EDE3] transition-colors cursor-pointer group"
                       >
                          <div className="flex flex-col">
                             <span className="text-base font-serif text-[#2C2119] font-medium mb-1">{t.order_str} #230894</span>
                             <span className="text-sm font-serif text-[#5C4E43]">{t.order_date_short} • 890 PLN</span>
                          </div>
                          <div className="flex items-center space-x-4">
                             <span className="text-xs uppercase tracking-widest text-[#8C7C6D] hidden md:inline-block">{t.status_processing}</span>
                             <ChevronRight size={16} className="text-[#8C7C6D] group-hover:text-[#2C2119] transition-colors" />
                          </div>
                       </div>
                    </div>
                 )}
              </div>
              <div className="flex flex-col">
                 <h2 className="text-sm uppercase tracking-widest text-[#8C7C6D] mb-8">{t.account_details}</h2>
                 
                 {!isEditingAccount ? (
                   <div className="flex flex-col space-y-6 text-[#2C2119] font-serif border border-[#E6DCC9] p-8 bg-[#FAF7F2]">
                     <div>
                       <p className="font-semibold text-lg">Anna Kowalska</p>
                       <p className="text-base text-[#5C4E43]">anna.kowalska@example.com</p>
                     </div>
                     <div className="text-base space-y-1 text-[#5C4E43]">
                       <p>+48 123 456 789</p>
                       <p>ul. Wiosenna 12/4</p>
                       <p>00-001 Warszawa</p>
                     </div>
                     <div className="text-base space-y-1 text-[#5C4E43] pt-4 border-t border-[#E6DCC9]">
                       <p className="font-semibold text-[#2C2119]">Studio Kobiet Sp. z o.o.</p>
                       <p>NIP: 1234567890</p>
                     </div>
                     <button 
                       onClick={() => setIsEditingAccount(true)}
                       className="self-start text-xs uppercase tracking-widest font-semibold border-b border-[#2C2119] pb-1 hover:text-[#8C7C6D] hover:border-[#8C7C6D] mt-4 transition-colors"
                     >
                       {t.account_edit_details}
                     </button>
                   </div>
                 ) : (
                   <form className="flex flex-col space-y-6 border border-[#E6DCC9] p-8 bg-[#FAF7F2]" onSubmit={(e) => { e.preventDefault(); setIsEditingAccount(false); }}>
                     <div className="flex flex-col space-y-4">
                       <input type="text" defaultValue="Anna Kowalska" className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] font-serif" placeholder={t.checkout_first_name} />
                       <input type="email" defaultValue="anna.kowalska@example.com" className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] font-serif" placeholder="E-mail" />
                       <input type="tel" defaultValue="+48 123 456 789" className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] font-serif" placeholder={t.checkout_phone} />
                       <input type="text" defaultValue="ul. Wiosenna 12/4" className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] font-serif" placeholder={t.checkout_street} />
                       <div className="grid grid-cols-2 gap-4">
                         <input type="text" defaultValue="00-001" className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] font-serif" placeholder={t.checkout_zip} />
                         <input type="text" defaultValue="Warszawa" className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] font-serif" placeholder={t.checkout_city} />
                       </div>
                       <input type="text" defaultValue="Studio Kobiet Sp. z o.o." className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] font-serif" placeholder={t.checkout_company_name} />
                       <input type="text" defaultValue="1234567890" className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] font-serif" placeholder={t.checkout_company_nip} />
                     </div>
                     <button type="submit" className="w-full py-4 bg-[#2C2119] text-[#F3EDE3] text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#3A2D23] transition-colors">
                       {t.account_save_details}
                     </button>
                   </form>
                 )}

                 {!isEditingPassword ? (
                   <button 
                     onClick={() => setIsEditingPassword(true)}
                     className="self-start text-xs uppercase tracking-widest font-semibold text-[#8C7C6D] border-b border-transparent hover:border-[#8C7C6D] hover:text-[#2C2119] mt-8 transition-colors"
                   >
                     {t.account_change_password}
                   </button>
                 ) : (
                   <form className="flex flex-col space-y-4 border border-[#E6DCC9] p-8 bg-[#FAF7F2] mt-8" onSubmit={(e) => { e.preventDefault(); setIsEditingPassword(false); }}>
                     <input type="password" required minLength={6} className="bg-transparent border-b border-[#E6DCC9] py-2 focus:outline-none focus:border-[#2C2119] text-[#2C2119] font-serif" placeholder={t.account_new_password} />
                     <button type="submit" className="w-full py-4 bg-[#2C2119] text-[#F3EDE3] text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#3A2D23] transition-colors">
                       {t.account_save_password}
                     </button>
                   </form>
                 )}
              </div>
            </div>
          </motion.div>
        </main>
      ) : currentPage === 'thankyou' ? (
        <main className="flex-grow w-full min-h-screen pt-48 pb-24 px-6 md:px-12 max-w-5xl mx-auto flex flex-col items-center justify-center text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center max-w-lg"
          >
            <div className="w-16 h-16 border rounded-full flex items-center justify-center mb-8 border-[#2C2119]">
               <div className="w-12 h-12 rounded-full bg-[#EBE2D3] flex items-center justify-center">
                 <MoveRight size={24} className="text-[#2C2119] -rotate-45" />
               </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif text-[#2C2119] tracking-wider uppercase mb-6">{t.thank_you_title}</h1>
            <p className="text-[#5C4E43] font-serif text-lg mb-8 leading-relaxed">{t.thank_you_message}</p>
            <p className="text-sm uppercase tracking-[0.2em] font-semibold text-[#8C7C6D] mb-12">{t.thank_you_order_number}</p>
            
            <button 
              onClick={() => { setCurrentPage('home'); window.scrollTo(0, 0); }}
              className="text-sm uppercase tracking-widest text-[#2C2119] border-b border-[#2C2119] pb-1 hover:text-[#8C7C6D] hover:border-[#8C7C6D] transition-colors"
            >
              {t.back_to_home}
            </button>
          </motion.div>
        </main>
      ) : currentPage === 'journal' ? (
        <main className="flex-grow w-full min-h-screen pt-32 md:pt-48 pb-24 px-6 md:px-12 max-w-7xl mx-auto flex flex-col">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full flex flex-col"
          >
            <h1 className="text-3xl md:text-5xl font-serif text-[#2C2119] tracking-wider uppercase mb-16 md:mb-24 text-center">{t.journal_section_title}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
              {t.journal_posts.map((post: any, idx: number) => (
                <motion.article 
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex flex-col group cursor-pointer"
                  onClick={() => { setCurrentPostId(post.id); setCurrentPage('post'); window.scrollTo(0,0); }}
                >
                  <div className="w-full aspect-[4/3] overflow-hidden bg-[#EBE2D3] mb-6 relative">
                     <img 
                       src={`./wpis-${post.id}.webp`} 
                       alt={post.title} 
                       className="w-full h-full object-cover mix-blend-multiply opacity-80 transition-all duration-700 ease-out grayscale-[10%] group-hover:scale-105 group-hover:opacity-100" 
                     />
                  </div>
                  <h3 className="text-xl md:text-2xl font-serif text-[#2C2119] mb-4 group-hover:text-[#8C7C6D] transition-colors">{post.title}</h3>
                  <p className="text-[#5C4E43] font-serif pr-4 leading-relaxed line-clamp-3">{post.excerpt}</p>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </main>
      ) : currentPage === 'post' && currentPostId !== null ? (
        <main className="flex-grow w-full min-h-screen pt-32 md:pt-48 pb-24 px-6 md:px-12 max-w-4xl mx-auto flex flex-col">
          {(() => {
            const post = t.journal_posts.find((p: any) => p.id === currentPostId) || t.journal_posts[0];
            return (
              <motion.article 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full flex flex-col"
              >
                <button 
                  onClick={() => { setCurrentPage('journal'); window.scrollTo(0,0); }}
                  className="self-start flex items-center space-x-2 text-sm uppercase tracking-widest text-[#8C7C6D] hover:text-[#2C2119] transition-colors mb-12"
                >
                  <ChevronLeft size={16} />
                  <span>{t.back_to_journal}</span>
                </button>
                
                <header className="mb-12 md:mb-16">
                  <h1 className="text-3xl md:text-5xl font-serif text-[#2C2119] tracking-wider uppercase text-center md:text-left leading-[1.2]">{post.title}</h1>
                </header>

                <div className="w-full aspect-[4/3] md:aspect-[16/9] overflow-hidden bg-[#EBE2D3] mb-12 md:mb-16">
                   <img 
                     src={`./wpis-${post.id}.webp`} 
                     alt={post.title} 
                     className="w-full h-full object-cover mix-blend-multiply opacity-90 grayscale-[10%]" 
                   />
                </div>

                <div className="flex flex-col space-y-8 text-lg md:text-xl text-[#5C4E43] font-serif leading-relaxed max-w-3xl mx-auto">
                  <p className="font-medium text-[#2C2119] text-xl md:text-2xl mb-4 italic">{post.excerpt}</p>
                  {(post.content as string[]).map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
                
                {/* Other posts section */}
                <div className="mt-24 md:mt-32 pt-16 border-t border-[#E6DCC9] w-full">
                  <h2 className="text-xl md:text-2xl font-serif text-[#2C2119] mb-12 text-center uppercase tracking-widest">{lang === 'pl' ? 'Pozostałe wpisy' : 'Other posts'}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
                    {t.journal_posts.filter((p: any) => p.id !== post.id).slice(0, 3).map((otherPost: any, idx: number) => (
                      <motion.article 
                        key={otherPost.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex flex-col group cursor-pointer"
                        onClick={() => { setCurrentPostId(otherPost.id); window.scrollTo(0, 0); }}
                      >
                        <div className="w-full aspect-[4/3] overflow-hidden bg-[#EBE2D3] mb-6 relative">
                           <img 
                             src={`./wpis-${otherPost.id}.webp`}
                             alt={otherPost.title} 
                             className="w-full h-full object-cover mix-blend-multiply opacity-80 transition-all duration-700 ease-out grayscale-[10%] group-hover:scale-105 group-hover:opacity-100" 
                           />
                        </div>
                        <h3 className="text-lg md:text-xl font-serif text-[#2C2119] mb-4 group-hover:text-[#8C7C6D] transition-colors">{otherPost.title}</h3>
                        <p className="text-[#5C4E43] font-serif pr-4 leading-relaxed line-clamp-2 text-sm">{otherPost.excerpt}</p>
                      </motion.article>
                    ))}
                  </div>
                </div>
              </motion.article>
            );
          })()}
        </main>
      ) : currentPage === 'terms' ? (
        <MarkdownPage url="/regulamin-habit22.md" title={t.terms} />
      ) : currentPage === 'privacy' ? (
        <MarkdownPage url="/polityka-prywatnosci-habit22.md" title={t.privacy} />
      ) : currentPage === 'cookies' ? (
        <MarkdownPage url="/polityka-cookies-habit22.md" title={t.cookies} />
      ) : (
        <main>
      {/* Hero Section */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-[#EBE2D3]">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 z-0 bg-[#EBE2D3]"
        >
          <img 
            src="./hero__1.webp" 
            alt="Habit22 Hero Background" 
            className="w-full h-full object-cover opacity-90 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-black/60 via-black/10 to-transparent z-10" />
        </motion.div>
        
        <div className="relative z-10 flex flex-col items-center text-center text-white px-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl md:text-7xl font-serif tracking-wider uppercase mb-6"
          >
            {t.hero_title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-base md:text-base font-light tracking-widest whitespace-pre-line leading-relaxed uppercase"
          >
            {t.hero_subtitle}
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-12 z-10 flex flex-col items-center"
        >
          <button 
            onClick={() => scrollToSection('shop')}
            className="text-sm uppercase tracking-[0.3em] text-white hover:text-white/70 transition-colors flex flex-col items-center space-y-4"
          >
            <span>{t.discover}</span>
            <div className="w-[1px] h-12 bg-white/50 relative overflow-hidden">
              <motion.div 
                animate={{ y: [0, 48] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="w-full h-1/2 bg-white absolute top-0"
              />
            </div>
          </button>
        </motion.div>
      </section>

      {/* Main Content Layout - Product Feature */}
      <section id="shop" className="w-full pt-12 md:pt-0 border-b border-[#E6DCC9]">
        <div className="grid grid-cols-1 md:grid-cols-2 md:h-screen">
          
          {/* Images Section (Left Side on Desktop) */}
          <div className="relative w-full h-auto md:h-screen">
            
            {/* Desktop Visual Indicator for Scrolling */}
            <div className="hidden md:flex absolute right-6 md:right-10 top-1/2 -translate-y-1/2 flex-col items-center justify-center pointer-events-auto z-20 gap-6">
               <motion.button
                 onClick={() => {
                   if (desktopScrollRef.current) {
                     desktopScrollRef.current.scrollBy({ top: -window.innerHeight, left: 0, behavior: 'smooth' });
                   }
                 }}
                 animate={{ y: [0, -10, 0] }}
                 transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                 className="text-[#EBE2D3] drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
               >
                 <ChevronUp size={44} strokeWidth={1.5} />
               </motion.button>
               <motion.button
                 onClick={() => {
                   if (desktopScrollRef.current) {
                     desktopScrollRef.current.scrollBy({ top: window.innerHeight, left: 0, behavior: 'smooth' });
                   }
                 }}
                 animate={{ y: [0, 10, 0] }}
                 transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                 className="text-[#EBE2D3] drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
               >
                 <ChevronDown size={44} strokeWidth={1.5} />
               </motion.button>
            </div>

            <div 
              ref={desktopScrollRef}
              onMouseEnter={() => isHoveredRef.current = true}
              onMouseLeave={() => isHoveredRef.current = false}
              className="w-full h-full bg-[#FAF7F2] flex flex-col md:overflow-y-auto no-scrollbar snap-y snap-mandatory scroll-smooth relative"
            >
              {/* Desktop: Scrollable Stack of Images */}
            <div className="hidden md:block w-full">
              {selectedVariant.images.map((img, idx) => (
                <div key={idx} className="w-full h-screen snap-center relative">
                  <img 
                    src={img} 
                    alt={`${t.product_section_title} - ${selectedVariant.name[lang]}`}
                    className={`w-full h-full ${idx === 0 ? "object-contain p-2 md:p-8 object-center" : "object-cover"}`}
                    loading={idx === 0 ? "eager" : "lazy"}
                  />
                </div>
              ))}
            </div>

            {/* Mobile: Simple Image Carousel */}
            <div 
              className="md:hidden w-full h-[65vh] relative overflow-hidden group"
              onMouseEnter={() => isHoveredRef.current = true}
              onMouseLeave={() => isHoveredRef.current = false}
              onTouchStart={() => isHoveredRef.current = true}
              onTouchEnd={() => { setTimeout(() => isHoveredRef.current = false, 3000) }}
            >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={selectedVariant.images[currentImageIndex]}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`w-full h-full ${currentImageIndex === 0 ? "object-contain p-2 md:p-8 object-center" : "object-cover"}`}
                  />
                </AnimatePresence>
                
                {/* Carousel Controls */}
                <div className="absolute inset-x-0 bottom-6 flex justify-center space-x-3">
                  {selectedVariant.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`h-[2px] transition-all ${
                        idx === currentImageIndex ? 'bg-[#2C2119] w-8' : 'bg-[#2C2119]/30 w-4'
                      }`}
                    />
                  ))}
                </div>

                <div className="absolute inset-y-0 left-0 flex items-center">
                   <button onClick={handlePrevImage} className="p-4 text-white/70 hover:text-white drop-shadow-md transition-colors">
                     <ChevronLeft strokeWidth={2} size={32}/>
                   </button>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center">
                   <button onClick={handleNextImage} className="p-4 text-white/70 hover:text-white drop-shadow-md transition-colors">
                     <ChevronRight strokeWidth={2} size={32}/>
                   </button>
                </div>
            </div>
            </div>
          </div>

          {/* Product Info Section */}
          <div className="w-full md:h-screen px-6 py-16 md:px-20 md:py-32 flex flex-col justify-start relative md:overflow-y-auto">
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="max-w-md mx-auto md:mx-0 w-full my-auto"
            >
              <h2 className="text-3xl md:text-4xl font-serif mb-4 uppercase">{t.product_section_title} - {selectedVariant.design[lang]}</h2>
              <div className="flex flex-col space-y-4 mb-12">
                <p className="text-lg md:text-xl text-[#5C4E43]">{t.product_price}</p>
                <div className="flex items-center space-x-2">
                  <span className="inline-block text-xs uppercase tracking-widest text-[#8C7C6D] border border-[#E6DCC9] px-3 py-1 bg-[#EBE2D3]/50">
                    {t.product_handmade}
                  </span>
                </div>
              </div>

              {/* Color Selector */}
              <div className="mb-12">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm uppercase tracking-widest font-medium text-[#8C7C6D]">{t.color}</span>
                  <span className="text-sm uppercase tracking-widest">{selectedVariant.name[lang]}</span>
                </div>
                <div className="flex space-x-6">
                  {PRODUCT.variants.map(variant => (
                    <motion.button
                      key={variant.id}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedVariantId(variant.id)}
                      className={`w-10 h-10 rounded-full border-[1px] transition-all flex items-center justify-center relative overflow-hidden group ${
                        selectedVariantId === variant.id 
                          ? 'border-[#2C2119] p-[3px]' 
                          : 'border-transparent'
                      }`}
                      aria-label={`Select ${variant.name[lang]}`}
                    >
                      <span 
                        className="w-full h-full rounded-full shadow-inner"
                        style={{ backgroundColor: variant.hex }}
                      />
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Add to Cart */}
              <motion.button 
                onClick={() => { setCartCount(1); setIsCartOpen(true); }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#2C2119] text-white py-5 text-sm font-semibold uppercase tracking-[0.2em] hover:bg-[#1A140F] transition-colors mb-16 flex items-center justify-center space-x-3 group relative overflow-hidden"
              >
                <span className="relative z-20">{t.add_to_cart}</span>
                <Plus size={16} className="opacity-0 group-hover:opacity-100 transition-all duration-300 -ml-8 group-hover:ml-0 relative z-20" />
                
                {/* Button shine effect */}
                <span className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section - Editorial Redesign V2 */}
      <section id="about" className="relative w-full py-32 md:py-48 bg-[#F3EDE3] overflow-hidden">
        
        {/* Background Decorative Motif */}
        <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#CBBFA8]/30 to-transparent" />
        
        <div className="w-full px-4 md:px-8 relative z-10">
          
          {/* Section Header */}
          <div className="flex flex-col items-center text-center">
            <motion.h2 
               initial={{ opacity: 0, y: -20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               className="text-xs sm:text-sm tracking-[0.3em] uppercase text-[#8C7C6D] mb-16 md:mb-24 flex items-center space-x-4"
             >
               <span className="w-8 sm:w-16 h-[1px] bg-[#E6DCC9]" />
               <span>{t.about_title}</span>
               <span className="w-8 sm:w-16 h-[1px] bg-[#E6DCC9]" />
             </motion.h2>
          </div>

          {/* Visual Collage Zara-inspired */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start">
            
            {/* Column 1 (Left) */}
            <div className="md:col-span-4 flex flex-col gap-8 md:gap-24 md:mt-16">
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="w-[90%] aspect-[3/4] overflow-hidden bg-[#EBE2D3] ml-auto"
              >
                 <motion.img 
                   whileHover={{ scale: 1.03 }}
                   transition={{ duration: 5, ease: "easeOut" }}
                   src="./produkt__1-2.webp" alt="Product view" className="w-full h-full object-cover mix-blend-multiply opacity-90" 
                 />
              </motion.div>
              
              <div className="md:hidden flex flex-col justify-center text-center px-4 mb-4">
                 <p className="text-2xl text-[#2C2119] font-serif leading-snug">{t.about_text[0]}</p>
                 <p className="text-base mt-4 text-[#8C7C6D] font-serif italic">{t.about_text[1]}</p>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                className="w-full aspect-square overflow-hidden bg-[#EBE2D3]"
              >
                 <motion.img 
                   whileHover={{ scale: 1.03 }}
                   transition={{ duration: 5, ease: "easeOut" }}
                   src="./Adriana.webp" alt="Habit22 Studio" className="w-full h-full object-cover mix-blend-multiply opacity-90 grayscale-[20%]" 
                 />
              </motion.div>
            </div>

            {/* Column 2 (Center/Right) */}
            <div className="md:col-span-8 flex flex-col gap-8 md:gap-24">
              <div className="hidden md:flex flex-col w-[85%] mx-auto text-center mt-4 mb-4">
                 <p className="text-3xl lg:text-5xl text-[#2C2119] font-serif leading-[1.3]">
                   {t.about_text[0]}
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="w-full aspect-[4/5] overflow-hidden bg-[#EBE2D3]"
                >
                   <motion.img 
                     whileHover={{ scale: 1.02 }}
                     transition={{ duration: 8, ease: "easeOut" }}
                     src="./produkt__2-2.webp" alt="Detail view" className="w-full h-full object-cover mix-blend-multiply opacity-90" 
                   />
                </motion.div>
                
                <div className="flex flex-col gap-4 md:gap-8">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                    className="w-[85%] aspect-[3/4] overflow-hidden bg-[#EBE2D3] ml-auto"
                  >
                     <motion.img 
                       whileHover={{ scale: 1.02 }}
                       transition={{ duration: 8, ease: "easeOut" }}
                       src="./hero__1.webp" alt="Detail view" className="w-full h-full object-cover mix-blend-multiply opacity-90" 
                     />
                  </motion.div>

                  <div className="flex flex-col justify-end pt-8 md:pt-16 pb-4 md:pb-8 pl-4 md:pl-12">
                     <h3 className="text-2xl md:text-4xl font-serif text-[#2C2119] mb-6 uppercase tracking-wider">{t.about_material_title}</h3>
                     <p className="text-base md:text-lg text-[#5C4E43] font-serif leading-relaxed max-w-sm">
                       {t.about_material_text}
                     </p>
                  </div>
                </div>
              </div>
              
              {/* Additional full-width or large image for editorial feel */}
              <div className="w-full flex justify-center mt-12 md:mt-0">
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="w-full md:w-[95%] aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-[#EBE2D3]"
                >
                   <img src="./produkt__2-2.webp" alt="Mood" className="w-full h-full object-cover mix-blend-multiply opacity-90 object-[50%_70%]" />
                </motion.div>
              </div>
            </div>
          </div>
        
          {/* Conclusion Text */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="pt-12 md:pt-24 border-t border-[#E6DCC9] mt-16 md:mt-32 w-full flex justify-start"
          >
              <p className="text-2xl md:text-3xl lg:text-4xl text-[#2C2119] font-serif leading-snug text-left md:w-[60%]">
                {t.about_conclusion}
              </p>
          </motion.div>
        
        </div>
      </section>

      {/* Journal Section */}
      <section id="journal" className="w-full py-24 md:py-32 px-6 md:px-12 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16 border-b border-[#E6DCC9] pb-6">
            <h2 className="text-sm tracking-[0.3em] uppercase text-[#8C7C6D]">
              {t.journal_section_title}
            </h2>
            <button 
              onClick={() => { setCurrentPage('journal'); window.scrollTo(0,0); }}
              className="text-xs font-semibold tracking-widest uppercase border-b border-[#2C2119] pb-1 hover:text-[#8C7C6D] hover:border-[#8C7C6D] transition-colors"
            >
              {t.all_posts}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {t.journal_posts.map((post, idx) => (
              <motion.article 
                key={post.id} 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: idx * 0.2 }}
                className="group cursor-pointer flex flex-col h-full"
                onClick={() => { setCurrentPostId(post.id); setCurrentPage('post'); window.scrollTo(0,0); }}
              >
                <div className="aspect-[4/3] w-full overflow-hidden mb-6 bg-[#EBE2D3]">
                  <img 
                    src={`./wpis-${post.id}.webp`}
                    alt={post.title}
                    className="w-full h-full object-cover mix-blend-multiply opacity-80 transition-all duration-700 ease-out grayscale-[10%] group-hover:scale-105 group-hover:opacity-100"
                  />
                </div>
                <h3 className="text-xl font-serif text-[#2C2119] mb-4 group-hover:text-[#8C7C6D] transition-colors">{post.title}</h3>
                <p className="text-base font-serif text-[#5C4E43] leading-relaxed mb-6 flex-grow">
                  {post.excerpt}
                </p>
                <div className="mt-auto self-start">
                  <span className="text-xs font-semibold tracking-widest uppercase border-b border-[#2C2119] pb-1 group-hover:text-[#8C7C6D] group-hover:border-[#8C7C6D] transition-colors inline-block relative overflow-hidden group-hover:pr-4">
                    <span className="relative z-10">{t.journal_read_more}</span>
                    <ChevronRight size={12} className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" strokeWidth={2}/>
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-24 md:py-32 px-6 md:px-12 bg-[#F3EDE3] border-t border-[#E6DCC9]">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 md:mb-24"
          >
            <h2 className="text-xs tracking-[0.3em] uppercase text-[#8C7C6D] mb-4">{t.faq_title}</h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-12 md:gap-16">
            {t.faq_items.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="flex flex-col md:flex-row gap-4 md:gap-16 items-start border-b border-[#E6DCC9] pb-12"
              >
                <h3 className="text-xl font-serif text-[#2C2119] md:w-1/3 leading-snug">{item.q}</h3>
                <p className="text-base text-[#5C4E43] font-serif leading-relaxed md:w-2/3">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="w-full py-24 md:py-32 px-6 md:px-12 bg-[#FAF7F2] border-t border-[#E6DCC9] flex flex-col items-center justify-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto flex flex-col items-center"
        >
          <h2 className="text-3xl md:text-5xl font-serif text-[#2C2119] uppercase tracking-wider mb-6 leading-tight">{t.newsletter_title}</h2>
          <p className="text-[#5C4E43] font-serif text-lg leading-relaxed mb-12">{t.newsletter_desc}</p>
          <form className="w-full relative flex flex-col items-start space-y-6" onSubmit={(e) => { e.preventDefault(); }}>
             <div className="w-full relative flex flex-col md:flex-row items-center space-y-4 md:space-y-0">
               <input 
                 type="email" 
                 required 
                 placeholder={t.newsletter_placeholder} 
                 className="w-full bg-transparent border-b border-[#2C2119] py-3 md:py-4 px-2 text-[#2C2119] font-serif focus:outline-none placeholder:text-[#8C7C6D]" 
               />
               <button type="submit" className="w-full md:w-auto md:absolute md:right-0 md:bottom-0 text-xs font-semibold uppercase tracking-widest text-[#2C2119] hover:text-[#8C7C6D] transition-colors py-3 md:py-4 md:px-4">
                  {t.newsletter_submit}
               </button>
             </div>
             <label className="flex items-start space-x-3 text-left cursor-pointer group mt-4">
               <input type="checkbox" required className="w-4 h-4 accent-[#2C2119] bg-transparent border-[#E6DCC9] mt-0.5" />
               <span className="text-xs text-[#8C7C6D] leading-relaxed select-none">
                 {t.newsletter_consent}
                 <button type="button" onClick={() => { setCurrentPage('privacy'); window.scrollTo(0, 0); }} className="underline hover:text-[#2C2119] transition-colors">{t.privacy.toLowerCase()}</button>.
               </span>
             </label>
          </form>
        </motion.div>
      </section>
      </main>
      )}

      {/* Footer */}
      <footer className="w-full py-16 md:py-24 px-6 md:px-12 bg-[#2C2119] font-sans text-[#E6DCC9] text-sm uppercase tracking-widest">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-serif text-[#F3EDE3] mb-6 uppercase">Habit22</h3>
            <p className="max-w-xs leading-loose mb-8 normal-case font-serif tracking-normal text-base text-[#CBBFA8]">
              {t.footer_p1}
            </p>
          </div>
          
          <div>
            <h4 className="mb-6 font-semibold text-[#F3EDE3]">{t.explore}</h4>
            <ul className="space-y-4 text-[#CBBFA8]">
              <li><a href="#shop" onClick={(e) => { e.preventDefault(); scrollToSection('shop'); }} className="hover:text-white transition-colors">{t.shop}</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('about'); window.scrollTo(0, 0); }} className="hover:text-white transition-colors">{t.about}</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('journal'); window.scrollTo(0, 0); }} className="hover:text-white transition-colors">{t.journal}</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-6 font-semibold text-[#F3EDE3]">{t.shortcuts}</h4>
            <ul className="space-y-4 text-[#CBBFA8]">
              <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('contact'); window.scrollTo(0, 0); }} className="hover:text-white transition-colors">{t.contact}</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('terms'); window.scrollTo(0, 0); }} className="hover:text-white transition-colors">{t.terms}</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('privacy'); window.scrollTo(0, 0); }} className="hover:text-white transition-colors">{t.privacy}</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('cookies'); window.scrollTo(0, 0); }} className="hover:text-white transition-colors">{t.cookies}</a></li>
              <li><a href="mailto:hello@habit22.eu" className="hover:text-white transition-colors normal-case tracking-normal mt-2 inline-block">hello@habit22.eu</a></li>
            </ul>
          </div>
          
        </div>
        
        <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-[#3A2D23] flex flex-col md:flex-row justify-between items-center text-xs text-[#CBBFA8]">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-8 text-center md:text-left">
            <p>&copy; {new Date().getFullYear()} Habit22 . {t.all_rights_reserved}</p>
            <p className="normal-case">{t.developed_by} <a href="https://webisko.pl" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">Webisko.pl</a></p>
          </div>
          <div className="flex space-x-6 mt-6 md:mt-0">
             <button onClick={toggleLang} className="hover:text-white transition-colors">{t.lang_switch} VERSION</button>
          </div>
        </div>
      </footer>

      {/* Slide-out Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex"
          >
            <div className="absolute inset-0 bg-[#2C2119]/40 backdrop-blur-sm cursor-pointer" onClick={() => setIsMenuOpen(false)} />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
              className="relative w-full max-w-sm bg-[#FAF7F2] h-full shadow-2xl flex flex-col p-8 md:p-12 overflow-y-auto"
            >
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="self-start text-[#8C7C6D] hover:text-[#2C2119] transition-colors mb-20"
              >
                <X size={28} strokeWidth={1} />
              </button>
              
              <nav className="flex flex-col space-y-8 font-serif text-3xl md:text-4xl text-[#2C2119] uppercase">
                <a href="#shop" onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); scrollToSection('shop'); }} className="hover:text-[#8C7C6D] transition-colors">{t.shop}</a>
                <a href="#" onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); setCurrentPage('about'); window.scrollTo(0,0); }} className="hover:text-[#8C7C6D] transition-colors">{t.about}</a>
                <a href="#" onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); setCurrentPage('journal'); window.scrollTo(0, 0); }} className="hover:text-[#8C7C6D] transition-colors">{t.journal}</a>
                <a href="#" onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); setCurrentPage('contact'); window.scrollTo(0,0); }} className="hover:text-[#8C7C6D] transition-colors">{t.contact}</a>
              </nav>

              <div className="mt-auto pt-8 border-t border-[#E6DCC9] text-sm uppercase tracking-[0.2em] text-[#8C7C6D] space-y-4">
                <p className="hover:text-[#2C2119] cursor-pointer">{t.newsletter}</p>
                <p className="hover:text-[#2C2119] cursor-pointer">Instagram</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end"
          >
            <div className="absolute inset-0 bg-[#2C2119]/40 backdrop-blur-sm cursor-pointer" onClick={() => setIsCartOpen(false)} />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
              className="relative w-full max-w-md bg-[#FAF7F2] h-full shadow-2xl flex flex-col p-8 md:p-12 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-16">
                <h3 className="text-sm font-medium tracking-[0.2em] uppercase">{t.cart}</h3>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="text-[#8C7C6D] hover:text-[#2C2119] transition-colors"
                >
                  <X size={24} strokeWidth={1} />
                </button>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center text-center">
                {cartCount === 0 ? (
                  <div className="space-y-6 flex flex-col items-center justify-center h-full w-full">
                    <ShoppingBag size={48} strokeWidth={1} className="text-[#CBBFA8]" />
                    <p className="text-[#8C7C6D] text-sm uppercase tracking-[0.2em]">{t.empty_cart}</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="border-b border-[#2C2119] pb-1 text-sm font-semibold uppercase tracking-widest mt-6 hover:text-[#8C7C6D] hover:border-[#8C7C6D] transition-colors"
                    >
                      {t.continue_shopping}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col h-full w-full justify-between pt-8">
                    <div className="flex items-center gap-6 mb-8 border-b border-[#E6DCC9] pb-8 text-left">
                      <div className="w-24 h-32 bg-[#FAF7F2] overflow-hidden flex-shrink-0">
                        <img src={selectedVariant.images[0]} alt="Habit22 Bag" className="w-full h-full object-contain p-1 mix-blend-multiply opacity-90 grayscale-[10%]" />
                      </div>
                      <div className="flex flex-col flex-1">
                        <div className="flex justify-between items-start mb-2">
                           <h4 className="font-serif text-[#2C2119] text-lg">{t.product_section_title} - {selectedVariant.design[lang]}</h4>
                           <button onClick={() => setCartCount(0)} className="text-[#8C7C6D] hover:text-[#2C2119]"><X size={16} /></button>
                        </div>
                        <p className="text-xs uppercase tracking-widest text-[#8C7C6D] mb-4">{selectedVariant.name[lang]}</p>
                        <p className="text-[#5C4E43] font-serif">{t.product_price}</p>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <div className="flex justify-between items-center font-serif text-xl border-t border-[#E6DCC9] pt-6 mb-8 text-[#2C2119]">
                        <span>Total</span>
                        <span>{t.product_price}</span>
                      </div>
                      <button 
                        onClick={() => { setIsCartOpen(false); setCurrentPage('checkout'); window.scrollTo(0, 0); }}
                        className="w-full py-5 bg-[#2C2119] text-[#F3EDE3] text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#3A2D23] transition-colors"
                      >
                        {t.go_to_checkout}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hide Scrollbars */}
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}} />
    </div>
  );
}

