<?php

namespace App\Filament\Resources\NewsletterSubscribers\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class NewsletterSubscribersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('email')->label('E-mail')->searchable()->sortable(),
                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'warning',
                        'active' => 'success',
                        'unsubscribed' => 'danger',
                        default => 'gray',
                    })
                    ->sortable(),
                TextColumn::make('source')->label('Źródło')->toggleable(),
                TextColumn::make('consented_at')->label('Zgoda od')->dateTime('Y-m-d H:i')->sortable(),
                TextColumn::make('double_opt_in_ip')->label('IP zapisu')->toggleable(),
                TextColumn::make('unsubscribed_at')->label('Wypisany od')->dateTime('Y-m-d H:i')->toggleable(),
                IconColumn::make('is_active')->label('Aktywny')->boolean(),
            ])
            ->filters([
                TernaryFilter::make('is_active')->label('Aktywny'),
                SelectFilter::make('status')
                    ->label('Status')
                    ->options([
                        'pending' => 'Oczekujący',
                        'active' => 'Aktywny',
                        'unsubscribed' => 'Wypisany',
                    ]),
            ])
            ->recordActions([
                ViewAction::make()->iconButton()->tooltip('Podgląd')->extraAttributes(['style' => 'display: none !important;'])
                    ->slideOver()
                    ->extraModalFooterActions([
                        EditAction::make()
                            ->button()
                            ->label('Edytuj')
                            ->slideOver()
                            ->cancelParentActions(),
                    ]),
                EditAction::make()->iconButton()->tooltip('Edytuj')->color('violet')->slideOver(),
                DeleteAction::make()->iconButton()->tooltip('Usuń'),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}