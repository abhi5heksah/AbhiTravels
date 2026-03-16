import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Train, Plane, Bus, Car } from 'lucide-react';
import SearchWidget from '../components/SearchWidget';
import TransportCard from '../components/TransportCard';
import trainsData from '../data/trains.json';
import flightsData from '../data/flights.json';
import busesData from '../data/buses.json';
import cabsData from '../data/cabs.json';

type TransportMode = 'train' | 'flight' | 'bus' | 'cab';

interface TransportItem {
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

const modeIcons: Record<TransportMode, React.ReactNode> = {
  train: <Train className="w-5 h-5" />,
  flight: <Plane className="w-5 h-5" />,
  bus: <Bus className="w-5 h-5" />,
  cab: <Car className="w-5 h-5" />,
};

const dataMap: Record<TransportMode, TransportItem[]> = {
  train: trainsData,
  flight: flightsData,
  bus: busesData,
  cab: cabsData,
};

export default function Search() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<TransportItem[]>([]);

  const mode = (searchParams.get('mode') as TransportMode) || 'train';
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const date = searchParams.get('date') || '';

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const data = dataMap[mode] || [];
      const filtered = data.filter((item) => {
        const fromMatch = !from || 
          (mode === 'cab' ? item.pickup?.toLowerCase().includes(from.toLowerCase()) : item.departure?.toLowerCase().includes(from.toLowerCase()));
        const toMatch = !to ||
          (mode === 'cab' ? item.drop?.toLowerCase().includes(to.toLowerCase()) : item.arrival?.toLowerCase().includes(to.toLowerCase()));
        return fromMatch && toMatch;
      });
      setResults(filtered.length > 0 ? filtered : data);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [mode, from, to]);

  return (
    <div className="min-h-screen bg-base-200">
      <div className="bg-base-100 shadow-md py-6">
        <div className="container mx-auto px-4">
          <SearchWidget initialMode={mode} embedded />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading text-2xl font-bold">
              {mode === 'train' ? 'Trains' : mode === 'flight' ? 'Flights' : mode === 'bus' ? 'Buses' : 'Cabs'}
            </h1>
            <p className="text-base-content/60">
              {from && to ? `${from} to ${to}` : 'Showing all available options'}
              {date && ` • ${new Date(date).toLocaleDateString()}`}
            </p>
          </div>
          <div className="badge badge-lg gap-2 p-3">
            {modeIcons[mode]}
            <span>{results.length} results found</span>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card bg-base-100 shadow-md">
                <div className="card-body">
                  <div className="skeleton h-6 w-3/4"></div>
                  <div className="skeleton h-4 w-1/2 mt-2"></div>
                  <div className="flex justify-between mt-4">
                    <div className="skeleton h-4 w-20"></div>
                    <div className="skeleton h-4 w-20"></div>
                  </div>
                  <div className="skeleton h-8 w-full mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-base-300 mb-4">
              {modeIcons[mode]}
            </div>
            <h2 className="font-heading text-2xl font-bold mb-2">No results found</h2>
            <p className="text-base-content/60 mb-6">
              Try adjusting your search criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((item) => (
              <TransportCard key={item.id} data={item} mode={mode} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
