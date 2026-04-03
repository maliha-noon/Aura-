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

        User::create([
            'name' => 'Sarah Ahmed',
            'email' => 'sarah@example.com',
            'phone' => '01722222222',
            'password' => Hash::make('password'),
            'role' => 'user',
            'is_active' => true,
            'is_subscribed' => true,
        ]);

        User::create([
            'name' => 'Michael Hossain',
            'email' => 'michael@example.com',
            'phone' => '01733333333',
            'password' => Hash::make('password'),
            'role' => 'user',
            'is_active' => true,
            'is_subscribed' => true,
        ]);

        // Add Events
        Event::create([
            'title' => 'Stand-Up Comedy Night',
            'description' => 'A night of non-stop laughter featuring world-renowned comedians telling their best jokes.',
            'date' => Carbon::now()->addDays(15)->setHour(20)->setMinute(0),
            'location' => 'ICCB Arena',
            'image' => 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
            'price' => 1500.00,
            'capacity' => 1000,
            'category' => 'Comic',
            'is_featured' => true,
            'chief_guest' => 'Kevin Hart',
            'tickets_sold' => 850,
        ]);

        Event::create([
            'title' => 'Laughter Riot',
            'description' => 'Get ready to laugh till your sides hurt! The most anticipated comedy tour of the year hits Dhaka.',
            'date' => Carbon::now()->addDays(20)->setHour(20)->setMinute(30),
            'location' => 'Army Stadium',
            'image' => 'https://images.unsplash.com/photo-1470229722913-7c090be5bc65?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
            'price' => 2000.00,
            'capacity' => 3000,
            'category' => 'Comic',
            'is_featured' => true,
            'chief_guest' => 'Dave Chappelle',
            'tickets_sold' => 2800,
        ]);

        Event::create([
            'title' => 'The Fluffy Show',
            'description' => 'Experience a hilarious evening with the legendary comedian known for his storytelling and voices.',
            'date' => Carbon::now()->addDays(25)->setHour(19)->setMinute(0),
            'location' => 'BCC Auditorium',
            'image' => 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
            'price' => 1200.00,
            'capacity' => 800,
            'category' => 'Comic',
            'is_featured' => true,
            'chief_guest' => 'Gabriel Iglesias',
            'tickets_sold' => 760,
        ]);

        Event::create([
            'title' => 'Bangla Comedy Bash',
            'description' => 'Local hits and hilarious relatable jokes defining the modern comedy scene in Bangladesh.',
            'date' => Carbon::now()->addDays(10)->setHour(18)->setMinute(0),
            'location' => 'Shilpakala Academy',
            'image' => 'https://images.unsplash.com/photo-1510520630501-8bf79af47cc3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
            'price' => 500.00,
            'capacity' => 500,
            'category' => 'Comic',
            'is_featured' => false,
            'chief_guest' => 'Amin Hannan',
            'tickets_sold' => 410,
        ]);

        Event::create([
            'title' => 'Aura++ Master Hackathon',
            'description' => 'A 48-hour intense coding competition bringing together the brightest minds to solve massive real-world problems.',
            'date' => Carbon::now()->addDays(30)->setHour(9)->setMinute(0),
            'location' => 'Radisson Blu Dhaka',
            'image' => 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
            'price' => 1000.00,
            'capacity' => 400,
            'category' => 'Tech',
            'is_featured' => true,
            'chief_guest' => 'Linus Torvalds',
            'tickets_sold' => 380,
        ]);

        Event::create([
            'title' => 'Global Competitive Programming Championship',
            'description' => 'The ultimate battle of algorithms and logic. Prove your skills among the elite programmers.',
            'date' => Carbon::now()->addDays(35)->setHour(10)->setMinute(0),
            'location' => 'ICCB Hall 4',
            'image' => 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
            'price' => 800.00,
            'capacity' => 1000,
            'category' => 'Tech',
            'is_featured' => true,
            'chief_guest' => 'Gennady Korotkevich (tourist)',
            'tickets_sold' => 950,
        ]);

        Event::create([
            'title' => 'React Advanced Conf',
            'description' => 'Deep dive into advanced frontend architecture, hooks, and React ecosystem tools.',
            'date' => Carbon::now()->addDays(40)->setHour(9)->setMinute(30),
            'location' => 'InterContinental Dhaka',
            'image' => 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
            'price' => 1500.00,
            'capacity' => 600,
            'category' => 'Tech',
            'is_featured' => true,
            'chief_guest' => 'Dan Abramov',
            'tickets_sold' => 550,
        ]);

        Event::create([
            'title' => 'Summer Beats Festival',
            'description' => 'The ultimate summer concert featuring top DJs, singers and performers. Energetic, loud, and unforgettable.',
            'date' => Carbon::now()->addDays(45)->setHour(18)->setMinute(0),
            'location' => 'Hatirjheel Amphitheater',
            'image' => 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
            'price' => 2000.00,
            'capacity' => 5000,
            'category' => 'Concert',
            'is_featured' => false,
            'chief_guest' => 'A.R. Rahman',
            'tickets_sold' => 4500,
        ]);

        Event::create([
            'title' => 'Anime & Comic Con',
            'description' => 'Celebrate pop culture, cosplay, and everything geeky. Get autographed posters and exclusive merch.',
            'date' => Carbon::now()->addDays(50)->setHour(10)->setMinute(0),
            'location' => 'Jamuna Future Park',
            'image' => 'https://images.unsplash.com/photo-1612487528505-d2338264c821?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
            'price' => 600.00,
            'capacity' => 3000,
            'category' => 'Entertainment',
            'is_featured' => true,
            'chief_guest' => 'Masashi Kishimoto',
            'tickets_sold' => 2800,
        ]);

        Event::create([
            'title' => 'Web3 & Blockchain Conference',
            'description' => 'Dive deep into decentralized technologies, crypto trends, smart contracts, and the future of the internet.',
            'date' => Carbon::now()->addDays(55)->setHour(10)->setMinute(0),
            'location' => 'Bangabandhu International Conference Center',
            'image' => 'https://images.unsplash.com/photo-1639762681485-074b7f4ecfc0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
            'price' => 500.00,
            'capacity' => 500,
            'category' => 'Tech',
            'is_featured' => false,
            'chief_guest' => 'Vitalik Buterin',
            'tickets_sold' => 420,
        ]);
    }
}
