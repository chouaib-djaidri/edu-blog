"use client";

import LogoIcon from "@/assets/icons/logo-icon";
import FadedAnimation from "@/components/animations/faded-animation";
import SubmitPressedButton from "@/components/buttons/submit-pressed-button";
import { Progress } from "@/components/ui/progress";
import { useUserTestAnswer } from "@/context/user-test-answer";
import { useStep } from "@/hooks/use-step";
import { TestFormValues } from "@/schemas/creator/test-form.schema";
import { QuestionProps, ResponseSummary } from "@/types/globals";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import GetQuiz from "./preview/get-quiz";
import { cn, extractResponses, validateResponses } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import TestResult from "./preview/test-result";
import { useTranslations } from "next-intl";

const Step4 = () => {
  const t = useTranslations("NewTest");
  const tb = useTranslations("Buttons");
  const { watch } = useFormContext<TestFormValues>();
  const { quizzes: questions, level, title } = watch();
  const [currentStep, helpers] = useStep(questions.length);
  const { goToNextStep, goToPrevStep, canGoToPrevStep, setStep } = helpers;
  const { userTestAnswer, setUserTestAnswer } = useUserTestAnswer();
  const [result, setResult] = useState<ResponseSummary | null>(null);

  if (!questions.length)
    return (
      <p className="px-6 text-center text-muted-foreground">{t("emptyTest")}</p>
    );

  const totalSteps = questions.length;
  const currentQuiz = questions[currentStep - 1] as QuestionProps;
  const handleNextClick = async () => {
    goToNextStep();
    if (currentStep === totalSteps) {
      const data = validateResponses(
        userTestAnswer,
        extractResponses(questions as QuestionProps[]),
        questions.map((el) => ({
          id: el.id,
          type: el.metadata.type,
          level,
        })),
        level
      );
      setResult(data);
    }
  };

  const onBackClick = () => {
    setUserTestAnswer({});
    setStep(1);
    setResult(null);
  };
  return (
    <div className="relative w-full h-full">
      <FadedAnimation k={result ? "result" : "test"}>
        {result ? (
          <TestResult
            result={result}
            onBackClick={onBackClick}
            title={title}
            level={level}
          />
        ) : (
          <div className="w-full h-full flex flex-col">
            <div className="w-full max-w-2xl mx-auto flex justify-start gap-4">
              <div className="flex gap-2 items-center">
                <LogoIcon className="h-6 w-auto" />
                <p className="text-lg font-bold pt-2 tracking-tight text-foreground">
                  {title}
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
              <div
                className={cn(
                  "flex justify-end flex-shrink-0 items-center pt-4 border-t-2 w-full gap-4",
                  canGoToPrevStep && "justify-between"
                )}
              >
                {canGoToPrevStep && (
                  <SubmitPressedButton
                    rounded="2xl"
                    onClick={goToPrevStep}
                    variant={"outline"}
                    parentClassName="w-full max-w-32"
                    type="button"
                  >
                    {tb("previous")}
                  </SubmitPressedButton>
                )}
                <SubmitPressedButton
                  rounded="2xl"
                  onClick={handleNextClick}
                  variant={"success"}
                  disabled={!userTestAnswer?.[currentQuiz?.id]}
                  parentClassName="w-full max-w-32"
                  type="button"
                >
                  {tb("next")}
                </SubmitPressedButton>
              </div>
            </div>
          </div>
        )}
      </FadedAnimation>
    </div>
  );
};

export default Step4;
