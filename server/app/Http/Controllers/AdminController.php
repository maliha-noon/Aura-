<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Event;
use App\Models\Booking;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    // Returns overall platform statistics for the admin dashboard.
    // Counts users, events, bookings, and total revenue from confirmed bookings.
    public function getStats()
    {
        return response()->json([
            'stats' => [
                'total_users' => User::count(),
                'total_events' => Event::count(),
                'total_bookings' => Booking::count(),
                // Only sum revenue from confirmed (paid) bookings
                'total_revenue' => Booking::where('status', 'confirmed')->sum('total_price'),
            ]
        ]);
    }

    // Returns a list of all users including soft-deleted (suspended) ones.
    // withTrashed() includes users that were soft-deleted from the system.
    public function getUsers()
    {
        $users = User::withTrashed()
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['users' => $users]);
    }

    // Toggles a user's active status (activate/deactivate).
    // Uses the '!' operator to flip the current boolean value.
    public function toggleUserStatus(User $user)
    {
        $user->update(['is_active' => !$user->is_active]);

        return response()->json([
            'message' => 'User status updated successfully',
            'user' => $user
        ]);
    }

    // Soft deletes a user — does not permanently remove from DB.
    // The user will still appear via withTrashed() but is suspended.
    public function deleteUser(User $user)
    {
        $user->delete(); // soft delete (uses Laravel's SoftDeletes trait)

        return response()->json(['message' => 'User suspended successfully']);
    }
}
