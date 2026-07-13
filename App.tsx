import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import EmailLoginScreen from './src/screens/EmailLoginScreen';
import EmailVerificationScreen from './src/screens/EmailVerificationScreen';
import CreatePasswordScreen from './src/screens/CreatePasswordScreen';
import { sendEmailConfirmation, setUserPassword } from './src/services/auth';
import { isSupabaseConfigured, supabase } from './src/lib/supabase';
import { getAuthErrorMessage } from './src/utils/authError';

type Screen = 'login' | 'verification' | 'password' | 'done';
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

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setScreen('password');
      }
      setCheckingSession(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setScreen('password');
        setMessage('');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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
          onEmailChange={setEmail}
          onContinue={handleSendConfirmation}
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
      {screen === 'done' && (
        <View style={styles.doneContainer}>
          <Text style={styles.doneTitle}>Conta criada!</Text>
          <Text style={styles.doneSubtitle}>Bem-vindo ao InstaFit.</Text>
        </View>
      )}
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
  doneContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  doneTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  doneSubtitle: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
  },
});
