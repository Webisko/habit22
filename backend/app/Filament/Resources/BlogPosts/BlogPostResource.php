<?php

namespace App\Filament\Resources\BlogPosts;

use App\Traits\HasDynamicNavigation;

use App\Filament\Resources\BlogPosts\Pages\CreateBlogPost;
use App\Filament\Resources\BlogPosts\Pages\EditBlogPost;
use App\Filament\Resources\BlogPosts\Pages\ListBlogPosts;
use App\Filament\Resources\BlogPosts\Pages\ViewBlogPost;
use App\Filament\Resources\BlogPosts\Schemas\BlogPostForm;
use App\Filament\Resources\BlogPosts\Schemas\BlogPostInfolist;
use App\Filament\Resources\BlogPosts\Tables\BlogPostsTable;
use App\Models\BlogPost;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class BlogPostResource extends Resource
{
    use HasDynamicNavigation;
    protected static ?string $model = BlogPost::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedNewspaper;

    protected static ?string $modelLabel = 'wpis blogowy';

    protected static ?string $pluralModelLabel = 'blog';

    protected static ?string $navigationLabel = 'Blog';

    protected static ?string $slug = 'wpisy-na-blogu';

    protected static \UnitEnum|string|null $navigationGroup = 'Treści i marketing';

    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return BlogPostForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return BlogPostInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return BlogPostsTable::configure($table);
    }

    public static function getEloquentQuery(): \Illuminate\Database\Eloquent\Builder
    {
        return parent::getEloquentQuery()
            ->withoutGlobalScopes([
                \Illuminate\Database\Eloquent\SoftDeletingScope::class,
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListBlogPosts::route('/'),
        ];
    }
}
