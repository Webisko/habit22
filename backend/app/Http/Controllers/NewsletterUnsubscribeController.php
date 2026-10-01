<?php

namespace App\Http\Controllers;

use App\Domain\Communication\NewsletterSubscriptionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class NewsletterUnsubscribeController extends Controller
{
    public function __construct(
        private readonly NewsletterSubscriptionService $subscriptionService
    ) {
    }

    public function unsubscribeWeb(Request $request, string $email): RedirectResponse
    {
        if (! $request->hasValidSignature()) {
            return redirect()->away(env('FRONTEND_URL', 'http://localhost:3000') . '/newsletter/error');
        }

        $this->subscriptionService->unsubscribe($email);

        return redirect()->away(env('FRONTEND_URL', 'http://localhost:3000') . '/newsletter/unsubscribed');
    }
}
