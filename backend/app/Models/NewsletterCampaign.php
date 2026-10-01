<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NewsletterCampaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'subject',
        'body_html',
        'status',
        'sent_to_count',
        'sent_at',
    ];

    protected function casts(): array
    {
        return [
            'sent_to_count' => 'integer',
            'sent_at' => 'datetime',
        ];
    }
}
