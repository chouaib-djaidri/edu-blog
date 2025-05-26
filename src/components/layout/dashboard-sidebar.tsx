"use client";

import { logoutAction } from "@/actions/auth/logout";
import LogoIcon from "@/assets/icons/logo-icon";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  ADMIN_SIDEBAR_ITEMS,
  CREATOR_SIDEBAR_ACTIONS,
  CREATOR_SIDEBAR_ITEMS,
  USER_SIDEBAR_ITEMS,
} from "@/constants/constants";
import { isRouteMatch } from "@/lib/paths";
import { cn } from "@/lib/utils";
import { Role, sidebarRouteProps } from "@/types/globals";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LangSwitcherSideButton } from "../buttons/lang-switcher-side-button";
import Notifications from "./notifications";

const MenuItem = ({
  imgUrl,
  label,
  path,
  isActive,
  className,
  type,
}: sidebarRouteProps & { isActive: boolean; className?: string }) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        className={cn(
          "h-10 px-4 font-medium",
          isActive &&
            "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:sidebar-primary-foreground",
          className
        )}
        tooltip={{
          hidden: true,
        }}
      >
        {label.toLowerCase() === "notifications" ? (
          <Notifications
            {...{ imgUrl, label, path, isActive, className, type }}
          />
        ) : (
          <Link href={path}>
            <div className="flex justify-center items-center">
              <Image
                src={`/icons/${imgUrl}`}
                alt=""
                width={512}
                height={512}
                className="size-5"
              />
            </div>
            {label}
          </Link>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

const DashboardSidebar = ({
  userRole,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  userRole: Role;
}) => {
  const pathname = usePathname();
  const items =
    userRole === "admin"
      ? ADMIN_SIDEBAR_ITEMS
      : userRole === "creator"
        ? CREATOR_SIDEBAR_ITEMS
        : USER_SIDEBAR_ITEMS;
  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader className="flex-row items-center px-8 h-20">
        <div className="flex items-center gap-2">
          <div className="bg-background rounded-md size-9 px-1 flex items-center justify-center">
            <LogoIcon className="text-foreground" />
          </div>
          <div className="space-y-4 pt-1">
            <p className="text-base font-medium leading-1">EduBlog</p>
            <p className="text-background/70 leading-1 font-normal text-xs capitalize">
              {userRole} Account
            </p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4 pt-0">
        <SidebarMenu className="gap-1">
          {items.map((props) => (
            <MenuItem
              key={props.path}
              {...props}
              isActive={isRouteMatch(pathname, {
                path: props.path,
                type: props.type,
              })}
            />
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 flex items-center justify-center">
        <SidebarMenu className="gap-1">
          {userRole === "creator" &&
            CREATOR_SIDEBAR_ACTIONS.map((props) => (
              <MenuItem
                key={props.path}
                {...props}
                isActive={isRouteMatch(pathname, {
                  path: props.path,
                  type: props.type,
                })}
              />
            ))}
          <LangSwitcherSideButton />
          <SidebarMenuItem>
            <SidebarMenuButton
              className="h-10 px-4 font-medium cursor-pointer"
              tooltip={{
                hidden: true,
              }}
              onClick={async () => {
                await logoutAction();
              }}
            >
              <div className="flex justify-center items-center">
                <Image
                  src={`/icons/power.png`}
                  alt=""
                  width={512}
                  height={512}
                  className="size-5"
                />
              </div>
              Logout
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
