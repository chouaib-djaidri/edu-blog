"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/context/user";
import { format } from "date-fns";
import { useTranslations } from "next-intl";

const InfoProfileCard = () => {
  const { userData } = useUser();
  const tc = useTranslations("Toolbar.columns");
  const t = useTranslations("Settings");
  if (!userData) return <></>;
  const { updatedAt, createdAt } = userData;
  return (
    <div className="flex items-center p-6 border rounded-xl flex-1">
      <div className="flex flex-col gap-2">
        <div className="space-y-1">
          <h4 className="text-lg font-semibold">{t("info.title")}</h4>
          <p className="text-muted-foreground">{t("info.description")}</p>
        </div>
        <div className="flex items-center gap-4 lg:gap-6 h-10 font-medium mt-4">
          <div className="space-y-1">
            <p className="text-muted-foreground">{tc("createdAt")}</p>
            <Badge className="font-semibold">
              {format(createdAt, "MMMM dd, yyyy HH:mm")}
            </Badge>
          </div>
          <Separator orientation="vertical" className="h-full" />
          <div className="space-y-1">
            <p className="text-muted-foreground">{tc("updatedAt")}</p>
            <Badge className="font-semibold">
              {format(updatedAt, "MMMM dd, yyyy HH:mm")}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoProfileCard;
