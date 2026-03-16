import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Train, Plane, Bus, Car, Clock, Star, ArrowRight } from 'lucide-react';
import ConsentBanner from '../components/ConsentBanner';
import { useConsent } from '../context/ConsentContext';
import toast from 'react-hot-toast';
import trainsData from '../data/trains.json';
import flightsData from '../data/flights.json';
import busesData from '../data/buses.json';
import cabsData from '../data/cabs.json';

interface TransportData {
  id: string;
  name: string;
  departure?: string;
  arrival?: string;
  pickup?: string;
  drop?: string;
  departureTime?: string;
  arrivalTime?: string;
  duration: string;
  price: number;
  availableSeats?: number;
  availableCars?: number;
  rating: number;
  class?: string;
  type?: string;
  amenities: string[];
}

const modeIcons: Record<string, React.ElementType> = {
  train: Train,
  flight: Plane,
  bus: Bus,
  cab: Car,
};

const classOptions: Record<string, string[]> = {
  train: ['Sleeper', '3A', '2A', '1A'],
  flight: ['Economy', 'Business', 'First Class'],
  bus: ['Seater', 'Sleeper', 'AC Seater', 'AC Sleeper'],
  cab: ['Hatchback', 'Sedan', 'SUV', 'Luxury'],
};

export default function BookingDetail() {
  const { mode = 'train', id } = useParams<{ mode: string; id: string }>();
  const navigate = useNavigate();
  const [passengers, setPassengers] = useState(1);
  const [selectedClass, setSelectedClass] = useState('');
  const [userInfo, setUserInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  const [showConsent, setShowConsent] = useState(false);
  const [consentGiven, setConsentGiven] = useState(() => {
    return !!localStorage.getItem('abhitravels_consent');
  });

  const { saveConsent, revokeConsent } = useConsent();

  useEffect(() => {
    const consent = localStorage.getItem('abhitravels_consent');
    setConsentGiven(!!consent);
  }, [showConsent]);

  const getData = (): TransportData | undefined => {
    switch (mode) {
      case 'train':
        return trainsData.find((t) => t.id === id);
      case 'flight':
        return flightsData.find((f) => f.id === id);
      case 'bus':
        return busesData.find((b) => b.id === id);
      case 'cab':
        return cabsData.find((c) => c.id === id);
      default:
        return undefined;
    }
  };

  const data = getData();
  const Icon = modeIcons[mode] || Train;
  const classes = classOptions[mode] || [];

  if (!data) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-error">Booking Not Found</h2>
          <button onClick={() => navigate('/')} className="btn btn-primary mt-4">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const totalPrice = data.price * passengers;

  const handleConsentSubmit = async (selectedPurposes: { id: string; granted: boolean }[]) => {
    await saveConsent(userInfo.email, selectedPurposes);
    setShowConsent(false);
    setConsentGiven(true);
    toast.success('Consent saved! You can now confirm your booking.');
  };

  const isFormValid = userInfo.fullName.length >= 2 && 
                     /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email) && 
                     userInfo.phone.length >= 10;

  const handleBooking = () => {
    if (!consentGiven) {
      setShowConsent(true);
      return;
    }

    const booking = {
      ...data,
      departure: mode === 'cab' ? data.pickup : data.departure,
      arrival: mode === 'cab' ? data.drop : data.arrival,
      passengers,
      class: selectedClass || data.class || data.type,
      totalPrice,
    };
    navigate('/confirmation', { state: { booking } });
  };

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="btn btn-ghost mb-4">
          ← Back to Search
        </button>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="card-title text-xl">{data.name}</h2>
                  <div className="flex items-center gap-1 text-sm text-base-content/60">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{data.rating}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{data.departureTime}</p>
                    <p className="text-sm text-base-content/60">
                      {mode === 'cab' ? data.pickup : data.departure}
                    </p>
                  </div>
                  <div className="flex-1 mx-4 relative">
                    <div className="border-t-2 border-dashed border-base-300"></div>
                    <ArrowRight className="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-base-100 text-base-content/40" />
                    <p className="text-center text-xs text-base-content/40 mt-1">{data.duration}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{data.arrivalTime}</p>
                    <p className="text-sm text-base-content/60">
                      {mode === 'cab' ? data.drop : data.arrival}
                    </p>
                  </div>
                </div>
              </div>

              <div className="divider"></div>

              <div>
                <h3 className="font-semibold mb-2">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {data.amenities.map((amenity, index) => (
                    <span key={index} className="badge badge-outline badge-sm">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-base-content/60">
                <Clock className="w-4 h-4" />
                <span>Duration: {data.duration}</span>
                {data.availableSeats && (
                  <span className="ml-auto text-success">
                    {data.availableSeats} seats available
                  </span>
                )}
                {data.availableCars && (
                  <span className="ml-auto text-success">
                    {data.availableCars} cars available
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4">Book Your {mode === 'cab' ? 'Ride' : 'Ticket'}</h2>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Number of {mode === 'cab' ? 'Passengers' : 'Passengers'}</span>
                </label>
                <div className="join w-full">
                  <button
                    className="btn join-item"
                    onClick={() => setPassengers(Math.max(1, passengers - 1))}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={passengers}
                    onChange={(e) => setPassengers(Math.max(1, parseInt(e.target.value) || 1))}
                    className="input input-bordered join-item flex-1 text-center"
                    min="1"
                  />
                  <button
                    className="btn join-item"
                    onClick={() => setPassengers(passengers + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Select {mode === 'cab' ? 'Car Type' : 'Class'}</span>
                </label>
                <select
                  className="select select-bordered"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  <option value="">{data.class || data.type || 'Select'}</option>
                  {classes.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>

              <div className="divider"></div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="input input-bordered"
                  value={userInfo.fullName}
                  onChange={(e) => setUserInfo({ ...userInfo, fullName: e.target.value })}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="input input-bordered"
                  value={userInfo.email}
                  onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Phone Number</span>
                </label>
                <input
                  type="tel"
                  placeholder="+91 1234567890"
                  className="input input-bordered"
                  value={userInfo.phone}
                  onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                />
              </div>

              <div className="divider"></div>

              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    type="checkbox"
                    checked={consentGiven}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setShowConsent(true);
                      } else {
                        revokeConsent();
                        setConsentGiven(false);
                      }
                    }}
                    className="checkbox checkbox-primary"
                  />
                  <span className="label-text font-medium text-sm text-base-content/70">
                    I agree to receive booking updates and communication consent
                  </span>
                </label>
              </div>

              <div className="space-y-2 mt-4">
                <div className="flex justify-between">
                  <span>Price per {mode === 'cab' ? 'trip' : 'person'}</span>
                  <span>₹{data.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Number of {mode === 'cab' ? 'passengers' : 'passengers'}</span>
                  <span>× {passengers}</span>
                </div>
                <div className="divider my-1"></div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleBooking}
                disabled={!isFormValid || !consentGiven}
                className="btn btn-primary w-full mt-4"
              >
                Confirm Booking
              </button>

              {!isFormValid && (
                <p className="text-xs text-center text-base-content/60 mt-2">
                  Please fill in all details to proceed.
                </p>
              )}
              {isFormValid && !consentGiven && (
                <p className="text-xs text-center text-error mt-2">
                  Consent is required to confirm booking.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {showConsent && (
        <ConsentBanner
          isOpen={showConsent}
          onClose={() => setShowConsent(false)}
          onSubmit={handleConsentSubmit}
          userData={{
            name: userInfo.fullName,
            email: userInfo.email,
            phone: userInfo.phone
          }}
        />
      )}
    </div>
  );
}
