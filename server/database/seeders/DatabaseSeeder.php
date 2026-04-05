<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Event;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $admin = User::create([
            'name' => 'Admin Rifat',
            'email' => 'rahator44@gmail.com',
            'phone' => '01712345678',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_active' => true,
            'is_subscribed' => true,
        ]);

        User::create([
            'name' => 'Maliha Parvin',
            'email' => 'parvinmaliha26@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_active' => true,
            'is_subscribed' => true,
        ]);

        User::create([
            'name' => 'Eventica Admin',
            'email' => 'eventica@gmail.com',
            'phone' => '01712345679',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_active' => true,
            'is_subscribed' => true,
        ]);

        // Mock Subscribers
        User::create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '01711111111',
            'password' => Hash::make('password'),
            'role' => 'user',
            'is_active' => true,
            'is_subscribed' => true,
        ]);

        // Expand Events for 3D Showcase (High Quality Stable Images)
        $events = [
            [
                'title' => 'Stellar Night Concert',
                'description' => 'A magical musical journey under the stars.',
                'date' => Carbon::now()->addDays(10),
                'location' => 'ICCB Hall 4',
                'city_country' => 'Dhaka, Bangladesh',
                'image' => 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
                'price' => 2500,
                'capacity' => 5000,
                'category' => 'Music',
                'is_featured' => true,
                'chief_guest' => 'Tahir Raj Bhasin',
                'tickets_sold' => 4200,
            ],
            [
                'title' => 'Tech Summit 2026',
                'description' => 'The biggest tech gathering of the year.',
                'date' => Carbon::now()->addDays(15),
                'location' => 'Radisson Blu',
                'city_country' => 'Dhaka, Bangladesh',
                'image' => 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
                'price' => 1200,
                'capacity' => 800,
                'category' => 'Tech',
                'is_featured' => true,
                'chief_guest' => 'Elon Musk (Virtual)',
                'tickets_sold' => 750,
            ],
            [
                'title' => 'Art & Soul Expo',
                'description' => 'A tribute to contemporary art and culture.',
                'date' => Carbon::now()->addDays(20),
                'location' => 'Shilpakala Academy',
                'city_country' => 'Dhaka, Bangladesh',
                'image' => 'https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
                'price' => 500,
                'capacity' => 1200,
                'category' => 'Art',
                'is_featured' => true,
                'chief_guest' => 'Zainul Abedin Jr.',
                'tickets_sold' => 900,
            ],
            [
                'title' => 'Comedy Bash: Live!',
                'description' => 'Non-stop laughter with the best Stand-up comedians.',
                'date' => Carbon::now()->addDays(5),
                'location' => 'TCB Auditorium',
                'city_country' => 'Dhaka, Bangladesh',
                'image' => 'https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
                'price' => 1000,
                'capacity' => 600,
                'category' => 'Comedy',
                'is_featured' => true,
                'chief_guest' => 'Humayun Faridi Tribute',
                'tickets_sold' => 580,
            ],
            [
                'title' => 'Aura++ Launch Gala',
                'description' => 'Celebrating the future of events with Aura++ Premium.',
                'date' => Carbon::now()->addDays(1),
                'location' => 'Westin Dhaka',
                'city_country' => 'Dhaka, Bangladesh',
                'image' => 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
                'price' => 0,
                'capacity' => 300,
                'category' => 'Launch',
                'is_featured' => true,
                'chief_guest' => 'Founder Team',
                'tickets_sold' => 295,
            ]
        ];

        foreach ($events as $eventData) {
            $eventData['user_id'] = $admin->id;
            Event::create($eventData);
        }
    }
}
