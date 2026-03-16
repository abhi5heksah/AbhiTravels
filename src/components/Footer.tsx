import { Link } from 'react-router-dom';
import { Plane, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-base-200 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Plane className="text-primary w-8 h-8" />
              <span className="font-heading text-2xl font-bold text-primary">AbhiTravels</span>
            </div>
            <p className="text-base-content/70 mb-4">
              Your trusted partner for seamless travel bookings. Explore the world with comfort and convenience.
            </p>
            <div className="flex gap-4">
              <a href="#" className="btn btn-ghost btn-circle btn-sm">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="btn btn-ghost btn-circle btn-sm">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="btn btn-ghost btn-circle btn-sm">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="btn btn-ghost btn-circle btn-sm">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-heading text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/search?mode=train" className="hover:text-primary transition-colors">Search Flights</Link></li>
              <li><Link to="/search?mode=bus" className="hover:text-primary transition-colors">Search Buses</Link></li>
              <li><Link to="/search?mode=cab" className="hover:text-primary transition-colors">Book Cabs</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>123 Travel Street, Mumbai, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>support@abhitravels.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-base-300 mt-8 pt-8 text-center">
          <p className="text-base-content/60">
            © {new Date().getFullYear()} AbhiTravels. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
