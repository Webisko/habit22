<?php

namespace App\Filament\Resources\NewsletterSubscribers\Pages;

use App\Filament\Resources\NewsletterSubscribers\NewsletterSubscriberResource;
use Filament\Actions\Action;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListNewsletterSubscribers extends ListRecords
{
    protected static string $resource = NewsletterSubscriberResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('exportNewsletterSubscribers')
                ->label('Eksport CSV')
                ->icon('heroicon-o-arrow-down-tray')
                ->color('info')
                ->url(route('admin.exports.newsletter-subscribers'), shouldOpenInNewTab: true),
            CreateAction::make()->icon('heroicon-o-plus')->slideOver(),
        ];
    }
}