/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestProps } from "@/components/data-table/tests/types";
import { UserProps } from "@/components/data-table/users/types";

export function normalizeTest(data: any): TestProps {
  return {
    id: data.id,
    title: data.title,
    categories: data.categories,
    description: data.description,
    level: data.level,
    coverUrl: data.cover_url,
    createdAt: data.created_at,
    slug: data.slug,
    updatedAt: data.updated_at,
    userId: data.user_id,
    authorFullName: data.author_full_name,
    authorAvatarUrl: data.author_avatar_url,
    questions: data.questions,
  };
}

export const normalizeUser = (user: any): UserProps => {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    fullName: user.full_name,
    avatarUrl: user.avatar_url,
    level: user.level,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
};
