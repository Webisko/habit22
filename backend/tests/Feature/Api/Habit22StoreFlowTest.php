<?php

namespace Tests\Feature\Api;

use App\Models\BlogPost;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\Product;
use App\Models\ShippingMethod;
use App\Models\User;
use Database\Seeders\Habit22DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class Habit22StoreFlowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(Habit22DatabaseSeeder::class);
    }

    public function test_habit22_catalog_contains_bags_and_variants(): void
    {
        $response = $this->getJson('/api/catalog');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                'products',
                'categories',
            ],
        ]);

        $products = $response->json('data.products');
        $this->assertCount(3, $products);

        $slugs = collect($products)->pluck('slug')->all();
        $this->assertContains('kratka-vichy', $slugs);
        $this->assertContains('szalwiowa-zielen', $slugs);
        $this->assertContains('gleboki-granat', $slugs);

        // Verify variants and price (350.00 PLN = 35000 groszy)
        $vichy = collect($products)->firstWhere('slug', 'kratka-vichy');
        $this->assertNotEmpty($vichy['variants']);
        $this->assertEquals(35000, (int) $vichy['current_price_amount']);
    }

    public function test_habit22_quote_with_inpost_locker(): void
    {
        $payload = [
            'shipping_method_code' => 'locker',
            'delivery_point' => [
                'id' => 'WAW123M',
                'name' => 'Paczkomat WAW123M',
                'address' => 'ul. Mokotowska 15',
                'city' => 'Warszawa',
                'postal_code' => '00-640',
            ],
            'items' => [
                ['slug' => 'kratka-vichy', 'quantity' => 1],
            ],
        ];

        $response = $this->postJson('/api/quote', $payload);

        $response->assertStatus(200);
        // Subtotal: 35000 gr. Free shipping applies (threshold is 25000 gr).
        $this->assertEquals(35000, (int) $response->json('data.subtotal_amount'));
        $this->assertEquals(0, (int) $response->json('data.shipping_amount'));
        $this->assertEquals(35000, (int) $response->json('data.total_amount'));
        $this->assertEquals(0, (int) $response->json('data.coupon_discount_amount'));
    }

    public function test_habit22_quote_with_percentage_coupon_habit10(): void
    {
        $payload = [
            'shipping_method_code' => 'locker',
            'coupon_code' => 'HABIT10',
            'delivery_point' => [
                'id' => 'WAW123M',
                'name' => 'Paczkomat WAW123M',
                'address' => 'ul. Mokotowska 15',
                'city' => 'Warszawa',
                'postal_code' => '00-640',
            ],
            'items' => [
                ['slug' => 'kratka-vichy', 'quantity' => 1],
            ],
        ];

        $response = $this->postJson('/api/quote', $payload);

        $response->assertStatus(200);
        // Subtotal: 35000. Discount 10% = 3500. Free shipping = 0. Total = 31500 gr (315 PLN).
        $this->assertEquals(35000, (int) $response->json('data.subtotal_amount'));
        $this->assertEquals(3500, (int) $response->json('data.coupon_discount_amount'));
        $this->assertEquals(0, (int) $response->json('data.shipping_amount'));
        $this->assertEquals(31500, (int) $response->json('data.total_amount'));
        $this->assertEquals('HABIT10', $response->json('data.applied_coupon_code'));
    }

    public function test_habit22_quote_with_fixed_coupon_lato50(): void
    {
        $payload = [
            'shipping_method_code' => 'courier',
            'coupon_code' => 'LATO50',
            'items' => [
                ['slug' => 'szalwiowa-zielen', 'quantity' => 2], // 70000 gr
            ],
        ];

        $response = $this->postJson('/api/quote', $payload);

        $response->assertStatus(200);
        // Subtotal: 70000. Discount 5000. Free shipping: 0. Total: 65000 gr (650 PLN).
        $this->assertEquals(70000, (int) $response->json('data.subtotal_amount'));
        $this->assertEquals(5000, (int) $response->json('data.coupon_discount_amount'));
        $this->assertEquals(0, (int) $response->json('data.shipping_amount'));
        $this->assertEquals(65000, (int) $response->json('data.total_amount'));
        $this->assertEquals('LATO50', $response->json('data.applied_coupon_code'));
    }

    public function test_habit22_place_order_with_inpost_and_stripe(): void
    {
        $payload = [
            'shipping_method_code' => 'locker',
            'coupon_code' => 'HABIT10',
            'payment_method' => 'stripe',
            'customer' => [
                'first_name' => 'Anna',
                'last_name' => 'Nowak',
                'email' => 'anna.nowak@example.com',
                'phone' => '+48600100200',
            ],
            'billing_address' => [
                'street' => 'ul. Piękna 10/2',
                'city' => 'Warszawa',
                'postal_code' => '00-549',
            ],
            'delivery_point' => [
                'id' => 'WAW123M',
                'name' => 'Paczkomat WAW123M',
                'address' => 'ul. Mokotowska 15',
                'city' => 'Warszawa',
                'postal_code' => '00-640',
            ],
            'items' => [
                ['slug' => 'kratka-vichy', 'quantity' => 1],
            ],
            'terms_accepted' => true,
        ];

        $response = $this->postJson('/api/checkout/place', $payload);

        $response->assertStatus(201);
        $orderData = $response->json('data.order');
        $this->assertNotEmpty($orderData['number']);
        $this->assertEquals(31500, (int) $orderData['total_amount']);
        $this->assertEquals('anna.nowak@example.com', $orderData['customer_email']);
        $this->assertEquals('WAW123M', $orderData['delivery_point']['id']);

        // Check in database
        $order = Order::where('number', $orderData['number'])->first();
        $this->assertNotNull($order);
        $this->assertEquals('WAW123M', $order->metadata['delivery_point']['id'] ?? null);
        $this->assertEquals(3500, (int) $order->discount_amount);

        // Test payment session initiation
        $sessionResponse = $this->postJson("/api/checkout/orders/{$order->number}/payment-session", [], [
            'X-Order-Email' => 'anna.nowak@example.com',
        ]);
        $sessionResponse->assertStatus(201);
        $sessionData = $sessionResponse->json('data.payment_session');
        $this->assertEquals('stripe', $sessionData['provider']);
        $this->assertEquals(31500, (int) $sessionData['amount']);
    }

    public function test_habit22_blog_posts(): void
    {
        $response = $this->getJson('/api/blog/posts');

        $response->assertStatus(200);
        $posts = $response->json('data.posts');
        $this->assertCount(3, $posts);
    }

    public function test_habit22_admin_user_can_authenticate(): void
    {
        $superadmin = User::where('email', 'admin@webisko.pl')->first();
        $this->assertNotNull($superadmin);
        $this->assertTrue(Hash::check('password123', $superadmin->password));
        $this->assertTrue($superadmin->is_admin);
        $this->assertEquals('admin', $superadmin->role->value);

        $clientManager = User::where('email', 'kontakt@habit22.eu')->first();
        $this->assertNotNull($clientManager);
        $this->assertTrue(Hash::check('password123', $clientManager->password));
        $this->assertTrue($clientManager->is_admin);
        $this->assertEquals('manager', $clientManager->role->value);
    }
}
