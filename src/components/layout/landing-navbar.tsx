"use client";

import LogoIcon from "@/assets/icons/logo-icon";
import { useUser } from "@/context/user";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import AvatarButton from "../buttons/avatar-button";
import LangSwitcherButton from "../buttons/lang-switcher-button";
import { Button } from "../ui/button";

export const tabs = [
  { title: "home", icon: "house.png", sectionId: "hero" },
  { title: "lastBlogs", icon: "lightning.png", sectionId: "lastBlogs" },
  { title: "lastTests", icon: "fire.png", sectionId: "lastTests" },
  { title: "authors", icon: "teacher.png", sectionId: "authors" },
  { title: "features", icon: "features.png", sectionId: "features" },
  {
    title: "testimonials",
    icon: "votes.png",
    sectionId: "testimonials",
  },
  { title: "faqs", icon: "help.png", sectionId: "faqs" },
  { title: "contact", icon: "headphone.png", sectionId: "contact" },
];

const buttonVariants = {
  initial: {
    width: "fit-content",
  },
  animate: (isSelected: boolean) => ({
    gap: isSelected ? ".5rem" : 0,
    width: "fit-content",
  }),
};

const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: "auto", opacity: 1 },
  exit: { width: 0, opacity: 0 },
};

const transition = { delay: 0.1, type: "spring", bounce: 0, duration: 0.6 };

export default function Navbar({
  selected,
  handleSelect,
}: {
  selected: number;
  handleSelect: (index: number) => void;
}) {
  const tn = useTranslations("Navigation");
  const tb = useTranslations("Buttons");
  const { userData } = useUser();

  return (
    <div className="sticky inset-0 p-2 z-4 bg-white">
      <div className="flex justify-center w-full h-18 border-b z-50 bg-foreground rounded-xl">
        <div className="w-full max-w-7xl flex items-center justify-between gap-2 px-6">
          <div className="flex items-center gap-2 text-white">
            <div className="bg-background rounded-md size-9 px-1 flex items-center justify-center">
              <LogoIcon className="text-foreground" />
            </div>
            <p className="text-lg font-medium leading-1">EduBlog</p>
          </div>
          <div className="flex items-center gap-4 max-md:hidden">
            {tabs.map((tab, index) => {
              return (
                <motion.button
                  key={tab.title}
                  variants={buttonVariants}
                  initial={false}
                  animate="animate"
                  custom={selected === index}
                  onClick={() => handleSelect(index)}
                  transition={transition}
                  className={cn(
                    "relative flex gap-2 justify-center items-center h-10 text-sm transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-ring focus-visible:ring-offset-0 border-transparent flex-shrink-0 font-medium text-white px-1 opacity-80 hover:opacity-100",
                    selected === index
                      ? "border-b-white opacity-100"
                      : "cursor-pointer"
                  )}
                >
                  <div className="size-5 relative">
                    <Image
                      src={`/icons/${tab.icon}`}
                      alt=""
                      width={512}
                      height={512}
                      className="size-full object-cover"
                    />
                  </div>
                  <AnimatePresence initial={false}>
                    {selected === index && (
                      <motion.span
                        variants={spanVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={transition}
                        className="overflow-hidden whitespace-nowrap"
                      >
                        {tn(tab.title)}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
          <div className="flex items-center">
            <LangSwitcherButton />
            {userData ? (
              <div className="flex items-center gap-2 ps-1.5">
                <Button className="rounded-xl h-10" asChild>
                  <Link href="/dashboard">{tb("dashboard")}</Link>
                </Button>
                <AvatarButton />
              </div>
            ) : (
              <div className="flex items-center gap-4 ps-2">
                <Button
                  className="rounded-xl no-underline h-10 bg-transparent text-white hover:text-white"
                  variant="link"
                  asChild
                >
                  <Link href="/signup">{tb("signup")}</Link>
                </Button>
                <Button className="px-8 rounded-xl h-10" asChild>
                  <Link href="/login">{tb("login")}</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
