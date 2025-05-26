/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getLevelTest,
  getLevelTestCorrectAnswers,
  initilizeUserProgress,
} from "@/actions/user/tests";
import { useUser } from "@/context/user";
import { useUserProgress } from "@/context/user-progress";
import { UserTestAnswerProvider } from "@/context/user-test-answer";
import { supabaseClient } from "@/lib/supabase/client";
import {
  createFormData,
  getEnglishLevel,
  getNextLevel,
  validateResponses,
} from "@/lib/utils";
import { EnglishLevel, ResponsesProps, TestDataProps } from "@/types/globals";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import FadedAnimation from "../animations/faded-animation";
import PressedButton from "../buttons/pressed-button";
import WrongSonner from "../sonners/wrong-sonner";
import TestPreview from "./test-preview";

const PlacementTestContent = () => {
  const { userData, setUserData } = useUser();
  const tb = useTranslations("Buttons");
  const t = useTranslations("Tests");
  const to = useTranslations("Toasts");
  const [currentStep, setCurrentStep] = useState(
    userData?.onBoardingStatus === "taking-test" ? 2 : 1
  );

  const { setTotalPoints, setCurrentLevel, currentLevel } = useUserProgress();

  const [testData, setTestData] = useState<TestDataProps | null>(null);
  const supabase = supabaseClient();

  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const handleNextClick = async (answer: string) => {
    if (!userData) return;
    if (answer === "no") {
      setIsLoading(true);
      const formData = createFormData({ skip: "skip" });
      await initilizeUserProgress(formData);
      setUserData({ ...userData, onBoardingStatus: "done" });
      router.push("/dashboard");
      return;
    }
    setCurrentStep(2);
    await supabase
      .from("profiles")
      .update({ on_boarding_status: "taking-test" })
      .eq("user_id", userData.id);
  };

  useEffect(() => {
    const fetcher = async () => {
      const testData = await getLevelTest();
      setTestData(testData);
      setIsLoading(false);
    };
    if (!testData) {
      fetcher();
    }
  }, [testData]);

  const getResult = async (userTestAnswer: ResponsesProps) => {
    if (!testData) return { correct: 0, points: 0, wrong: 0 };
    const correctAnswers = await getLevelTestCorrectAnswers();
    const questions = testData.questions.map((el) => ({
      id: el.id,
      type: el.type,
      level: (el as any).level,
    }));
    const data = validateResponses(userTestAnswer, correctAnswers, questions);
    const formData = createFormData({ userTestAnswer, questions });
    const state = await initilizeUserProgress(formData);
    if (state.err) {
      toast.custom((id) => (
        <WrongSonner id={id} title={to(state.err as string)} />
      ));
    }
    if (state.msg) {
      const totals = getEnglishLevel(state.data.level);
      data.points = totals;
      setTotalPoints(totals);
      setCurrentLevel(state.data.level);
    }
    return data;
  };

  if (!userData) return <></>;

  return (
    <div className="relative w-full min-h-svh flex items-center justify-center">
      <FadedAnimation
        k={`${currentStep}-${isLoading}`}
        className="relative justify-center"
      >
        {isLoading ? (
          <Loader2 className="size-16 animate-spin" strokeWidth={1.5} />
        ) : currentStep === 1 ? (
          <div className="max-w-md flex flex-col items-center">
            <div className="flex-grow w-full py-8 flex flex-col items-center gap-6">
              <div className="flex-shrink-0">
                <h2 className="text-xl font-semibold">
                  {t("onBoarding.whatIsYourLevel")}
                </h2>
              </div>
              <div className="relative min-h-[400px] flex flex-col items-center justify-center">
                <div className="flex flex-col gap-3 w-full pb-2">
                  {[
                    {
                      id: "no",
                      title: t("onBoarding.startAsBegginer"),
                    },
                    {
                      id: "yes",
                      title: t("onBoarding.testMyLevel"),
                    },
                  ].map(({ title, id }) => (
                    <PressedButton
                      key={id}
                      variant={"outline"}
                      className="h-20 text-lg"
                      onClick={() => {
                        handleNextClick(id);
                      }}
                    >
                      {title}
                    </PressedButton>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0">
                <p className="text-muted-foreground text-center mx-auto text-sm">
                  {t("onBoarding.info")}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <UserTestAnswerProvider>
            <TestPreview
              testData={testData as TestDataProps}
              getResult={getResult}
              level={currentLevel || EnglishLevel.A1}
              pointTitle={(p) => `${p}P`}
              description={t.rich("testResult", {
                level: currentLevel,
                nextLevel: getNextLevel(currentLevel),
                b: (chunk) => <strong className="font-bold">{chunk}</strong>,
              })}
              MainButton={
                <PressedButton
                  type="button"
                  rounded="2xl"
                  parentClassName="mt-1"
                  className="h-12"
                  asChild
                  onClick={() => {
                    setUserData({ ...userData, onBoardingStatus: "done" });
                  }}
                >
                  <Link href="/dashboard">{tb("goToDashboard")}</Link>
                </PressedButton>
              }
            />
          </UserTestAnswerProvider>
        )}
      </FadedAnimation>
    </div>
  );
};

export default PlacementTestContent;
