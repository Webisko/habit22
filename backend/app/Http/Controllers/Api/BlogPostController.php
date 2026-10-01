<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BlogPostResource;
use App\Models\BlogPost;
use Illuminate\Http\JsonResponse;

class BlogPostController extends Controller
{
    public function index(): JsonResponse
    {
        $posts = BlogPost::query()
            ->publiclyVisible()
            ->latest('published_at')
            ->get();

        return response()->json([
            'data' => [
                'posts' => BlogPostResource::collection($posts),
            ],
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $post = BlogPost::query()
            ->publiclyVisible()
            ->where('slug', $slug)
            ->firstOrFail();

        $baseUrl = rtrim((string) config('services.storefront.url', config('app.url')), '/');
        $postUrl = $baseUrl . '/blog/' . $post->slug;

        $defaultLocale = config('app.locale', 'pl');
        $supportedLocales = [$defaultLocale, config('app.fallback_locale', 'en')];
        $hreflangs = [];
        foreach ($supportedLocales as $locale) {
            $langPrefix = $locale === $defaultLocale ? '' : '/' . $locale;
            $hreflangs[] = [
                'locale' => $locale,
                'url' => $baseUrl . $langPrefix . '/blog/' . $post->slug,
            ];
        }

        $coverUrl = $post->publicCoverImageUrl();
        
        $authorSchema = [
            '@type' => 'Person',
            'name' => $post->author_name ?: 'Administrator',
        ];

        if (filled($post->metadata['author_bio'] ?? null)) {
            $authorSchema['description'] = $post->metadata['author_bio'];
        }
        if (filled($post->metadata['author_avatar_path'] ?? null)) {
            $authorSchema['image'] = \App\Support\PublicMediaUrl::resolve($post->metadata['author_avatar_path']);
        }
        if (filled($post->metadata['author_linkedin'] ?? null)) {
            $authorSchema['sameAs'] = $post->metadata['author_linkedin'];
        }

        $schema = [
            '@context' => 'https://schema.org',
            '@type' => 'BlogPosting',
            'headline' => $post->title,
            'description' => $post->excerpt ?: $post->seo_description,
            'datePublished' => optional($post->published_at)->toIso8601String(),
            'url' => $postUrl,
            'author' => $authorSchema,
            'publisher' => [
                '@type' => 'Organization',
                'name' => app(\App\Support\StoreSettings::class)->storeName(),
            ]
        ];

        if ($coverUrl) {
            $schema['image'] = $coverUrl;
        }

        $ogTitle = $post->metadata['og_title'] ?? $post->seo_title ?? $post->title;
        $ogDescription = $post->metadata['og_description'] ?? $post->seo_description ?? $post->excerpt;
        if (blank($ogDescription) && filled($post->content)) {
            $ogDescription = \Illuminate\Support\Str::limit(strip_tags($post->content), 160);
        }
        $ogImage = null;
        if (filled($post->metadata['og_image_path'] ?? null)) {
            $ogImage = \App\Support\PublicMediaUrl::resolve($post->metadata['og_image_path']);
        }
        if (blank($ogImage)) {
            $ogImage = $coverUrl;
        }

        $dynamicOgImageUrl = null;
        if (app('router')->has('og-image')) {
            try {
                $dynamicOgImageUrl = \Illuminate\Support\Facades\URL::signedRoute('og-image', [
                    'title' => $post->title,
                    'subtitle' => $post->author_name ? 'Autor: ' . $post->author_name : 'Blog',
                ]);
            } catch (\Throwable $e) {
            }
        }

        return response()->json([
            'data' => [
                'post' => [
                    'id' => $post->id,
                    'slug' => $post->slug,
                    'title' => $post->title,
                    'excerpt' => $post->excerpt,
                    'content' => $post->content,
                    'author_name' => $post->author_name,
                    'cover_image_url' => $coverUrl,
                    'cover_image_alt' => $post->metadata['cover_image_alt'] ?? null,
                    'seo_title' => $post->seo_title,
                    'seo_description' => $post->seo_description,
                    'is_noindex' => (bool) $post->is_noindex,
                    'canonical_url' => $postUrl,
                    'hreflangs' => $hreflangs,
                    'social_meta' => [
                        'og:title' => $ogTitle,
                        'og:description' => $ogDescription,
                        'og:image' => $ogImage ?: $dynamicOgImageUrl,
                        'twitter:card' => 'summary_large_image',
                        'twitter:title' => $ogTitle,
                        'twitter:description' => $ogDescription,
                        'twitter:image' => $ogImage ?: $dynamicOgImageUrl,
                    ],
                    'dynamic_og_image_url' => $dynamicOgImageUrl,
                    'published_at' => optional($post->published_at)->toIso8601String(),
                    'metadata' => $post->metadata ?? [],
                    'author_details' => [
                        'name' => $post->author_name,
                        'bio' => $post->metadata['author_bio'] ?? null,
                        'avatar_url' => isset($post->metadata['author_avatar_path']) ? \App\Support\PublicMediaUrl::resolve($post->metadata['author_avatar_path']) : null,
                        'linkedin' => $post->metadata['author_linkedin'] ?? null,
                    ],
                    'sources' => $post->metadata['sources'] ?? [],
                    'schema_json_ld' => $schema,
                ],
            ],
        ]);
    }
}
