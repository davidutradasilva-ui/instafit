import { useRef, useState } from 'react';
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

type EmailVerificationScreenProps = {
  email: string;
  onBack: () => void;
  onContinue: (code: string) => void;
  onResend: () => void;
  loading?: boolean;
  message?: string;
  messageType?: 'error' | 'success' | 'info';
};

const CODE_LENGTH = 6;

export default function EmailVerificationScreen({
  email,
  onBack,
  onContinue,
  onResend,
  loading = false,
  message = '',
  messageType = 'error',
}: EmailVerificationScreenProps) {
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleChange = (value: string, index: number) => {
    const digit = value.replace(/\D/g, '').slice(-1);

    const nextCode = [...code];
    nextCode[index] = digit;
    setCode(nextCode);

    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

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
          <Text style={styles.title}>Verifique seu email</Text>
          <Text style={styles.subtitle}>
            Enviamos um código de 6 dígitos para{'\n'}
            {email || 'seu@email.com'}
          </Text>

          <View style={styles.codeRow}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                style={styles.codeInput}
                value={digit}
                onChangeText={(value) => handleChange(value, index)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                keyboardType="number-pad"
                maxLength={1}
                textAlign="center"
                selectTextOnFocus
                underlineColorAndroid="transparent"
              />
            ))}
          </View>

          <TouchableOpacity accessibilityLabel="Reenviar código" onPress={onResend} disabled={loading}>
            <Text style={styles.resendText}>Reenviar Código</Text>
          </TouchableOpacity>

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
            onPress={() => onContinue(code.join(''))}
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
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    color: '#888',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 300,
    marginBottom: 28,
  },
  spacer: {
    flex: 1,
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 28,
  },
  codeInput: {
    width: 44,
    height: 52,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 8,
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    backgroundColor: 'transparent',
    outlineStyle: 'none',
    outlineWidth: 0,
  },
  resendText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
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
