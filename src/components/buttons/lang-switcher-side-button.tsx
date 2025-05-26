"use client";

import { Check } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Locale, useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState, useTransition } from "react";

export function LangSwitcherSideButton() {
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
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu
          dir={activeLang?.id === "ar" ? "rtl" : "ltr"}
          onOpenChange={setIsOpen}
          open={isOpen}
        >
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              className={cn(
                "h-10 px-4 font-medium",
                isOpen && "bg-sidebar-accent"
              )}
              tooltip={{
                hidden: true,
              }}
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
              {t("language")}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-[13rem] rounded-xl bg-foreground text-background border-sidebar-accent"
            side={"top"}
            sideOffset={8}
          >
            {locales.map(({ id, label }) => (
              <DropdownMenuItem
                asChild
                className={cn(
                  "cursor-pointer h-10 w-full font-medium flex px-4 items-center justify-between gap-4 transition-colors rounded-md data-[disabled]:opacity-100 focus:bg-sidebar-accent",
                  langValue === id && "bg-sidebar-accent"
                )}
                key={id}
                onClick={() => {
                  onLangChange(id);
                }}
                disabled={langValue === id}
              >
                <button>
                  <div className="flex items-center gap-2.5">
                    <Image
                      src={`/flags/${id}.svg`}
                      alt="flag"
                      width={60}
                      height={60}
                      className="size-5"
                    />
                    <span className="pt-px"> {label}</span>
                  </div>
                  {langValue === id && <Check strokeWidth={2.5} size={16} />}
                </button>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
