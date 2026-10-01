<?php

namespace App\Filament\Resources\ContentPages\Tables;

use App\Models\ContentPage;
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

class ContentPagesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->columns([
                TextColumn::make('title')->label('Tytuł')->searchable()->sortable(),
                TextColumn::make('slug')->label('Slug')->searchable(),
                TextColumn::make('sort_order')->label('Kolejność')->sortable(),
                TextColumn::make('template')
                    ->label('Szablon')
                    ->formatStateUsing(fn (?string $state): string => ContentPage::templateOptions()[$state] ?? (string) $state)
                    ->toggleable(),
                IconColumn::make('is_active')->label('Aktywna')->boolean(),
                TextColumn::make('published_at')->label('Publikacja')->dateTime('Y-m-d H:i')->sortable()->toggleable(),
            ])
            ->filters([
                SelectFilter::make('template')
                    ->label('Szablon')
                    ->options(ContentPage::templateOptions()),
                TernaryFilter::make('is_active')->label('Aktywna'),
                \Filament\Tables\Filters\TrashedFilter::make(),
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
                \Filament\Actions\RestoreAction::make()->iconButton()->tooltip('Przywróć'),
                \Filament\Actions\ForceDeleteAction::make()->iconButton()->tooltip('Usuń trwale'),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                    \Filament\Actions\RestoreBulkAction::make(),
                    \Filament\Actions\ForceDeleteBulkAction::make(),
                ]),
            ]);
    }
}