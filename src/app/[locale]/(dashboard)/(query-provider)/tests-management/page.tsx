"use client";

import { TestsTable } from "@/components/data-table/tests";
import { useTranslations } from "next-intl";

const TestsManagementPage = () => {
  const t = useTranslations("TestsManagement");
  return (
    <div className="mx-auto 2xl:container space-y-4">
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
        <p
          className="text-muted-foreground line-clamp-1"
          title={t("adminDescription")}
        >
          {t("adminDescription")}
        </p>
      </div>
      <TestsTable />
    </div>
  );
};

export default TestsManagementPage;
