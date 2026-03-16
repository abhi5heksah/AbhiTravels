import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { 
  getConsents, 
  getPurposes,
  setPurposes as savePurposes,
  getHistory,
  addHistoryEntry,
  type ConsentData,
  type HistoryEntry,
  getTheme,
  setTheme as saveTheme
} from '../services/localStorage';
import { 
  loadFormPurposes, 
  recordConsent, 
  getIPAddress,
  type Purpose 
} from '../services/consentApi';

interface ConsentContextType {
  consents: Record<string, ConsentData>;
  history: HistoryEntry[];
  purposes: Purpose[];
  userPurposes: Record<string, boolean>;
  theme: string;
  setUserPurposes: (purposes: Record<string, boolean>) => void;
  saveConsent: (email: string, purposes: { id: string; granted: boolean }[], action?: 'granted' | 'revoked' | 'updated', source?: string) => Promise<void>;
  revokeConsent: (email: string, source?: string) => void;
  setTheme: (theme: string) => void;
  hasConsent: (email: string) => boolean;
  getConsentForEmail: (email: string) => ConsentData | null;
}

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consents, setConsentsState] = useState<Record<string, ConsentData>>({});
  const [history, setHistoryState] = useState<HistoryEntry[]>([]);
  const [purposes, setPurposes] = useState<Purpose[]>([]);
  const [userPurposes, setUserPurposesState] = useState<Record<string, boolean>>({});
  const [theme, setThemeState] = useState<string>('light');

  useEffect(() => {
    setConsentsState(getConsents());
    setHistoryState(getHistory());
    setUserPurposesState(getPurposes());
    setThemeState(getTheme());
    
    loadFormPurposes().then(setPurposes).catch(() => {});
  }, []);

  const handleSetUserPurposes = (purposes: Record<string, boolean>) => {
    setUserPurposesState(purposes);
    savePurposes(purposes);
  };

  const handleSaveConsent = async (
    email: string, 
    consentPurposes: { id: string; granted: boolean }[],
    action: 'granted' | 'revoked' | 'updated' = 'granted',
    source: string = 'web'
  ) => {
    const ip = await getIPAddress();
    const userAgent = navigator.userAgent;
    const metadata = { ip, userAgent, source };

    const apiPurposes = consentPurposes.map(p => ({ purpose_id: p.id, granted: p.granted }));
    await recordConsent(email, apiPurposes, metadata);
    
    // Create history entry
    const entry: HistoryEntry = {
      email,
      action,
      purposes: consentPurposes,
      timestamp: new Date().toISOString(),
      ...metadata
    };
    addHistoryEntry(entry);
    
    // Update local storage via the API service's implicit local storage keep, 
    // but we also need to update our plural consents map.
    const updatedConsents = getConsents();
    setConsentsState(updatedConsents);
    setHistoryState(getHistory());
  };

  const handleRevokeConsent = (email: string, source: string = 'web') => {
    const existing = consents[email];
    const revokePurposes = existing 
      ? existing.purposes.map(p => ({ ...p, granted: false }))
      : purposes.map(p => ({ id: p.id, granted: false }));
      
    handleSaveConsent(email, revokePurposes, 'revoked', source);
  };

  const handleSetTheme = (newTheme: string) => {
    setThemeState(newTheme);
    saveTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const hasConsent = (email: string) => {
    const c = consents[email];
    return c !== undefined && c.granted;
  };

  const getConsentForEmail = (email: string) => {
    return consents[email] || null;
  };

  return (
    <ConsentContext.Provider value={{
      consents,
      history,
      purposes,
      userPurposes,
      theme,
      setUserPurposes: handleSetUserPurposes,
      saveConsent: handleSaveConsent,
      revokeConsent: handleRevokeConsent,
      setTheme: handleSetTheme,
      hasConsent,
      getConsentForEmail,
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
