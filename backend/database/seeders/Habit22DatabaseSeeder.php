<?php

namespace Database\Seeders;

use App\Domain\Commerce\Enums\ProductType;
use App\Models\BlogPost;
use App\Models\Coupon;
use App\Models\Product;
use App\Models\ProductOption;
use App\Models\ProductOptionValue;
use App\Models\ProductVariant;
use App\Models\StoreSetting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class Habit22DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Admin & Manager Users
        $superadmin = User::query()->updateOrCreate(
            ['email' => 'admin@webisko.pl'],
            [
                'name' => 'Webisko Admin',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );
        $superadmin->forceFill(['is_admin' => true])->save();

        $clientManager = User::query()->updateOrCreate(
            ['email' => 'kontakt@habit22.eu'],
            [
                'name' => 'Habit22 Menedżer',
                'password' => Hash::make('password123'),
                'role' => 'manager',
                'email_verified_at' => now(),
            ]
        );
        $clientManager->forceFill(['is_admin' => true])->save();

        // 2. Store Settings
        $shippingMethods = [
            [
                'code' => 'locker',
                'name' => 'Paczkomat InPost',
                'amount' => 1500, // 15,00 PLN
                'supports_cod' => false,
                'requires_delivery_point' => true,
                'zone_prices' => [],
            ],
            [
                'code' => 'courier',
                'name' => 'Kurier',
                'amount' => 2000, // 20,00 PLN
                'supports_cod' => false,
                'requires_delivery_point' => false,
                'zone_prices' => [],
            ],
        ];

        $setting = StoreSetting::query()->first();
        if (! $setting) {
            $setting = StoreSetting::query()->create([
                'store_name' => 'Habit22',
                'currency' => 'PLN',
                'allow_guest_checkout' => true,
                'shipping_methods' => $shippingMethods,
                'shipping_zones' => [],
                'metadata' => [
                    'admin_brand_name' => 'Habit22 Studio',
                ],
            ]);
        } else {
            $setting->update([
                'store_name' => 'Habit22',
                'currency' => 'PLN',
                'allow_guest_checkout' => true,
                'shipping_methods' => $shippingMethods,
                'shipping_zones' => [],
                'metadata' => array_merge($setting->metadata ?? [], [
                    'admin_brand_name' => 'Habit22 Studio',
                ]),
            ]);
        }

        // 3. Products
        $productsData = [
            [
                'id' => 'floral',
                'slug' => 'kratka-vichy',
                'sku' => 'H22-VICHY',
                'name' => ['pl' => 'Kratka Vichy', 'en' => 'Vichy Check'],
                'short_description' => ['pl' => 'Kolekcja Gingham / Vichy', 'en' => 'Gingham / Vichy Collection'],
                'description' => [
                    'pl' => "Ręcznie szyta lniana torba projektowa z autorskiej kolekcji Gingham. Wykonana z grubego, trwałego lnu o charakterystycznym splocie w kratkę Vichy. Idealna do przechowywania robótek dziewiarskich, podróży oraz codziennego użytku w miejskim stylu.",
                    'en' => "Handmade natural linen project bag from our signature Gingham collection. Crafted from heavy, durable linen in a classic Vichy check pattern. Perfect for knitting projects, travel, and everyday minimalist living.",
                ],
                'price' => 35000,
                'images' => [
                    '/habit22/produkt__1-1.webp',
                    '/habit22/produkt__1-2.webp',
                    '/habit22/produkt__1-3.webp',
                ],
                'sizes' => ['22', '33', '44'],
            ],
            [
                'id' => 'len',
                'slug' => 'szalwiowa-zielen',
                'sku' => 'H22-SAGE',
                'name' => ['pl' => 'Szałwiowa zieleń', 'en' => 'Sage Green'],
                'short_description' => ['pl' => 'Kolekcja Eucalyptus / Linen', 'en' => 'Eucalyptus / Linen Collection'],
                'description' => [
                    'pl' => "Subtelna i elegancka torba lniana w kojącym odcieniu szałwii. 100% naturalna tkanina, usztywniane dno ułatwiające stabilne stawianie na stole lub trawie oraz wewnętrzne kieszonki na druty i drobiazgi.",
                    'en' => "Subtle and calming sage green natural linen bag. 100% natural fabric, reinforced bottom for standing upright effortlessly, and thoughtful inner compartments for needles and notions.",
                ],
                'price' => 35000,
                'images' => [
                    '/habit22/produkt__2-1.webp',
                    '/habit22/produkt__2-2.webp',
                    '/habit22/produkt__2-3.webp',
                ],
                'sizes' => ['22', '33', '44'],
            ],
            [
                'id' => 'oliwa',
                'slug' => 'gleboki-granat',
                'sku' => 'H22-NAVY',
                'name' => ['pl' => 'Głęboki granat', 'en' => 'Deep Navy'],
                'short_description' => ['pl' => 'Kolekcja Ginkgo / Navy', 'en' => 'Ginkgo / Navy Collection'],
                'description' => [
                    'pl' => "Klasyczny, głęboki granat w szlachetnym wykończeniu. Pojemna, rzemieślnicza torba projektowa, która nabiera szlachetności wraz z każdym praniem i noszeniem.",
                    'en' => "Classic deep navy linen with an artisanal finish. A spacious project bag that matures gracefully with every wash and wear.",
                ],
                'price' => 35000,
                'images' => [
                    '/habit22/produkt__3-1.webp',
                    '/habit22/produkt__3-2.webp',
                    '/habit22/produkt__3-3.webp',
                ],
                'sizes' => ['22', '33', '44'],
            ],
        ];

        foreach ($productsData as $pData) {
            $product = Product::query()->updateOrCreate(
                ['slug' => $pData['slug']],
                [
                    'sku' => $pData['sku'],
                    'type' => ProductType::Physical,
                    'name' => $pData['name'],
                    'short_description' => $pData['short_description'],
                    'description' => $pData['description'],
                    'currency' => 'PLN',
                    'regular_price_amount' => $pData['price'],
                    'sale_price_amount' => null,
                    'featured_image_path' => $pData['images'][0],
                    'gallery_image_paths' => $pData['images'],
                    'stock_quantity' => 20,
                    'manages_stock' => false,
                    'is_active' => true,
                    'is_visible' => true,
                    'is_purchasable' => true,
                    'is_bestseller' => true,
                    'show_on_homepage' => true,
                    'published_at' => now(),
                    'metadata' => [
                        'habit22_id' => $pData['id'],
                    ],
                ]
            );

            // Size Option
            $option = ProductOption::query()->firstOrCreate(
                ['product_id' => $product->id, 'name' => 'Rozmiar']
            );

            foreach ($pData['sizes'] as $sizeName) {
                $optionValue = ProductOptionValue::query()->firstOrCreate(
                    ['product_option_id' => $option->id, 'value' => $sizeName]
                );

                $variant = ProductVariant::query()->updateOrCreate(
                    [
                        'product_id' => $product->id,
                        'sku' => "{$pData['sku']}-{$sizeName}",
                    ],
                    [
                        'regular_price_amount' => $pData['price'],
                        'stock_quantity' => 10,
                        'manages_stock' => false,
                        'is_active' => true,
                    ]
                );

                $variant->optionValues()->syncWithoutDetaching([$optionValue->id]);
            }
        }

        // 4. Coupons
        Coupon::query()->updateOrCreate(
            ['code' => 'HABIT10'],
            [
                'name' => 'Kod rabatowy -10%',
                'discount_type' => 'percentage',
                'value' => 10,
                'currency' => 'PLN',
                'minimum_subtotal_amount' => 0,
                'usage_limit' => 1000,
                'is_active' => true,
            ]
        );

        Coupon::query()->updateOrCreate(
            ['code' => 'LATO50'],
            [
                'name' => 'Kod rabatowy -50 zł',
                'discount_type' => 'fixed_cart',
                'value' => 5000, // 50,00 PLN w groszach
                'currency' => 'PLN',
                'minimum_subtotal_amount' => 20000, // min 200 PLN
                'usage_limit' => 500,
                'is_active' => true,
            ]
        );

        // 5. Blog Posts (Dziennik)
        $postsData = [
            [
                'slug' => 'pielegnacja-naturalnego-lnu',
                'title' => [
                    'pl' => 'Pielęgnacja naturalnego lnu',
                    'en' => 'Caring for natural linen',
                ],
                'excerpt' => [
                    'pl' => 'Odpowiednia dbałość i miłość do naturalnych materiałów sprawi, że zostaną z Tobą na lata.',
                    'en' => 'Proper care and love for natural materials will ensure they stay with you for years to come.',
                ],
                'content' => [
                    'pl' => "Naturalny len to tkanina, która szlachetnieje z każdym praniem i użyciem. Odpowiednia pielęgnacja jest jednak kluczowa, by zachować jego miękkość i trwałość.\n\nPrzede wszystkim unikajmy wysokich temperatur. Pranie w 30 lub 40 stopniach Celsjusza jest w zupełności wystarczające. Pamiętajmy, aby używać delikatnych detergentów, najlepiej płynów, które nie osiadają na włóknach.\n\nSuszenie lnu na świeżym powietrzu to dla niego najlepsze rozwiązanie. Unikajmy suszarek bębnowych, które mogą przesuszyć włókna i spowodować ich łamliwość. Len najlepiej prasować lekko wilgotny, co ułatwi wygładzenie naturalnych zagnieceń, choć to właśnie one nadają mu ten uroczy, nieformalny charakter.",
                    'en' => "Natural linen is a fabric that becomes nobler with every wash and use. Proper care, however, is key to maintaining its softness and durability.\n\nAbove all, we should avoid high temperatures. Washing at 30 or 40 degrees Celsius is perfectly sufficient. Remember to use gentle detergents, preferably liquids, which do not settle on the fibers.\n\nDrying linen in the fresh air is the best solution. We avoid tumble dryers, which can overdry the fibers and cause them to break. Linen is best ironed while slightly damp, making it easier to smooth out natural creases, although they are what gives it that charming, informal character.",
                ],
                'cover_image_url' => '/habit22/produkt__1-1.webp',
                'published_at' => now()->subDays(10),
            ],
            [
                'slug' => 'rytualy-codziennosci',
                'title' => [
                    'pl' => 'Rytuały codzienności',
                    'en' => 'Everyday rituals',
                ],
                'excerpt' => [
                    'pl' => 'Dlaczego to czym się otaczamy ma znaczenie i jak z uważnością budować swoją przestrzeń.',
                    'en' => 'Why the things we surround ourselves with matter, and how to mindfully build your space.',
                ],
                'content' => [
                    'pl' => "Poranna kawa w ulubionym kubku, kilka stron książki przed pracą, chwila z robótką ręczną po południu – to właśnie te momenty budują nasz dzień.\n\nCzęsto zapominamy, że przestrzeń, w której żyjemy, kształtuje nasze myśli i emocje. Wybór przedmiotów codziennego użytku to nie tylko kwestia estetyki, ale przede wszystkim tego, jak dana rzecz na nas wpływa. Zwracanie uwagi na detale, materiały z których wykonane są rzeczy, z którymi obcujemy na co dzień, może przynieść niespodziewaną ulgę ze stresu.\n\nBudujmy naszą przestrzeń z intencją. Rezygnujmy z rzeczy, których nie używamy i zostawmy to, co piękne i użyteczne.",
                    'en' => "Morning coffee in your favorite mug, a few pages of a book before work, a moment with handcrafting in the afternoon - these are the moments that build our day.\n\nWe often forget that the space we live in shapes our thoughts and emotions. Choosing everyday items is not just a matter of aesthetics, but above all how a given thing affects us. Paying attention to details, to the materials from which the things we interact with every day are made, can bring unexpected relief from stress.\n\nLet's build our space with intention. Let's give up things we don't use and leave what is beautiful and useful.",
                ],
                'cover_image_url' => '/habit22/produkt__2-1.webp',
                'published_at' => now()->subDays(20),
            ],
            [
                'slug' => 'wybor-ma-znaczenie',
                'title' => [
                    'pl' => 'Wybór ma znaczenie',
                    'en' => 'Choices matter',
                ],
                'excerpt' => [
                    'pl' => 'Proces wyboru odpowiednich tkanin i rzemieślnicze podejście do każdego detalu naszej torby.',
                    'en' => 'The process of selecting the right fabrics and our artisanal approach to every detail.',
                ],
                'content' => [
                    'pl' => "Kiedy projektowałam pierwsze torby dziewiarskie, wiedziałam jedno: materiał musi być w 100% naturalny i wytrzymały.\n\nTestowanie tkanin zajęło wiele tygodni. Sztywny len o odpowiedniej gramaturze i splocie okazał się idealny, aby torba mogła samodzielnie stać, podczas gdy my wygodnie nabieramy kolejne oczka. Detale takie jak szwy, taśmy czy wykończenie kieszeni wewnątrz były dopracowywane we współpracy z zaprzyjaźnioną rzemieślniczką.",
                    'en' => "When designing the first knitting bags, I knew one thing: the material must be 100% natural and durable.\n\nTesting fabrics took many weeks. Heavyweight linen with the right weave turned out to be perfect so that the bag could stand on its own while we comfortably cast on consecutive stitches. Details such as seams, tapes, or inner pocket finishes were refined in cooperation with a friendly artisan.",
                ],
                'cover_image_url' => '/habit22/produkt__3-1.webp',
                'published_at' => now()->subDays(30),
            ],
        ];

        foreach ($postsData as $pData) {
            BlogPost::query()->updateOrCreate(
                ['slug' => $pData['slug']],
                [
                    'title' => $pData['title'],
                    'excerpt' => $pData['excerpt'],
                    'content' => $pData['content'],
                    'author_name' => 'Adriana',
                    'cover_image_url' => $pData['cover_image_url'],
                    'is_active' => true,
                    'published_at' => $pData['published_at'],
                ]
            );
        }
    }
}
