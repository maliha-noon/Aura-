<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Event;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

try {
    DB::beginTransaction();
    echo "Testing User creation...\n";
    User::create([
        'name' => 'Test User',
        'email' => 'test_' . time() . '@example.com',
        'password' => Hash::make('password'),
        'is_active' => true,
    ]);
    echo "User creation OK.\n";

    echo "Testing Event creation...\n";
    Event::create([
        'title' => 'Test Event',
        'description' => 'Test',
        'date' => Carbon::now(),
        'location' => 'Test',
        'image' => 'https://example.com/image.jpg',
        'price' => 100.00,
        'capacity' => 100,
        'category' => 'Test',
        'chief_guest' => 'Test',
        'tickets_sold' => 0,
    ]);
    echo "Event creation OK.\n";
    
    DB::rollBack();
    echo "All tests passed!\n";
} catch (Exception $e) {
    DB::rollBack();
    echo "ERROR: " . $e->getMessage() . "\n";
    if (method_exists($e, 'getSql')) echo "SQL: " . $e->getSql() . "\n";
}
?>
