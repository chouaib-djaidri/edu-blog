"use client";

import { useUser } from "@/context/user";
import { Role } from "@/types/globals";
import { ReactNode } from "react";
import PlacementTestContent from "./placement-test-content";

const PlacementTest = ({
  children,
  userRole,
}: {
  children: ReactNode;
  userRole: Role;
}) => {
  const { userData } = useUser();
  if (!userData) return <></>;

  if (userRole === Role.USER && userData.onBoardingStatus !== "done") {
    return <PlacementTestContent />;
  }
  return children;
};

export default PlacementTest;
