"use client";

import ProfileForm from "@/components/forms/profile-form";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/user";
import { cn } from "@/lib/utils";
import { ExternalLink, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import DeleteAccountModal from "./delete-account-modal";
import InfoProfileCard from "./info-profile-card";

const Wrapper = () => {
  const t = useTranslations("Settings");
  const { userData } = useUser();

  return (
    <div className="2xl:container mx-auto flex flex-col gap-4">
      <div className="space-y-1 shrink-0">
        <h2 className="text-xl font-bold tracking-tight">
          {t("deleteAccount.title")}
        </h2>
        <p
          className="text-muted-foreground line-clamp-1"
          title={t("description")}
        >
          {t("description")}
        </p>
      </div>
      <div className="space-y-3">
        <div className="w-full flex md:flex-row lg:flex-col flex-col xl:flex-row gap-3">
          <div className="flex-1">
            <ProfileForm />
          </div>
          <div className="flex-1 flex flex-col gap-3">
            <InfoProfileCard />
            <div className="rounded-xl border overflow-hidden">
              <div className="grid grow gap-1 p-6">
                <h4 className="text-lg font-semibold">{t("password.title")}</h4>
                <p className="text-muted-foreground">
                  {t("password.description")}
                </p>
              </div>
              <div className="border-t bg-accent px-6 py-4 flex justify-between gap-4 items-center">
                <Button variant="link" asChild>
                  <Link href="/reset-password">
                    <span className="pt-px">
                      {t("password.changePassword")}
                    </span>
                    <ExternalLink className="size-4.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-xl border overflow-hidden">
          <div className="grid grow gap-1 p-6">
            <h4 className="text-lg font-semibold">{t("delete.title")}</h4>
            <p className="text-muted-foreground">{t("delete.description")}</p>
          </div>
          <div
            className={cn(
              "border-t bg-accent px-6 py-4 flex justify-between gap-4 items-center",
              userData?.role === "admin" && "py-3"
            )}
          >
            {userData?.role === "admin" ? (
              <div className="rounded-xl border border-amber-600 bg-amber-600 px-4 py-3 text-amber-50 flex gap-2">
                <TriangleAlert
                  className="size-4.5 shrink-0"
                  aria-hidden="true"
                />
                <p className="text-sm">
                  {t("deleteAccount.cannotDeleteAdmin")}
                </p>
              </div>
            ) : (
              <DeleteAccountModal />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wrapper;
