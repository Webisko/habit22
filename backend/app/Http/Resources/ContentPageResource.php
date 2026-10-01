<?php

namespace App\Http\Resources;

use App\Models\ContentPage;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContentPageResource extends JsonResource
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
            'slug' => $this->slug,
            'title' => $this->title,
            'excerpt' => $this->excerpt,
            'body' => $this->body,
            'hero_image_url' => $this->heroImageUrl(),
            'hero_image_alt' => $this->metadata['hero_image_alt'] ?? null,
            'template' => $this->template,
            'template_label' => ContentPage::templateOptions()[$this->template] ?? $this->template,
            'published_at' => optional($this->published_at)->toIso8601String(),
        ];
    }
}
