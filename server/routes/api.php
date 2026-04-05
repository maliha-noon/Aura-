<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// Auth Routes (Throttled to 5 attempts per minute)
Route::middleware('throttle:auth')->group(function () {
    Route::post('/register', [AuthController::class , 'register']);
    Route::post('/login', [AuthController::class , 'login']);
    Route::post('/social-login', [AuthController::class , 'socialLogin']);
    Route::post('/forgot-password', [AuthController::class , 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class , 'resetPassword']);
});
Route::middleware('auth:api')->post('/logout', [AuthController::class , 'logout']);

// Admin Dashboard Routes
Route::middleware(['auth:api', 'check.admin'])->prefix('admin')->group(function () {
    Route::get('/stats', [\App\Http\Controllers\AdminController::class , 'getStats']);
    Route::get('/users', [\App\Http\Controllers\AdminController::class , 'getUsers']);
    Route::post('/users/{user}/toggle', [\App\Http\Controllers\AdminController::class , 'toggleUserStatus']);
    Route::delete('/users/{user}', [\App\Http\Controllers\AdminController::class , 'deleteUser']);
    Route::get('/bookings', [\App\Http\Controllers\BookingController::class , 'getAllBookings']);
    Route::get('/subscriptions', [\App\Http\Controllers\AdminController::class , 'getSubscriptions']);
    Route::post('/subscriptions/{id}/verify', [\App\Http\Controllers\AdminController::class , 'verifySubscription']);
});

// Subscriber Event Management
Route::middleware(['auth:api', 'check.subscriber'])->group(function () {
    Route::post('/events', [\App\Http\Controllers\EventController::class , 'store']);
    Route::put('/events/{event}', [\App\Http\Controllers\EventController::class , 'update']);
    Route::delete('/events/{event}', [\App\Http\Controllers\EventController::class , 'destroy']);
});

// Public Event Routes
Route::get('/events', [\App\Http\Controllers\EventController::class , 'index']);
Route::get('/events/{event}', [\App\Http\Controllers\EventController::class , 'show']);

// Public Subscription Stats Route
Route::get('/subscribers/recent', [\App\Http\Controllers\SubscriptionController::class , 'getRecentSubscribers']);

// User Booking Routes
Route::middleware('auth:api')->group(function () {
    Route::post('/subscribe', [\App\Http\Controllers\SubscriptionController::class , 'subscribe']);
    Route::post('/bookings', [\App\Http\Controllers\BookingController::class , 'store']);
    Route::get('/my-bookings', [\App\Http\Controllers\BookingController::class , 'index']);
});
