<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

use App\Http\Controllers\AuthController;
use App\Http\Controllers\SiteContentController;
use App\Http\Controllers\UploadController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::get('/site-content', [SiteContentController::class, 'index']);
Route::post('/site-content/initialize', [SiteContentController::class, 'init']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    // Protected routes
    Route::post('/site-content', [SiteContentController::class, 'update']);
    Route::post('/upload', [UploadController::class, 'upload']);
});
