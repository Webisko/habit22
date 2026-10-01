<?php

namespace App\Filament\Pages;

use App\Models\BlogPost;
use App\Models\ContactInquiry;
use App\Models\ContentPage;
use App\Models\CustomerProfile;
use App\Models\FailedJob;
use App\Models\IntegrationLog;
use App\Models\NewsletterSubscriber;
use App\Models\Order;
use App\Models\OrderReturn;
use App\Models\Product;
use App\Models\ProductReview;
use BackedEnum;
use Filament\Pages\Page;
use Filament\Support\Icons\Heroicon;

class StoreDashboard extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedHome;

    protected static ?string $navigationLabel = 'Kokpit';

    protected static ?string $title = 'Kokpit';

    protected static ?int $navigationSort = -2;

    protected static ?string $slug = 'kokpit';

    protected string $view = 'filament.pages.store-dashboard';

    public function getMaxContentWidth(): string
    {
        return 'full';
    }

    /**
     * @return array<int, array{label: string, value: string, context: string, tone: string}>
     */
    public function heroStats(): array
    {
        $user = auth()->user();
        
        $revenueToday = (int) Order::query()
            ->whereDate('placed_at', today())
            ->where('status', '!=', 'cancelled')
            ->sum('total_amount');
            
        $ordersToday = Order::query()
            ->whereDate('placed_at', today())
            ->count();

        $stats = [
            [
                'label' => 'Dzisiejszy przychód',
                'value' => number_format($revenueToday / 100, 2, ',', ' ') . ' PLN',
                'context' => 'Suma opłaconych i w realizacji',
                'tone' => 'success',
                'url' => '/admin/analityka',
            ],
            [
                'label' => 'Dzisiejsze zamówienia',
                'value' => number_format($ordersToday, 0, ',', ' '),
                'context' => 'Wszystkie złożone dzisiaj',
                'tone' => 'info',
                'url' => '/admin/zamowienia',
            ],
        ];

        if ($user && !$user->isEmployee()) {
            $abandonedCarts = Order::query()
                ->where('status', 'draft')
                ->whereHas('items')
                ->whereDate('updated_at', '>=', now()->subDays(30)->toDateString())
                ->count();

            $stats[] = [
                'label' => 'Porzucone koszyki',
                'value' => number_format($abandonedCarts, 0, ',', ' '),
                'context' => 'Z ostatnich 30 dni',
                'tone' => 'warning',
                'url' => '/admin/porzucone-koszyki',
            ];

            $newCustomers = CustomerProfile::query()
                ->whereDate('created_at', '>=', now()->subDays(30)->toDateString())
                ->count();

            $stats[] = [
                'label' => 'Nowi klienci',
                'value' => number_format($newCustomers, 0, ',', ' '),
                'context' => 'Z ostatnich 30 dni',
                'tone' => 'default',
                'url' => '/admin/klienci',
            ];
        }

        return $stats;
    }

    /**
     * @return array<int, array{label: string, value: string, description: string, tone: string, url: string}>
     */
    public function operationalStats(): array
    {
        $user = auth()->user();
        if ($user && $user->isEmployee()) {
            return [];
        }

        $pendingFulfillment = Order::query()
            ->where('status', 'placed')
            ->where('fulfillment_status', 'pending')
            ->count();

        $lowStockCount = Product::query()
            ->where('is_active', true)
            ->where('manages_stock', true)
            ->where('stock_quantity', '<=', 5)
            ->count();

        $pendingReturns = OrderReturn::query()
            ->where('status', 'pending')
            ->count();

        $newInquiries = ContactInquiry::query()
            ->where('status', 'new')
            ->count();

        return [
            [
                'label' => 'Do wysyłki',
                'value' => number_format($pendingFulfillment, 0, ',', ' '),
                'description' => 'Zamówienia opłacone czekające na realizację.',
                'tone' => $pendingFulfillment > 0 ? 'warning' : 'success',
                'url' => '/admin/zamowienia',
            ],

            [
                'label' => 'Niskie stany magazynowe',
                'value' => number_format($lowStockCount, 0, ',', ' '),
                'description' => 'Aktywne produkty o stanie magazynowym ≤ 5.',
                'tone' => $lowStockCount > 0 ? 'danger' : 'success',
                'url' => '/admin/produkty',
            ],

            [
                'label' => 'Zwroty do rozpatrzenia',
                'value' => number_format($pendingReturns, 0, ',', ' '),
                'description' => 'Zgłoszenia zwrotów od klientów do weryfikacji.',
                'tone' => $pendingReturns > 0 ? 'warning' : 'success',
                'url' => '/admin/zwroty',
            ],

            [
                'label' => 'Nowe zapytania',
                'value' => number_format($newInquiries, 0, ',', ' '),
                'description' => 'Nowe wiadomości z formularza kontaktowego.',
                'tone' => $newInquiries > 0 ? 'danger' : 'success',
                'url' => '/admin/zapytania-kontaktowe',
            ],
        ];
    }

    /**
     * @return \Illuminate\Database\Eloquent\Collection<int, Order>
     */
    public function recentOrders(): \Illuminate\Database\Eloquent\Collection
    {
        return Order::query()
            ->latest('placed_at')
            ->limit(5)
            ->get();
    }

    /**
     * @return \Illuminate\Database\Eloquent\Collection<int, IntegrationLog>
     */
    public function recentIntegrationIssues(): \Illuminate\Database\Eloquent\Collection
    {
        return IntegrationLog::query()
            ->where('status', '!=', IntegrationLog::STATUS_SUCCESS)
            ->latest('occurred_at')
            ->limit(5)
            ->get();
    }

    /**
     * @return \Illuminate\Database\Eloquent\Collection<int, FailedJob>
     */
    public function recentFailedJobs(): \Illuminate\Database\Eloquent\Collection
    {
        return FailedJob::query()
            ->latest('failed_at')
            ->limit(5)
            ->get();
    }

    /**
     * @return \Illuminate\Database\Eloquent\Collection<int, ProductReview>
     */
    public function recentReviews(): \Illuminate\Database\Eloquent\Collection
    {
        return ProductReview::query()
            ->with('product')
            ->latest('created_at')
            ->limit(5)
            ->get();
    }
}
