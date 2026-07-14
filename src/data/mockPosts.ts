export type FeedTab = 'clubes' | 'explorar' | 'seguindo';

export type FeedPost = {
  id: string;
  username: string;
  verified?: boolean;
  avatarColor: string;
  timeAgo: string;
  category: string;
  type: 'workout' | 'image' | 'text';
  caption?: string;
  duration?: string;
  calories?: string;
  imageUrl?: string;
  imageCount?: number;
  location?: string;
  actionLabel: string;
  isFollowing?: boolean;
  isClub?: boolean;
};

export const mockPosts: FeedPost[] = [
  {
    id: '1',
    username: 'leandrooliveira',
    verified: true,
    avatarColor: '#4A90D9',
    timeAgo: '5 min atrás',
    category: 'Treino',
    type: 'workout',
    duration: '56m 8s',
    calories: '414 kcal',
    actionLabel: 'Ver mais',
    isFollowing: true,
    isClub: false,
  },
  {
    id: '2',
    username: 'gkarine',
    avatarColor: '#D97B4A',
    timeAgo: '12 min atrás',
    category: 'Treino',
    type: 'image',
    caption: 'segunda com quadrícepsssss',
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
    imageCount: 2,
    actionLabel: 'Ver treino',
    isFollowing: true,
    isClub: true,
  },
  {
    id: '3',
    username: 'marcosfit',
    avatarColor: '#7B4AD9',
    timeAgo: '1 h atrás',
    category: 'Dieta',
    type: 'text',
    caption: 'Almoço de hoje: frango, arroz e salada. 520 kcal no total.',
    location: 'São Paulo, BR',
    actionLabel: 'Ver mais',
    isFollowing: false,
    isClub: true,
  },
  {
    id: '4',
    username: 'anaclara',
    verified: true,
    avatarColor: '#4AD97B',
    timeAgo: '2 h atrás',
    category: 'Treino',
    type: 'workout',
    duration: '42m 15s',
    calories: '310 kcal',
    actionLabel: 'Ver treino',
    isFollowing: true,
    isClub: false,
  },
];

export function getPostsByTab(tab: FeedTab) {
  switch (tab) {
    case 'seguindo':
      return mockPosts.filter((post) => post.isFollowing);
    case 'clubes':
      return mockPosts.filter((post) => post.isClub);
    default:
      return mockPosts;
  }
}
