import { StyleSheet, Text, View } from 'react-native';

type AuthMessageProps = {
  message: string;
  type?: 'error' | 'success' | 'info';
};

export default function AuthMessage({ message, type = 'error' }: AuthMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        type === 'error' && styles.error,
        type === 'success' && styles.success,
        type === 'info' && styles.info,
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    maxWidth: 320,
    width: '100%',
  },
  error: {
    backgroundColor: '#3a1515',
    borderWidth: 1,
    borderColor: '#ff6b6b',
  },
  success: {
    backgroundColor: '#153a20',
    borderWidth: 1,
    borderColor: '#6bff8b',
  },
  info: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#424242',
  },
  text: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
