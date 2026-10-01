<?php

namespace App\Filament\Resources\ProductCategories\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class ProductCategoriesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->recordAction('view')
            ->columns([
                TextColumn::make('name')
                    ->label('Nazwa')
                    ->weight('bold')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('slug')
                    ->label('Slug')
                    ->color('gray')
                    ->searchable(),
                TextColumn::make('sort_order')
                    ->label('Kolejność')
                    ->sortable(),
                IconColumn::make('is_active')
                    ->label('Aktywna')
                    ->boolean(),
                TextColumn::make('products_count')
                    ->label('Produkty')
                    ->counts('products')
                    ->badge()
                    ->color('info')
                    ->sortable()
                    ->toggleable(),
                TextColumn::make('attributes.name')
                    ->label('Atrybuty')
                    ->listWithLineBreaks()
                    ->badge()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                TernaryFilter::make('is_active')
                    ->label('Aktywna'),
            ])
            ->recordActions([
                ViewAction::make()->iconButton()->tooltip('Podgląd')->extraAttributes(['style' => 'display: none !important;'])
                    ->slideOver()
                    ->modalWidth('7xl')
                    ->extraModalFooterActions([
                        EditAction::make()
                            ->button()
                            ->label('Edytuj')
                            ->slideOver()
                            ->modalWidth('7xl')
                            ->cancelParentActions(),
                    ]),
                EditAction::make()->iconButton()->tooltip('Edytuj')->color('violet')
                    ->slideOver()
                    ->modalWidth('7xl'),
                DeleteAction::make()->iconButton()->tooltip('Usuń'),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}