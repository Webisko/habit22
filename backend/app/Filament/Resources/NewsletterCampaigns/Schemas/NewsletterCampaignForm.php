<?php

namespace App\Filament\Resources\NewsletterCampaigns\Schemas;

use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class NewsletterCampaignForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Szczegóły kampanii')->columnSpanFull()
                ->schema([
                    TextInput::make('subject')
                        ->label('Temat kampanii')
                        ->required()
                        ->maxLength(255)
                        ->columnSpanFull(),
                    RichEditor::make('body_html')
                        ->label('Treść newslettera (HTML)')
                        ->required()
                        ->columnSpanFull(),
                ]),
        ]);
    }
}
