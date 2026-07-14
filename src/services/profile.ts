import { supabase } from '../lib/supabase';

export type ProfileData = {
  fullName: string;
  username: string;
  birthDate: string;
  gender: string;
  referralCode: string | null;
};

type UsernameAvailability = {
  available: boolean;
  error?: string;
};

function hasMetadataProfile(user: { user_metadata?: Record<string, unknown> }) {
  const metadata = user.user_metadata ?? {};
  const fullName = typeof metadata.full_name === 'string' ? metadata.full_name.trim() : '';
  const username = typeof metadata.username === 'string' ? metadata.username.trim() : '';

  return metadata.profile_complete === true && Boolean(fullName && username);
}

export function normalizeUsername(value: string) {
  return value
    .trim()
    .replace(/^@+/, '')
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '');
}

export async function isUsernameAvailable(username: string): Promise<UsernameAvailability> {
  const normalized = normalizeUsername(username);

  if (normalized.length < 3) {
    return { available: false };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: ownProfile, error: ownProfileError } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user?.id ?? '')
    .maybeSingle();

  if (!ownProfileError && ownProfile?.username === normalized) {
    return { available: true };
  }

  const { data, error } = await supabase.rpc('is_username_available', {
    check_username: normalized,
  });

  if (error) {
    return {
      available: false,
      error: error.message,
    };
  }

  return { available: Boolean(data) };
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
  const normalizedUsername = normalizeUsername(profile.username);
  const fullName = profile.fullName.trim();

  const { error: profileError } = await supabase.from('profiles').upsert(
    {
      id: user.id,
      full_name: fullName,
      username: normalizedUsername,
      birth_date: isoDate,
      gender: profile.gender.trim(),
      referral_code: profile.referralCode,
    },
    { onConflict: 'id' }
  );

  if (profileError) {
    return { error: profileError };
  }

  const { error: metadataError } = await supabase.auth.updateUser({
    data: {
      profile_complete: true,
      full_name: fullName,
      username: normalizedUsername,
    },
  });

  if (metadataError) {
    return { error: metadataError };
  }

  return { error: null };
}

export async function hasProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, username')
    .eq('id', user.id)
    .maybeSingle();

  if (!error && data?.full_name?.trim() && data?.username?.trim()) {
    return true;
  }

  return hasMetadataProfile(user);
}
