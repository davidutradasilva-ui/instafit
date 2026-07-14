import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type AccountCreatedScreenProps = {
  onContinue: () => void;
};

export default function AccountCreatedScreen({ onContinue }: AccountCreatedScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Conta Criada com Sucesso</Text>

        <TouchableOpacity style={styles.continueButton} onPress={onContinue} accessibilityLabel="Continuar">
          <Text style={styles.continueText}>Continuar</Text>
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    gap: 32,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  continueButton: {
    width: '100%',
    maxWidth: 320,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});
