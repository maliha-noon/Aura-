@php /** @var \App\Models\User $user */ @endphp
<!DOCTYPE html>
<html>
<head>
    <title>Event Booking Verification Request</title>
</head>
<body style="font-family: sans-serif; padding: 20px;">
    <h2>New Event Booking Verification Request</h2>
    
    <p>A user has placed a new booking for an event on Aura++ and is awaiting verification.</p>
    
    <div style="background: #f4f4f4; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
        <p><strong>Customer Name:</strong> {{ $user->name }}</p>
        <p><strong>Customer Email:</strong> {{ $user->email }}</p>
        <p><strong>Event:</strong> {{ $booking->event->title }}</p>
        <p><strong>Quantity:</strong> {{ $booking->quantity }} Tickets</p>
        <p><strong>Total Price:</strong> {{ $booking->total_price }} BDT</p>
        <p><strong>Transaction ID:</strong> {{ $booking->transaction_id }}</p>
        <p><strong>Payment Method:</strong> {{ $booking->payment_method }}</p>
    </div>

    <p>Please review the transaction ID. If it is valid, accept the booking below.</p>

    <div style="margin-top: 30px;">
        <a href="{{ $acceptUrl }}" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-right: 10px; font-weight: bold;">Accept Booking</a>
        
        <a href="{{ $rejectUrl }}" style="background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reject</a>
    </div>
</body>
</html>
