import { supabase } from '../lib/supabase';

export type ProfileData = {
  fullName: string;
  username: string;
  birthDate: string;
  gender: string;
  referralCode: string | null;
};

export function normalizeUsername(value: string) {
  return value
    .trim()
    .replace(/^@+/, '')
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '');
}

export async function isUsernameAvailable(username: string) {
  const normalized = normalizeUsername(username);

  if (normalized.length < 3) {
    return false;
  }

  const { data, error } = await supabase.rpc('is_username_available', {
    check_username: normalized,
  });

  if (error) {
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', normalized)
      .maybeSingle();

    return !existing;
  }

  return Boolean(data);
}

export async function saveProfile(profile: ProfileData) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: { message: 'Usuário não autenticado.' } };
  }

  const [day, month, year] = profile.birthDate.split('/');
  const isoDate = `${year}-${month}-${day}`;

  return supabase.from('profiles').insert({
    id: user.id,
    full_name: profile.fullName.trim(),
    username: normalizeUsername(profile.username),
    birth_date: isoDate,
    gender: profile.gender.trim(),
    referral_code: profile.referralCode,
  });
}

export async function hasProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  const { data } = await supabase
    .from('profiles')
    .select('id, full_name, username')
    .eq('id', user.id)
    .maybeSingle();

  return Boolean(data?.full_name?.trim() && data?.username?.trim());
}
