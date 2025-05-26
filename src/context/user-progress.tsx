"use client";
import { EnglishLevel } from "@/types/globals";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface UserProgressContextType {
  totalPoints: number;
  setTotalPoints: React.Dispatch<React.SetStateAction<number>>;
  currentLevel: EnglishLevel;
  setCurrentLevel: React.Dispatch<React.SetStateAction<EnglishLevel>>;
  testsCompleted: number;
  setTestsCompleted: React.Dispatch<React.SetStateAction<number>>;
  quizzesCompleted: number;
  setQuizzesCompleted: React.Dispatch<React.SetStateAction<number>>;
}

const UserProgressContext = createContext<UserProgressContextType | undefined>(
  undefined
);

export type InitialProgress = {
  initialTotalPoints?: number;
  initialCurrentLevel?: EnglishLevel;
  initialTestsCompleted?: number;
  initialQuizzesCompleted?: number;
};

interface UserProgressProviderProps {
  children: ReactNode;
  initialValues?: InitialProgress | null;
}

export function UserProgressProvider({
  children,
  initialValues,
}: UserProgressProviderProps) {
  const [totalPoints, setTotalPoints] = useState<number>(
    initialValues?.initialTotalPoints || 0
  );
  const [currentLevel, setCurrentLevel] = useState<EnglishLevel>(
    initialValues?.initialCurrentLevel || EnglishLevel.A1
  );
  const [testsCompleted, setTestsCompleted] = useState<number>(
    initialValues?.initialTestsCompleted || 0
  );
  const [quizzesCompleted, setQuizzesCompleted] = useState<number>(
    initialValues?.initialQuizzesCompleted || 0
  );

  useEffect(() => {
    setTotalPoints(initialValues?.initialTotalPoints || 0);
    setCurrentLevel(initialValues?.initialCurrentLevel || EnglishLevel.A1);
    setTestsCompleted(initialValues?.initialTestsCompleted || 0);
    setQuizzesCompleted(initialValues?.initialQuizzesCompleted || 0);
  }, [initialValues]);

  return (
    <UserProgressContext.Provider
      value={{
        totalPoints,
        setTotalPoints,
        currentLevel,
        setCurrentLevel,
        testsCompleted,
        setTestsCompleted,
        quizzesCompleted,
        setQuizzesCompleted,
      }}
    >
      {children}
    </UserProgressContext.Provider>
  );
}

export function useUserProgress(): UserProgressContextType {
  const context = useContext(UserProgressContext);
  if (context === undefined) {
    throw new Error(
      "useUserProgress must be used within a UserProgressProvider"
    );
  }
  return context;
}
