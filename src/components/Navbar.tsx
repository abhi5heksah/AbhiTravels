import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Plane } from 'lucide-react';
import { useConsent } from '../context/ConsentContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const {} = useConsent();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/search?mode=train', label: 'Search' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname + location.search.startsWith(path.split('?')[0]);
  };

  return (
    <nav className="navbar bg-base-100 shadow-md px-4 lg:px-8 sticky top-0 z-50">
      <div className="flex-1">
        <Link to="/" className="flex items-center gap-2">
          <Plane className="text-primary w-8 h-8" />
          <span className="font-heading text-2xl font-bold text-primary">AbhiTravels</span>
        </Link>
      </div>

      <div className="hidden lg:flex items-center gap-6">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`font-medium hover:text-primary transition-colors ${
              isActive(link.path) ? 'text-primary' : ''
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="lg:hidden flex items-center gap-2">
       
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="btn btn-ghost btn-circle"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-base-100 shadow-lg p-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`font-medium hover:text-primary transition-colors ${
                isActive(link.path) ? 'text-primary' : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
