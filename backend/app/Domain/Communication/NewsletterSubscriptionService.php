<?php

namespace App\Domain\Communication;

use App\Models\NewsletterSubscriber;
use App\Mail\NewsletterDoubleOptInMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class NewsletterSubscriptionService
{
    /**
     * Subscribe an email address to the newsletter using Double Opt-In verification.
     */
    public function subscribe(string $email, ?string $firstName = null, ?string $lastName = null, string $source = 'api.newsletter.subscribe'): NewsletterSubscriber
    {
        $email = mb_strtolower(trim($email));

        $subscriber = NewsletterSubscriber::query()->where('email', $email)->first();

        // If subscriber is already active, do not trigger double opt-in email again
        if ($subscriber && $subscriber->status === 'active' && $subscriber->is_active) {
            $subscriber->update([
                'first_name' => $firstName ?? $subscriber->first_name,
                'last_name' => $lastName ?? $subscriber->last_name,
            ]);
            return $subscriber;
        }

        $token = Str::random(40);

        if ($subscriber) {
            $subscriber->update([
                'first_name' => $firstName ?? $subscriber->first_name,
                'last_name' => $lastName ?? $subscriber->last_name,
                'source' => $source,
                'status' => 'pending',
                'is_active' => false,
                'double_opt_in_token' => $token,
                'double_opt_in_ip' => request()->ip(),
                'double_opt_in_confirmed_at' => null,
            ]);
        } else {
            $subscriber = NewsletterSubscriber::query()->create([
                'email' => $email,
                'first_name' => $firstName,
                'last_name' => $lastName,
                'source' => $source,
                'status' => 'pending',
                'is_active' => false,
                'double_opt_in_token' => $token,
                'double_opt_in_ip' => request()->ip(),
            ]);
        }

        Mail::to($subscriber->email)->send(new NewsletterDoubleOptInMail($subscriber));

        return $subscriber;
    }

    /**
     * Unsubscribe an email address from the newsletter.
     */
    public function unsubscribe(string $email): ?NewsletterSubscriber
    {
        $email = mb_strtolower(trim($email));

        $subscriber = NewsletterSubscriber::query()->where('email', $email)->first();

        if ($subscriber) {
            $subscriber->update([
                'status' => 'unsubscribed',
                'is_active' => false,
                'unsubscribed_at' => now(),
                'double_opt_in_token' => null,
            ]);
        }

        return $subscriber;
    }
}

