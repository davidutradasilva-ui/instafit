import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FeedHeader() {
  return (
    <View style={styles.container}>
      <TouchableOpacity accessibilityLabel="Buscar">
        <Ionicons name="search" size={22} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>Feed</Text>

      <View style={styles.rightActions}>
        <View style={styles.streakWrap}>
          <Ionicons name="flame" size={18} color="#FF6B2C" />
          <Text style={styles.streakText}>0</Text>
        </View>
        <TouchableOpacity accessibilityLabel="Notificações">
          <Ionicons name="notifications-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  streakWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  streakText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
