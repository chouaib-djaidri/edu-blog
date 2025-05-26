"use client";

import { QUIZZES } from "@/constants/constants";
import { cn } from "@/lib/utils";
import { createQuizMetadata } from "@/schemas/creator/blog-form.schema";
import type { TestFormValues } from "@/schemas/creator/test-form.schema";
import { QuizType } from "@/types/globals";
import { type Dispatch, type SetStateAction, useId, useMemo } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import OneImageForm from "./quizzes/one-image-form";
import OneOptionForm from "./quizzes/one-option-form";
import MatchForm from "./quizzes/match-form";
import OrderWordsForm from "./quizzes/order-words-form";
import { useTranslations } from "next-intl";

const Step2 = ({
  currentQuiz,
  setCurrentQuiz,
}: {
  currentQuiz: number;
  setCurrentQuiz: Dispatch<SetStateAction<number>>;
}) => {
  const t = useTranslations("Quizzess");
  const {
    control,
    watch,
    formState: {
      errors: { quizzes: quizzesErrors },
    },
    clearErrors,
  } = useFormContext<TestFormValues>();
  const { append } = useFieldArray({
    control: control,
    name: "quizzes",
  });
  const quizzes = watch("quizzes");
  const currentQuizType = useMemo(
    () => quizzes?.[currentQuiz]?.metadata?.type,
    [currentQuiz, quizzes]
  );
  const forceUpdateKey = `${useId()}-${currentQuiz}`;

  const getQuizComp = () => {
    switch (currentQuizType) {
      case QuizType.ONE_IMAGE:
        return <OneImageForm key={forceUpdateKey} currentQuiz={currentQuiz} />;
      case QuizType.ONE_OPTION:
        return <OneOptionForm key={forceUpdateKey} currentQuiz={currentQuiz} />;
      case QuizType.MATCH:
        return <MatchForm key={forceUpdateKey} currentQuiz={currentQuiz} />;
      case QuizType.ORDER_WORDS:
        return (
          <OrderWordsForm key={forceUpdateKey} currentQuiz={currentQuiz} />
        );
      default:
        return (
          <div className="space-y-3">
            <p className="font-medium">{t("label")}</p>
            <div className="grid grid-cols-2 gap-2">
              {QUIZZES.map(
                ({
                  id,
                  Icon,
                  className,
                  description,
                  iconClassName,
                  title,
                }) => (
                  // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
                  <div
                    key={id}
                    className={cn(
                      "border p-4 rounded-xl flex items-center gap-4 cursor-pointer",
                      className
                    )}
                    onClick={() => {
                      const metadata = createQuizMetadata(id);
                      if (metadata) {
                        append({
                          question: "",
                          metadata: metadata,
                          id: crypto.randomUUID(),
                          order: quizzes.length + 1,
                        });
                        clearErrors();
                        setCurrentQuiz(quizzes.length);
                      }
                    }}
                  >
                    <div
                      className={cn(
                        "flex justify-center items-center size-11 rounded-full mx-auto shrink-0",
                        iconClassName
                      )}
                    >
                      <Icon className="size-6" strokeWidth={1.5} />
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="text-base font-semibold">{t(title)}</h3>
                      <p>{t(description)}</p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        );
    }
  };
  return (
    <div className="flex flex-col items-center">
      {getQuizComp()}
      {quizzesErrors?.message && (
        <div className="absolute bottom-0 left-0 w-full flex justify-center p-2">
          <p className="text-xs font-medium bg-destructive text-white rounded-md px-2 py-1">
            {quizzesErrors.message}
          </p>
        </div>
      )}
    </div>
  );
};

export default Step2;
