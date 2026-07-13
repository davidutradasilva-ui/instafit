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

type CreatePasswordScreenProps = {
  password: string;
  onPasswordChange: (password: string) => void;
  onBack: () => void;
  onContinue: () => void;
  loading?: boolean;
  message?: string;
  messageType?: 'error' | 'success' | 'info';
};

export default function CreatePasswordScreen({
  password,
  onPasswordChange,
  onBack,
  onContinue,
  loading = false,
  message = '',
  messageType = 'error',
}: CreatePasswordScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableOpacity style={styles.closeButton} accessibilityLabel="Fechar" onPress={onBack}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.contentSection}>
          <Text style={styles.title}>Crie uma senha</Text>
          <TextInput
            style={styles.passwordInput}
            value={password}
            onChangeText={onPasswordChange}
            placeholder="Digite sua senha"
            placeholderTextColor="#555"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            underlineColorAndroid="transparent"
          />

          <Text style={styles.termsText}>
            Ao cria uma conta, você concorda com nossos{'\n'}
            <Text style={styles.termsLink}>Termos de Serviço</Text> e{' '}
            <Text style={styles.termsLink}>Politica de Privacidade</Text>
          </Text>

          <AuthMessage message={message} type={messageType} />
        </View>

        <View style={styles.spacer} />

        <View style={styles.footer}>
          <TouchableOpacity style={styles.backButton} accessibilityLabel="Voltar" onPress={onBack}>
            <Ionicons name="arrow-back" size={18} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.continueButton, loading && styles.continueButtonDisabled]}
            accessibilityLabel="Continuar"
            onPress={onContinue}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.continueText}>Continuar</Text>
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
  contentSection: {
    alignItems: 'center',
    marginTop: '32%',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
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
    marginBottom: 36,
  },
  spacer: {
    flex: 1,
  },
  termsText: {
    color: '#888',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 300,
  },
  termsLink: {
    color: '#fff',
    fontWeight: '700',
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
