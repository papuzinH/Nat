// TypeScript interface for Blog Posts
export interface BlogPost {
  id: number;
  slug?: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  image?: string;
  featured?: boolean;
  author?: string;
  tags?: string[];
  content?: string | string[];
}
