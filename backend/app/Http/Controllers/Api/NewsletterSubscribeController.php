<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Domain\Communication\NewsletterSubscriptionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NewsletterSubscribeController extends Controller
{
    public function __construct(
        private readonly NewsletterSubscriptionService $subscriptionService
    ) {
    }

    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email:rfc', 'max:255'],
            'first_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'source' => ['nullable', 'string', 'max:120'],
        ]);

        $subscriber = $this->subscriptionService->subscribe(
            email: $validated['email'],
            firstName: $validated['first_name'] ?? null,
            lastName: $validated['last_name'] ?? null,
            source: $validated['source'] ?? 'api.newsletter.subscribe'
        );

        return response()->json([
            'data' => [
                'subscriber' => [
                    'id' => $subscriber->id,
                    'email' => $subscriber->email,
                    'status' => $subscriber->status,
                    'is_active' => $subscriber->is_active,
                    'consented_at' => optional($subscriber->consented_at)->toIso8601String(),
                ],
            ],
        ], $subscriber->wasRecentlyCreated ? 201 : 200);
    }
}