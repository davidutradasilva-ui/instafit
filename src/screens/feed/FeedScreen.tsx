import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FeedHeader from '../../components/feed/FeedHeader';
import FeedTabs from '../../components/feed/FeedTabs';
import PostCard from '../../components/feed/PostCard';
import FabButton from '../../components/feed/FabButton';
import { FeedTab, getPostsByTab } from '../../data/mockPosts';

export default function FeedScreen() {
  const [activeTab, setActiveTab] = useState<FeedTab>('explorar');
  const posts = useMemo(() => getPostsByTab(activeTab), [activeTab]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <FeedHeader />
        <FeedTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <ScrollView
          style={styles.feed}
          contentContainerStyle={styles.feedContent}
          showsVerticalScrollIndicator={false}
        >
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </ScrollView>

        <FabButton onPress={() => {}} />
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
  feed: {
    flex: 1,
  },
  feedContent: {
    paddingBottom: 76,
  },
});
