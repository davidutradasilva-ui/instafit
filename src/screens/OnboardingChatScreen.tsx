import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { isUsernameAvailable, normalizeUsername, saveProfile } from '../services/profile';
import { getProfileErrorMessage } from '../utils/profileError';

type ChatMessage = {
  id: string;
  type: 'bot' | 'user';
  text: string;
};

type OnboardingStep = 'name' | 'username' | 'birthdate' | 'gender' | 'referral' | 'done';

type OnboardingChatScreenProps = {
  onComplete: () => void;
};

const STEP_ORDER: OnboardingStep[] = ['name', 'username', 'birthdate', 'gender', 'referral'];

function getFirstName(fullName: string) {
  return fullName.trim().split(' ')[0];
}

function getBotQuestion(step: OnboardingStep, name: string) {
  switch (step) {
    case 'name':
      return 'Qual o seu nome?';
    case 'username':
      return 'Escolha um username';
    case 'birthdate':
      return 'Qual sua data de nascimento?';
    case 'gender':
      return 'Qual seu gênero?';
    case 'referral':
      return `${name}, você foi indicado por algum amigo? Se sim digite o código de convite, ou apenas digite não.`;
    default:
      return '';
  }
}

function getPlaceholder(step: OnboardingStep) {
  switch (step) {
    case 'name':
      return 'Digite seu nome e sobrenome';
    case 'username':
      return 'Escolha um username';
    case 'birthdate':
      return 'DD/MM/AAAA';
    case 'gender':
      return 'Digite seu gênero';
    case 'referral':
      return 'Código de convite ou não';
    default:
      return '';
  }
}

function isValidBirthDate(value: string) {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) {
    return false;
  }

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day &&
    year >= 1900 &&
    year <= new Date().getFullYear()
  );
}

export default function OnboardingChatScreen({ onComplete }: OnboardingChatScreenProps) {
  const scrollRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('name');
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    setMessages([{ id: 'bot-0', type: 'bot', text: getBotQuestion('name', '') }]);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages, error]);

  const addMessage = (type: 'bot' | 'user', text: string) => {
    setMessages((prev) => [...prev, { id: `${type}-${Date.now()}`, type, text }]);
  };

  const goToNextStep = (nextAnswers: {
    fullName?: string;
    username?: string;
    birthDate?: string;
    gender?: string;
    referralCode?: string | null;
  }) => {
    const name = nextAnswers.fullName ?? fullName;
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    const nextStep = STEP_ORDER[currentIndex + 1];

    if (!nextStep) {
      setCurrentStep('done');
      return;
    }

    setCurrentStep(nextStep);
    addMessage('bot', getBotQuestion(nextStep, getFirstName(name)));
  };

  const handleSubmit = async () => {
    const value = inputValue.trim();
    if (!value || loading) {
      return;
    }

    setError('');

    if (currentStep === 'name') {
      if (value.length < 2) {
        setError('Digite seu nome completo.');
        return;
      }

      setFullName(value);
      addMessage('user', value);
      setInputValue('');
      goToNextStep({ fullName: value });
      return;
    }

    if (currentStep === 'username') {
      const normalized = normalizeUsername(value);

      if (normalized.length < 3) {
        setError('Username deve ter pelo menos 3 caracteres.');
        return;
      }

      setLoading(true);
      const usernameCheck = await isUsernameAvailable(normalized);
      setLoading(false);

      if (usernameCheck.error) {
        setError(getProfileErrorMessage({ message: usernameCheck.error }, 'Não foi possível validar o username.'));
        return;
      }

      if (!usernameCheck.available) {
        setError('Esse username já está em uso. Escolha outro.');
        return;
      }

      setUsername(normalized);
      addMessage('user', `@${normalized}`);
      setInputValue('');
      goToNextStep({ username: normalized });
      return;
    }

    if (currentStep === 'birthdate') {
      if (!isValidBirthDate(value)) {
        setError('Use o formato DD/MM/AAAA.');
        return;
      }

      setBirthDate(value);
      addMessage('user', value);
      setInputValue('');
      goToNextStep({ birthDate: value });
      return;
    }

    if (currentStep === 'gender') {
      setGender(value);
      addMessage('user', value);
      setInputValue('');
      goToNextStep({ gender: value });
      return;
    }

    if (currentStep === 'referral') {
      const referral = value.toLowerCase() === 'não' || value.toLowerCase() === 'nao' ? null : value;
      setReferralCode(referral);
      addMessage('user', value);
      setInputValue('');
      setLoading(true);

      const { error: saveError } = await saveProfile({
        fullName,
        username,
        birthDate,
        gender,
        referralCode: referral,
      });

      setLoading(false);

      if (saveError) {
        setError(getProfileErrorMessage(saveError, 'Não foi possível salvar seu perfil.'));
        return;
      }

      setCurrentStep('done');
      onComplete();
    }
  };

  const handleBack = () => {
    if (messages.length <= 1) {
      return;
    }

    setError('');
    setInputValue('');

    const lastUserIndex = [...messages].reverse().findIndex((item) => item.type === 'user');
    if (lastUserIndex === -1) {
      return;
    }

    const removeFrom = messages.length - lastUserIndex;
    const nextMessages = messages.slice(0, removeFrom);
    setMessages(nextMessages);

    const stepIndex = Math.max(0, nextMessages.filter((item) => item.type === 'user').length);
    const step = STEP_ORDER[stepIndex] ?? 'name';
    setCurrentStep(step);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text style={styles.logo}>Logo</Text>

        <ScrollView
          ref={scrollRef}
          style={styles.chatArea}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) =>
            message.type === 'bot' ? (
              <Text key={message.id} style={styles.botMessage}>
                {message.text}
              </Text>
            ) : (
              <View key={message.id} style={styles.userBubbleWrap}>
                <View style={styles.userBubble}>
                  <Text style={styles.userBubbleText}>{message.text}</Text>
                </View>
              </View>
            )
          )}

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </ScrollView>

        <View style={styles.inputRow}>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder={getPlaceholder(currentStep)}
              placeholderTextColor="#555"
              onSubmitEditing={handleSubmit}
              editable={currentStep !== 'done' && !loading}
              underlineColorAndroid="transparent"
            />

            <View style={styles.inputActions}>
              <TouchableOpacity style={styles.backButton} onPress={handleBack} accessibilityLabel="Voltar">
                <View style={styles.backButtonInner} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSubmit}
                disabled={loading || currentStep === 'done'}
                accessibilityLabel="Enviar"
              >
                {loading ? (
                  <ActivityIndicator color="#aaa" size="small" />
                ) : (
                  <Ionicons name="arrow-forward" size={18} color="#aaa" />
                )}
              </TouchableOpacity>
            </View>
          </View>
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
    paddingHorizontal: 20,
  },
  logo: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    paddingTop: 12,
    paddingBottom: 24,
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    paddingBottom: 16,
    gap: 18,
  },
  botMessage: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'left',
  },
  userBubbleWrap: {
    alignItems: 'flex-end',
  },
  userBubble: {
    backgroundColor: '#d9d9d9',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
    maxWidth: '80%',
  },
  userBubbleText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '500',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  inputRow: {
    paddingBottom: 20,
    paddingTop: 8,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 28,
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 8,
    paddingVertical: 6,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    outlineStyle: 'none',
    outlineWidth: 0,
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#666',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
