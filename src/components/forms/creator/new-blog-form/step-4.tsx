import { QUIZZES } from "@/constants/constants";
import { cn } from "@/lib/utils";
import {
  BlogFormValues,
  createQuizMetadata,
} from "@/schemas/creator/blog-form.schema";
import { QuizType } from "@/types/globals";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import MatchForm from "./quizzes/match-form";
import OneImageForm from "./quizzes/one-image-form";
import OneOptionForm from "./quizzes/one-option-form";
import OrderWordsForm from "./quizzes/order-words-form";
import { useTranslations } from "next-intl";

const Step4 = () => {
  const t = useTranslations("Quizzess");
  const { setValue, watch } = useFormContext<BlogFormValues>();
  const quizType = watch("quiz.metadata.type");
  const [quiz, setQuiz] = useState<QuizType | "no-type">(quizType || "no-type");

  const getQuizComp = () => {
    switch (quiz) {
      case QuizType.ONE_IMAGE:
        return <OneImageForm setQuiz={setQuiz} />;
      case QuizType.ONE_OPTION:
        return <OneOptionForm setQuiz={setQuiz} />;
      case QuizType.MATCH:
        return <MatchForm setQuiz={setQuiz} />;
      case QuizType.ORDER_WORDS:
        return <OrderWordsForm setQuiz={setQuiz} />;
      case "no-type":
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
                  <div
                    key={id}
                    className={cn(
                      "border p-4 rounded-xl flex items-center gap-4 cursor-pointer",
                      className
                    )}
                    onClick={() => {
                      const metadata = createQuizMetadata(id);
                      if (metadata) {
                        setValue("quiz", {
                          question: "",
                          metadata: metadata,
                        });
                        setQuiz(id);
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
    <div className="relative p-6 flex flex-col items-center">
      {getQuizComp()}
    </div>
  );
};

export default Step4;
