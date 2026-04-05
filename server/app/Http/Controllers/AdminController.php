<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Event;
use App\Models\Booking;
use Illuminate\Http\Request;

use App\Models\Subscription;
use App\Models\Notification;
use App\Mail\UserSubscriptionResult;
use Illuminate\Support\Facades\Mail;

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
                'total_subscriptions' => Subscription::count(),
            ]
        ]);
    }

    /**
     * Get all subscriptions.
     */
    public function getSubscriptions()
    {
        $subscriptions = Subscription::with('user')->orderBy('created_at', 'desc')->get();
        return response()->json([
            'success' => true,
            'subscriptions' => $subscriptions
        ]);
    }

    /**
     * Verify a subscription request.
     */
    public function verifySubscription(Request $request, $id)
    {
        $subscription = Subscription::with('user')->findOrFail($id);
        $status = $request->status; // 'accepted' or 'rejected'

        $subscription->update(['status' => $status]);

        if ($status === 'accepted') {
            $user = $subscription->user;
            $user->update(['role' => 'admin']); // or 'subscriber'

            // Create notification
            Notification::create([
                'user_id' => $user->id,
                'title' => 'Subscription Activated!',
                'message' => 'Congratulations! Your premium subscription is now active.',
                'type' => 'success',
            ]);
        }

        // Send Email to User
        try {
            Mail::to($subscription->user->email)->send(new UserSubscriptionResult($subscription));
        } catch (\Exception $e) {
            // Log error but keep going
            \Log::error("Failed to send subscription mail: " . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Subscription status updated to ' . $status,
            'subscription' => $subscription
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
