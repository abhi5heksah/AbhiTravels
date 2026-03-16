import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import ConsentBanner from '../components/ConsentBanner';
import { useConsent } from '../context/ConsentContext';

const contactSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+91\d{10}$/, 'Phone must be +91 followed by 10 digits').or(z.string().min(10).max(15)), 
  age: z.string().refine((val) => parseInt(val) >= 18, { message: 'You must be at least 18' }),
  gender: z.string().min(1, 'Please select your gender'),
  destination: z.string().min(2, 'Destination must be at least 2 characters'),
  travelDates: z.string().min(1, 'Please select travel dates'),
  details: z.string().min(10, 'Please provide more details (at least 10 characters)'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

export default function Contact() {
  const [showConsent, setShowConsent] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const { saveConsent, revokeConsent, getConsentForEmail } = useConsent();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      phone: '+91',
    },
  });

  const emailValue = watch('email');
  const fullNameValue = watch('fullName');
  const phoneValue = watch('phone');

  useEffect(() => {
    if (emailValue && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      const existingConsent = getConsentForEmail(emailValue);
      setConsentGiven(!!existingConsent?.granted);
    } else {
      setConsentGiven(false);
    }
  }, [emailValue, getConsentForEmail]);

  const handleConsentSubmit = async (selectedPurposes: { id: string; granted: boolean }[]) => {
    await saveConsent(emailValue, selectedPurposes, 'granted', 'contact_page');
    setShowConsent(false);
    setConsentGiven(true);
    toast.success('Consent saved! You can now submit your inquiry.');
  };

  const onSubmit = async (data: ContactFormData) => {
    try {
      const existingSubmissions = JSON.parse(localStorage.getItem('abhitravels_submissions') || '[]');
      const newSubmission = {
        ...data,
        submittedAt: new Date().toISOString(),
      };
      
      localStorage.setItem('abhitravels_submissions', JSON.stringify([...existingSubmissions, newSubmission]));
      
      toast.success('Thank you for your inquiry! We will get back to you soon.');
      reset();
    } catch (error) {
      toast.error('Failed to submit form. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Plan Your Dream Trip</h1>
          <p className="text-base-content/60 mt-2">
            Tell us about your travel plans and we'll craft the perfect itinerary
          </p>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              <div className="grid md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Full Name *</span>
                  </label>
                  <input
                    {...register('fullName')}
                    type="text"
                    placeholder="John Doe"
                    className={`input input-bordered ${errors.fullName ? 'input-error' : ''}`}
                  />
                  {errors.fullName && (
                    <span className="text-error text-xs mt-1">{errors.fullName.message}</span>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email *</span>
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="john@example.com"
                    className={`input input-bordered ${errors.email ? 'input-error' : ''}`}
                  />
                  {errors.email && (
                    <span className="text-error text-xs mt-1">{errors.email.message}</span>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Age *</span>
                  </label>
                  <input
                    {...register('age')}
                    type="number"
                    placeholder="25"
                    className={`input input-bordered ${errors.age ? 'input-error' : ''}`}
                  />
                  {errors.age && (
                    <span className="text-error text-xs mt-1">{errors.age.message}</span>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Phone *</span>
                  </label>
                  <input
                    {...register('phone')}
                    type="tel"
                    placeholder=""
                    className={`input input-bordered ${errors.phone ? 'input-error' : ''}`}
                  />
                  {errors.phone && (
                    <span className="text-error text-xs mt-1">{errors.phone.message}</span>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Gender *</span>
                  </label>
                  <select
                    {...register('gender')}
                    className={`select select-bordered ${errors.gender ? 'select-error' : ''}`}
                  >
                    <option value="">Select your gender</option>
                    {genderOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {errors.gender && (
                    <span className="text-error text-xs mt-1">{errors.gender.message}</span>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Destination *</span>
                  </label>
                  <input
                    {...register('destination')}
                    type="text"
                    placeholder="e.g. Paris, Tokyo, New York"
                    className={`input input-bordered ${errors.destination ? 'input-error' : ''}`}
                  />
                  {errors.destination && (
                    <span className="text-error text-xs mt-1">{errors.destination.message}</span>
                  )}
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Travel Dates *</span>
                </label>
                <input
                  {...register('travelDates')}
                  type="text"
                  placeholder="e.g. Jun 15 - Jun 25"
                  className={`input input-bordered ${errors.travelDates ? 'input-error' : ''}`}
                />
                {errors.travelDates && (
                  <span className="text-error text-xs mt-1">{errors.travelDates.message}</span>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Additional Details *</span>
                </label>
                <textarea
                  {...register('details')}
                  placeholder="Tell us about your preferred activities, accommodation type, budget, or any specific requirements..."
                  className={`textarea textarea-bordered h-24 ${errors.details ? 'textarea-error' : ''}`}
                ></textarea>
                {errors.details && (
                  <span className="text-error text-xs mt-1">{errors.details.message}</span>
                )}
              </div>
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-3 border border-base-200 bg-base-50/50 rounded-lg p-3 hover:bg-base-200/30 transition-colors">
                  <input
                    type="checkbox"
                    checked={consentGiven}
                    onChange={(e) => {
                      if (e.target.checked) {
                        if (emailValue && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
                          setShowConsent(true);
                        } else {
                          toast.error('Please enter a valid email address first');
                          e.target.checked = false;
                        }
                      } else {
                        revokeConsent(emailValue, 'contact_page');
                        setConsentGiven(false);
                      }
                    }}
                    className="checkbox checkbox-primary"
                  />
                  <span className="label-text font-medium text-sm text-base-content/70">
                    I agree to receive travel updates and communication consent *
                  </span>
                </label>
              </div>


              <button
                type="submit"
                disabled={isSubmitting || !consentGiven}
                className="btn text-white w-full border-none shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
                style={{ backgroundColor: consentGiven ? '#5c9c94' : '#a0a0a0' }}
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  'Submit Travel Inquiry'
                )}
              </button>
              
              <div className="flex justify-center items-center gap-2 text-xs text-base-content/60 mt-4">
                <span>✉️ We typically respond within 24 hours</span>
                <span>•</span>
                <span>🔒 Your data is secure and confidential</span>
              </div>
            </form>
          </div>

        </div>
      </div>

      {showConsent && (
        <ConsentBanner
          isOpen={showConsent}
          onClose={() => setShowConsent(false)}
          onSubmit={handleConsentSubmit}
          userData={{
            name: fullNameValue,
            email: emailValue,
            phone: phoneValue
          }}
        />
      )}
    </div>
  );
}
