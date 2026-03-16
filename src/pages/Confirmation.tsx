import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Home, Mail } from 'lucide-react';

interface BookingData {
  id: string;
  name: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  passengers: number;
  class: string;
  totalPrice: number;
}

export default function Confirmation() {
  const location = useLocation();
  const booking = (location.state as { booking?: BookingData })?.booking;

  if (!booking) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-bold mb-4">No booking found</h2>
          <Link to="/" className="btn btn-primary">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 mb-4">
              <CheckCircle className="w-10 h-10 text-success" />
            </div>
            <h1 className="font-heading text-4xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-base-content/60">
              Your booking has been successfully confirmed. A confirmation email has been sent to your email address.
            </p>
          </div>

          <div className="card bg-base-100 shadow-xl mb-6">
            <div className="card-body">
              <h2 className="font-heading text-xl font-semibold mb-4">Booking Details</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between pb-4 border-b border-base-200">
                  <span className="text-base-content/60">Booking ID</span>
                  <span className="font-mono font-semibold">{booking.id.toUpperCase()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-base-content/60">Service</span>
                  <span className="font-semibold">{booking.name}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-base-content/60">Route</span>
                  <span>{booking.departure} → {booking.arrival}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-base-content/60">Time</span>
                  <span>{booking.departureTime} - {booking.arrivalTime}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-base-content/60">Duration</span>
                  <span>{booking.duration}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-base-content/60">Passengers</span>
                  <span>{booking.passengers}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-base-content/60">Class</span>
                  <span>{booking.class}</span>
                </div>

                <div className="flex justify-between pt-4 border-t border-base-200">
                  <span className="font-semibold">Total Amount</span>
                  <span className="text-xl font-bold text-primary">₹{booking.totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/" className="btn btn-outline flex-1">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>

          <div className="mt-8 p-4 bg-info/10 rounded-lg">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-info mt-0.5" />
              <div>
                <h3 className="font-semibold text-info">Confirmation Email Sent</h3>
                <p className="text-sm text-base-content/70">
                  We've sent a confirmation email with your booking details. Please check your inbox and spam folder.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
