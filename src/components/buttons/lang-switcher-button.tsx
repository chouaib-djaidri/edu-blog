"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Locale } from "@/types/globals";
import { Check } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function LangSwitcherButton() {
  const t = useTranslations("LangSwitcher");
  const langValue = useLocale();
  const locales = routing.locales.map((locale) => ({
    id: locale,
    label: t("locale", { locale }),
  }));

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();
  const activeLang = locales.find((el) => el.id === langValue);
  const [isOpen, setIsOpen] = useState(false);

  function onLangChange(nextLocale: Locale) {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        { pathname, params },
        { locale: nextLocale }
      );
    });
  }

  return (
    <DropdownMenu
      modal={false}
      dir={activeLang?.id === "ar" ? "rtl" : "ltr"}
      onOpenChange={setIsOpen}
      open={isOpen}
    >
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className={cn(
            "text-white hover:bg-[#32304a] size-10",
            isOpen && "text-white bg-[#32304a]"
          )}
          disabled={isPending}
        >
          <div className="flex justify-center items-center">
            <Image
              src={`/flags/${activeLang?.id}.svg`}
              alt=""
              width={512}
              height={512}
              className="size-5"
            />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col gap-1" align="end">
        {locales.map(({ id, label }) => (
          <DropdownMenuItem
            asChild
            className={cn(
              "cursor-pointer h-10 w-full font-medium flex px-4 items-center justify-between gap-4 transition-colors rounded-md",
              langValue === id && "bg-muted/80"
            )}
            key={id}
            onClick={() => {
              onLangChange(id);
            }}
            disabled={langValue === id}
          >
            <button>
              <div className="flex items-center gap-2">
                <Image
                  src={`/flags/${id}.svg`}
                  alt="flag"
                  width={60}
                  height={60}
                  className="w-6 h-6 me-1"
                />
                {label}
              </div>
              {langValue === id && <Check strokeWidth={2.5} size={16} />}
            </button>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
