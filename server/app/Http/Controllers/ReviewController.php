<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $review = Review::create([
            'user_id' => Auth::id(),
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        $user = Auth::user();

        // 1. Personal Notification for the User
        Notification::create([
            'user_id' => $user->id,
            'title' => 'Review Submitted! ✨',
            'message' => "Thank you for your {$request->rating}-star feedback. It helps Aura++ grow!",
            'type' => 'success',
            'is_read' => false,
        ]);

        // 2. Alert Notification for All Admins
        $admins = User::where('role', 'admin')->get();
        foreach ($admins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'title' => 'New Review Alert 🔔',
                'message' => "{$user->name} just left a {$request->rating}-star review: \"{$request->comment}\"",
                'type' => 'info',
                'is_read' => false,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Review submitted! Thank you for your feedback.',
            'review' => $review
        ], 201);
    }

    public function index()
    {
        $reviews = Review::with('user')->latest()->paginate(4);
        return response()->json(['success' => true, 'reviews' => $reviews]);
    }
}
