<?php
 
namespace App\Notifications;
 
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Config;
 
class MailResetPasswordToken extends Notification
{
    use Queueable;
 
    public $token;
 
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($token)
    {
        $this->token = $token;
    }
 
    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }
 
    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable) {
        return (new MailMessage)
            ->subject("Reset your password")
            ->line("Click the button to reset your password.")
            ->action('Reset Password', url(Config::get('mail.siteurl').Config::get('mail.routes.reset').$this->token));
    }
 
}