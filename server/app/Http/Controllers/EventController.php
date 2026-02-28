<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    /**
     * Display a listing of the events.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $events = Event::orderBy('date', 'asc')->get();
        $user = auth('sanctum')->user();

        $events->map(function ($event) use ($user) {
            $event->is_booked = $user ? $event->bookings()->where('user_id', $user->id)->exists() : false;
            // Add a "live" flag if the event is happening now (within 3 hours)
            $now = now();
            $eventDate = \Carbon\Carbon::parse($event->date);
            $event->is_live = $now->between($eventDate, $eventDate->copy()->addHours(3));
            return $event;
        });

        return response()->json([
            'success' => true,
            'data' => $events,
        ]);
    }
}
