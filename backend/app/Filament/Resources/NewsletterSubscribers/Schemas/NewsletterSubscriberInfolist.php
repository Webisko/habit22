<?php

namespace App\Filament\Resources\NewsletterSubscribers\Schemas;

use Filament\Infolists\Components\KeyValueEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class NewsletterSubscriberInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Subskrybent')->columnSpanFull()
                ->columns(3)
                ->schema([
                    TextEntry::make('email')->label('E-mail'),
                    TextEntry::make('first_name')->label('Imie')->formatStateUsing(fn ($state): string => filled($state) ? (string) $state : '-'),
                    TextEntry::make('last_name')->label('Nazwisko')->formatStateUsing(fn ($state): string => filled($state) ? (string) $state : '-'),
                    TextEntry::make('source')->label('Zrodlo')->formatStateUsing(fn ($state): string => filled($state) ? (string) $state : '-'),
                    TextEntry::make('consented_at')->label('Zgoda od')->dateTime('Y-m-d H:i')->formatStateUsing(fn ($state): string => filled($state) ? (string) $state : '-'),
                    TextEntry::make('unsubscribed_at')->label('Wypisany od')->dateTime('Y-m-d H:i')->formatStateUsing(fn ($state): string => filled($state) ? (string) $state : '-'),
                    TextEntry::make('is_active')->label('Aktywny')->formatStateUsing(fn (bool $state): string => $state ? 'Tak' : 'Nie'),
                    KeyValueEntry::make('metadata')->label('Metadata')->columnSpanFull(),
                ]),
        ]);
    }
}