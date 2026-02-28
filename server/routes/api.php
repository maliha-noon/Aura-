<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\AuthController;

/* |-------------------------------------------------------------------------- | API Routes |-------------------------------------------------------------------------- | | Here is where you can register API routes for your application. These | routes are loaded by the RouteServiceProvider within a group which | is assigned the "api" middleware group. Enjoy building your API! | */

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
            return $request->user();
        }
        );
        Route::post('/bookings', [\App\Http\Controllers\BookingController::class , 'store']);
        Route::get('/my-bookings', [\App\Http\Controllers\BookingController::class , 'myBookings']);    });

Route::get('/session', [SessionController::class , 'getSession']);
Route::post('/session', [SessionController::class , 'createSession'])->middleware('check.admin');
Route::put('/session', [SessionController::class , 'updateSession'])->middleware('check.admin');
Route::post('/sessions', [SessionController::class , 'viewSessions'])->middleware('check.admin');
Route::post('/attendance', [SessionController::class , 'submitAttendance']);
Route::get('/events', [\App\Http\Controllers\EventController::class , 'index']);

// Auth Routes (Throttled to 5 attempts per minute)
Route::middleware('throttle:auth')->group(function () {
    Route::post('/register', [AuthController::class , 'register']);
    Route::post('/login', [AuthController::class , 'login']);
    Route::post('/social-login', [AuthController::class , 'socialLogin']);
    Route::post('/forgot-password', [AuthController::class , 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class , 'resetPassword']);
});
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class , 'logout']);

// Admin Dashboard Routes
Route::middleware(['auth:sanctum', 'check.admin'])->prefix('admin')->group(function () {
    Route::get('/stats', [\App\Http\Controllers\AdminController::class , 'getStats']);
    Route::get('/users', [\App\Http\Controllers\AdminController::class , 'getUsers']);
    Route::post('/users/{user}/toggle', [\App\Http\Controllers\AdminController::class , 'toggleUserStatus']);
    Route::delete('/users/{user}', [\App\Http\Controllers\AdminController::class , 'deleteUser']);
});
