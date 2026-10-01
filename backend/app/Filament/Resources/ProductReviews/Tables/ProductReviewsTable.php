<?php

namespace App\Filament\Resources\ProductReviews\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class ProductReviewsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->recordAction('view')
            ->columns([
                TextColumn::make('product.name')
                    ->label('Produkt')
                    ->weight('bold')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('customer_name')
                    ->label('Klient')
                    ->weight('bold')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('customer_email')
                    ->label('E-mail')
                    ->icon('heroicon-o-envelope')
                    ->iconColor('gray')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('rating')
                    ->label('Ocena')
                    ->badge()
                    ->formatStateUsing(fn ($state) => str_repeat('★', $state) . str_repeat('☆', 5 - $state))
                    ->color('warning')
                    ->sortable(),
                IconColumn::make('is_verified_purchase')
                    ->label('Kupiono')
                    ->boolean()
                    ->trueIcon('heroicon-o-shield-check')
                    ->trueColor('success')
                    ->falseIcon('heroicon-o-x-circle')
                    ->falseColor('gray')
                    ->sortable(),
                IconColumn::make('is_approved')
                    ->label('Zatwierdzona')
                    ->boolean()
                    ->trueIcon('heroicon-o-check-circle')
                    ->trueColor('success')
                    ->falseIcon('heroicon-o-clock')
                    ->falseColor('warning')
                    ->sortable(),
                TextColumn::make('created_at')
                    ->label('Data dodania')
                    ->dateTime('Y-m-d H:i')
                    ->sortable(),
            ])
            ->filters([
                TernaryFilter::make('is_approved')
                    ->label('Zatwierdzone'),
                TernaryFilter::make('is_verified_purchase')
                    ->label('Zweryfikowany zakup'),
                SelectFilter::make('rating')
                    ->label('Ocena')
                    ->options([
                        1 => '1 Gwiazdka',
                        2 => '2 Gwiazdki',
                        3 => '3 Gwiazdki',
                        4 => '4 Gwiazdki',
                        5 => '5 Gwiazdek',
                    ]),
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
