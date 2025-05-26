"use client";

import { BlogsTable } from "@/components/data-table/blogs";
import { useTranslations } from "next-intl";

const BlogsManagementPage = () => {
  const t = useTranslations("BlogsManagement");
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
      <BlogsTable />
    </div>
  );
};

export default BlogsManagementPage;
