export interface GiscusConfig {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
  mapping: 'pathname' | 'url' | 'title' | 'og:title' | 'specific' | 'number';
  strict: boolean;
  reactionsEnabled: boolean;
  emitMetadata: boolean;
  inputPosition: 'top' | 'bottom';
  theme: string;
  lang: string;
  loading?: 'lazy' | 'eager';
}

export interface GiscusMetadata {
  discussion?: {
    id: string;
    url: string;
    locked: boolean;
    repository: {
      nameWithOwner: string;
    };
    reactionCount: number;
    totalCommentCount: number;
    totalReplyCount: number;
  };
  viewer?: {
    avatarUrl: string;
    login: string;
    url: string;
  };
}

export interface GiscusProps {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
  mapping?: 'pathname' | 'url' | 'title' | 'og:title' | 'specific' | 'number';
  strict?: boolean;
  reactionsEnabled?: boolean;
  emitMetadata?: boolean;
  inputPosition?: 'top' | 'bottom';
  lang?: string;
  loading?: 'lazy' | 'eager';
  theme?: string;
}

export interface CommentCountProps {
  repo: string;
  pathname: string;
  className?: string;
}

export interface LazyGiscusProps {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
  threshold?: number;
}

export interface CommentStats {
  totalComments: number;
  totalReactions: number;
  engagementRate: number;
  topCommentedPosts: Array<{
    slug: string;
    title: string;
    commentCount: number;
  }>;
}