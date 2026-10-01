<?php

namespace App\Console\Commands;

use App\Models\NewsletterSubscriber;
use Illuminate\Console\Command;

class CleanupPendingSubscribers extends Command
{
    protected $signature = 'app:cleanup-pending-subscribers {--days=14 : Liczba dni, po których niepotwierdzone subskrypcje będą usuwane}';

    protected $description = 'Usuwa z bazy danych adresy e-mail ze statusem pending, które nie potwierdziły zapisu do newslettera w określonym czasie';

    public function handle(): int
    {
        $days = (int) $this->option('days');
        $cutoff = now()->subDays($days);

        $count = NewsletterSubscriber::query()
            ->where('status', 'pending')
            ->where('created_at', '<', $cutoff)
            ->count();

        if ($count === 0) {
            $this->info('Nie znaleziono niepotwierdzonych subskrypcji newslettera do usunięcia.');
            return self::SUCCESS;
        }

        NewsletterSubscriber::query()
            ->where('status', 'pending')
            ->where('created_at', '<', $cutoff)
            ->delete();

        $this->info("Pomyślnie usunięto {$count} niepotwierdzonych subskrypcji newslettera starszych niż {$days} dni.");

        return self::SUCCESS;
    }
}
