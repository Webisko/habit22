<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BlogPostResource extends JsonResource
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
            'content' => $this->content,
            'cover_image_url' => $this->publicCoverImageUrl(),
            'reading_time_minutes' => $this->reading_time_minutes,
            'author_name' => $this->author_name,
            'published_at' => optional($this->published_at)->toIso8601String(),
        ];
    }
}
