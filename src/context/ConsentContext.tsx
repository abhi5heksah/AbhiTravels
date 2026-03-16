import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { 
  getConsent, 
   
  clearConsent as removeConsent,
  getPurposes,
  setPurposes as savePurposes,
  type ConsentData,
  getTheme,
  setTheme as saveTheme
} from '../services/localStorage';
import { loadFormPurposes, recordConsent, type Purpose } from '../services/consentApi';

interface ConsentContextType {
  consent: ConsentData | null;
  purposes: Purpose[];
  userPurposes: Record<string, boolean>;
  theme: string;
  setUserPurposes: (purposes: Record<string, boolean>) => void;
  saveConsent: (email: string, purposes: { id: string; granted: boolean }[]) => Promise<void>;
  revokeConsent: () => void;
  setTheme: (theme: string) => void;
  hasConsent: () => boolean;
}

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsentState] = useState<ConsentData | null>(null);
  const [purposes, setPurposes] = useState<Purpose[]>([]);
  const [userPurposes, setUserPurposesState] = useState<Record<string, boolean>>({});
  const [theme, setThemeState] = useState<string>('light');

  useEffect(() => {
    setConsentState(getConsent());
    setUserPurposesState(getPurposes());
    setThemeState(getTheme());
    
    loadFormPurposes().then(setPurposes).catch(() => {});
  }, []);

  const handleSetUserPurposes = (purposes: Record<string, boolean>) => {
    setUserPurposesState(purposes);
    savePurposes(purposes);
  };

  const handleSaveConsent = async (email: string, consentPurposes: { id: string; granted: boolean }[]) => {
    const apiPurposes = consentPurposes.map(p => ({ purpose_id: p.id, granted: p.granted }));
    await recordConsent(email, apiPurposes);
    setConsentState(getConsent());
  };

  const handleRevokeConsent = () => {
    removeConsent();
    setConsentState(null);
  };

  const handleSetTheme = (newTheme: string) => {
    setThemeState(newTheme);
    saveTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const hasConsent = () => {
    return consent !== null && consent.granted;
  };

  return (
    <ConsentContext.Provider value={{
      consent,
      purposes,
      userPurposes,
      theme,
      setUserPurposes: handleSetUserPurposes,
      saveConsent: handleSaveConsent,
      revokeConsent: handleRevokeConsent,
      setTheme: handleSetTheme,
      hasConsent,
    }}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error('useConsent must be used within a ConsentProvider');
  }
  return context;
}
