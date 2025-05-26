"use client";

import { UsersTable } from "@/components/data-table/users";
import { useTranslations } from "next-intl";

const UsersManagementPage = () => {
  const t = useTranslations("UsersManagement");
  return (
    <div className="mx-auto 2xl:container space-y-4">
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
        <p
          className="text-muted-foreground line-clamp-1"
          title={t("description")}
        >
          {t("description")}
        </p>
      </div>
      <UsersTable />
    </div>
  );
};

export default UsersManagementPage;
