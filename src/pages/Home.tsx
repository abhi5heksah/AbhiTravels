import { Link } from 'react-router-dom';
import { Compass, Shield, Clock, Headphones, ArrowRight } from 'lucide-react';
import SearchWidget from '../components/SearchWidget';
import PurposeSection from '../components/PurposeSection';
import TransportCard from '../components/TransportCard';
import trainsData from '../data/trains.json';
import flightsData from '../data/flights.json';

const popularDestinations = [
  { name: 'Mumbai', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=300&fit=crop' },
  { name: 'Delhi', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop' },
  { name: 'Goa', image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&h=300&fit=crop' },
  { name: 'Bangalore', image: 'data:image/jpeg;base64,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' },
  { name: 'Jaipur', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&h=300&fit=crop' },
  { name: 'Kerala', image: 'https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=400&h=300&fit=crop' },
];

const features = [
  { icon: <Compass className="w-8 h-8" />, title: 'Explore More', desc: 'Discover amazing destinations worldwide' },
  { icon: <Shield className="w-8 h-8" />, title: 'Secure Booking', desc: 'Your payments are always protected' },
  { icon: <Clock className="w-8 h-8" />, title: '24/7 Support', desc: 'We are here to help anytime' },
  { icon: <Headphones className="w-8 h-8" />, title: 'Best Deals', desc: 'Get exclusive discounts on every booking' },
];

export default function Home() {
  const featuredTrains = trainsData.slice(0, 3);
  const featuredFlights = flightsData.slice(0, 3);

  return (
    <div>
      <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-cyan-50 dark:from-base-200 dark:via-base-300 dark:to-base-200">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-10"></div>
        
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4">
              Your Journey Begins Here
            </h1>
            <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
              Discover seamless travel booking for trains, flights, buses, and cabs. 
              Your adventure is just a click away.
            </p>
          </div>

          <SearchWidget />
        </div>
      </section>

      <section className="py-16 bg-base-100">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold text-center mb-12">
            Popular Destinations
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularDestinations.map((dest) => (
              <Link
                to={`/search?mode=flight&from=Delhi&to=${dest.name}&date=${new Date().toISOString().split('T')[0]}&passengers=1`}
                key={dest.name}
                className="group relative overflow-hidden rounded-xl aspect-[4/5]"
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-semibold text-lg">{dest.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PurposeSection />

      <section className="py-16 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-heading text-3xl font-bold">Featured Trains</h2>
            <Link to="/search?mode=train" className="btn btn-ghost">
              View All <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTrains.map((train) => (
              <TransportCard key={train.id} data={train} mode="train" />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-heading text-3xl font-bold">Popular Flights</h2>
            <Link to="/search?mode=flight" className="btn btn-ghost">
              View All <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredFlights.map((flight) => (
              <TransportCard key={flight.id} data={flight} mode="flight" />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-heading text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-base-content/60">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
