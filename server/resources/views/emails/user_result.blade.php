<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; background-color: #f8f9fa; padding: 20px;">
    <div style="background-color: white; padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto;">
        <h2>Aura++ Status Update</h2>
        <p>Dear {{ $subscription->user->name }},</p>
        <p>Your subscription request (TrxID: {{ $subscription->transaction_id }}) has been processed.</p>
        <hr>
        <p><strong>Current Status:</strong> {{ strtoupper($subscription->status) }}</p>
        <br>
        @if($subscription->status == 'accepted')
            <p style="color: #27ae60;">Congratulations! You now have full access to AURA++ Premium features.</p>
        @else
            <p style="color: #e74c3c;">Your subscription was not accepted. Please contact support for more details.</p>
        @endif
        <hr>
        <p>Thank you for choosing AURA++.</p>
    </div>
</body>
</html>
