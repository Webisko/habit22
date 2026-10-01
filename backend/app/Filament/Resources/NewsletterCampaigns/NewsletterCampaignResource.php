<?php

namespace App\Filament\Resources\NewsletterCampaigns;

use App\Traits\HasDynamicNavigation;

use App\Filament\Resources\NewsletterCampaigns\Pages\CreateNewsletterCampaign;
use App\Filament\Resources\NewsletterCampaigns\Pages\EditNewsletterCampaign;
use App\Filament\Resources\NewsletterCampaigns\Pages\ListNewsletterCampaigns;
use App\Filament\Resources\NewsletterCampaigns\Schemas\NewsletterCampaignForm;
use App\Filament\Resources\NewsletterCampaigns\Tables\NewsletterCampaignsTable;
use App\Models\NewsletterCampaign;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class NewsletterCampaignResource extends Resource
{
    protected static ?string $slug = 'kampanie-newslettera';
    use HasDynamicNavigation;
    protected static ?string $model = NewsletterCampaign::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedPaperAirplane;

    protected static ?string $modelLabel = 'kampania newslettera';

    protected static ?string $pluralModelLabel = 'kampanie newslettera';

    protected static ?string $navigationLabel = 'Kampanie newslettera';

    protected static \UnitEnum|string|null $navigationGroup = 'Treści i marketing';

    protected static ?int $navigationSort = 4;

    public static function form(Schema $schema): Schema
    {
        return NewsletterCampaignForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return NewsletterCampaignsTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListNewsletterCampaigns::route('/'),
        ];
    }
}

