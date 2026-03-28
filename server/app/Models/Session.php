<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Session extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'duration',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
        'duration' => 'integer',
    ];

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }
}