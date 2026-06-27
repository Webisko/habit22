import { persistentAtom } from '@nanostores/persistent';

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  zip: string;
  companyNip?: string;
  companyName?: string;
}

const DEFAULT_PROFILE: UserProfile = {
  firstName: "Adriana",
  lastName: "Kowalska",
  email: "adriana.kowalska@example.com",
  phone: "500600700",
  street: "Miodowa 12",
  city: "Warszawa",
  zip: "00-001"
};

// Store if user is logged in, persistent
export const isLoggedIn = persistentAtom<boolean>('habit22_logged_in', false, {
  encode: (val) => String(val),
  decode: (val) => val === 'true'
});

// Store user profile info, persistent
export const userProfile = persistentAtom<UserProfile>('habit22_profile', DEFAULT_PROFILE, {
  encode: JSON.stringify,
  decode: JSON.parse
});

export function logIn(email: string) {
  isLoggedIn.set(true);
  const profile = userProfile.get();
  userProfile.set({ ...profile, email });
}

export function logOut() {
  isLoggedIn.set(false);
}

export function updateProfile(updated: Partial<UserProfile>) {
  const current = userProfile.get();
  userProfile.set({ ...current, ...updated });
}
