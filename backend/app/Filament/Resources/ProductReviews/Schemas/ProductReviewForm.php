<?php

namespace App\Filament\Resources\ProductReviews\Schemas;

use App\Models\Product;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ProductReviewForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Opinia')->columnSpanFull()
                ->columns(2)
                ->schema([
                    Select::make('product_id')
                        ->label('Produkt')
                        ->relationship('product', 'name')
                        ->searchable()
                        ->preload()
                        ->nullable(),
                    Select::make('rating')
                        ->label('Ocena')
                        ->options([
                            1 => '1 Gwiazdka',
                            2 => '2 Gwiazdki',
                            3 => '3 Gwiazdki',
                            4 => '4 Gwiazdki',
                            5 => '5 Gwiazdek',
                        ])
                        ->required()
                        ->native(false),
                    TextInput::make('customer_name')
                        ->label('Nazwa klienta')
                        ->required()
                        ->maxLength(255),
                    TextInput::make('customer_email')
                        ->label('E-mail klienta')
                        ->email()
                        ->required()
                        ->maxLength(255),
                    Textarea::make('comment')
                        ->label('Komentarz / Recenzja')
                        ->rows(4)
                        ->columnSpanFull()
                        ->maxLength(1000),
                    Toggle::make('is_verified_purchase')
                        ->label('Zakup zweryfikowany')
                        ->default(false),
                    Toggle::make('is_approved')
                        ->label('Zatwierdzona (widoczna w sklepie)')
                        ->default(false),
                ]),
        ]);
    }
}
