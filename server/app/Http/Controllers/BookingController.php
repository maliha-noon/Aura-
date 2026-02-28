<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BookingController extends Controller
{
    /**
     * Store a newly created booking in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'quantity' => 'required|integer|min:1',
            'payment_method' => 'required|string|in:card,bkash',
        ]);

        $event = Event::findOrFail($request->event_id);

        // Check if already booked
        $existing = Booking::where('user_id', Auth::id())
            ->where('event_id', $event->id)
            ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'You have already booked this event.',
            ], 400);
        }

        // Check capacity
        if ($event->capacity < $request->quantity) {
            return response()->json([
                'success' => false,
                'message' => 'Not enough capacity available.',
            ], 400);
        }

        $booking = Booking::create([
            'user_id' => Auth::id(),
            'event_id' => $event->id,
            'quantity' => $request->quantity,
            'total_price' => $event->price * $request->quantity,
            'payment_method' => $request->payment_method,
            'payment_status' => 'paid', // Mark as paid for mock
            'status' => 'confirmed',
        ]);

        // Reduce capacity
        $event->capacity -= $request->quantity;
        $event->save();

        return response()->json([
            'success' => true,
            'message' => 'Booking successful!',
            'booking' => $booking,
        ]);
    }

    /**
     * Display a listing of the user's bookings.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function myBookings()
    {
        $bookings = Booking::with('event')
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $bookings,
        ]);
    }
}
