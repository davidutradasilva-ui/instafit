import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthMessage from '../components/AuthMessage';

type AuthMode = 'signup' | 'login';

type EmailLoginScreenProps = {
  email: string;
  password: string;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onContinue: () => void;
  onLogin: () => void;
  loading?: boolean;
  message?: string;
  messageType?: 'error' | 'success' | 'info';
};

export default function EmailLoginScreen({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onContinue,
  onLogin,
  loading = false,
  message = '',
  messageType = 'error',
}: EmailLoginScreenProps) {
  const [mode, setMode] = useState<AuthMode>('signup');

  const toggleMode = () => {
    setMode((current) => (current === 'signup' ? 'login' : 'signup'));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableOpacity style={styles.closeButton} accessibilityLabel="Fechar">
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.emailSection}>
          <Text style={styles.title}>{mode === 'signup' ? 'Qual seu Email?' : 'Entrar'}</Text>
          <TextInput
            style={styles.emailInput}
            value={email}
            onChangeText={onEmailChange}
            placeholder="seu@email.com"
            placeholderTextColor="#555"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            underlineColorAndroid="transparent"
          />

          {mode === 'login' && (
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={onPasswordChange}
              placeholder="Sua senha"
              placeholderTextColor="#555"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              underlineColorAndroid="transparent"
            />
          )}

          <TouchableOpacity onPress={toggleMode} accessibilityLabel="Alternar modo">
            <Text style={styles.modeLink}>
              {mode === 'signup' ? 'Já tem uma conta? Entrar' : 'Não tem conta? Cadastre-se'}
            </Text>
          </TouchableOpacity>

          <AuthMessage message={message} type={messageType} />
        </View>

        {mode === 'signup' && (
          <View style={styles.socialSection}>
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Ou entre usando</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialButtonsRow}>
              <TouchableOpacity style={styles.socialButton} accessibilityLabel="Entrar com Google">
                <Ionicons name="logo-google" size={22} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} accessibilityLabel="Entrar com Apple">
                <Ionicons name="logo-apple" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {mode === 'login' && <View style={styles.spacer} />}

        <View style={styles.footer}>
          <TouchableOpacity style={styles.backButton} accessibilityLabel="Voltar">
            <Ionicons name="arrow-back" size={18} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.continueButton, loading && styles.continueButtonDisabled]}
            accessibilityLabel={mode === 'signup' ? 'Continuar' : 'Entrar'}
            onPress={mode === 'signup' ? onContinue : onLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.continueText}>{mode === 'signup' ? 'Continuar' : 'Entrar'}</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 28,
  },
  closeButton: {
    paddingTop: 20,
    paddingBottom: 16,
    paddingLeft: 4,
    alignSelf: 'flex-start',
  },
  emailSection: {
    alignItems: 'center',
    paddingTop: 240,
    marginBottom: 48,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  emailInput: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    borderWidth: 0,
    backgroundColor: 'transparent',
    outlineStyle: 'none',
    outlineWidth: 0,
    width: '100%',
    maxWidth: 280,
    marginBottom: 16,
  },
  passwordInput: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    borderWidth: 0,
    backgroundColor: 'transparent',
    outlineStyle: 'none',
    outlineWidth: 0,
    width: '100%',
    maxWidth: 280,
    marginBottom: 16,
  },
  modeLink: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  spacer: {
    flex: 1,
  },
  socialSection: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#424242',
  },
  dividerText: {
    color: '#424242',
    fontSize: 13,
    marginHorizontal: 14,
  },
  socialButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#444',
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingBottom: 24,
  },
  backButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButton: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonDisabled: {
    opacity: 0.7,
  },
  continueText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});
