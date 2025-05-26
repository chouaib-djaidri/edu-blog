import { logoutAction } from "@/actions/auth/logout";
import { useUser } from "@/context/user";
import { getPreview } from "@/lib/paths";
import { Bell, Coffee, LogOut, Phone, UserRound } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Feedback from "../layout/feedback";

const AvatarButton = () => {
  const { userData } = useUser();
  const fallback = userData?.fullName?.[0] || "U";
  const avatarUrl = getPreview(userData?.avatarUrl || "", "avatars");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={"ghost"}
            size={"icon"}
            className="hover:bg-transparent rounded-full"
          >
            <Avatar className="size-10">
              {avatarUrl && <AvatarImage src={avatarUrl} alt="user avatar" />}
              <AvatarFallback className="bg-sidebar-accent border-2 border-white/20">
                {fallback}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[--radix-dropdown-menu-trigger-width] min-w-60 rounded-xl"
          align="end"
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="size-10">
                {avatarUrl && <AvatarImage src={avatarUrl} alt="user avatar" />}
                <AvatarFallback>{fallback}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-px flex-1 text-left text-sm leading-tight pt-0.5">
                <span className="truncate font-medium">
                  {userData?.fullName || "Unknown"}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {userData?.email || "unknown@gmail.com"}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Bell />
              Notifications
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <UserRound />
              Account
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Phone />
              Support
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setIsOpen(true);
              }}
            >
              <Coffee />
              Feedback
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={async () => {
              await logoutAction();
            }}
          >
            <LogOut />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {isOpen && <Feedback setIsOpen={setIsOpen} />}
    </>
  );
};

export default AvatarButton;
