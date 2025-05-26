import { Role } from "@/types/globals";

export enum BlogCategory {
  GRAMMAR = "grammar",
  VOCABULARY = "vocabulary",
  LISTENING = "listening",
  SPEAKING = "speaking",
  READING = "reading",
  WRITING = "writing",
  TIPS = "tips",
  CULTURE = "culture",
}

export type BlogStatus = "draft" | "published";

export type BlogProps = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverUrl: string;
  userId: string;
  status: BlogStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  authorFullName: string | null;
  authorAvatarUrl: string | null;
  categories: BlogCategory[];
  readTime: number;
  viewCount: number;
  commentCount: number;
};
