import { EnglishLevel } from "@/types/globals";

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string[];
  coverImage: string;
  publishedAt: string;
  authorName: string;
  authorAvatar: string;
  level: EnglishLevel;
}

export interface Comment {
  id: string;
  articleId: string;
  author: {
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: Date;
}
