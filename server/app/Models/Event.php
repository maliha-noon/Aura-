<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'date',
        'location',
        'image',
        'price',
        'capacity',
        'category',
        'is_featured',
        'chief_guest',
        'tickets_sold',
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
