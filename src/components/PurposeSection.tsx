import { useState } from 'react';
import { Bell, Mail, MapPin, Lock, BarChart3, Target } from 'lucide-react';
import toast from 'react-hot-toast';
import { useConsent } from '../context/ConsentContext';

const purposeIcons: Record<string, React.ReactNode> = {
  'price_alerts': <Bell className="w-6 h-6" />,
  'marketing_communications': <Mail className="w-6 h-6" />,
  'personalized_recommendations': <MapPin className="w-6 h-6" />,
  'booking_confirmations': <Lock className="w-6 h-6" />,
  'analytics': <BarChart3 className="w-6 h-6" />,
  'third_party_promotions': <Target className="w-6 h-6" />,
};

const purposeLabels: Record<string, string> = {
  'price_alerts': 'Price Drop Alerts',
  'marketing_communications': 'Email Offers & Deals',
  'personalized_recommendations': 'Personalized Recommendations',
  'booking_confirmations': 'Secure Booking Updates',
  'analytics': 'Usage Analytics',
  'third_party_promotions': 'Targeted Promotions',
};

const purposeDescriptions: Record<string, string> = {
  'price_alerts': 'Get notified when fares drop',
  'marketing_communications': 'Receive exclusive travel deals',
  'personalized_recommendations': 'Based on your travel history',
  'booking_confirmations': 'Booking confirmations & changes',
  'analytics': 'Help us improve our service',
  'third_party_promotions': 'Personalized ads based on preferences',
};

export default function PurposeSection() {
  const { userPurposes, setUserPurposes } = useConsent();
  const [localPurposes, setLocalPurposes] = useState<Record<string, boolean>>(
    userPurposes || {}
  );

  const handleToggle = (id: string) => {
    if (id === 'booking_confirmations') return;
    setLocalPurposes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSave = () => {
    setUserPurposes(localPurposes);
    toast.success('Preferences saved successfully!');
  };

  const purposes = [
    'price_alerts',
    'marketing_communications',
    'personalized_recommendations',
    'booking_confirmations',
    'analytics',
    'third_party_promotions',
  ];

  return (
    <section className="py-16 bg-base-200">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-3xl font-bold text-center mb-4">Why AbhiTravels?</h2>
        <p className="text-center text-base-content/70 mb-12 max-w-2xl mx-auto">
          Choose how you want to stay informed about your travel bookings
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {purposes.map((id) => (
            <div
              key={id}
              className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {purposeIcons[id]}
                    </div>
                    <div>
                      <h3 className="font-semibold">{purposeLabels[id]}</h3>
                      <p className="text-sm text-base-content/60">
                        {purposeDescriptions[id]}
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={id === 'booking_confirmations' ? true : localPurposes[id] || false}
                    disabled={id === 'booking_confirmations'}
                    onChange={() => handleToggle(id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button onClick={handleSave} className="btn btn-primary">
            Save Preferences
          </button>
        </div>
      </div>
    </section>
  );
}
