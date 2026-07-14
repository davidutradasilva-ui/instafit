import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type FabButtonProps = {
  onPress?: () => void;
};

export default function FabButton({ onPress }: FabButtonProps) {
  return (
    <TouchableOpacity style={styles.fab} onPress={onPress} accessibilityLabel="Criar post">
      <Ionicons name="document-text-outline" size={22} color="#fff" />
      <View style={styles.plusBadge}>
        <Ionicons name="add" size={12} color="#fff" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 12,
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#FF6B2C',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  plusBadge: {
    position: 'absolute',
    right: 6,
    bottom: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
