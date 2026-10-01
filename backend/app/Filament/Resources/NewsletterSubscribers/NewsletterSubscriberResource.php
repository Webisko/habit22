<?php

namespace App\Filament\Resources\NewsletterSubscribers;

use App\Traits\HasDynamicNavigation;

use App\Filament\Resources\NewsletterSubscribers\Pages\CreateNewsletterSubscriber;
use App\Filament\Resources\NewsletterSubscribers\Pages\EditNewsletterSubscriber;
use App\Filament\Resources\NewsletterSubscribers\Pages\ListNewsletterSubscribers;
use App\Filament\Resources\NewsletterSubscribers\Pages\ViewNewsletterSubscriber;
use App\Filament\Resources\NewsletterSubscribers\Schemas\NewsletterSubscriberForm;
use App\Filament\Resources\NewsletterSubscribers\Schemas\NewsletterSubscriberInfolist;
use App\Filament\Resources\NewsletterSubscribers\Tables\NewsletterSubscribersTable;
use App\Models\NewsletterSubscriber;
use BackedEnum;
use Illuminate\Database\Eloquent\Builder;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class NewsletterSubscriberResource extends Resource
{
    use HasDynamicNavigation;
    protected static ?string $model = NewsletterSubscriber::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedEnvelope;

    protected static ?string $modelLabel = 'subskrybent newslettera';

    protected static ?string $pluralModelLabel = 'newsletter';

    protected static ?string $navigationLabel = 'Newsletter';

    protected static ?string $slug = 'subskrybenci-newslettera';

    protected static \UnitEnum|string|null $navigationGroup = 'Klienci i kontakt';

    protected static ?int $navigationSort = 5;

    public static function form(Schema $schema): Schema
    {
        return NewsletterSubscriberForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return NewsletterSubscriberInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return NewsletterSubscribersTable::configure($table);
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->latest('created_at');
    }

    public static function getPages(): array
    {
        return [
            'index' => ListNewsletterSubscribers::route('/'),
        ];
    }
}
