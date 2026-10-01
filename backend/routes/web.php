<?php

use App\Http\Controllers\Admin\AdminContactExportController;
use App\Http\Controllers\Admin\AdminOrderExportController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\NewsletterConfirmController;
use App\Http\Controllers\NewsletterUnsubscribeController;
use App\Http\Controllers\RobotsController;
use App\Http\Controllers\OgImageController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/sitemap.xml', SitemapController::class)->name('sitemap');
Route::get('/robots.txt', RobotsController::class)->name('robots');
Route::get('/og-image', OgImageController::class)->middleware(['signed', 'throttle:30,1'])->name('og-image');
Route::get('/newsletter/confirm/{token}', NewsletterConfirmController::class)->name('newsletter.confirm');
Route::get('/newsletter/unsubscribe/{email}', [NewsletterUnsubscribeController::class, 'unsubscribeWeb'])
    ->name('newsletter.unsubscribe');

Route::middleware('auth')->prefix('admin/exports')->group(function (): void {
    Route::get('/customers', [AdminContactExportController::class, 'customers'])->name('admin.exports.customers');
    Route::get('/newsletter-subscribers', [AdminContactExportController::class, 'newsletterSubscribers'])->name('admin.exports.newsletter-subscribers');
    Route::get('/orders', [AdminOrderExportController::class, 'export'])->name('admin.exports.orders');
});

Route::get('/login', function () {
    return redirect()->route('filament.admin.auth.login');
})->name('login');

Route::middleware('auth')->prefix('admin')->group(function (): void {
    Route::get('/orders/{number}/inpost-label', [\App\Http\Controllers\Admin\InPostLabelController::class, 'download'])->name('admin.orders.inpost-label');
    Route::get('/orders/{number}/orlen-label', [\App\Http\Controllers\Admin\OrlenPaczkaLabelController::class, 'download'])->name('admin.orders.orlen-label');
    Route::post('/sidebar/save-order', [\App\Http\Controllers\Admin\SidebarController::class, 'saveOrder'])->name('admin.sidebar.save-order');
});

