<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


// Route::get('/', function () {
//     return ['Laravel' => app()->version()];
// });

Route::get('/{any?}', function () {
    $path = public_path('index.html');
    if (file_exists($path)) {
        return file_get_contents($path);
    }
    return response()->json([
        'status' => 'Laravel API is running',
        'message' => 'React build (index.html) not found in public directory.'
    ]);
})->where('any', '^(?!api).*$');
