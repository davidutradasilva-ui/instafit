import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNav, { BottomTab } from '../components/feed/BottomNav';
import FeedScreen from './feed/FeedScreen';
import PlaceholderTabScreen from './PlaceholderTabScreen';

export default function MainAppScreen() {
  const [activeTab, setActiveTab] = useState<BottomTab>('home');

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.container}>
        {activeTab === 'home' && <FeedScreen />}
        {activeTab === 'workout' && <PlaceholderTabScreen title="Meu Treino" />}
        {activeTab === 'community' && <PlaceholderTabScreen title="Comunidade" />}
        {activeTab === 'diet' && <PlaceholderTabScreen title="Minha Dieta" />}
        {activeTab === 'profile' && <PlaceholderTabScreen title="Perfil" />}

        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
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
  },
});
