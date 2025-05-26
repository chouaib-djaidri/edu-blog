"use client";

import LogoIcon from "@/assets/icons/logo-icon";
import PressedButton from "@/components/buttons/pressed-button";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/user";
import { cn } from "@/lib/utils";
import { ChevronRight, MoveRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

const HeroSection = ({
  handleSelect,
}: {
  handleSelect: (index: number) => void;
}) => {
  const { userData } = useUser();
  const t = useTranslations("HomePage.hero");
  const tb = useTranslations("Buttons");
  const locale = useLocale();
  const isRTL = locale === "ar";
  return (
    <div className="relative" id="hero">
      <section className="relative mx-auto max-w-4xl min-h-[calc(100svh-5.5rem)] z-1 flex flex-col items-center justify-center text-center gap-4 py-20 px-6">
        <LogoIcon width="102" height="84" />
        <Button
          className="rounded-full pe-1.5 h-10 ps-6 border-2 gap-4 bg-foreground hover:bg-foreground/90 text-background"
          onClick={() => {
            handleSelect(1);
          }}
        >
          {tb("exploreOurBlogs")}
          <span className="flex items-center justify-center size-7 rounded-full bg-primary text-primary-foreground">
            <ChevronRight
              strokeWidth={2.5}
              className={cn("ms-0.5 size-3.5 sm:size-4", {
                "rotate-180": isRTL,
              })}
            />
          </span>
        </Button>
        <h1
          className={cn(
            "font-extrabold text-4xl sm:text-5xl md:text-6xl capitalize",
            isRTL && "!leading-[1.25]"
          )}
        >
          {t("title")} <span className="text-primary block">{t("title2")}</span>
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg mt-2 max-w-2xl">
          {t("description")}
        </p>
        <PressedButton
          parentClassName="mt-4 w-fit"
          className="px-12 h-12"
          asChild
        >
          <Link href={userData ? "/dashboard" : "/login"}>
            {tb("getStarted")}{" "}
            <MoveRight className={cn({ "rotate-180": isRTL })} />
          </Link>
        </PressedButton>
      </section>
    </div>
  );
};

export { HeroSection };
