<?php

namespace App\Mail;

use App\Models\NewsletterSubscriber;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewsletterDoubleOptInMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly NewsletterSubscriber $subscriber
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Potwierdź swój zapis do Newslettera',
        );
    }

    public function content(): Content
    {
        $activationUrl = route('newsletter.confirm', ['token' => $this->subscriber->double_opt_in_token]);
        $storeName = config('shop.store.name', config('app.name', 'Nasz Sklep'));

        $html = <<<HTML
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Potwierdź swój zapis do Newslettera</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                    background-color: #f3f4f6;
                    color: #1f2937;
                    margin: 0;
                    padding: 0;
                    line-height: 1.5;
                }
                .container {
                    max-width: 600px;
                    margin: 40px auto;
                    padding: 20px;
                }
                .card {
                    background-color: #ffffff;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    padding: 40px 30px;
                    text-align: center;
                }
                .logo {
                    font-size: 24px;
                    font-weight: 800;
                    color: #2563eb;
                    margin-bottom: 24px;
                    text-decoration: none;
                }
                h1 {
                    font-size: 22px;
                    font-weight: 700;
                    color: #111827;
                    margin-top: 0;
                    margin-bottom: 16px;
                }
                p {
                    font-size: 16px;
                    color: #4b5563;
                    margin-bottom: 24px;
                    line-height: 1.6;
                }
                .btn {
                    display: inline-block;
                    background-color: #2563eb;
                    color: #ffffff !important;
                    font-weight: 600;
                    text-decoration: none;
                    padding: 12px 32px;
                    border-radius: 8px;
                    font-size: 16px;
                    margin-bottom: 24px;
                    transition: background-color 0.2s;
                }
                .btn:hover {
                    background-color: #1d4ed8;
                }
                .link-text {
                    font-size: 13px;
                    color: #9ca3af;
                    word-break: break-all;
                    margin-top: 16px;
                }
                .link-text a {
                    color: #2563eb;
                    text-decoration: none;
                }
                .footer {
                    margin-top: 24px;
                    font-size: 12px;
                    color: #9ca3af;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="card">
                    <div class="logo">{$storeName}</div>
                    <h1>Potwierdź swój zapis do Newslettera</h1>
                    <p>Dziękujemy za chęć dołączenia do naszego newslettera! Aby aktywować subskrypcję i otrzymywać informacje o promocjach oraz nowościach, kliknij poniższy przycisk potwierdzający adres e-mail.</p>
                    <a href="{$activationUrl}" class="btn">Potwierdzam zapis</a>
                    <div class="link-text">
                        Jeśli przycisk nie działa, skopiuj i wklej ten link do przeglądarki:<br>
                        <a href="{$activationUrl}">{$activationUrl}</a>
                    </div>
                </div>
                <div class="footer">
                    Ta wiadomość została wysłana, ponieważ podano ten adres e-mail w formularzu zapisu. Jeśli to pomyłka, zignoruj tę wiadomość – nie zostaniesz zapisany bez kliknięcia linku.
                </div>
            </div>
        </body>
        </html>
        HTML;

        return new Content(
            htmlString: $html,
        );
    }
}
