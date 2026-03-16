import type { ConsentData } from './localStorage';

const API_BASE = 'https://arcompli.com/api/v1';
const API_KEY = import.meta.env.VITE_ARC_API_KEY || '';
const FORM_TOKEN = import.meta.env.VITE_ARC_FORM_TOKEN || '';

export interface Purpose {
  id: string;
  name: string;
  description: string;
  required?: boolean;
  locked?: boolean;
}

export async function loadFormPurposes(): Promise<Purpose[]> {
  if (!FORM_TOKEN) {
    console.warn('Form token not configured, using fallback purposes');
    return getFallbackPurposes();
  }

  try {
    const response = await fetch(`${API_BASE}/forms/${FORM_TOKEN}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to load purposes');
    }
    
    const data = await response.json();
    return data.purposes || getFallbackPurposes();
  } catch (error) {
    console.warn('API call failed, using fallback purposes:', error);
    return getFallbackPurposes();
  }
}

export async function recordConsent(
  subjectEmail: string,
  consents: { purpose_id: string; granted: boolean }[]
): Promise<boolean> {
  if (!API_KEY || !FORM_TOKEN) {
    console.warn('API not configured, storing consent locally only');
    storeConsentLocally(subjectEmail, consents);
    return true;
  }

  try {
    const response = await fetch(`${API_BASE}/consent`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        form_token: FORM_TOKEN,
        subject_email: subjectEmail,
        consents,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to record consent');
    }

    storeConsentLocally(subjectEmail, consents);
    return true;
  } catch (error) {
    console.warn('API call failed, storing consent locally:', error);
    storeConsentLocally(subjectEmail, consents);
    return false;
  }
}

function storeConsentLocally(
  email: string,
  consents: { purpose_id: string; granted: boolean }[]
): void {
  const purposes = consents.map(c => ({ id: c.purpose_id, granted: c.granted }));
  const consentData: ConsentData = {
    granted: consents.some(c => c.granted),
    purposes,
    timestamp: new Date().toISOString(),
    email,
  };
  
  try {
    localStorage.setItem('abhitravels_consent', JSON.stringify(consentData));
  } catch {
    console.error('Failed to store consent');
  }
}

function getFallbackPurposes(): Purpose[] {
  return [
    { id: 'necessary', name: 'Necessary Cookies', description: 'Required for basic site functionality', required: true, locked: true },
    { id: 'analytics', name: 'Analytics Cookies', description: 'Help us understand how you use our site', required: false },
    { id: 'marketing', name: 'Marketing Cookies', description: 'Used for targeted advertising and promotions', required: false },
    { id: 'preference', name: 'Preference Cookies', description: 'Remember your settings and preferences', required: false },
  ];
}
