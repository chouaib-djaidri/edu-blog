import { EnglishLevel, QuestionProps } from "@/types/globals";

export type TestProps = {
  id: string;
  description: string;
  level: EnglishLevel;
  categories: string[];
  title: string;
  slug: string;
  coverUrl: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  authorFullName: string | null;
  authorAvatarUrl: string | null;
  questions: QuestionProps[];
};
