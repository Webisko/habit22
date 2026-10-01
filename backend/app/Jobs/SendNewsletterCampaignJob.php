<?php

namespace App\Jobs;

use App\Mail\NewsletterMail;
use App\Models\NewsletterCampaign;
use App\Models\NewsletterSubscriber;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Throwable;

class SendNewsletterCampaignJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public readonly NewsletterCampaign $campaign
    ) {
    }

    public function handle(): void
    {
        $this->campaign->update([
            'status' => 'sending',
        ]);

        $subscribers = NewsletterSubscriber::query()
            ->where('is_active', true)
            ->where('status', 'active')
            ->get();
            
        $sentCount = 0;

        try {
            foreach ($subscribers as $subscriber) {
                $unsubscribeUrl = URL::signedRoute('newsletter.unsubscribe', ['email' => $subscriber->email]);
                $bodyHtml = $this->campaign->body_html;

                if (str_contains($bodyHtml, '{{unsubscribe_url}}')) {
                    $bodyHtml = str_replace('{{unsubscribe_url}}', $unsubscribeUrl, $bodyHtml);
                } elseif (str_contains($bodyHtml, '{{UNSUBSCRIBE_URL}}')) {
                    $bodyHtml = str_replace('{{UNSUBSCRIBE_URL}}', $unsubscribeUrl, $bodyHtml);
                } else {
                    $bodyHtml .= '<hr><p style="font-size:12px;color:#666;text-align:center;">Jeżeli nie chcesz otrzymywać tych wiadomości, <a href="' . $unsubscribeUrl . '">wypisz się z newslettera</a>.</p>';
                }

                Mail::to($subscriber->email)->send(new NewsletterMail(
                    $this->campaign->subject,
                    $bodyHtml,
                    $unsubscribeUrl
                ));
                $sentCount++;
            }

            $this->campaign->update([
                'status' => 'sent',
                'sent_to_count' => $sentCount,
                'sent_at' => now(),
            ]);
        } catch (Throwable $exception) {
            $this->campaign->update([
                'status' => 'failed',
                'sent_to_count' => $sentCount,
            ]);

            throw $exception;
        }
    }
}
