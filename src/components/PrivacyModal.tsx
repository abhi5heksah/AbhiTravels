import { useState, useEffect } from 'react';
import { X, Globe, Download, CheckCircle2, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useConsent } from '../context/ConsentContext';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  const { consent, purposes, saveConsent, revokeConsent } = useConsent();
  const [localPurposes, setLocalPurposes] = useState<Record<string, boolean>>({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi' | 'mr'>('en');

  const translations = {
    en: {
      title: "Privacy & Consent Management",
      description: "We use cookies to provide essential site functionality, analyze usage patterns, and deliver personalized content. You can manage your preferences or learn more about our privacy practices.",
      emailConsentRequired: "Email Communication Consent Required",
      revoke: "Revoke",
      activeConsent: "Active consent since",
      purpose: "Purpose",
      marketingUpdates: "Marketing and product updates",
      recentActivity: "Recent Activity",
      consented: "Consented",
      noConsent: "No active email consent found.",
      consentHistory: "Consent History",
      exportHistory: "Export Full History (CSV)",
      revokeConfirmTitle: "Confirm Revocation",
      revokeConfirmDesc: "Are you sure you want to revoke all consent? You will stop receiving booking updates.",
      cancel: "Cancel",
      yesRevoke: "Yes, Revoke All",
      entries: "entries",
      granted: "granted"
    },
    hi: {
      title: "गोपनीयता और सहमति प्रबंधन",
      description: "हम आवश्यक साइट कार्यक्षमता प्रदान करने, उपयोग पैटर्न का विश्लेषण करने और व्यक्तिगत सामग्री वितरित करने के लिए कुकीज़ का उपयोग करते हैं। आप अपनी प्राथमिकताओं का प्रबंधन कर सकते हैं या हमारी गोपनीयता प्रथाओं के बारे में अधिक जान सकते हैं।",
      emailConsentRequired: "ईमेल संचार सहमति आवश्यक है",
      revoke: "वापस लें",
      activeConsent: "सक्रिय सहमति तब से",
      purpose: "उद्देश्य",
      marketingUpdates: "मार्केटिंग और उत्पाद अपडेट",
      recentActivity: "हाल की गतिविधि",
      consented: "सहमति दी गई",
      noConsent: "कोई सक्रिय ईमेल सहमति नहीं मिली।",
      consentHistory: "सहमति इतिहास",
      exportHistory: "पूर्ण इतिहास निर्यात करें (CSV)",
      revokeConfirmTitle: "निरसन की पुष्टि करें",
      revokeConfirmDesc: "क्या आप वाकई सभी सहमति वापस लेना चाहते हैं? आपको बुकिंग अपडेट प्राप्त होना बंद हो जाएंगे।",
      cancel: "रद्द करें",
      yesRevoke: "हाँ, सब वापस लें",
      entries: "प्रविष्टियां",
      granted: "स्वीकृत"
    },
    mr: {
      title: "गोपनीयता आणि संमती व्यवस्थापन",
      description: "आम्ही आवश्यक साइट कार्यक्षमता प्रदान करण्यासाठी, वापर पद्धतींचे विश्लेषण करण्यासाठी आणि वैयक्तिकृत सामग्री वितरीत करण्यासाठी कुकीज वापरतो. तुम्ही तुमची प्राधान्ये व्यवस्थापित करू शकता किंवा आमच्या गोपनीयता पद्धतींबद्दल अधिक जाणून घेऊ शकता.",
      emailConsentRequired: "ईमेल संप्रेषण संमती आवश्यक आहे",
      revoke: "मागे घ्या",
      activeConsent: "पासून सक्रिय संमती",
      purpose: "उद्देश",
      marketingUpdates: "मार्केटिंग आणि उत्पादन अद्यतने",
      recentActivity: "अलीकडील क्रियाकलाप",
      consented: "संमती दिली",
      noConsent: "कोणतीही सक्रिय ईमेल संमती आढळली नाही.",
      consentHistory: "संमती इतिहास",
      exportHistory: "पूर्ण इतिहास निर्यात करा (CSV)",
      revokeConfirmTitle: "रद्द करण्याची पुष्टी करा",
      revokeConfirmDesc: "तुम्हाला खात्री आहे की तुम्ही सर्व संमती रद्द करू इच्छिता? तुम्हाला बुकिंग अपडेट मिळणे बंद होईल.",
      cancel: "रद्द करा",
      yesRevoke: "हो, सर्व मागे घ्या",
      entries: "प्रविष्टी",
      granted: "मंजूर"
    }
  };

  const t = translations[language];

  useEffect(() => {
    if (consent?.purposes) {
      const purposeStates: Record<string, boolean> = {};
      consent.purposes.forEach((p: { id: string; granted: boolean }) => {
        purposeStates[p.id] = p.granted;
      });
      setLocalPurposes(purposeStates);
    }
  }, [consent]);

  const handleToggle = async (id: string) => {
    if (id === 'necessary') return;
    const newPurposes = {
      ...localPurposes,
      [id]: !localPurposes[id],
    };
    setLocalPurposes(newPurposes);
    
    // Auto-save
    const selectedPurposes = Object.entries(newPurposes).map(([pid, granted]) => ({
      id: pid,
      granted,
    }));
    await saveConsent(consent?.email || '', selectedPurposes);
    toast.success('Preferences updated!');
  };

  const handleRevoke = () => {
    revokeConsent();
    setLocalPurposes({});
    setShowConfirmDialog(false);
    toast.success('All consent revoked');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 left-6 z-50 pointer-events-none">
      <div className="relative bg-base-100 w-[360px] max-h-[80vh] overflow-y-auto rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] pointer-events-auto flex flex-col">
        <div className="sticky top-0 bg-base-100 p-4 border-b border-base-200 flex justify-between items-start z-10">
          <div className="pr-2">
            <h2 className="font-heading text-lg font-bold leading-tight" dangerouslySetInnerHTML={{ __html: t.title.replace(' & ', ' &<br/>') }}></h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex border border-base-300 rounded-md px-2 py-1 items-center gap-1">
              <Globe className="w-3 h-3 text-base-content/70" />
              <select 
                className="bg-transparent text-xs outline-none cursor-pointer"
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'hi' | 'mr')}
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="mr">Marathi</option>
              </select>
            </div>
            <button onClick={onClose} className="btn btn-ghost btn-xs btn-circle ml-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4 flex-1">
          <p className="text-xs text-base-content/80">
            {t.description}
          </p>

          <div className="space-y-4">
            {purposes.map((purpose) => {
              const checked = localPurposes[purpose.id] || false;
              const isNecessary = purpose.id === 'necessary' || purpose.required;
              return (
              <div key={purpose.id} className="flex gap-3">
                <div className="pt-0.5">
                  {isNecessary ? (
                    <div className="text-success"><CheckCircle2 className="w-4 h-4" /></div>
                  ) : (
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs rounded-sm border-base-300"
                      style={checked ? { backgroundColor: '#0056D2', borderColor: '#0056D2' } : {}}
                      checked={checked}
                      onChange={() => handleToggle(purpose.id)}
                    />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-sm text-base-content whitespace-nowrap">
                    {purpose.name} {isNecessary && <span className="text-error">*</span>}
                  </h4>
                  <p className="text-xs text-base-content/60 leading-tight mt-0.5">{purpose.description}</p>
                </div>
              </div>
            )})}
          </div>

          <div className="mt-6">
            <h3 className="text-[13px] font-semibold mb-2">{t.emailConsentRequired} ({consent?.granted ? '1' : '0'})</h3>
            {consent?.granted && consent?.email ? (
              <div className="border border-base-200 bg-[#fbfdfd] rounded-md p-3">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-[13px]">{consent.email}</span>
                  <button 
                    onClick={() => setShowConfirmDialog(true)}
                    className="text-error text-xs font-semibold px-2 py-0.5 border border-error/30 rounded"
                  >
                    {t.revoke}
                  </button>
                </div>
                <div className="text-success text-xs flex items-center gap-1 mb-2">
                  <Check className="w-3 h-3" />
                  <span>{t.activeConsent} {new Date(consent.timestamp).toLocaleDateString()}</span>
                </div>
                <div className="text-[11px] text-base-content/70">
                  <span className="font-medium">{t.purpose}:</span> {t.marketingUpdates}
                </div>
                <div className="text-[11px] text-base-content/70 flex justify-between mt-1">
                  <span><span className="font-medium">{t.recentActivity}:</span> {t.consented}</span>
                  <span>{new Date(consent.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-base-content/60 italic">{t.noConsent}</div>
            )}
          </div>

          <div className="border-t border-base-200 mt-6 pt-4">
             <h3 className="font-medium text-[13px] mb-3">{t.consentHistory} ({Object.keys(localPurposes).filter(k => localPurposes[k]).length + (consent?.granted ? 1 : 0)} {t.entries})</h3>
             {Object.keys(localPurposes).filter(k => localPurposes[k]).map(key => (
               <div key={key} className="flex justify-between items-center text-[11px] text-base-content/70 mb-1.5">
                 <span>{t.granted} ({key})</span>
                 <span>{new Date(consent?.timestamp || Date.now()).toLocaleString()}</span>
               </div>
             ))}
             {consent?.granted && consent?.email && (
               <div className="flex justify-between items-center text-[11px] text-primary mt-2">
                 <span>Email: {consent.email}</span>
               </div>
             )}
             
             <button className="btn btn-outline btn-sm w-full mt-3 text-xs">
               <Download className="w-3 h-3 mr-1" /> {t.exportHistory}
             </button>
          </div>
        </div>
      </div>

      {showConfirmDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[100] pointer-events-auto">
          <div className="bg-base-100 p-6 rounded-2xl shadow-2xl max-w-sm mx-4">
            <h3 className="font-heading text-lg font-bold mb-3">{t.revokeConfirmTitle}</h3>
            <p className="text-base-content/70 text-sm mb-4">
              {t.revokeConfirmDesc}
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowConfirmDialog(false)} className="btn btn-ghost btn-sm">
                {t.cancel}
              </button>
              <button onClick={handleRevoke} className="btn btn-error btn-sm">
                {t.yesRevoke}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
