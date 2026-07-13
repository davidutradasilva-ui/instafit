import { supabase } from '../lib/supabase';

export async function sendEmailOtp(email: string) {
  return supabase.auth.signInWithOtp({
    email: email.trim().toLowerCase(),
    options: {
      shouldCreateUser: true,
    },
  });
}

export async function verifyEmailOtp(email: string, token: string) {
  return supabase.auth.verifyOtp({
    email: email.trim().toLowerCase(),
    token,
    type: 'email',
  });
}

export async function setUserPassword(password: string) {
  return supabase.auth.updateUser({ password });
}
