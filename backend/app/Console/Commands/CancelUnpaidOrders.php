<?php

namespace App\Console\Commands;

use App\Models\Order;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class CancelUnpaidOrders extends Command
{
    protected $signature = 'app:cancel-unpaid-orders {--hours=48 : Liczba godzin, po których nieopłacone zamówienie zostanie anulowane}';

    protected $description = 'Anuluje nieopłacone zamówienia oczekujące na płatność i zwalnia zarezerwowane stany magazynowe';

    public function handle(): int
    {
        $hours = (int) $this->option('hours');
        $cutoff = now()->subHours($hours);

        $unpaidOrders = Order::query()
            ->where('status', 'placed')
            ->where('payment_status', 'awaiting_payment')
            ->where(function ($query) use ($cutoff) {
                $query->where('placed_at', '<', $cutoff)
                    ->orWhere(function ($sub) use ($cutoff) {
                        $sub->whereNull('placed_at')
                            ->where('created_at', '<', $cutoff);
                    });
            })
            ->get();

        $cancelledCount = 0;

        foreach ($unpaidOrders as $order) {
            // Do not cancel cash on delivery orders
            if ($order->isCod()) {
                continue;
            }

            try {
                $order->forceFill([
                    'status' => 'cancelled',
                    'metadata' => array_merge($order->metadata ?? [], [
                        'auto_cancelled_at' => now()->toIso8601String(),
                        'cancellation_reason' => "Brak płatności w ciągu {$hours} godzin.",
                    ]),
                ])->save();

                $cancelledCount++;
                Log::info("Automatycznie anulowano nieopłacone zamówienie {$order->number} (stany magazynowe przywrócone).");
            } catch (\Throwable $e) {
                Log::error("Błąd podczas automatycznego anulowania zamówienia {$order->number}: " . $e->getMessage());
            }
        }

        $this->info("Pomyślnie anulowano {$cancelledCount} nieopłaconych zamówień starszych niż {$hours} godz.");

        return self::SUCCESS;
    }
}
