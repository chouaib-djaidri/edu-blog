"use client";

import LogoIcon from "@/assets/icons/logo-icon";
import FadedAnimation from "@/components/animations/faded-animation";
import { Progress } from "@/components/ui/progress";
import { useUserTestAnswer } from "@/context/user-test-answer";
import { useStep } from "@/hooks/use-step";
import { cn } from "@/lib/utils";
import {
  EnglishLevel,
  ResponsesProps,
  ResponseSummary,
  TestDataProps,
} from "@/types/globals";
import { useTranslations } from "next-intl";
import { ReactNode, useState } from "react";
import SubmitPressedButton from "../buttons/submit-pressed-button";
import { ScrollArea } from "../ui/scroll-area";
import GetQuiz from "./get-quiz";
import TestResult from "./test-result";

export default function TestPreview({
  testData: { questions, test },
  getResult,
  level,
  MainButton,
  description,
  pointTitle,
}: {
  testData: TestDataProps;
  getResult: (userTestAnswer: ResponsesProps) => Promise<ResponseSummary>;
  level: EnglishLevel;
  pointTitle?: (point: number) => string;
  MainButton?: ReactNode;
  description?: ReactNode | string;
}) {
  const t = useTranslations("NewTest");
  const tb = useTranslations("Buttons");
  const [isPending, setIsPending] = useState(false);
  const [currentStep, helpers] = useStep(questions.length);
  const { goToNextStep } = helpers;
  const { userTestAnswer } = useUserTestAnswer();
  const [result, setResult] = useState<ResponseSummary | null>(null);

  if (!questions.length)
    return (
      <p className="px-6 text-center text-muted-foreground">{t("emptyTest")}</p>
    );

  const totalSteps = questions.length;
  const currentQuiz = questions[currentStep - 1];
  const handleNextClick = async () => {
    goToNextStep();
    if (currentStep === totalSteps) {
      setIsPending(true);
      const data = await getResult(userTestAnswer);
      setResult(data);
      setIsPending(false);
    }
  };

  return (
    <div className="w-full h-svh p-6">
      <div className="w-full h-full relative">
        <FadedAnimation k={result ? "result" : "test"}>
          {result ? (
            <TestResult
              result={result}
              level={level}
              title={test.title}
              MainButton={MainButton}
              description={description}
              pointTitle={pointTitle}
            />
          ) : (
            <div className="w-full h-full flex flex-col">
              <div className="w-full max-w-2xl mx-auto flex justify-start gap-4">
                <div className="flex gap-2 items-center">
                  <LogoIcon className="h-6 w-auto" />
                  <p className="text-lg font-bold pt-2 tracking-tight text-foreground">
                    {test.title}
                  </p>
                </div>
              </div>
              <div className="mx-auto w-full max-w-2xl flex-1 flex flex-col items-center">
                <div className="flex-grow w-full pb-6 pt-2 flex flex-col gap-4">
                  <div className="space-y-2 flex-shrink-0">
                    <Progress
                      className="h-1.5 [&>div]:bg-green-600"
                      value={((currentStep - 1) / (totalSteps - 1)) * 100}
                    />
                    <div className="text-center text-muted-foreground font-medium">
                      {t("question")} {currentStep}/{totalSteps}
                    </div>
                  </div>
                  <div className="flex-grow relative overflow-hidden">
                    <FadedAnimation k={currentStep}>
                      {currentQuiz ? (
                        <ScrollArea className="w-full h-full">
                          <GetQuiz {...currentQuiz} />
                        </ScrollArea>
                      ) : (
                        <p>{t("quizNotExist")}</p>
                      )}
                    </FadedAnimation>
                  </div>
                </div>
                <div className="flex justify-end flex-shrink-0 items-center pt-4 border-t-2 w-full gap-4">
                  <SubmitPressedButton
                    rounded="2xl"
                    onClick={handleNextClick}
                    variant={"success"}
                    disabled={!userTestAnswer?.[currentQuiz?.id]}
                    parentClassName={cn(
                      "w-fit",
                      !isPending && "max-w-32 w-full"
                    )}
                    className=""
                    type="button"
                    isPending={isPending}
                  >
                    {currentStep === totalSteps ? tb("showResult") : tb("next")}
                  </SubmitPressedButton>
                </div>
              </div>
            </div>
          )}
        </FadedAnimation>
      </div>
    </div>
  );
}
