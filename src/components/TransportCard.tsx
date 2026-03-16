import { Link } from 'react-router-dom';
import { Clock, Star, Users, Wifi, Coffee, Power, Armchair, Calendar } from 'lucide-react';

interface TransportData {
  id: string;
  name: string;
  departure?: string;
  arrival?: string;
  departureTime?: string;
  arrivalTime?: string;
  duration: string;
  price: number;
  availableSeats?: number;
  rating: number;
  amenities: string[];
  type?: string;
  class?: string;
  pickup?: string;
  drop?: string;
  distance?: string;
  availableCars?: number;
}

interface TransportCardProps {
  data: TransportData;
  mode: 'train' | 'flight' | 'bus' | 'cab';
}

const amenityIcons: Record<string, React.ReactNode> = {
  'WiFi': <Wifi className="w-4 h-4" />,
  'Meals': <Coffee className="w-4 h-4" />,
  'AC': <Calendar className="w-4 h-4" />,
  'Charging Point': <Power className="w-4 h-4" />,
  'Bedroll': <Armchair className="w-4 h-4" />,
  'Entertainment': <Wifi className="w-4 h-4" />,
  'Leg Room': <Users className="w-4 h-4" />,
  'Snacks': <Coffee className="w-4 h-4" />,
  'Lounge': <Coffee className="w-4 h-4" />,
  'Priority Boarding': <Users className="w-4 h-4" />,
  'Flat Bed': <Armchair className="w-4 h-4" />,
  'Charging': <Power className="w-4 h-4" />,
  'Music': <Wifi className="w-4 h-4" />,
  'Wifi': <Wifi className="w-4 h-4" />,
  'Refreshments': <Coffee className="w-4 h-4" />,
  'Extra Luggage': <Users className="w-4 h-4" />,
  'Pillow': <Armchair className="w-4 h-4" />,
  'Blanket': <Armchair className="w-4 h-4" />,
};

export default function TransportCard({ data, mode }: TransportCardProps) {
  const getSubtitle = () => {
    if (mode === 'train') return data.class;
    if (mode === 'flight') return data.class;
    if (mode === 'bus') return data.type;
    if (mode === 'cab') return data.type;
    return '';
  };

  return (
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
      <div className="card-body">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="card-title text-lg">{data.name}</h3>
            <p className="text-sm text-base-content/60">{getSubtitle()}</p>
          </div>
          <div className="flex items-center gap-1 text-warning">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium">{data.rating}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-center">
            <p className="font-semibold">{mode === 'cab' ? data.pickup : data.departure}</p>
            <p className="text-sm text-base-content/60">{data.departureTime || 'N/A'}</p>
          </div>
          <div className="flex-1 px-4">
            <div className="relative flex items-center">
              <div className="flex-1 h-0.5 bg-base-300"></div>
              <div className="absolute left-1/2 -translate-x-1/2 -top-1 bg-base-100 p-1">
                <Clock className="w-4 h-4 text-primary" />
              </div>
            </div>
            <p className="text-center text-xs text-base-content/60 mt-1">{data.duration}</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">{mode === 'cab' ? data.drop : data.arrival}</p>
            <p className="text-sm text-base-content/60">{data.arrivalTime || 'N/A'}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {data.amenities.slice(0, 4).map((amenity, idx) => (
            <div key={idx} className="badge badge-outline badge-sm gap-1">
              {amenityIcons[amenity] || null}
              {amenity}
            </div>
          ))}
          {data.amenities.length > 4 && (
            <div className="badge badge-outline badge-sm">+{data.amenities.length - 4}</div>
          )}
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-base-200">
          <div>
            <span className="text-2xl font-bold text-primary">₹{data.price.toLocaleString()}</span>
            <span className="text-sm text-base-content/60">/person</span>
          </div>
          <div className="flex items-center gap-2">
            {mode !== 'cab' && (
              <span className="text-sm text-success">
                {data.availableSeats || data.availableCars} seats available
              </span>
            )}
            <Link to={`/booking/${mode}/${data.id}`} className="btn btn-primary btn-sm">
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
