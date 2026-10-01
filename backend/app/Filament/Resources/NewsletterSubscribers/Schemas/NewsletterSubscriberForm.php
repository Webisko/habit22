<?php

namespace App\Filament\Resources\NewsletterSubscribers\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Select;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class NewsletterSubscriberForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Subskrybent')->columnSpanFull()
                ->columns(2)
                ->schema([
                    TextInput::make('email')
                        ->label('E-mail')
                        ->email()
                        ->required()
                        ->maxLength(255)
                        ->unique(ignoreRecord: true)
                        ->dehydrateStateUsing(fn (?string $state): ?string => filled($state) ? mb_strtolower(trim($state)) : null),
                    TextInput::make('source')
                        ->label('Źródło')
                        ->maxLength(120),
                    TextInput::make('first_name')
                        ->label('Imię')
                        ->maxLength(255),
                    TextInput::make('last_name')
                        ->label('Nazwisko')
                        ->maxLength(255),
                    Select::make('status')
                        ->label('Status')
                        ->options([
                            'pending' => 'Oczekujący (Pending)',
                            'active' => 'Aktywny (Active)',
                            'unsubscribed' => 'Wypisany (Unsubscribed)',
                        ])
                        ->required()
                        ->default('pending'),
                    Toggle::make('is_active')
                        ->label('Aktywny (Widoczny w bazie)')
                        ->default(false),
                    DateTimePicker::make('consented_at')
                        ->label('Zgoda udzielona od'),
                    DateTimePicker::make('unsubscribed_at')
                        ->label('Wypisany od'),
                    
                    Section::make('Logi Double Opt-In')->columnSpanFull()
                        ->columns(3)
                        ->collapsed()
                        ->schema([
                            TextInput::make('double_opt_in_token')
                                ->label('Token weryfikacyjny')
                                ->disabled()
                                ->maxLength(100),
                            TextInput::make('double_opt_in_ip')
                                ->label('IP zapisu/potwierdzenia')
                                ->disabled()
                                ->maxLength(45),
                            DateTimePicker::make('double_opt_in_confirmed_at')
                                ->label('Potwierdzono dnia')
                                ->disabled(),
                        ]),

                    KeyValue::make('metadata')
                        ->label('Metadata')
                        ->keyLabel('Klucz')
                        ->valueLabel('Wartość')
                        ->columnSpanFull(),
                ]),
        ]);
    }
}