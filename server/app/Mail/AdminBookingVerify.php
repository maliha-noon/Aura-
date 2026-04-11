<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Booking;
use App\Models\User;

class AdminBookingVerify extends Mailable
{
    use Queueable, SerializesModels;

    public $booking;
    public $user;
    public $acceptUrl;
    public $rejectUrl;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(Booking $booking, User $user, $acceptUrl, $rejectUrl)
    {
        $this->booking = $booking;
        $this->user = $user;
        $this->acceptUrl = $acceptUrl;
        $this->rejectUrl = $rejectUrl;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->from($this->user->email, $this->user->name)
                    ->replyTo($this->user->email, $this->user->name)
                    ->subject('New Event Booking Verification Request')
                    ->view('emails.admin_booking_verify');
    }
}
