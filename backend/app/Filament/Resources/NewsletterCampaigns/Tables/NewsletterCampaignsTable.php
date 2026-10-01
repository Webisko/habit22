<?php

namespace App\Filament\Resources\NewsletterCampaigns\Tables;

use App\Mail\NewsletterMail;
use App\Jobs\SendNewsletterCampaignJob;
use App\Models\NewsletterCampaign;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Notifications\Notification;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;

class NewsletterCampaignsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('subject')
                    ->label('Temat kampanii')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'draft' => 'gray',
                        'sending' => 'info',
                        'sent' => 'success',
                        'failed' => 'danger',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'draft' => 'Szkic',
                        'sending' => 'Wysyłanie',
                        'sent' => 'Wysłane',
                        'failed' => 'Błąd wysyłki',
                        default => $state,
                    })
                    ->sortable(),
                TextColumn::make('sent_to_count')
                    ->label('Wysłano do')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('sent_at')
                    ->label('Data wysyłki')
                    ->dateTime('Y-m-d H:i')
                    ->sortable(),
                TextColumn::make('created_at')
                    ->label('Utworzono')
                    ->dateTime('Y-m-d H:i')
                    ->sortable(),
            ])
            ->recordActions([
                EditAction::make()->iconButton()->tooltip('Edytuj')->color('violet')
                    ->slideOver()
                    ->modalWidth('5xl')
                    ->extraModalFooterActions([
                        \Filament\Actions\Action::make('send_test')
                            ->label('Wyślij test')
                            ->icon('heroicon-o-envelope')
                            ->form([
                                \Filament\Forms\Components\TextInput::make('email')
                                    ->label('Adres e-mail do testu')
                                    ->email()
                                    ->required()
                                    ->default(fn (): string => auth()->user()->email ?? ''),
                            ])
                            ->action(function (NewsletterCampaign $record, array $data): void {
                                try {
                                    $unsubscribeUrl = URL::signedRoute('newsletter.unsubscribe', ['email' => $data['email']]);
                                    $bodyHtml = $record->body_html;

                                    if (str_contains($bodyHtml, '{{unsubscribe_url}}')) {
                                        $bodyHtml = str_replace('{{unsubscribe_url}}', $unsubscribeUrl, $bodyHtml);
                                    } elseif (str_contains($bodyHtml, '{{UNSUBSCRIBE_URL}}')) {
                                        $bodyHtml = str_replace('{{UNSUBSCRIBE_URL}}', $unsubscribeUrl, $bodyHtml);
                                    } else {
                                        $bodyHtml .= '<hr><p style="font-size:12px;color:#666;text-align:center;">Jeżeli nie chcesz otrzymywać tych wiadomości, <a href="' . $unsubscribeUrl . '">wypisz się z newslettera</a>.</p>';
                                    }

                                    Mail::to($data['email'])->send(new NewsletterMail(
                                        $record->subject,
                                        $bodyHtml
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

                        \Filament\Actions\Action::make('send_to_subscribers')
                            ->label('Wyślij do subskrybentów')
                            ->icon('heroicon-o-paper-airplane')
                            ->color('success')
                            ->requiresConfirmation()
                            ->action(function (NewsletterCampaign $record): void {
                                SendNewsletterCampaignJob::dispatch($record);

                                Notification::make()
                                    ->title('Uruchomiono masową wysyłkę newslettera')
                                    ->body('Zadanie zostało zakolejkowane.')
                                    ->success()
                                    ->send();
                            })
                            ->visible(fn (NewsletterCampaign $record): bool => in_array($record->status, ['draft', 'failed'])),
                    ]),
            ])
            ->actions([
                EditAction::make()->iconButton()->tooltip('Edytuj')->color('violet')
                    ->slideOver()
                    ->modalWidth('5xl')
                    ->extraModalFooterActions([
                        \Filament\Actions\Action::make('send_test')
                            ->label('Wyślij test')
                            ->icon('heroicon-o-envelope')
                            ->form([
                                \Filament\Forms\Components\TextInput::make('email')
                                    ->label('Adres e-mail do testu')
                                    ->email()
                                    ->required()
                                    ->default(fn (): string => auth()->user()->email ?? ''),
                            ])
                            ->action(function (NewsletterCampaign $record, array $data): void {
                                try {
                                    $unsubscribeUrl = URL::signedRoute('newsletter.unsubscribe', ['email' => $data['email']]);
                                    $bodyHtml = $record->body_html;

                                    if (str_contains($bodyHtml, '{{unsubscribe_url}}')) {
                                        $bodyHtml = str_replace('{{unsubscribe_url}}', $unsubscribeUrl, $bodyHtml);
                                    } elseif (str_contains($bodyHtml, '{{UNSUBSCRIBE_URL}}')) {
                                        $bodyHtml = str_replace('{{UNSUBSCRIBE_URL}}', $unsubscribeUrl, $bodyHtml);
                                    } else {
                                        $bodyHtml .= '<hr><p style="font-size:12px;color:#666;text-align:center;">Jeżeli nie chcesz otrzymywać tych wiadomości, <a href="' . $unsubscribeUrl . '">wypisz się z newslettera</a>.</p>';
                                    }

                                    Mail::to($data['email'])->send(new NewsletterMail(
                                        $record->subject,
                                        $bodyHtml
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

                        \Filament\Actions\Action::make('send_to_subscribers')
                            ->label('Wyślij do subskrybentów')
                            ->icon('heroicon-o-paper-airplane')
                            ->color('success')
                            ->requiresConfirmation()
                            ->action(function (NewsletterCampaign $record): void {
                                SendNewsletterCampaignJob::dispatch($record);

                                Notification::make()
                                    ->title('Uruchomiono masową wysyłkę newslettera')
                                    ->body('Zadanie zostało zakolejkowane.')
                                    ->success()
                                    ->send();
                            })
                            ->visible(fn (NewsletterCampaign $record): bool => in_array($record->status, ['draft', 'failed'])),
                    ]),
                DeleteAction::make()->iconButton()->tooltip('Usuń'),
            ]);
    }
}
