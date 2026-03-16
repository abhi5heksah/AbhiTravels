import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Train, Plane, Bus, Car, Calendar, Users, ArrowRight } from 'lucide-react';
import { indianCities } from '../data/cities';

type TransportMode = 'train' | 'flight' | 'bus' | 'cab';

interface SearchWidgetProps {
  initialMode?: TransportMode;
  embedded?: boolean;
}

export default function SearchWidget({ initialMode = 'train', embedded = false }: SearchWidgetProps) {
  const [mode, setMode] = useState<TransportMode>(initialMode);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const navigate = useNavigate();

  const modes: { id: TransportMode; label: string; icon: React.ReactNode }[] = [
    { id: 'train', label: 'Train', icon: <Train className="w-5 h-5" /> },
    { id: 'flight', label: 'Flight', icon: <Plane className="w-5 h-5" /> },
    { id: 'bus', label: 'Bus', icon: <Bus className="w-5 h-5" /> },
    { id: 'cab', label: 'Cab', icon: <Car className="w-5 h-5" /> },
  ];

  const handleSearch = () => {
    if (!from || !to || !date) return;
    navigate(`/search?mode=${mode}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}&passengers=${passengers}`);
  };

  return (
    <div className={`${embedded ? '' : 'bg-base-100 rounded-2xl shadow-xl p-6 lg:p-8'}`}>
      <div className="tabs tabs-boxed bg-base-200 p-1 mb-6">
        {modes.map((m) => (
          <button
            key={m.id}
            className={`tab flex items-center gap-2 ${mode === m.id ? 'tab-active bg-primary text-primary-content' : ''}`}
            onClick={() => {
              setMode(m.id);
              setFrom('');
              setTo('');
            }}
          >
            {m.icon}
            {m.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="form-control lg:col-span-2">
          <label className="label">
            <span className="label-text font-medium">From</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          >
            <option value="">Select {mode === 'cab' ? 'Pickup' : 'Departure'} City</option>
            {indianCities.map((city) => (
              <option key={city} value={city} disabled={city === to}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">To</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          >
            <option value="">Select {mode === 'cab' ? 'Drop' : 'Destination'} City</option>
            {indianCities.map((city) => (
              <option key={city} value={city} disabled={city === from}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Date</span>
          </label>
          <div className="relative">
            <input
              type="date"
              className="input input-bordered w-full pl-10"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/50" />
          </div>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Passengers</span>
          </label>
          <div className="relative">
            <select
              className="select select-bordered w-full pl-10"
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>{n} {n === 1 ? 'Passenger' : 'Passengers'}</option>
              ))}
            </select>
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/50" />
          </div>
        </div>
      </div>

      <button
        onClick={handleSearch}
        disabled={!from || !to || !date}
        className="btn btn-primary w-full mt-6"
      >
        Search {mode === 'train' ? 'Trains' : mode === 'flight' ? 'Flights' : mode === 'bus' ? 'Buses' : 'Cabs'}
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
