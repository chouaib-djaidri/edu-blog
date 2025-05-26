export const TESTIMONIALS = [
  {
    id: 1,
    testimonial:
      "Learning English feels like a game here! Now I chat confidently with native speakers.",
    author: "Miguel Sanchez",
  },
  {
    id: 2,
    testimonial:
      "Fun activities kept me motivated and helped me pass my IELTS exam with flying colors!",
    author: "Yuki Tanaka",
  },
  {
    id: 3,
    testimonial:
      "These creative methods made grammar enjoyable. I actually look forward to practice now!",
    author: "Sofia Petrova",
  },
];

import { QuizType, sidebarRouteProps } from "@/types/globals";
import { ArrowLeftRight, Columns, Image, LucideIcon, Menu } from "lucide-react";

export const CREATOR_SIDEBAR_ITEMS: sidebarRouteProps[] = [
  {
    path: "/dashboard",
    label: "Dashboard",
    imgUrl: "house.png",
    type: "start",
  },
  {
    path: "/blogs-management",
    label: "Blogs Management",
    imgUrl: "lightning.png",
    type: "start",
  },
  {
    path: "/tests-management",
    label: "Tests Management",
    imgUrl: "fire.png",
    type: "start",
  },
  {
    path: "/notifications",
    label: "Notifications",
    imgUrl: "bell.png",
    type: "start",
  },
  {
    path: "/settings",
    label: "Settings",
    imgUrl: "gear.png",
    type: "equal",
  },
];

export const ADMIN_SIDEBAR_ITEMS: sidebarRouteProps[] = [
  {
    path: "/dashboard",
    label: "Dashboard",
    imgUrl: "house.png",
    type: "start",
  },
  {
    path: "/blogs-management",
    label: "Blogs Management",
    imgUrl: "lightning.png",
    type: "start",
  },
  {
    path: "/tests-management",
    label: "Tests Management",
    imgUrl: "fire.png",
    type: "start",
  },
  {
    path: "/users-management",
    label: "Users Management",
    imgUrl: "graduating-student.png",
    type: "equal",
  },
  {
    path: "/feedbacks-management",
    label: "Feedbacks Management",
    imgUrl: "votes.png",
    type: "equal",
  },
  {
    path: "/notifications",
    label: "Notifications",
    imgUrl: "bell.png",
    type: "start",
  },
  {
    path: "/settings",
    label: "Settings",
    imgUrl: "gear.png",
    type: "equal",
  },
];

export const USER_SIDEBAR_ITEMS: sidebarRouteProps[] = [
  {
    path: "/dashboard",
    label: "Dashboard",
    imgUrl: "house.png",
    type: "start",
  },
  {
    path: "/blogs",
    label: "Explore Blogs",
    imgUrl: "lightning.png",
    type: "start",
  },
  {
    path: "/tests",
    label: "Explore Tests",
    imgUrl: "fire.png",
    type: "start",
  },
  {
    path: "/saved-blogs",
    label: "Saved Blogs",
    imgUrl: "bookmark.png",
    type: "equal",
  },
  {
    path: "/notifications",
    label: "Notifications",
    imgUrl: "bell.png",
    type: "start",
  },
  {
    path: "/settings",
    label: "Settings",
    imgUrl: "gear.png",
    type: "equal",
  },
];

export const CREATOR_SIDEBAR_ACTIONS: sidebarRouteProps[] = [
  {
    path: "/add-new-blog",
    label: "Add New Blog",
    imgUrl: "drawing.png",
    type: "equal",
  },
  {
    path: "/add-new-test",
    label: "Add New Test",
    imgUrl: "graduate-hat.png",
    type: "equal",
  },
];

export const QUIZZES: {
  id: QuizType;
  title: string;
  description: string;
  className: string;
  Icon: LucideIcon;
  iconClassName: string;
}[] = [
  {
    id: QuizType.ONE_OPTION,
    title: "oneOption.title",
    description: "oneOption.description",
    className: "bg-indigo-100 border-indigo-300 text-indigo-900",
    Icon: Menu,
    iconClassName: "bg-indigo-300 text-indigo-950",
  },
  {
    id: QuizType.ONE_IMAGE,
    title: "oneImage.title",
    description: "oneImage.description",
    className: "bg-green-100 border-green-300 text-green-900",
    Icon: Image,
    iconClassName: "bg-green-300 text-green-900",
  },
  {
    id: QuizType.MATCH,
    title: "match.title",
    description: "match.description",
    className: "bg-orange-100 border-orange-300 text-orange-900",
    Icon: Columns,
    iconClassName: "bg-orange-300 text-orange-900",
  },
  {
    id: QuizType.ORDER_WORDS,
    title: "orderWords.title",
    description: "orderWords.description",
    className: "bg-purple-100 border-purple-300 text-purple-900",
    Icon: ArrowLeftRight,
    iconClassName: "bg-purple-300 text-purple-900",
  },
];
