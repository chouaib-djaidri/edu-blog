/* eslint-disable @typescript-eslint/no-explicit-any */
export type FormActionResponse = {
  err?: string;
  msg?: string;
  data?: any;
};

export type Locale = "ar" | "en";

import { JwtPayload } from "jwt-decode";
import { Database } from "./database";

export interface SupabaseJwtPayload extends JwtPayload {
  aud: string;
  exp: number;
  amr: { method: string; timestamp: number }[];
  sub: string;
  email: string;
  phone: string;
  is_anonymous: boolean;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  user_metadata: {
    birthday: string;
    country: string;
    email_verified: boolean;
    fullName: string;
  };
  role: string;
  user_role: string | null;
}

// Routes
export type routeProps = { type: "equal" | "start"; path: string };

export type sidebarRouteProps = {
  type: "equal" | "start";
  label: string;
  path: string;
  imgUrl: string;
};

// Blog
export enum EnglishLevel {
  A1 = "A1",
  A2 = "A2",
  B1 = "B1",
  B2 = "B2",
  C1 = "C1",
  C2 = "C2",
}

export enum QuizType {
  ONE_IMAGE = "one_image",
  ONE_OPTION = "one_option",
  MATCH = "match",
  ORDER_WORDS = "order_words",
}

export enum Role {
  ADMIN = "admin",
  CREATOR = "creator",
  USER = "user",
}

export type TitleIdProps = { id: string; title: string };
export type ImageIdProps = { id: string; imageUrl: string };
export type OrderIdProps = { id: string; order: number };

export type ChooseOptQuizProps = TitleIdProps[];
export type ChooseImgQuizProps = ImageIdProps[];
export type ReorderOptsQuizProps = TitleIdProps[];
export type MatchOptsQuizProps = {
  l: TitleIdProps[];
  r: TitleIdProps[];
};

export type OneSelectionResponse = { id: string };
export type OrderedResponse = OrderIdProps[];

export type TestAnswerState = "correct" | "wrong" | "points";
export type TestResultProps = Record<TestAnswerState, number>;

export type ResponseProps = OneSelectionResponse | OrderedResponse;
export type ResponsesProps = Record<string, ResponseProps>;

export interface ResponseSummary {
  correct: number;
  wrong: number;
  points: number;
}

export type QuestionProps = {
  id: string;
  question: string;
  metadata: QuizMetada;
  order: number;
};

export type OneOptionMetadata = {
  type: QuizType.ONE_OPTION;
  data: ChooseOptQuizProps;
  correctAnswer: OneSelectionResponse;
};

export type OneImageMetadata = {
  type: QuizType.ONE_IMAGE;
  data: ChooseImgQuizProps;
  correctAnswer: OneSelectionResponse;
};

export type OrderMetadata = {
  type: QuizType.ORDER_WORDS;
  data: ReorderOptsQuizProps;
  correctAnswer: OrderedResponse;
};

export type MatchMetadata = {
  type: QuizType.MATCH;
  data: MatchOptsQuizProps;
  correctAnswer: OrderedResponse;
};

export type QuizMetada =
  | OneOptionMetadata
  | OneImageMetadata
  | OrderMetadata
  | MatchMetadata;

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageCount: number;
}

export interface SearchParams {
  levels?: Database["public"]["Enums"]["english_level"][];
  searchTerm?: string;
  roles?: Role[];
}

export type TestDataProps = {
  test: {
    id: string;
    title: string;
    slug: string;
    description: string;
    categories: string[];
    coverUrl: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    level: EnglishLevel;
  };
  questions: {
    id: string;
    question: string;
    type: QuizType;
    metadata: any;
    order: number;
  }[];
};
