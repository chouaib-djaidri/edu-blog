"use client";

import { Role } from "@/types/globals";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

export interface UserData {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
  onBoardingStatus: string;
}

interface UserContextType {
  userData: UserData | null;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
  initialUserData: UserData | null;
}

export function UserProvider({ children, initialUserData }: UserProviderProps) {
  const [userData, setUserData] = useState<UserData | null>(initialUserData);
  useEffect(() => {
    setUserData(initialUserData);
  }, [initialUserData]);
  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
