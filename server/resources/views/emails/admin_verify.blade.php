<!DOCTYPE html>
<html>
<head>
    <style>
        .button { background-color: #6c5ce7; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
    </style>
</head>
<body style="font-family: sans-serif; background-color: #f8f9fa; padding: 20px;">
    <div style="background-color: white; padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto;">
        <h2>🔔 New Subscription Request</h2>
        <p>A user has requested a premium subscription for AURA++.</p>
        <hr>
        <p><strong>Member Name:</strong> {{ $subscription->user->name }}</p>
        <p><strong>Email:</strong> {{ $subscription->user->email }}</p>
        <p><strong>Transaction ID:</strong> {{ $subscription->transaction_id }}</p>
        <p><strong>Payment Method:</strong> {{ $subscription->payment_method }}</p>
        <br>
        <a href="http://localhost:5174/admin" class="button">Visit Admin Dashboard</a>
    </div>
</body>
</html>
