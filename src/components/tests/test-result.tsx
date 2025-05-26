"use client";

import LogoIcon from "@/assets/icons/logo-icon";
import PressedButton from "@/components/buttons/pressed-button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  cn,
  getFilledLevelBadgeClasses,
  getLevelBadgeClasses,
  getQuizPoint,
} from "@/lib/utils";
import { EnglishLevel, TestResultProps } from "@/types/globals";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ReactNode } from "react";
import ResultChart from "../forms/creator/new-test-form/preview/result-chart";

const TestResult = ({
  result,
  title,
  level,
  pointTitle,
  MainButton,
  description,
  withAi = false,
}: {
  result: TestResultProps;
  title: string;
  level: EnglishLevel;
  pointTitle?: (point: number) => string;
  MainButton?: ReactNode;
  description?: ReactNode | string;
  withAi?: boolean;
}) => {
  const tf = useTranslations("Fields");
  const t = useTranslations("NewTest");
  const tb = useTranslations("Buttons");

  return (
    <div className="w-full h-full flex flex-col gap-3 items-center">
      <div className="w-full max-w-2xl mx-auto shrink-0 flex justify-start gap-4">
        <div className="flex gap-2 items-center">
          <LogoIcon className="h-6 w-auto" />
          <p className="text-lg font-bold pt-2 tracking-tight text-foreground">
            {title}
          </p>
        </div>
      </div>
      <div className="max-w-2xl w-full shrink-0 min-h-px">
        <Separator className="border-b-2" />
      </div>
      <div className="w-full max-w-lg flex-1 flex flex-col justify-center gap-2 mt-1">
        <ResultChart result={result} />
        <div
          className={cn(
            "space-y-3 border rounded-2xl p-5 text-center",
            getLevelBadgeClasses(level)
          )}
        >
          <Badge
            className={cn("mx-auto px-4", getFilledLevelBadgeClasses(level))}
          >
            {level} {tf("level.title")}
          </Badge>
          <div className="space-y-2">
            <p className="text-3xl leading-none font-bold">
              {pointTitle?.(result.points) || `+${result.points}P`}
            </p>
            <p className="font-medium text-base">
              {description ||
                t("correctAnswerPoints", {
                  level,
                  points: getQuizPoint(level, level),
                })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {withAi && (
            <>
              <PressedButton
                type="button"
                rounded="2xl"
                variant={"secondary"}
                parentClassName="mt-1"
                className="h-12"
                asChild
              >
                <Link href="/tests">Get AI Feedback</Link>
              </PressedButton>
              <p className="text-muted-foreground font-medium">OR</p>
            </>
          )}
          {MainButton || (
            <PressedButton
              type="button"
              rounded="2xl"
              parentClassName="mt-1"
              className="h-12"
              asChild
            >
              <Link href="/tests">{tb("exploreMoreTests")}</Link>
            </PressedButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestResult;
