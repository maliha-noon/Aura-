<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Event;
use App\Models\Booking;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * Get platform statistics.
     */
    public function getStats()
    {
        return response()->json([
            'stats' => [
                'total_users' => User::count(),
                'total_events' => Event::count(),
                'total_bookings' => Booking::count(),
                'total_revenue' => Booking::where('status', 'confirmed')->sum('total_price'),
            ]
        ]);
    }

    /**
     * Get all users.
     */
    public function getUsers()
    {
        $users = User::withTrashed()
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'users' => $users
        ]);
    }

    /**
     * Toggle user active status.
     */
    public function toggleUserStatus(User $user)
    {
        $user->update(['is_active' => !$user->is_active]);

        return response()->json([
            'message' => 'User status updated successfully',
            'user' => $user
        ]);
    }

    /**
     * Delete a user (Soft Delete).
     */
    public function deleteUser(User $user)
    {
        $user->delete();

        return response()->json([
            'message' => 'User suspended successfully'
        ]);
    }
}
