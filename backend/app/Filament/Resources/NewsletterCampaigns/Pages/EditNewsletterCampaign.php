<?php

namespace App\Filament\Resources\NewsletterCampaigns\Pages;

use App\Filament\Resources\NewsletterCampaigns\NewsletterCampaignResource;
use App\Mail\NewsletterMail;
use App\Jobs\SendNewsletterCampaignJob;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Illuminate\Support\Facades\Mail;

class EditNewsletterCampaign extends EditRecord
{
    protected static string $resource = NewsletterCampaignResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('send_test')
                ->label('Wyślij test')
                ->icon('heroicon-o-envelope')
                ->form([
                    TextInput::make('email')
                        ->label('Adres e-mail do testu')
                        ->email()
                        ->required()
                        ->default(fn (): string => auth()->user()->email ?? ''),
                ])
                ->action(function (array $data): void {
                    try {
                        $unsubscribeUrl = \Illuminate\Support\Facades\URL::signedRoute('newsletter.unsubscribe', ['email' => $data['email']]);
                        $bodyHtml = $this->record->body_html;

                        if (str_contains($bodyHtml, '{{unsubscribe_url}}')) {
                            $bodyHtml = str_replace('{{unsubscribe_url}}', $unsubscribeUrl, $bodyHtml);
                        } elseif (str_contains($bodyHtml, '{{UNSUBSCRIBE_URL}}')) {
                            $bodyHtml = str_replace('{{UNSUBSCRIBE_URL}}', $unsubscribeUrl, $bodyHtml);
                        } else {
                            $bodyHtml .= '<hr><p style="font-size:12px;color:#666;text-align:center;">Jeżeli nie chcesz otrzymywać tych wiadomości, <a href="' . $unsubscribeUrl . '">wypisz się z newslettera</a>.</p>';
                        }

                        Mail::to($data['email'])->send(new NewsletterMail(
                            $this->record->subject,
                            $bodyHtml,
                            $unsubscribeUrl
                        ));

                        Notification::make()
                            ->title('Wysłano e-mail testowy')
                            ->success()
                            ->send();
                    } catch (\Throwable $e) {
                        Notification::make()
                            ->title('Błąd podczas wysyłania testu')
                            ->body($e->getMessage())
                            ->danger()
                            ->send();
                    }
                }),

            Action::make('send_to_subscribers')
                ->label('Wyślij do subskrybentów')
                ->icon('heroicon-o-paper-airplane')
                ->color('success')
                ->requiresConfirmation()
                ->action(function (): void {
                    SendNewsletterCampaignJob::dispatch($this->record);

                    Notification::make()
                        ->title('Uruchomiono masową wysyłkę newslettera')
                        ->body('Zadanie zostało zakolejkowane.')
                        ->success()
                        ->send();
                })
                ->visible(fn (): bool => in_array($this->record->status, ['draft', 'failed'])),

            DeleteAction::make(),
        ];
    }
}
