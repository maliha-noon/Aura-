<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'session_id',
        'roll',
    ];

    protected $casts = [
        'session_id' => 'integer',
        'roll' => 'integer',
    ];

    public function session()
    {
        return $this->belongsTo(Session::class);
    }
}