<?php

namespace App\Filament\Resources\ContentPages\Schemas;

use App\Models\ContentPage;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class ContentPageForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Strona')->columnSpanFull()
                ->columns(2)
                ->schema([
                    TextInput::make('slug')
                        ->label('Slug')
                        ->required()
                        ->maxLength(255)
                        ->unique(ignoreRecord: true),
                    Select::make('template')
                        ->label('Szablon')
                        ->options(ContentPage::templateOptions())
                        ->default('default')
                        ->required()
                        ->native(false),
                    DateTimePicker::make('published_at')
                        ->label('Publikacja od'),
                    Toggle::make('is_active')
                        ->label('Aktywna')
                        ->default(true),
                    TextInput::make('sort_order')
                        ->label('Kolejność')
                        ->numeric()
                        ->default(0)
                        ->required(),
                    Tabs::make('Language')
                        ->tabs([
                            Tabs\Tab::make('Polski')
                                ->schema([
                                    TextInput::make('title.pl')
                                        ->label('Tytul')
                                        ->required()
                                        ->maxLength(255)
                                        ->live(onBlur: true)
                                        ->afterStateUpdated(function (Get $get, Set $set, ?string $old, ?string $state): void {
                                            if (($get('slug') ?? '') !== Str::slug((string) $old)) {
                                                return;
                                            }
                                            $set('slug', Str::slug((string) $state));
                                        }),
                                    Textarea::make('excerpt.pl')
                                        ->label('Lead')
                                        ->rows(3),
                                    Textarea::make('content.pl')
                                        ->label('Tresc')
                                        ->rows(14),
                                ]),
                            Tabs\Tab::make('English')
                                ->schema([
                                    TextInput::make('title.en')
                                        ->label('Title (EN)')
                                        ->maxLength(255),
                                    Textarea::make('excerpt.en')
                                        ->label('Excerpt (EN)')
                                        ->rows(3),
                                    Textarea::make('content.en')
                                        ->label('Content (EN)')
                                        ->rows(14),
                                ]),
                        ])
                        ->columnSpanFull(),
                ]),
            Section::make('Media')->columnSpanFull()
                ->schema([
                    FileUpload::make('hero_image_path')
                        ->label('Hero / obraz strony')
                        ->disk('public')
                        ->directory('content-pages')
                        ->visibility('public')
                        ->image()
                        ->imageEditor()
                        ->columnSpanFull(),
                    TextInput::make('metadata.hero_image_alt')
                        ->label('Tekst alternatywny obrazu (alt)')
                        ->placeholder('np. Baner przedstawiający naszą misję i zespół')
                        ->maxLength(255)
                        ->columnSpanFull(),
                ]),
            Section::make('SEO i metadata')->columnSpanFull()
                ->schema([
                    TextInput::make('seo_title')
                        ->label('Tytul SEO')
                        ->maxLength(255),
                    Textarea::make('seo_description')
                        ->label('Opis SEO')
                        ->rows(3),
                    Toggle::make('is_noindex')
                        ->label('Zablokuj indeksowanie tej strony (noindex)')
                        ->default(false),
                    TextInput::make('metadata.og_title')
                        ->label('Tytuł Open Graph (og:title)')
                        ->placeholder('Pozostaw puste, aby użyć Tytułu SEO')
                        ->maxLength(255),
                    Textarea::make('metadata.og_description')
                        ->label('Opis Open Graph (og:description)')
                        ->placeholder('Pozostaw puste, aby użyć Opisu SEO')
                        ->rows(3),
                    FileUpload::make('metadata.og_image_path')
                        ->label('Obraz Open Graph (og:image)')
                        ->disk('public')
                        ->directory('seo/og')
                        ->visibility('public')
                        ->image()
                        ->imageEditor(),
                    KeyValue::make('metadata')
                        ->label('Metadane')
                        ->keyLabel('Klucz')
                        ->valueLabel('Wartosc'),
                ]),
        ]);
    }
}