/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  EnglishLevel,
  OneSelectionResponse,
  OrderedResponse,
  QuestionProps,
  QuizType,
  ResponsesProps,
  ResponseSummary,
} from "@/types/globals";
import { clsx, type ClassValue } from "clsx";
import { customAlphabet } from "nanoid";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 6);

export const getBlogStatusBadgeClasses = (status: string) => {
  switch (status?.toLowerCase()) {
    case "published":
      return "bg-green-100/50 text-green-700 border-green-600";
    case "draft":
      return "bg-amber-100/50 text-amber-700 border-amber-600";
    default:
      return "bg-slate-100/50 text-slate-700 border-slate-600";
  }
};

type PrimitiveValue = string | number | boolean | null | undefined | Date;
type ObjectValue = Record<string, unknown>;
type ArrayValue = Array<PrimitiveValue | ObjectValue | File>;
type FormDataValue = PrimitiveValue | ObjectValue | ArrayValue | File;

export const createFormData = <T extends Record<string, FormDataValue>>(
  data: T
): FormData => {
  const formData = new FormData();

  const processValue = (value: unknown): string | File | undefined => {
    if (value === null || value === undefined) {
      return undefined;
    }
    if (value instanceof Date) {
      return value.toISOString();
    }
    if (value instanceof File) {
      return value;
    }
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    }
    return String(value);
  };

  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => {
        const processedItem = processValue(item);
        if (processedItem !== undefined) {
          formData.append(key, processedItem);
        }
      });
    } else {
      const processedValue = processValue(value);
      if (processedValue !== undefined) {
        formData.set(key, processedValue);
      }
    }
  });

  return formData;
};

export const getPriorityBadgeClasses = (priority: string) => {
  switch (priority.toLowerCase()) {
    case "high":
      return "bg-red-100 text-red-600 border-red-600";
    case "medium":
      return "bg-yellow-100 text-yellow-600 border-yellow-600";
    case "low":
      return "bg-green-100 text-green-600 border-green-600";
    default:
      return "bg-blue-100 text-blue-600 border-blue-600";
  }
};

export const getLevelBadgeClasses = (level: string) => {
  switch (level?.toUpperCase()) {
    case "A1":
      return "bg-red-100/50 text-red-700 border-red-600";
    case "A2":
      return "bg-orange-100/50 text-orange-700 border-orange-600";
    case "B1":
      return "bg-yellow-100/50 text-yellow-700 border-yellow-600";
    case "B2":
      return "bg-green-100/50 text-green-700 border-green-600";
    case "C1":
      return "bg-indigo-100/50 text-indigo-700 border-indigo-600";
    case "C2":
      return "bg-purple-100/50 text-purple-700 border-purple-600";
    default:
      return "bg-slate-100/50 text-slate-700 border-slate-600";
  }
};

export const getRoleBadgeClasses = (role: string) => {
  switch (role?.toUpperCase()) {
    case "ADMIN":
      return "bg-pink-700 text-pink-50 border-pink-700";
    case "B2":
    case "CREATOR":
      return "bg-purple-700 text-purple-50 border-purple-700";
    default:
      return "bg-green-700 text-green-50 border-green-700";
  }
};

export const getFilledLevelBadgeClasses = (level: string) => {
  switch (level?.toUpperCase()) {
    case "A1":
      return "bg-red-700 border-red-700 text-red-50";
    case "A2":
      return "bg-orange-700 border-orange-700 text-orange-50";
    case "B1":
      return "bg-yellow-700 border-yellow-700 text-yellow-50";
    case "B2":
      return "bg-green-700 border-green-700 text-green-50";
    case "C1":
      return "bg-indigo-700 border-indigo-700 text-indigo-50";
    case "C2":
      return "bg-purple-700 border-purple-700 text-purple-50";
    default:
      return "bg-gray-700 border-gray-700 text-gray-50";
  }
};

export const getLetterBadgeClasses = (letter: string) => {
  const firstChar = letter.trim()[0]?.toLowerCase() || "";
  switch (firstChar) {
    case "a":
    case "g":
    case "y":
      return "bg-red-700 text-red-50 border-red-700";
    case "b":
    case "h":
    case "z":
      return "bg-orange-700 text-orange-50 border-orange-700";
    case "c":
    case "i":
    case "q":
      return "bg-yellow-700 text-yellow-50 border-yellow-700";
    case "d":
    case "j":
    case "r":
      return "bg-green-700 text-green-50 border-green-700";
    case "e":
    case "k":
    case "s":
      return "bg-cyan-700 text-cyan-50 border-cyan-700";
    case "f":
    case "l":
    case "t":
      return "bg-purple-700 text-purple-50 border-purple-700";
    case "m":
    case "u":
      return "bg-indigo-700 text-indigo-50 border-indigo-700";
    case "n":
    case "v":
      return "bg-pink-700 text-pink-50 border-pink-700";
    case "o":
    case "w":
      return "bg-teal-700 text-teal-50 border-teal-700";
    case "p":
    case "x":
      return "bg-amber-700 text-amber-50 border-amber-700";
    default:
      return "bg-gray-700 text-gray-50 border-gray-700";
  }
};

