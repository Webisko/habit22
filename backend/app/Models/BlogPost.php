<?php

namespace App\Models;

use App\Support\PublicMediaUrl;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

use Illuminate\Database\Eloquent\SoftDeletes;

class BlogPost extends Model
{
    use HasFactory, HasTranslations, SoftDeletes;

    public array $translatable = ['title', 'excerpt', 'content'];

    protected $fillable = [
        'slug',
        'title',
        'excerpt',
        'content',
        'author_name',
        'cover_image_url',
        'seo_title',
        'seo_description',
        'is_active',
        'published_at',
        'metadata',
        'is_noindex',
        'is_ai_generated',
        'ai_disclosure_text',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'published_at' => 'datetime',
            'metadata' => 'array',
            'is_noindex' => 'boolean',
            'is_ai_generated' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::updating(function (BlogPost $post): void {
            if ($post->isDirty('slug')) {
                $oldSlug = $post->getOriginal('slug');
                $newSlug = $post->slug;

                if (filled($oldSlug) && filled($newSlug) && $oldSlug !== $newSlug) {
                    $oldPath = '/blog/' . $oldSlug;
                    $newPath = '/blog/' . $newSlug;

                    \App\Models\RedirectRule::updateOrCreate(
                        ['source_path' => $oldPath],
                        [
                            'target_path' => $newPath,
                            'status_code' => 301,
                            'is_active' => true,
                        ]
                    );

                    \App\Models\RedirectRule::query()
                        ->where('target_path', $oldPath)
                        ->update(['target_path' => $newPath]);
                }
            }
        });
    }

    public function scopePubliclyVisible(Builder $query): Builder
    {
        return $query
            ->where('is_active', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    public function publicCoverImageUrl(): ?string
    {
        return PublicMediaUrl::resolve($this->cover_image_url);
    }
}
