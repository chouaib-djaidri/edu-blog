"use client";

import { ResponsesProps } from "@/types/globals";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

export type UserTestAnswerContextType = {
  userTestAnswer: ResponsesProps;
  setUserTestAnswer: Dispatch<SetStateAction<ResponsesProps>>;
};
export const UserTestAnswerContext = createContext<
  UserTestAnswerContextType | undefined
>(undefined);

interface UserTestAnswerProviderProps {
  children: ReactNode;
}

export function UserTestAnswerProvider({
  children,
}: UserTestAnswerProviderProps) {
  const [userTestAnswer, setUserTestAnswer] = useState<ResponsesProps>({});

  return (
    <UserTestAnswerContext.Provider
      value={{ userTestAnswer, setUserTestAnswer }}
    >
      {children}
    </UserTestAnswerContext.Provider>
  );
}

export function useUserTestAnswer(): UserTestAnswerContextType {
  const context = useContext(UserTestAnswerContext);
  if (context === undefined) {
    throw new Error(
      "useUserTestAnswer must be used within a UserTestAnswerProvider"
    );
  }
  return context;
}