export function validateResponses(
  userResponses: ResponsesProps,
  correctResponses: ResponsesProps,
  questions: { type: QuizType; id: string; level: EnglishLevel }[],
  userLevel?: EnglishLevel
): ResponseSummary {
  const summary: ResponseSummary = {
    correct: 0,
    wrong: 0,
    points: 0,
  };
  Object.keys(correctResponses).forEach((key) => {
    const userResponse = userResponses[key];
    const correctResponse = correctResponses[key];
    const question = questions.find((el) => el.id === key);
    if (userResponse === undefined) {
      summary.wrong++;
      return;
    }
    let isCorrect = false;
    if (question) {
      switch (question.type) {
        case QuizType.ONE_OPTION:
        case QuizType.ONE_IMAGE: {
          isCorrect =
            !Array.isArray(userResponse) &&
            "id" in userResponse &&
            "id" in correctResponse &&
            userResponse.id === correctResponse.id;
          break;
        }
        case QuizType.ORDER_WORDS:
        case QuizType.MATCH: {
          if (
            Array.isArray(userResponse) &&
            Array.isArray(correctResponse) &&
            userResponse.length === correctResponse.length
          ) {
            isCorrect = correctResponse.every((correctItem, index) => {
              const userItem = userResponse[index];
              return (
                userItem &&
                "id" in userItem &&
                "order" in userItem &&
                "id" in correctItem &&
                "order" in correctItem &&
                correctItem.id === userItem.id &&
                correctItem.order === userItem.order
              );
            });
          }
          break;
        }
        default:
          isCorrect = false;
          break;
      }
    }
    if (isCorrect) {
      summary.correct++;
      summary.points += getQuizPoint(
        question?.level || EnglishLevel.A1,
        userLevel || question?.level || EnglishLevel.A1
      );
    } else {
      summary.wrong++;
    }
  });
  if (questions.length > 0 && summary.wrong === questions.length) {
    summary.points++;
  }
  return summary;
}

export const extractResponses = (quizzes: QuestionProps[]): ResponsesProps => {
  const responses: ResponsesProps = {};
  quizzes.forEach((quiz: QuestionProps) => {
    const { id, metadata } = quiz;
    switch (metadata.type) {
      case QuizType.ONE_OPTION:
      case QuizType.ONE_IMAGE:
        responses[id] = metadata.correctAnswer as OneSelectionResponse;
        break;
      case QuizType.ORDER_WORDS:
      case QuizType.MATCH:
        responses[id] = metadata.correctAnswer as OrderedResponse;
        break;
      default:
        return {};
    }
  });

  return responses;
};

export const getQuizPoint = (
  level: EnglishLevel,
  userLevel: EnglishLevel,
  type: "test" | "blog" = "test"
) => {
  if (level !== userLevel) return 0;
  switch (level) {
    case EnglishLevel.A1:
      return type === "test" ? 2 : 8;
    case EnglishLevel.A2:
      return type === "test" ? 3 : 10;
    case EnglishLevel.B1:
      return type === "test" ? 5 : 15;
    case EnglishLevel.B2:
      return type === "test" ? 6 : 18;
    case EnglishLevel.C1:
      return type === "test" ? 8 : 25;
    case EnglishLevel.C2:
      return type === "test" ? 10 : 30;
    default:
      return 0;
  }
};

export function compareStr(str1: string, str2: string) {
  return str1.toLowerCase().trim() === str2.toLowerCase().trim();
}

export function compareArrays(arr1: string[], arr2: string[]): boolean {
  if (!arr1 || !arr2) return false;
  return (
    arr1.length === arr2.length &&
    arr1.every((item, index) => item === arr2[index])
  );
}

export const shuffleArray = <T>(array: T[]): T[] => {
  if (!array?.length) return [];
  if (array.length === 1) return [...array];
  const result = [...array];
  let changed = false;
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    if (i !== j) changed = true;
    [result[i], result[j]] = [result[j], result[i]];
  }
  if (!changed && result.length > 2) {
    [result[0], result[1]] = [result[1], result[0]];
  }
  return result;
};

export const shuffleQuizData = (quiz: any) => {
  const { type, metadata } = quiz;
  if (!metadata?.data) return quiz;
  switch (type) {
    case QuizType.ONE_IMAGE:
    case QuizType.ONE_OPTION:
    case QuizType.ORDER_WORDS:
      return {
        ...quiz,
        metadata: {
          ...metadata,
          data: shuffleArray(metadata.data),
        },
      };
    case QuizType.MATCH:
      return {
        ...quiz,
        metadata: {
          ...metadata,
          data: {
            l: shuffleArray(metadata.data.l),
            r: shuffleArray(metadata.data.r),
          },
        },
      };
    default:
      return quiz;
  }
};

export const processQuizzes = (quizzes: any[]) => {
  const quizzesWithShuffledOptions = quizzes.map((quiz) =>
    shuffleQuizData(quiz)
  );
  return shuffleArray(quizzesWithShuffledOptions);
};

export function getNextLevel(level: EnglishLevel) {
  const levelsOrder = [
    EnglishLevel.A1,
    EnglishLevel.A2,
    EnglishLevel.B1,
    EnglishLevel.B2,
    EnglishLevel.C1,
    EnglishLevel.C2,
  ];
  const currentIndex = levelsOrder.indexOf(level);
  return levelsOrder[currentIndex + 1] ?? null;
}

export const getEnglishLevel = (level: EnglishLevel) => {
  switch (level) {
    case EnglishLevel.A1:
      return 0;
    case EnglishLevel.A2:
      return 500;
    case EnglishLevel.B1:
      return 1500;
    case EnglishLevel.B2:
      return 3000;
    case EnglishLevel.C1:
      return 6000;
    case EnglishLevel.C2:
      return 12000;
    default:
      return 0;
  }
};
