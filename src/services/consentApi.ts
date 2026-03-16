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

const PURPOSE_UUID_MAP: Record<string, string> = {
  'necessary': '3f6b7b58-0b2d-4e78-9d5a-2b3c7d4f9b21', // Mapping all to the provided UUID for now as requested
  'analytics': '3f6b7b58-0b2d-4e78-9d5a-2b3c7d4f9b21',
  'marketing': '3f6b7b58-0b2d-4e78-9d5a-2b3c7d4f9b21',
  'preference': '3f6b7b58-0b2d-4e78-9d5a-2b3c7d4f9b21',
  'booking_confirmations': '3f6b7b58-0b2d-4e78-9d5a-2b3c7d4f9b21',
  'price_alerts': '3f6b7b58-0b2d-4e78-9d5a-2b3c7d4f9b21',
  'personalized_recommendations': '3f6b7b58-0b2d-4e78-9d5a-2b3c7d4f9b21',
  'marketing_communications': '3f6b7b58-0b2d-4e78-9d5a-2b3c7d4f9b21',
  'third_party_promotions': '3f6b7b58-0b2d-4e78-9d5a-2b3c7d4f9b21'
};

export async function getIPAddress(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.warn('Failed to fetch IP, using fallback');
    return 'localhost';
  }
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
  consents: { purpose_id: string; granted: boolean }[],
  metadata: { source?: string; ip?: string; userAgent?: string } = {}
): Promise<boolean> {
  const ip = metadata.ip || await getIPAddress();
  const finalMetadata = { ...metadata, ip };
  if (!API_KEY || !FORM_TOKEN) {
    console.warn('API not configured, storing consent locally only');
    storeConsentLocally(subjectEmail, consents);
    return true;
  }

  try {
    // Map purpose IDs to UUIDs to avoid 500 error
    const mappedConsents = consents.map(c => ({
      purpose_id: PURPOSE_UUID_MAP[c.purpose_id] || c.purpose_id,
      granted: c.granted
    }));

    const response = await fetch(`${API_BASE}/consent`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        form_token: FORM_TOKEN,
        subject_email: subjectEmail,
        consents: mappedConsents,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to record consent');
    }

    storeConsentLocally(subjectEmail, consents, finalMetadata);
    return true;
  } catch (error) {
    console.warn('API call failed, storing consent locally:', error);
    storeConsentLocally(subjectEmail, consents, finalMetadata);
    return false;
  }
}

function storeConsentLocally(
  email: string,
  consents: { purpose_id: string; granted: boolean }[],
  metadata: { source?: string; ip?: string; userAgent?: string } = {}
): void {
  const purposes = consents.map(c => ({ id: c.purpose_id, granted: c.granted }));
  const consentData: ConsentData = {
    granted: consents.some(c => c.granted),
    purposes,
    timestamp: new Date().toISOString(),
    email,
    ...metadata
  };
  
  try {
    const consentsMap = JSON.parse(localStorage.getItem('abhitravels_consents') || '{}');
    consentsMap[email] = consentData;
    localStorage.setItem('abhitravels_consents', JSON.stringify(consentsMap));
    // Also keep the single one for backward compatibility or simple lookup if needed
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
