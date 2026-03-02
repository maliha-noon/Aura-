<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Event;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // Add Admin User
        User::create([
            'name' => 'Admin Rifat',
            'email' => 'rahator44@gmail.com',
            'phone' => '01712345678',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        User::create([
            'name' => 'Eventica Admin',
            'email' => 'eventica@gmail.com',
            'phone' => '01712345679',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        // Add Events
        Event::create([
            'title' => 'Aura Tech Fest',
            'description' => 'The biggest tech gathering in Bangladesh. Experience innovation, networking, and the future of technology.',
            'date' => Carbon::now()->addDays(15)->setHour(10)->setMinute(0),
            'location' => 'Radisson Blu Dhaka',
            'image' => 'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
            'price' => 300.00,
            'capacity' => 500,
            'category' => 'Tech',
            'is_featured' => true,
        ]);

        Event::create([
            'title' => 'Midnight Symphony',
            'description' => 'An enchanting night of classical music and modern fusion. A soulful experience under the stars.',
            'date' => Carbon::now()->addDays(20)->setHour(20)->setMinute(0),
            'location' => 'ICCB Dhaka',
            'image' => 'https://images.unsplash.com/photo-1514525253361-bee0483307a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
            'price' => 500.00,
            'capacity' => 1000,
            'category' => 'Music',
            'is_featured' => true,
        ]);

        Event::create([
            'title' => 'Digital Art Expo',
            'description' => 'Explore the intersection of art and technology. Featuring local and international digital artists.',
            'date' => Carbon::now()->addDays(25)->setHour(11)->setMinute(0),
            'location' => 'Shilpakala Academy',
            'image' => 'https://images.unsplash.com/photo-1554188248-986adbb73be4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
            'price' => 200.00,
            'capacity' => 300,
            'category' => 'Art',
            'is_featured' => false,
        ]);

        Event::create([
            'title' => 'Summer Beats Festival',
            'description' => 'The ultimate summer concert featuring top DJs and performers. Energetic, loud, and unforgettable.',
            'date' => Carbon::now()->addDays(30)->setHour(18)->setMinute(0),
            'location' => 'Army Stadium',
            'image' => 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
            'price' => 1000.00,
            'capacity' => 5000,
            'category' => 'Concert',
            'is_featured' => true,
        ]);
    }
}
