import { EnglishLevel, Role } from "@/types/globals";

export type UserProps = {
  id: string;
  fullName: string;
  email: string;
  level: EnglishLevel;
  avatarUrl: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
};
