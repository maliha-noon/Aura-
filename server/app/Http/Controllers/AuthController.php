<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $role = ($request->email === 'rahator44@gmail.com') ? 'admin' : 'user';

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'role' => $role,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials provided.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        // Force admin role if email matches
        if ($user->email === 'rahator44@gmail.com' && $user->role !== 'admin') {
            $user->update(['role' => 'admin']);
        }

        $user->update(['last_login_at' => now()]);

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function socialLogin(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'name' => 'required|string',
            'provider_id' => 'required|string',
            'provider' => 'nullable|string',
        ]);

        $user = User::where('email', $request->email)->first();
        $isNewUser = false;

        // Logic to decide role based on email - The SQL Source of Truth
        $role = ($request->email === 'rahator44@gmail.com') ? 'admin' : 'user';

        if (! $user) {
            // New user registration via Social
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'role' => $role,
                'password' => Hash::make(Str::random(16)),
                'provider' => $request->provider ?? 'google',
                'provider_id' => $request->provider_id,
                'phone' => null,
            ]);
            $isNewUser = true;
        } else {
            // Existing user - update role and link provider if needed
            $user->update([
                'role' => $role, // Ensure role is correct even for returning users
                'provider' => $request->provider ?? 'google',
                'provider_id' => $request->provider_id,
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        $user->update(['last_login_at' => now()]);

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
            'is_new_user' => $isNewUser,
            'message' => $isNewUser ? 'Account created successfully!' : 'Welcome back!'
        ]);
    }
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['message' => 'If this email exists, a reset code has been sent.'], 200);
        }

        // Generate a 6-digit code for simulation
        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Store or update the token
        \Illuminate\Support\Facades\DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            [
                'token' => $code,
                'created_at' => now(),
            ]
        );

        // In a real app, you would send an email here.
        // For simulation, we return the code in the response so the user can see it.
        return response()->json([
            'message' => 'Reset code sent successfully!',
            'simulated_code' => $code // DO NOT do this in production!
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|size:6',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $reset = \Illuminate\Support\Facades\DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->where('token', $request->code)
            ->first();

        if (!$reset || now()->subMinutes(60)->gt($reset->created_at)) {
            return response()->json(['message' => 'Invalid or expired reset code.'], 422);
        }

        $user = User::where('email', $request->email)->first();
        if ($user) {
            $user->update(['password' => Hash::make($request->password)]);

            // Delete the token after use
            \Illuminate\Support\Facades\DB::table('password_reset_tokens')
                ->where('email', $request->email)
                ->delete();

            return response()->json(['message' => 'Password reset successful!']);
        }

        return response()->json(['message' => 'User not found.'], 404);
    }
}
