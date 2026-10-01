<?php

namespace App\Support\SEO;

use App\Models\BlogPost;
use App\Models\Course;
use App\Models\Product;

class JsonLdHelper
{
    /**
     * Generuje schemat JSON-LD dla produktu
     */
    public static function product(Product $product): string
    {
        $baseUrl = rtrim(config('app.url'), '/');
        
        $data = [
            '@context' => 'https://schema.org',
            '@type' => 'Product',
            'name' => $product->getTranslation('name', app()->getLocale()),
            'image' => $product->featuredImageUrl() ?: ($baseUrl . '/images/placeholder.png'),
            'description' => strip_tags($product->getTranslation('short_description', app()->getLocale()) ?: $product->getTranslation('description', app()->getLocale())),
            'sku' => $product->sku ?: 'PROD-' . $product->id,
            'offers' => [
                '@type' => 'Offer',
                'url' => $baseUrl . '/products/' . $product->slug,
                'priceCurrency' => $product->currency ?: 'PLN',
                'price' => number_format(($product->sale_price_amount ?? $product->regular_price_amount) / 100, 2, '.', ''),
                'priceValidUntil' => now()->addYear()->toDateString(),
                'itemCondition' => 'https://schema.org/NewCondition',
                'availability' => $product->stock_quantity > 0 || !$product->manages_stock
                    ? 'https://schema.org/InStock'
                    : 'https://schema.org/OutOfStock',
            ]
        ];

        // Dodaj oceny, jeśli produkt ma zatwierdzone opinie
        $avgRating = $product->averageRating();
        $reviewsCount = $product->approvedReviewsCount();
        if ($reviewsCount > 0) {
            $data['aggregateRating'] = [
                '@type' => 'AggregateRating',
                'ratingValue' => $avgRating,
                'reviewCount' => $reviewsCount,
                'bestRating' => '5',
                'worstRating' => '1',
            ];
        }

        return self::render($data);
    }

    /**
     * Generuje schemat JSON-LD dla kursu (LMS)
     */
    public static function course($course): string
    {
        $baseUrl = rtrim(config('app.url'), '/');
        
        $data = [
            '@context' => 'https://schema.org',
            '@type' => 'Course',
            'name' => $course->getTranslation('title', app()->getLocale()),
            'description' => strip_tags($course->getTranslation('description', app()->getLocale())),
            'provider' => [
                '@type' => 'Organization',
                'name' => config('app.name'),
                'sameAs' => $baseUrl,
            ]
        ];

        return self::render($data);
    }

    /**
     * Generuje schemat JSON-LD dla strony FAQ
     */
    public static function faq(iterable $faqItems): string
    {
        $mainEntity = [];
        foreach ($faqItems as $item) {
            $mainEntity[] = [
                '@type' => 'Question',
                'name' => $item->getTranslation('question', app()->getLocale()),
                'acceptedAnswer' => [
                    '@type' => 'Answer',
                    'text' => strip_tags($item->getTranslation('answer', app()->getLocale())),
                ]
            ];
        }

        $data = [
            '@context' => 'https://schema.org',
            '@type' => 'FAQPage',
            'mainEntity' => $mainEntity,
        ];

        return self::render($data);
    }

    /**
     * Generuje schemat JSON-LD dla artykułu na blogu
     */
    public static function article(BlogPost $post): string
    {
        $baseUrl = rtrim(config('app.url'), '/');
        
        $data = [
            '@context' => 'https://schema.org',
            '@type' => 'BlogPosting',
            'headline' => $post->getTranslation('title', app()->getLocale()),
            'image' => $post->publicCoverImageUrl() ?: ($baseUrl . '/images/placeholder.png'),
            'editor' => $post->author_name ?: config('app.name'),
            'genre' => 'Blog',
            'url' => $baseUrl . '/blog/' . $post->slug,
            'datePublished' => $post->published_at ? $post->published_at->toDateString() : $post->created_at->toDateString(),
            'dateCreated' => $post->created_at->toDateString(),
            'dateModified' => $post->updated_at->toDateString(),
            'description' => strip_tags($post->getTranslation('excerpt', app()->getLocale())),
            'articleBody' => strip_tags($post->getTranslation('content', app()->getLocale())),
            'author' => [
                '@type' => 'Person',
                'name' => $post->author_name ?: config('app.name'),
            ],
            'publisher' => [
                '@type' => 'Organization',
                'name' => config('app.name'),
                'logo' => [
                    '@type' => 'ImageObject',
                    'url' => $baseUrl . '/logo.png',
                ]
            ]
        ];

        return self::render($data);
    }

    private static function render(array $data): string
    {
        return '<script type="application/ld+json">' . json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . '</script>';
    }
}
