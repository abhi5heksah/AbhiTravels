export const STORAGE_KEYS = {
  CONSENT: 'abhitravels_consent',
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
}

export interface UserData {
  name: string;
  email: string;
  phone: string;
  org: string;
}

export interface Submission {
  id: string;
  data: UserData & Record<string, string>;
  submittedAt: string;
}

export function getConsent(): ConsentData | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CONSENT);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setConsent(consent: ConsentData): void {
  localStorage.setItem(STORAGE_KEYS.CONSENT, JSON.stringify(consent));
}

export function clearConsent(): void {
  localStorage.removeItem(STORAGE_KEYS.CONSENT);
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
