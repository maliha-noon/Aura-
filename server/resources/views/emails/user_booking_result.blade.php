<!DOCTYPE html>
<html>
<head>
    <title>Booking Update</title>
</head>
<body style="font-family: sans-serif; padding: 20px;">
    <h2>Hello {{ $customer->name }},</h2>
    
    @if($accepted)
        <p style="color: #28a745; font-size: 18px; font-weight: bold;">Your booking request has been ACCEPTED!</p>
        <p>Your tickets for <strong>{{ $booking->event->title }}</strong> are now active and ready. You can view them in your dashboard.</p>
    @else
        <p style="color: #dc3545; font-size: 18px; font-weight: bold;">Your booking request has been REJECTED.</p>
        <p>Unfortunately, your payment verification for <strong>{{ $booking->event->title }}</strong> did not pass. Please contact support if you believe this is an error.</p>
    @endif

    <div style="background: #f4f4f4; padding: 15px; border-radius: 5px; margin-top: 20px;">
        <p><strong>Event:</strong> {{ $booking->event->title }}</p>
        <p><strong>Quantity:</strong> {{ $booking->quantity }} Tickets</p>
        <p><strong>Transaction ID:</strong> {{ $booking->transaction_id }}</p>
    </div>

    <p style="margin-top: 30px;">
        Best regards,<br>
        The Aura++ Team
    </p>
</body>
</html>
