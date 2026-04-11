<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;
use App\Models\Booking;

class UserBookingResult extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $booking;
    public $accepted;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(User $user, Booking $booking, $accepted)
    {
        $this->user = $user;
        $this->booking = $booking;
        $this->accepted = $accepted;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $status = $this->accepted ? 'Confirmed' : 'Rejected';
        return $this->subject("Your Booking Request for {$this->booking->event->title} has been {$status}")
                    ->view('emails.user_booking_result')
                    ->with([
                        'customer' => $this->user,
                        'booking' => $this->booking,
                        'accepted' => $this->accepted
                    ]);
    }
}
