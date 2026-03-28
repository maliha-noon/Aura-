<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SubscriptionController extends Controller
{
    public function subscribe(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'payment_method' => 'required|string',
            'amount' => 'required|numeric',
            'email' => 'required|email',
            'phone' => 'nullable|string',
            'number' => 'nullable|string',
            'expiry' => 'nullable|string',
            'cvv' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        try {
            $user = $request->user();
            
            // Create Subscription Record
            \App\Models\Subscription::create([
                'user_id' => $user->id,
                'email' => $request->email,
                'payment_method' => $request->payment_method,
                'amount' => $request->amount,
                'phone' => $request->phone ?? $request->number,
                'transaction_id' => 'TXN-' . strtoupper(bin2hex(random_bytes(4))),
                'card_number' => $request->number && $request->payment_method === 'card' ? substr($request->number, -4) : null,
                'expiry' => $request->expiry,
                'cvv' => $request->cvv,
                'status' => 'active',
            ]);

            // Update User Status
            $user->is_subscribed = true;
            if ($request->has('email')) {
                $user->email = $request->email;
            }
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Successfully subscribed to Aura++!',
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
}
