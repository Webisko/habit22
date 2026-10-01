<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NewsletterSubscriber extends Model
{
    use HasFactory;

    protected $fillable = [
        'email',
        'first_name',
        'last_name',
        'source',
        'status',
        'double_opt_in_token',
        'double_opt_in_ip',
        'double_opt_in_confirmed_at',
        'consented_at',
        'unsubscribed_at',
        'is_active',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'consented_at' => 'datetime',
            'unsubscribed_at' => 'datetime',
            'double_opt_in_confirmed_at' => 'datetime',
            'is_active' => 'boolean',
            'metadata' => 'array',
        ];
    }

    protected static function booted(): void
    {
        static::saved(function (NewsletterSubscriber $subscriber): void {
            if ($subscriber->wasRecentlyCreated || $subscriber->isDirty('email') || $subscriber->isDirty('status')) {
                \App\Jobs\SyncNewsletterToWebhookJob::dispatch(
                    $subscriber->email,
                    $subscriber->status,
                    $subscriber->first_name,
                    $subscriber->last_name,
                    $subscriber->metadata ?? []
                );
            }
        });
    }
}