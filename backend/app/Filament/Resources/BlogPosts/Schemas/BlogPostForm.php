<?php

namespace App\Filament\Resources\BlogPosts\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class BlogPostForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Wpis')->columnSpanFull()
                ->columns(2)
                ->schema([
                    TextInput::make('slug')
                        ->label('Slug')
                        ->required()
                        ->maxLength(255)
                        ->unique(ignoreRecord: true),
                    TextInput::make('author_name')
                        ->label('Autor')
                        ->maxLength(255),
                    DateTimePicker::make('published_at')
                        ->label('Publikacja od'),
                    Toggle::make('is_active')
                        ->label('Aktywny')
                        ->default(true),
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
                                    RichEditor::make('content.pl')
                                        ->label('Treść')
                                        ->fileAttachmentsDisk('public')
                                        ->fileAttachmentsDirectory('blog-attachments')
                                        ->columnSpanFull(),
                                ]),
                            Tabs\Tab::make('English')
                                ->schema([
                                    TextInput::make('title.en')
                                        ->label('Title (EN)')
                                        ->maxLength(255),
                                    Textarea::make('excerpt.en')
                                        ->label('Excerpt (EN)')
                                        ->rows(3),
                                    RichEditor::make('content.en')
                                        ->label('Content (EN)')
                                        ->fileAttachmentsDisk('public')
                                        ->fileAttachmentsDirectory('blog-attachments')
                                        ->columnSpanFull(),
                                ]),
                        ])
                        ->columnSpanFull(),
                ]),
            Section::make('Media')->columnSpanFull()
                ->schema([
                    FileUpload::make('cover_image_url')
                        ->label('Cover wpisu')
                        ->disk('public')
                        ->directory('blog-posts')
                        ->visibility('public')
                        ->image()
                        ->imageEditor()
                        ->columnSpanFull(),
                    TextInput::make('metadata.cover_image_alt')
                        ->label('Tekst alternatywny okładki (alt)')
                        ->placeholder('np. Zespół programistów pracujący nad projektem e-commerce')
                        ->maxLength(255)
                        ->columnSpanFull(),
                ]),

            Section::make('Szczegóły autora (E-E-A-T)')->columnSpanFull()
                ->columns(2)
                ->schema([
                    Textarea::make('metadata.author_bio')
                        ->label('Biogram autora')
                        ->rows(3)
                        ->columnSpanFull(),
                    FileUpload::make('metadata.author_avatar_path')
                        ->label('Zdjęcie autora / avatar')
                        ->disk('public')
                        ->directory('blog-posts/authors')
                        ->visibility('public')
                        ->image()
                        ->imageEditor(),
                    TextInput::make('metadata.author_linkedin')
                        ->label('Profil LinkedIn')
                        ->placeholder('https://www.linkedin.com/in/username')
                        ->maxLength(255),
                ]),
            Section::make('Bibliografia i źródła (Citations)')->columnSpanFull()
                ->schema([
                    Repeater::make('metadata.sources')
                        ->label('źródła zewnętrzne')
                        ->columns(2)
                        ->schema([
                            TextInput::make('title')
                                ->label('Nazwa źródła (np. Badanie kliniczne PubMed)')
                                ->required()
                                ->maxLength(255),
                            TextInput::make('url')
                                ->label('URL źródła')
                                ->required()
                                ->maxLength(1024),
                        ])
                        ->defaultItems(0)
                        ->columnSpanFull(),
                ]),
            Section::make('Zgodność z AI Act')->columnSpanFull()
                ->description('Oznaczanie treści wygenerowanych przy użyciu sztucznej inteligencji')
                ->schema([
                    Toggle::make('is_ai_generated')
                        ->label('Treść wygenerowana przez AI')
                        ->reactive()
                        ->default(false),
                    Textarea::make('ai_disclosure_text')
                        ->label('Nota o udostępnieniu AI')
                        ->placeholder('np. Ten wpis został automatycznie wygenerowany przez sztuczną inteligencję.')
                        ->visible(fn (Get $get) => (bool) $get('is_ai_generated'))
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
                        ->label('Zablokuj indeksowanie tego wpisu (noindex)')
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