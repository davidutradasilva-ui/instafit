import { Platform } from 'react-native';
import { supabase } from '../lib/supabase';
import { hasProfile } from './profile';

export type AuthDestination = 'main' | 'onboarding' | 'password';

function ensureHttpsUrl(url: string) {
  const trimmed = url.trim();

  if (!trimmed) {
    return 'https://instafit.vercel.app';
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function getEmailRedirectTo() {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return window.location.origin;
  }

  return ensureHttpsUrl(process.env.EXPO_PUBLIC_SITE_URL ?? 'https://instafit.vercel.app');
}

export async function sendEmailConfirmation(email: string) {
  return supabase.auth.signInWithOtp({
    email: email.trim().toLowerCase(),
    options: {
      shouldCreateUser: true,
      emailRedirectTo: getEmailRedirectTo(),
    },
  });
}

export async function signInWithPassword(email: string, password: string) {
  return supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
}

export async function setUserPassword(password: string) {
  return supabase.auth.updateUser({
    password,
    data: { password_set: true },
  });
}

export async function markPasswordSet() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.user_metadata?.password_set === true) {
    return;
  }

  await supabase.auth.updateUser({ data: { password_set: true } });
}

export async function getAuthDestination(options?: { passwordIsSet?: boolean }): Promise<AuthDestination> {
  if (await hasProfile()) {
    return 'main';
  }

  if (options?.passwordIsSet) {
    return 'onboarding';
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.user_metadata?.password_set === true) {
    return 'onboarding';
  }

  return 'password';
}
