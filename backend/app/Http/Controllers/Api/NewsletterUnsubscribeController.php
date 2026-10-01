<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Domain\Communication\NewsletterSubscriptionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NewsletterUnsubscribeController extends Controller
{
    public function __construct(
        private readonly NewsletterSubscriptionService $subscriptionService
    ) {
    }

    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email:rfc', 'max:255'],
        ]);

        $subscriber = $this->subscriptionService->unsubscribe($validated['email']);

        if (!$subscriber) {
            return response()->json([
                'message' => 'Subscriber not found',
            ], 422);
        }

        return response()->json([
            'message' => 'Successfully unsubscribed',
            'data' => [
                'subscriber' => [
                    'id' => $subscriber->id,
                    'email' => $subscriber->email,
                    'status' => $subscriber->status,
                    'is_active' => $subscriber->is_active,
                    'unsubscribed_at' => optional($subscriber->unsubscribed_at)->toIso8601String(),
                ],
            ],
        ], 200);
    }
}
