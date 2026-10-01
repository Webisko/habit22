<?php

namespace App\Http\Controllers;

use App\Models\NewsletterSubscriber;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class NewsletterConfirmController extends Controller
{
    public function __invoke(Request $request, string $token): RedirectResponse
    {
        $subscriber = NewsletterSubscriber::query()
            ->where('double_opt_in_token', $token)
            ->where('status', 'pending')
            ->first();

        $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');

        if (!$subscriber) {
            return redirect()->away($frontendUrl . '/newsletter/error');
        }

        $subscriber->update([
            'status' => 'active',
            'is_active' => true,
            'consented_at' => now(),
            'double_opt_in_confirmed_at' => now(),
            'double_opt_in_ip' => $request->ip(),
            'double_opt_in_token' => null,
        ]);

        return redirect()->away($frontendUrl . '/newsletter/confirmed');
    }
}
