<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactInquiry extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'subject',
        'message',
        'payload',
        'status',
        'admin_notes',
        'ip_address',
        'user_agent',
    ];

    protected function casts(): array
    {
        return [
            'payload' => 'array',
        ];
    }

    public static function getStatuses(): array
    {
        return [
            'new' => 'Nowa',
            'read' => 'Przeczytana',
            'replied' => 'Odpowiedziano',
            'archived' => 'Zarchiwizowana',
        ];
    }

    public function scopeNew(Builder $query): Builder
    {
        return $query->where('status', 'new');
    }
}
