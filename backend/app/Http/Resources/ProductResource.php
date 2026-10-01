<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'sku' => $this->sku,
            'type' => $this->type?->value ?? $this->type,
            'short_description' => $this->short_description,
            'description' => $this->description,
            'price_amount' => $this->price_amount,
            'regular_price_amount' => $this->regular_price_amount,
            'sale_price_amount' => $this->sale_price_amount,
            'computed_price' => $this->computed_price ?? $this->price_amount,
            'is_on_sale' => (bool) $this->is_on_sale,
            'is_new' => (bool) $this->is_new,
            'is_bestseller' => (bool) $this->is_bestseller,
            'is_promoted' => (bool) $this->is_promoted,
            'is_recommended' => (bool) $this->is_recommended,
            'featured_image_url' => $this->featuredImageUrl(),
            'gallery_image_urls' => $this->galleryImageUrls(),
            'categories' => $this->whenLoaded('categories', fn () => CategoryResource::collection($this->categories)),
            'published_at' => optional($this->published_at)->toIso8601String(),
        ];
    }
}
