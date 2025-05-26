"use client";

import FadedAnimation from "@/components/animations/faded-animation";
import Step1 from "@/components/forms/creator/new-test-form/step-1";
import Step2 from "@/components/forms/creator/new-test-form/step-2";
import Step3 from "@/components/forms/creator/new-test-form/step-3";
import Step4 from "@/components/forms/creator/new-test-form/step-4";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";
import { UserTestAnswerProvider } from "@/context/user-test-answer";
import { useStep } from "@/hooks/use-step";
import {
  TEST_DEFAULT_FORM_VALUES,
  TestFormSchema,
  TestFormValues,
} from "@/schemas/creator/test-form.schema";
import { QuestionProps, QuizType } from "@/types/globals";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { addTestAction, updateTestAction } from "@/actions/creator/test";
import { cn, compareArrays, compareStr, createFormData } from "@/lib/utils";
import SubmitButton from "@/components/buttons/submit-button";
import WrongSonner from "@/components/sonners/wrong-sonner";
import { toast } from "sonner";
import SuccessSonner from "@/components/sonners/success-sonner";
import { useTranslations } from "next-intl";
import QuizzesOrdering from "./quizzes-ordering";
import { useUser } from "@/context/user";
import { useRouter } from "next/navigation";

const Wrapper = ({
  defaultValues,
}: {
  defaultValues?: TestFormValues & { id: string };
}) => {
  const isUpdating = !!defaultValues && Object.keys(defaultValues).length > 0;

  const t = useTranslations("NewTest");
  const tb = useTranslations("Buttons");
  const tv = useTranslations("Validation");
  const to = useTranslations("Toasts");

  const [currentStep, helpers] = useStep(4);
  const { canGoToPrevStep, goToNextStep, goToPrevStep, setStep } = helpers;
  const [isPending, setIsPending] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<number>(
    isUpdating ? defaultValues.quizzes.length - 1 : -1
  );
  const { userData } = useUser();

  const form = useForm<TestFormValues>({
    resolver: valibotResolver(TestFormSchema(tv)),
    defaultValues: isUpdating ? defaultValues : TEST_DEFAULT_FORM_VALUES,
    mode: "onChange",
  });

  const quizzes = form.watch("quizzes");
  const { remove } = useFieldArray({
    control: form.control,
    name: "quizzes",
  });

  const router = useRouter();

  const onSubmit = async (data: TestFormValues) => {
    if (isPending) return;
    setIsPending(true);
    const imageFiles: File[] = [];
    const quizImageMap: Record<string, number> = {};
    const realData = isUpdating
      ? {
          ...(!compareStr(data.title, defaultValues.title) && {
            title: data.title,
          }),
          ...(!compareStr(data.description, defaultValues.description) && {
            description: data.description,
          }),
          ...(!compareStr(data.level, defaultValues.level) && {
            level: data.level,
          }),
          ...(!compareArrays(data.categories, defaultValues.categories) && {
            categories: data.categories,
          }),
          ...((data.coverFile instanceof File ||
            (!!defaultValues.coverFile && data.coverFile === "")) && {
            coverFile: data.coverFile === "" ? "deleted" : data.coverFile,
          }),
          quizzes: data.quizzes,
          ...(isUpdating && { defaultQuizzes: defaultValues.quizzes }),
          testId: defaultValues.id,
          userId: userData?.id as string,
        }
      : data;

    const modifiedData = { ...realData };

    if (realData.quizzes) {
      modifiedData.quizzes = realData.quizzes.map((quiz) => {
        if (quiz.metadata.type === QuizType.ONE_IMAGE) {
          const modifiedQuiz = { ...quiz };
          modifiedQuiz.metadata = {
            ...quiz.metadata,
            data: quiz.metadata.data.map((item) => {
              if (item.imageUrl instanceof File) {
                const fileIndex = imageFiles.length;
                quizImageMap[item.id] = fileIndex;
                imageFiles.push(item.imageUrl);
                return {
                  ...item,
                  imageUrl: "xxx",
                };
              }
              return item;
            }),
          };
          return modifiedQuiz;
        }
        return quiz;
      });
    }

    const formData = createFormData(modifiedData);

    if (imageFiles.length > 0) {
      formData.append("quizImageMap", JSON.stringify(quizImageMap));
      imageFiles.forEach((file, index) => {
        formData.append(`quizImage_${index}`, file);
      });
    }
    const action = isUpdating ? updateTestAction : addTestAction;
    const state = await action(formData);
    if (state?.err) {
      toast.custom((id) => (
        <WrongSonner id={id} title={to(state.err as string)} />
      ));
    }
    if (state?.msg) {
      toast.custom((id) => (
        <SuccessSonner id={id} title={to(state.msg as string)} />
      ));
      if (isUpdating) {
        router.push("/tests-management");
      } else {
        form.reset();
        setStep(1);
      }
    }
    setIsPending(false);
  };

  const validateCurrentStep = async () => {
    switch (currentStep) {
      case 1:
        const isValid = await form.trigger([
          "title",
          "categories",
          "level",
          "description",
        ]);
        return isValid;
      case 2:
        return await form.trigger("quizzes");
      case 3:
        return await form.trigger("coverFile");
      default:
        return true;
    }
  };

  const handleNext = async () => {
    const isStepValid = await validateCurrentStep();
    if (isStepValid) {
      if (currentStep === 4) {
        await form.handleSubmit(onSubmit)();
      } else {
        goToNextStep();
      }
    }
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1 />;
      case 2:
        return (
          <Step2 currentQuiz={currentQuiz} setCurrentQuiz={setCurrentQuiz} />
        );
      case 3:
        return <Step3 />;
      case 4:
        return (
          <UserTestAnswerProvider>
            <Step4 />
          </UserTestAnswerProvider>
        );
      default:
        return null;
    }
  };

  const onOrderChange = (newQuizzes: QuestionProps[]) => {
    const activeQuizId = quizzes?.[currentQuiz]?.id;
    const newIndex = newQuizzes.findIndex((qz) => qz.id === activeQuizId);
    if (newIndex >= 0) setCurrentQuiz(newIndex);
    form.setValue("quizzes", newQuizzes);
  };

  return (
    <div className="2xl:container mx-auto flex flex-col gap-4 min-h-[calc(100svh-6.5rem)] lg:min-h-[calc(100svh-3rem)]">
      <div className="space-y-1 shrink-0">
        <h2 className="text-xl font-bold tracking-tight">
          {t(isUpdating ? "updateTitle" : "title")}
        </h2>
        <p
          className="text-muted-foreground line-clamp-1"
          title={t(isUpdating ? "updateDescription" : "description")}
        >
          {t(isUpdating ? "updateDescription" : "description")}
        </p>
      </div>
      <div className="flex flex-1 gap-2 overflow-hidden">
        <div className="flex-1 flex flex-col max-w-72 border rounded-xl p-6">
          <Stepper value={currentStep} orientation="vertical">
            {[1, 2, 3, 4].map((step) => (
              <StepperItem
                key={step}
                step={step}
                className="relative items-start not-last:flex-1"
                loading={isPending && step === 4}
              >
                <StepperTrigger className="items-start rounded pb-12 last:pb-0 z-10 relative">
                  <StepperIndicator />
                  <div className="mt-0.5 space-y-0.5 px-2 text-left">
                    <StepperTitle>{t(`steps.step${step}.title`)}</StepperTitle>
                    <StepperDescription>
                      {t(`steps.step${step}.description`)}
                    </StepperDescription>
                  </div>
                </StepperTrigger>
                {step < 4 && (
                  <StepperSeparator className="absolute inset-y-0 top-[calc(1.5rem+0.125rem)] left-4 -order-1 m-0 -translate-x-1/2 group-data-[orientation=horizontal]/stepper:w-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:flex-none group-data-[orientation=vertical]/stepper:h-[calc(100%-1.5rem-0.25rem)]" />
                )}
              </StepperItem>
            ))}
          </Stepper>
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <div
            className={cn(
              "border rounded-xl flex-1",
              currentStep === 2 && "overflow-hidden"
            )}
          >
            <Form {...form}>
              <div className="w-full h-full flex-1 flex flex-col relative">
                <FadedAnimation k={currentStep}>
                  <ScrollArea className="h-full w-full">
                    <div
                      className={cn(
                        "w-full h-full",
                        currentStep === 2 && "grid grid-cols-[1fr_14rem]"
                      )}
                    >
                      <form
                        noValidate
                        className="flex flex-col gap-4 justify-center flex-1 h-full relative p-6"
                      >
                        {currentStep !== 4 && (
                          <div className="shrink-0 space-y-0.5">
                            <h2 className="font-semibold text-lg">
                              {`${currentStep}. ${t(`steps.step${currentStep}.title`)}`}
                            </h2>
                            <p className="text-muted-foreground">
                              {t(`steps.step${currentStep}.description`)}
                            </p>
                          </div>
                        )}
                        <div className="flex-1 flex flex-col justify-center">
                          {getStepContent()}
                        </div>
                      </form>
                      {currentStep === 2 && (
                        <QuizzesOrdering
                          currentQuiz={currentQuiz}
                          setCurrentQuiz={setCurrentQuiz}
                          quizzes={quizzes as QuestionProps[]}
                          onDelete={(removedItemId: string) => {
                            const index = quizzes.findIndex(
                              (el) => el.id === removedItemId
                            );
                            remove(index);
                            setCurrentQuiz((prev) => Math.max(0, prev - 1));
                            const updated = quizzes
                              .filter((item) => item.id !== removedItemId)
                              .map((item, idx) => ({
                                ...item,
                                order: idx + 1,
                              }));
                            form.setValue("quizzes", updated);
                          }}
                          onOrderChange={onOrderChange}
                          handleAddQuizClick={() => {
                            setCurrentQuiz(-1);
                          }}
                        />
                      )}
                    </div>
                  </ScrollArea>
                </FadedAnimation>
              </div>
            </Form>
          </div>
          <div className="flex gap-2 justify-between w-full shrink-0">
            <Button
              type="button"
              disabled={!canGoToPrevStep || isPending}
              onClick={goToPrevStep}
              variant="outline"
              className="w-full max-w-40"
            >
              {tb("previous")}
            </Button>
            {
              <SubmitButton
                type="button"
                isPending={isPending}
                onClick={handleNext}
                className="w-full max-w-40"
              >
                {currentStep === 4
                  ? isUpdating
                    ? tb("updateTest")
                    : tb("addTest")
                  : tb("next")}
              </SubmitButton>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wrapper;
