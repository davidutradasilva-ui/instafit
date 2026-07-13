export function getAuthErrorMessage(error: unknown, fallback: string) {
  if (!error || typeof error !== 'object') {
    return fallback;
  }

  const authError = error as {
    message?: string;
    msg?: string;
    error_description?: string;
    code?: string | number;
  };

  const message =
    authError.message?.trim() ||
    authError.msg?.trim() ||
    authError.error_description?.trim();

  if (message && message !== '{}') {
    if (message.toLowerCase().includes('error sending magic link email')) {
      return 'Falha ao enviar o e-mail. Verifique o SMTP no Supabase ou desative o SMTP personalizado.';
    }

    return message;
  }

  if (authError.code) {
    return `${fallback} (código ${authError.code})`;
  }

  return fallback;
}
