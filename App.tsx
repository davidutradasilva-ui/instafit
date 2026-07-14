import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import EmailLoginScreen from './src/screens/EmailLoginScreen';
import EmailVerificationScreen from './src/screens/EmailVerificationScreen';
import CreatePasswordScreen from './src/screens/CreatePasswordScreen';
import AccountCreatedScreen from './src/screens/AccountCreatedScreen';
import OnboardingChatScreen from './src/screens/OnboardingChatScreen';
import MainAppScreen from './src/screens/MainAppScreen';
import {
  getAuthDestination,
  markPasswordSet,
  sendEmailConfirmation,
  setUserPassword,
  signInWithPassword,
} from './src/services/auth';
import { isSupabaseConfigured, supabase } from './src/lib/supabase';
import { getAuthErrorMessage } from './src/utils/authError';

type Screen = 'login' | 'verification' | 'password' | 'done' | 'onboarding' | 'main' | 'complete';
type MessageType = 'error' | 'success' | 'info';

export default function App() {
  const [screen, setScreen] = useState<Screen>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<MessageType>('error');

  const showMessage = (text: string, type: MessageType = 'error') => {
    setMessage(text);
    setMessageType(type);

    if (Platform.OS !== 'web') {
      Alert.alert(type === 'error' ? 'Atenção' : 'Sucesso', text);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setCheckingSession(false);
      showMessage(
        'Supabase não configurado na Vercel. Adicione EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY.',
        'error'
      );
      return;
    }

    const initSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        const destination = await getAuthDestination();
        setScreen(destination);
      }

      setCheckingSession(false);
    };

    initSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setScreen((current) => {
          if (current === 'verification') {
            return 'password';
          }
          return current;
        });
        setMessage('');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignIn = async () => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!isSupabaseConfigured) {
      showMessage('Configure as variáveis do Supabase na Vercel antes de continuar.');
      return;
    }

    if (!trimmedEmail.includes('@')) {
      showMessage('Digite um e-mail válido para continuar.');
      return;
    }

    if (password.length < 6) {
      showMessage('Digite sua senha para entrar.');
      return;
    }

    setMessage('');
    setLoading(true);

    try {
      const { error } = await signInWithPassword(trimmedEmail, password);
      if (error) {
        showMessage(`Erro ao entrar: ${getAuthErrorMessage(error, 'E-mail ou senha incorretos.')}`);
        return;
      }

      await markPasswordSet();
      const destination = await getAuthDestination({ passwordIsSet: true });
      setScreen(destination);
      setMessage('');
    } catch {
      showMessage('Não foi possível entrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendConfirmation = async () => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!isSupabaseConfigured) {
      showMessage('Configure as variáveis do Supabase na Vercel antes de continuar.');
      return;
    }

    if (!trimmedEmail.includes('@')) {
      showMessage('Digite um e-mail válido para continuar.');
      return;
    }

    setMessage('');
    setLoading(true);

    try {
      const { error } = await sendEmailConfirmation(trimmedEmail);
      if (error) {
        showMessage(
          `Erro ao enviar e-mail: ${getAuthErrorMessage(error, 'Não foi possível enviar o e-mail.')}`
        );
        return;
      }

      setEmail(trimmedEmail);
      setScreen('verification');
      showMessage('E-mail enviado! Confira sua caixa de entrada.', 'success');
    } catch {
      showMessage('Não foi possível enviar o e-mail. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckConfirmation = async () => {
    setMessage('');
    setLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        showMessage('Confirme seu e-mail clicando no link que enviamos antes de continuar.');
        return;
      }

      setScreen('password');
      showMessage('E-mail confirmado! Agora crie sua senha.', 'success');
    } catch {
      showMessage('Não foi possível verificar a confirmação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    setMessage('');
    setLoading(true);

    try {
      const { error } = await sendEmailConfirmation(email);
      if (error) {
        showMessage(
          `Erro ao reenviar: ${getAuthErrorMessage(error, 'Não foi possível reenviar o e-mail.')}`
        );
        return;
      }

      showMessage('E-mail de confirmação reenviado.', 'success');
    } catch {
      showMessage('Não foi possível reenviar o e-mail.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetPassword = async () => {
    if (password.length < 6) {
      showMessage('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setMessage('');
    setLoading(true);

    try {
      const { error } = await setUserPassword(password);
      if (error) {
        showMessage(`Erro ao criar senha: ${getAuthErrorMessage(error, 'Não foi possível salvar a senha.')}`);
        return;
      }

      setScreen('done');
      setMessage('');
    } catch {
      showMessage('Não foi possível criar a senha. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <SafeAreaProvider>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#fff" size="large" />
        </View>
        <StatusBar style="light" />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      {screen === 'login' && (
        <EmailLoginScreen
          email={email}
          password={password}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onContinue={handleSendConfirmation}
          onLogin={handleSignIn}
          loading={loading}
          message={message}
          messageType={messageType}
        />
      )}
      {screen === 'verification' && (
        <EmailVerificationScreen
          email={email}
          onBack={() => {
            setScreen('login');
            setMessage('');
          }}
          onContinue={handleCheckConfirmation}
          onResend={handleResendConfirmation}
          loading={loading}
          message={message}
          messageType={messageType}
        />
      )}
      {screen === 'password' && (
        <CreatePasswordScreen
          password={password}
          onPasswordChange={setPassword}
          onBack={() => {
            setScreen('verification');
            setMessage('');
          }}
          onContinue={handleSetPassword}
          loading={loading}
          message={message}
          messageType={messageType}
        />
      )}
      {screen === 'done' && <AccountCreatedScreen onContinue={() => setScreen('onboarding')} />}
      {screen === 'onboarding' && <OnboardingChatScreen onComplete={() => setScreen('main')} />}
      {screen === 'main' && <MainAppScreen />}
      {screen === 'complete' && <MainAppScreen />}
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
