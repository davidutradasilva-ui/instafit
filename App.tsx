import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import EmailLoginScreen from './src/screens/EmailLoginScreen';
import EmailVerificationScreen from './src/screens/EmailVerificationScreen';
import CreatePasswordScreen from './src/screens/CreatePasswordScreen';
import { sendEmailOtp, setUserPassword, verifyEmailOtp } from './src/services/auth';
import { supabase } from './src/lib/supabase';

type Screen = 'login' | 'verification' | 'password' | 'done';

export default function App() {
  const [screen, setScreen] = useState<Screen>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setScreen('done');
      }
      setCheckingSession(false);
    });
  }, []);

  const handleSendOtp = async () => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail.includes('@')) {
      Alert.alert('E-mail inválido', 'Digite um e-mail válido para continuar.');
      return;
    }

    setLoading(true);
    const { error } = await sendEmailOtp(trimmedEmail);
    setLoading(false);

    if (error) {
      Alert.alert('Erro ao enviar código', error.message);
      return;
    }

    setEmail(trimmedEmail);
    setScreen('verification');
  };

  const handleVerifyOtp = async (code: string) => {
    if (code.length !== 6) {
      Alert.alert('Código incompleto', 'Digite os 6 dígitos enviados para seu e-mail.');
      return;
    }

    setLoading(true);
    const { error } = await verifyEmailOtp(email, code);
    setLoading(false);

    if (error) {
      Alert.alert('Código inválido', error.message);
      return;
    }

    setScreen('password');
  };

  const handleResendOtp = async () => {
    setLoading(true);
    const { error } = await sendEmailOtp(email);
    setLoading(false);

    if (error) {
      Alert.alert('Erro ao reenviar', error.message);
      return;
    }

    Alert.alert('Código reenviado', 'Enviamos um novo código para seu e-mail.');
  };

  const handleSetPassword = async () => {
    if (password.length < 6) {
      Alert.alert('Senha fraca', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);
    const { error } = await setUserPassword(password);
    setLoading(false);

    if (error) {
      Alert.alert('Erro ao criar senha', error.message);
      return;
    }

    setScreen('done');
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
          onContinue={handleSendOtp}
          loading={loading}
        />
      )}
      {screen === 'verification' && (
        <EmailVerificationScreen
          email={email}
          onBack={() => setScreen('login')}
          onContinue={handleVerifyOtp}
          onResend={handleResendOtp}
          loading={loading}
        />
      )}
      {screen === 'password' && (
        <CreatePasswordScreen
          password={password}
          onPasswordChange={setPassword}
          onBack={() => setScreen('verification')}
          onContinue={handleSetPassword}
          loading={loading}
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
