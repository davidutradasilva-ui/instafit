import { Platform } from 'react-native';
import { supabase } from '../lib/supabase';

function getEmailRedirectTo() {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return window.location.origin;
  }

  return process.env.EXPO_PUBLIC_SITE_URL ?? 'https://instafit.vercel.app';
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

export async function setUserPassword(password: string) {
  return supabase.auth.updateUser({ password });
}
