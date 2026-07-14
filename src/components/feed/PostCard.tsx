import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FeedPost } from '../../data/mockPosts';

type PostCardProps = {
  post: FeedPost;
};

export default function PostCard({ post }: PostCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.userRow}>
          <View style={[styles.avatar, { backgroundColor: post.avatarColor }]}>
            <Text style={styles.avatarText}>{post.username[0].toUpperCase()}</Text>
          </View>

          <View style={styles.userInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.username}>{post.username}</Text>
              {post.verified && <Ionicons name="checkmark-circle" size={14} color="#E53935" />}
            </View>
            <Text style={styles.meta}>
              {post.timeAgo} · {post.category}
            </Text>
          </View>
        </View>

        <TouchableOpacity accessibilityLabel="Opções do post">
          <Ionicons name="ellipsis-horizontal" size={18} color="#888" />
        </TouchableOpacity>
      </View>

      {post.type === 'workout' && (
        <View style={styles.workoutStats}>
          <View style={styles.statBlock}>
            <Text style={styles.statValuePurple}>{post.duration}</Text>
            <Text style={styles.statLabel}>DURAÇÃO</Text>
          </View>
          <View style={styles.statBlock}>
            <Text style={styles.statValue}>{post.calories}</Text>
            <Text style={styles.statLabel}>CALORIAS</Text>
          </View>
        </View>
      )}

      {post.caption && post.type !== 'workout' && <Text style={styles.caption}>{post.caption}</Text>}

      {post.location && <Text style={styles.location}>{post.location}</Text>}

      {post.imageUrl && (
        <View style={styles.imageWrap}>
          <Image source={{ uri: post.imageUrl }} style={styles.postImage} resizeMode="cover" />
          {post.imageCount && post.imageCount > 1 && (
            <View style={styles.dotsRow}>
              <View style={[styles.dot, styles.dotActive]} />
              <View style={styles.dot} />
            </View>
          )}
        </View>
      )}

      {post.type === 'workout' && (
        <View style={styles.workoutIcons}>
          <Text style={styles.emoji}>💪</Text>
          <Ionicons name="chatbubble-outline" size={16} color="#888" />
        </View>
      )}

      <View style={styles.footer}>
        <View />
        <TouchableOpacity>
          <Text style={styles.actionLink}>{post.actionLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  username: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  meta: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  workoutStats: {
    flexDirection: 'row',
    gap: 40,
    marginBottom: 10,
  },
  statBlock: {
    gap: 2,
  },
  statValuePurple: {
    color: '#B388FF',
    fontSize: 18,
    fontWeight: '700',
  },
  statValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    color: '#666',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  caption: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  location: {
    color: '#666',
    fontSize: 12,
    marginBottom: 10,
  },
  imageWrap: {
    marginBottom: 10,
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: 320,
    borderRadius: 4,
    backgroundColor: '#111',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#444',
  },
  dotActive: {
    backgroundColor: '#fff',
  },
  workoutIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  emoji: {
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionLink: {
    color: '#FF6B2C',
    fontSize: 14,
    fontWeight: '600',
  },
});
