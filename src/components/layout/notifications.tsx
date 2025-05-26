import { cn } from "@/lib/utils";
import { sidebarRouteProps } from "@/types/globals";
import Image from "next/image";
import { Fragment, useState } from "react";
import { Badge } from "../ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";

const initialNotifications = [
  {
    id: 1,
    image:
      "https://images.saymedia-content.com/.image/t_share/MTk4OTEyNDE2Mzg0Mjk2Mjk5/songs-about-men.jpg",
    user: "Chris Tompson",
    action: "comment",
    target: "5 Tips to Improve Your English Vocabulary",
    timestamp: "15 minutes ago",
    unread: true,
  },
  {
    id: 2,
    image:
      "https://i.pinimg.com/474x/10/ca/3e/10ca3ebf744ed949b4c598795f51803b.jpg",
    user: "Emma Davis",
    action: "like",
    target: "Common English Idioms Explained",
    timestamp: "45 minutes ago",
    unread: true,
  },
  {
    id: 3,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHEB-FmVpoxcfMWFBHLpHd7FjhRBXJ6aaLjw&s",
    user: "James Wilson",
    action: "reply your comment on",
    target: "How to Practice Speaking English Alone",
    timestamp: "4 hours ago",
    unread: false,
  },
  {
    id: 4,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNbkECXtEG_6-RV7CSNgNoYUGZE-JCliYm9g&s",
    user: "Alex Morgan",
    action: "comment on",
    target: "Best YouTube Channels for Learning English",
    timestamp: "12 hours ago",
    unread: false,
  },
];

function Dot({ className }: { className?: string }) {
  return (
    <svg
      width="6"
      height="6"
      fill="currentColor"
      viewBox="0 0 6 6"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="3" cy="3" r="3" />
    </svg>
  );
}

const Notifications = ({
  imgUrl,
  label,
  isActive,
  className,
}: sidebarRouteProps & { isActive: boolean; className?: string }) => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter((n) => n.unread).length;
  const [isOpen, setIsOpen] = useState(false);
  const handleNotificationClick = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification
      )
    );
  };
  return (
    <Popover onOpenChange={setIsOpen} open={isOpen}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "h-10 px-4 font-medium flex items-center justify-between gap-4",
            (isActive || isOpen) &&
              "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:sidebar-primary-foreground",
            className
          )}
        >
          <div className="flex items-center gap-2">
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
          </div>
          {unreadCount > 0 && (
            <Badge className="h-5.5 text-xs flex items-center justify-center px-2 py-0 pt-0.5 bg-primary text-white border-primary">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent
        sideOffset={24}
        side="right"
        align="end"
        className="w-full max-w-sm p-0 mt-20 min-h-[100svh-16rem] bg-foreground border-foreground rounded-xl text-white"
      >
        <div className="flex flex-col items-baseline justify-between gap-0.5 px-6 py-4">
          <div className="text-lg font-semibold">Notifications</div>
          <p className="opacity-70">
            Stay updated with your latest notifications
          </p>
        </div>
        <div className="py-4 border-white/10 border-y bg-sidebar-accent/60 flex justify-between gap-4">
          <div className="flex items-center gap-4 ps-6">
            <button className="hover:underline focus:outline-none">All</button>
            <button className="hover:underline focus:outline-none text-white/70">
              Unread(2)
            </button>
          </div>
          {unreadCount > 0 && (
            <button className="hover:underline focus:outline-none pe-6 text-white/70">
              Mark all as read
            </button>
          )}
        </div>
        <div className="p-2 space-y-1.5">
          {notifications.map((notification) => (
            <Fragment key={notification.id}>
              <div className="hover:bg-sidebar-accent rounded-md px-4 py-3 text-sm transition-colors">
                <div className="relative flex items-start gap-3 pe-6">
                  <Avatar className="size-10">
                    <AvatarImage src={notification.image} alt="user avatar" />
                    <AvatarFallback className="bg-sidebar-accent border-2 border-white/20">
                      {notification.user[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <button
                      className="text-white/70 text-left after:absolute after:inset-0 line-clamp-2"
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <span className="text-white">{notification.user}</span>{" "}
                      {notification.action}{" "}
                      <span className="text-white">
                        {`'${notification.target}'`}
                      </span>
                      .
                    </button>
                    <div className="text-white/70 text-xs">
                      {notification.timestamp}
                    </div>
                  </div>
                  {notification.unread && (
                    <div className="absolute end-0 self-center">
                      <Dot />
                    </div>
                  )}
                </div>
              </div>
              {notification.id !== 4 && <Separator className="bg-white/10" />}
            </Fragment>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Notifications;
