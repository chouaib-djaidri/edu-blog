"use client";

import { useUser } from "@/context/user";
import { useUserProgress } from "@/context/user-progress";
import { getPreview } from "@/lib/paths";
import { cn } from "@/lib/utils";
import { Role } from "@/types/globals";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { SidebarTrigger, useSidebar } from "../ui/sidebar";

const DashboardNavbar = ({ role }: { role: Role }) => {
  const { state } = useSidebar();
  const { quizzesCompleted, testsCompleted, totalPoints } = useUserProgress();
  const { userData } = useUser();
  const fallback = userData?.fullName?.[0] || "U";
  const avatarUrl = getPreview(userData?.avatarUrl || "", "avatars");
  return (
    <div
      className={cn(
        "p-2 lg:hidden relative top-0 w-full z-50 bg-background",
        role === Role.USER && "lg:block lg:ps-0",
        role === Role.USER && state === "collapsed" && "lg:ps-2"
      )}
    >
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-6 bg-foreground text-background rounded-xl">
        <SidebarTrigger />
        <div className="flex items-center gap-4">
          {role === Role.USER ? (
            <div className="flex items-center gap-1.5">
              <div className="text-teal-300 flex items-center gap-2 text-sm font-semibold border-2 rounded-full border-teal-300 px-5 py-1.5 h-8 text-[13px]">
                <div className="size-3.5 relative -ms-0.5">
                  <Image
                    src="/icons/gems.png"
                    alt=""
                    width={512}
                    height={512}
                    className="size-full object-cover"
                  />
                </div>
                {/* {totalPoints}P */}
                1585P
              </div>
              <div className="text-yellow-300 flex items-center gap-2 text-sm font-semibold border-2 rounded-full border-yellow-300 px-5 py-1.5 h-8 text-[13px]">
                <div className="size-3.5 relative -ms-0.5">
                  <Image
                    src="/icons/lightning.png"
                    alt=""
                    width={512}
                    height={512}
                    className="size-full object-cover"
                  />
                </div>
                {/* {quizzesCompleted}Q */}
                2Q
              </div>
              <div className="text-red-300 flex items-center gap-2 text-sm font-semibold border-2 rounded-full border-red-300 px-5 py-1.5 h-8 text-[13px]">
                <div className="size-3.5 relative -ms-0.5">
                  <Image
                    src="/icons/fire.png"
                    alt=""
                    width={512}
                    height={512}
                    className="size-full object-cover"
                  />
                </div>
                {/* {testsCompleted}T */}
                3T
              </div>
            </div>
          ) : (
            <Avatar className="size-10">
              {avatarUrl && <AvatarImage src={avatarUrl} alt="user avatar" />}
              <AvatarFallback className="bg-sidebar-accent border-2 border-white/20">
                {fallback}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </header>
    </div>
  );
};

export default DashboardNavbar;
