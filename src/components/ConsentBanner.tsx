import { useState } from 'react';
import { X, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import { useConsent } from '../context/ConsentContext';


interface ConsentBannerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (selectedPurposes: { id: string; granted: boolean }[]) => void;
  userData: {
    name: string;
    email: string;
    phone: string;
    age?: string;
    gender?: string;
  };
}

export default function ConsentBanner({ isOpen, onClose, onSubmit, userData }: ConsentBannerProps) {
  const { purposes } = useConsent();
  const [language, setLanguage] = useState<'en' | 'hi' | 'mr'>('en');

  const translations = {
    en: {
      title: "Email Communication Consent Required",
      description: "We need your consent to send you information about our data management solutions and pricing. This helps us provide you with relevant updates and personalized recommendations for your specific needs.",
      dataProcessed: "Data to be processed with your consent:",
      fields: {
        name: "Full Name",
        email: "Email Address",
        age: "Age",
        gender: "Gender",
        phone: "Phone Number"
      },
      warning: "You can manage or withdraw this consent anytime from the privacy settings.",
      decline: "Decline",
      acceptAll: "Accept All",
      notProvided: "Not provided"
    },
    hi: {
      title: "ईमेल संचार सहमति आवश्यक है",
      description: "हमें आपको हमारे डेटा प्रबंधन समाधानों और मूल्य निर्धारण के बारे में जानकारी भेजने के लिए आपकी सहमति की आवश्यकता है। यह आपकी विशिष्ट आवश्यकताओं के लिए प्रासंगिक अपडेट और व्यक्तिगत अनुशंसाएँ प्रदान करने में हमारी सहायता करता है।",
      dataProcessed: "आपकी सहमति से संसाधित किया जाने वाला डेटा:",
      fields: {
        name: "पूरा नाम",
        email: "ईमेल पता",
        age: "आयु",
        gender: "लिंग",
        phone: "फ़ोन नंबर"
      },
      warning: "आप किसी भी समय गोपनीयता सेटिंग्स से इस सहमति को प्रबंधित या वापस ले सकते हैं।",
      decline: "अस्वीकार करें",
      acceptAll: "सभी स्वीकार करें",
      notProvided: "प्रदान नहीं किया गया"
    },
    mr: {
      title: "ईमेल संप्रेषण संमती आवश्यक आहे",
      description: "आम्हाला तुम्हाला आमच्या डेटा व्यवस्थापन उपायांबद्दल आणि किंमतींबद्दल माहिती पाठवण्यासाठी तुमच्या संमतीची आवश्यकता आहे. हे आम्हाला तुमच्या विशिष्ट गरजांसाठी संबंधित अद्यतने आणि वैयक्तिकृत शिफारसी प्रदान करण्यात मदत करते.",
      dataProcessed: "तुमच्या संमतीने प्रक्रिया करायचा डेटा:",
      fields: {
        name: "पूर्ण नाव",
        email: "ईमेल पत्ता",
        age: "वय",
        gender: "लिंग",
        phone: "फोन नंबर"
      },
      warning: "तुम्ही गोपनीयता सेटिंग्जमधून कधीही ही संमती व्यवस्थापित करू शकता किंवा मागे घेऊ शकता.",
      decline: "नाकारा",
      acceptAll: "सर्व स्वीकारा",
      notProvided: "दिले नाही"
    }
  };

  const t = translations[language as keyof typeof translations];

  if (!isOpen) return null;

  const handleAcceptAll = async () => {
    // Use purposes from context (which come from ARCompli API if possible)
    const allSelected = purposes.map((p) => ({
      id: p.id,
      granted: true,
    }));
    onSubmit(allSelected);
    toast.success(language === 'en' ? 'Consent accepted! Thank you.' : (language === 'hi' ? 'सहमति स्वीकार कर ली गई! धन्यवाद।' : 'संमती स्वीकारली! धन्यवाद.'));
  };

  const handleDecline = () => {
    onClose();
    toast.error(language === 'en' ? 'You declined consent. We cannot process your request.' : (language === 'hi' ? 'आपने सहमति अस्वीकार कर दी। हम आपके अनुरोध पर कार्रवाई नहीं कर सकते।' : 'तुम्ही संमती नाकारली.आम्ही तुमच्या विनंतीवर प्रक्रिया करू शकत नाही.'));
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-base-100 shadow-[0_-8px_30px_rgba(0,0,0,0.1)] border-t-[3px] border-primary animate-slide-up">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-6 justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-heading text-lg font-bold flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                {t.title}
              </h2>
              <div className="lg:hidden">
                <select
                  className="select select-bordered select-sm"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'en' | 'hi' | 'mr')}
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="mr">Marathi</option>
                </select>
              </div>
            </div>
            <p className="text-base-content/80 text-sm mb-4">
              {t.description}
            </p>

            <div className="bg-base-200 rounded-lg p-4 mb-4 lg:w-3/4">
              <h3 className="font-semibold text-sm mb-2">{t.dataProcessed}</h3>
              <ul className="space-y-1 text-xs">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>{t.fields.name}: <strong>{userData.name || t.notProvided}</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>{t.fields.email}: <strong>{userData.email || t.notProvided}</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>{t.fields.age}: <strong>{userData.age || t.notProvided}</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>{t.fields.gender}: <strong>{userData.gender || t.notProvided}</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>{t.fields.phone}: <strong>{userData.phone || t.notProvided}</strong></span>
                </li>
              </ul>
            </div>

            <div className="flex items-center gap-2 text-xs text-base-content/60">
              <span className="text-warning">⚠️</span>
              {t.warning}
            </div>
          </div>

          <div className="flex flex-col justify-between items-end gap-4 min-w-[200px]">
            <div className="hidden lg:block">
              <select
                className="select select-bordered select-sm rounded-full"
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'hi' | 'mr')}
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="mr">Marathi</option>
              </select>
            </div>
            
            <div className="flex items-center gap-3">
              <button onClick={handleDecline} className="btn btn-outline btn-sm rounded-full px-6">
                {t.decline}
              </button>
              <button 
                onClick={handleAcceptAll} 
                className="btn btn-sm text-white rounded-full px-6 border-none"
                style={{ backgroundColor: '#13cbb2' }}
              >
                {t.acceptAll}
              </button>
              <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle ml-2">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
