import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type BottomTab = 'home' | 'workout' | 'community' | 'diet' | 'profile';

type BottomNavProps = {
  activeTab: BottomTab;
  onTabChange: (tab: BottomTab) => void;
};

const TABS: { id: BottomTab; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'home', label: 'Início', icon: 'home' },
  { id: 'workout', label: 'Meu Treino', icon: 'barbell-outline' },
  { id: 'community', label: 'Comunidade', icon: 'people-outline' },
  { id: 'diet', label: 'Minha Dieta', icon: 'nutrition-outline' },
  { id: 'profile', label: 'Perfil', icon: 'person-circle-outline' },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => onTabChange(tab.id)}
            accessibilityLabel={tab.label}
          >
            <Ionicons name={tab.icon} size={20} color={isActive ? '#fff' : '#666'} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingTop: 10,
    paddingBottom: 12,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
    paddingVertical: 4,
  },
});
