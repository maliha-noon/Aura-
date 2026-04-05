<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use App\Models\Subscription;
use App\Models\User;
use App\Models\Booking;
use App\Models\Event;
use App\Mail\AdminSubscriptionVerify;
use App\Mail\UserSubscriptionResult;
use Illuminate\Support\Facades\DB;

class SubscriptionController extends Controller
{
    public function subscribe(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'payment_method' => 'required|string',
            'amount' => 'required|numeric',
            'email' => 'required|email',
            'phone' => 'nullable|string',
            'transaction_id' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        try {
            $user = $request->user();
            
            // Create Subscription Record as ACTIVE immediately
            $subscription = Subscription::create([
                'user_id' => $user->id,
                'email' => $request->email,
                'payment_method' => $request->payment_method,
                'amount' => $request->amount,
                'phone' => $request->phone,
                'transaction_id' => $request->transaction_id,
                'status' => 'active',
            ]);

            // Activate User Immediately
            $user->is_subscribed = true;
            $user->save();

            // Optional: Still send email but as a "Welcome/Receipt" instead of "Verify"
            try {
                // You can keep the mail logic if you want the admin to know, 
                // but removing the approval requirement.
                $adminEmail = env('ADMIN_EMAIL', 'rahator44@gmail.com');
                Mail::to($adminEmail)->send(new AdminSubscriptionVerify($subscription, $user, '#', '#')); 
            } catch (\Exception $e) {
                // Silently ignore mail errors for faster response
            }

            return response()->json([
                'success' => true,
                'message' => 'Subscription Successful! Welcome to Aura++ Premium.',
                'user' => $user
            ]);
        }
        catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to process subscription: ' . $e->getMessage()
            ], 500);
        }
    }

    public function verifyAccept(Request $request, $id)
    {
        if (! $request->hasValidSignature()) {
            abort(401, 'Invalid or expired link.');
        }

        $subscription = Subscription::findOrFail($id);
        
        if ($subscription->status !== 'pending') {
            return response("This subscription has already been processed as: " . $subscription->status);
        }

        $subscription->status = 'active';
        $subscription->save();

        $user = User::findOrFail($subscription->user_id);
        $user->is_subscribed = true;
        $user->save();

        // Notify user
        Mail::to($user->email)->send(new UserSubscriptionResult($user, true));

        return response("Subscription Accepted! User is now a premium member.");
    }

    public function verifyReject(Request $request, $id)
    {
        if (! $request->hasValidSignature()) {
            abort(401, 'Invalid or expired link.');
        }

        $subscription = Subscription::findOrFail($id);

        if ($subscription->status !== 'pending') {
            return response("This subscription has already been processed as: " . $subscription->status);
        }

        $subscription->status = 'rejected';
        $subscription->save();

        $user = User::findOrFail($subscription->user_id);
        
        // Notify user
        Mail::to($user->email)->send(new UserSubscriptionResult($user, false));

        return response("Subscription Rejected! User has been notified.");
    }

    public function getRecentSubscribers()
    {
        try {
            $count = \App\Models\User::where('is_subscribed', true)->count();

            // Get 3 recent subscribers (name and subscription date)
            $recent = \App\Models\User::where('is_subscribed', true)
                ->orderBy('updated_at', 'desc')
                ->take(3)
                ->get(['name', 'updated_at']);

            return response()->json([
                'success' => true,
                'total_subscribers' => $count,
                'recent_subscribers' => $recent
            ]);
        }
        catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch subscriber stats'
            ], 500);
        }
    }

    public function getDashboardStats(Request $request)
    {
        $user = $request->user();

        // 1. Total Tickets Bought (Sum of quantities bought by this user)
        $totalBought = Booking::where('user_id', $user->id)->sum('quantity');

        // 2. Events Attended (Count of unique events the user has bookings for)
        $eventsAttended = Booking::where('user_id', $user->id)->distinct('event_id')->count();

        // 3. User's Hosted Events & Sales
        $myEvents = Event::where('user_id', $user->id)->get();
        $myEventIds = $myEvents->pluck('id');

        // 4. Total Tickets Sold (Sum of quantities from all bookings for events created by this user)
        $totalSold = Booking::whereIn('event_id', $myEventIds)->sum('quantity');

        // 5. Total Revenue (Sum of total_price from all bookings for events created by this user)
        $totalRevenue = Booking::whereIn('event_id', $myEventIds)->sum('total_price');

        // 6. Detailed Event Performance for Table
        $eventPerformance = $myEvents->map(function($event) {
            $salesCount = Booking::where('event_id', $event->id)->sum('quantity');
            $salesRevenue = Booking::where('event_id', $event->id)->sum('total_price');
            return [
                'id' => $event->id,
                'title' => $event->title,
                'date' => $event->date,
                'price' => $event->price,
                'tickets_sold' => $salesCount,
                'revenue' => $salesRevenue,
            ];
        });

        return response()->json([
            'success' => true,
            'stats' => [
                'total_bought' => $totalBought,
                'events_attended' => $eventsAttended,
                'total_sold' => $totalSold,
                'total_revenue' => $totalRevenue,
                'membership_status' => $user->is_subscribed ? 'Aura++ Premium' : 'Free Tier',
                'event_performance' => $eventPerformance
            ]
        ]);
    }
}

