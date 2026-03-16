export const STORAGE_KEYS = {
  CONSENTS: 'abhitravels_consents',
  HISTORY: 'abhitravels_consent_history',
  PURPOSES: 'abhitravels_purposes',
  USER: 'abhitravels_user',
  SUBMISSIONS: 'abhitravels_submissions',
  THEME: 'abhitravels_theme',
} as const;

export interface ConsentData {
  granted: boolean;
  purposes: { id: string; granted: boolean }[];
  timestamp: string;
  email: string;
  ip?: string;
  userAgent?: string;
  source?: string;
}

export interface UserData {
  name: string;
  email: string;
  phone: string;
  org: string;
}

export interface HistoryEntry {
  email: string;
  action: 'granted' | 'revoked' | 'updated';
  purposes: { id: string; granted: boolean }[];
  timestamp: string;
  ip?: string;
  userAgent?: string;
  source?: string;
}

export interface Submission {
  id: string;
  data: UserData & Record<string, string>;
  submittedAt: string;
}

export function getConsents(): Record<string, ConsentData> {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CONSENTS);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function setConsentForEmail(email: string, consent: ConsentData): void {
  const consents = getConsents();
  consents[email] = consent;
  localStorage.setItem(STORAGE_KEYS.CONSENTS, JSON.stringify(consents));
}

export function clearConsentForEmail(email: string): void {
  const consents = getConsents();
  delete consents[email];
  localStorage.setItem(STORAGE_KEYS.CONSENTS, JSON.stringify(consents));
}

export function getHistory(): HistoryEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addHistoryEntry(entry: HistoryEntry): void {
  const history = getHistory();
  history.push(entry);
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
}

export function getPurposes(): Record<string, boolean> {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PURPOSES);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function setPurposes(purposes: Record<string, boolean>): void {
  localStorage.setItem(STORAGE_KEYS.PURPOSES, JSON.stringify(purposes));
}

export function getUser(): UserData | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setUser(user: UserData): void {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

export function getSubmissions(): Submission[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addSubmission(submission: Submission): void {
  const submissions = getSubmissions();
  submissions.push(submission);
  localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
}

export function getTheme(): string {
  return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
}

export function setTheme(theme: string): void {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
}
