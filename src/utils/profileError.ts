export function getProfileErrorMessage(error: unknown, fallback: string) {
  if (!error || typeof error !== 'object') {
    return fallback;
  }

  const profileError = error as {
    message?: string;
    code?: string;
    details?: string;
  };

  const message = profileError.message?.trim() || profileError.details?.trim();

  if (!message) {
    return fallback;
  }

  if (message.includes("Could not find the table 'public.profiles'")) {
    return 'A tabela de perfis não foi criada no Supabase. Execute o SQL em supabase/profiles.sql no painel do Supabase.';
  }

  if (message.includes('duplicate key') && message.includes('profiles_username_unique')) {
    return 'Esse username já está em uso. Escolha outro.';
  }

  if (message.includes('duplicate key') && message.includes('profiles_pkey')) {
    return 'Seu perfil já foi criado. Faça login novamente para ir ao feed.';
  }

  return message;
}
