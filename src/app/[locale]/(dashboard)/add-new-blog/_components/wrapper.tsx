"use client";

import FadedAnimation from "@/components/animations/faded-animation";
import SubmitButton from "@/components/buttons/submit-button";
import Step1 from "@/components/forms/creator/new-blog-form/step-1";
import Step2 from "@/components/forms/creator/new-blog-form/step-2";
import Step3 from "@/components/forms/creator/new-blog-form/step-3";
import Step4 from "@/components/forms/creator/new-blog-form/step-4";
import Step5 from "@/components/forms/creator/new-blog-form/step-5";
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
import { useStep } from "@/hooks/use-step";
import {
  BLOG_DEFAULT_FORM_VALUES,
  BlogFormSchema,
  type BlogFormValues,
} from "@/schemas/creator/blog-form.schema";
import "@/styles/editor.css";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";

const Wrapper = () => {
  const t = useTranslations("NewBlog");
  const tb = useTranslations("Buttons");
  const tv = useTranslations("Validation");
  // const to = useTranslations("Toasts");

  const [currentStep, helpers] = useStep(5, 2);
  const { canGoToPrevStep, goToNextStep, goToPrevStep } = helpers;
  const [isDone, setIsDone] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<BlogFormValues>({
    resolver: valibotResolver(BlogFormSchema(tv)),
    defaultValues: BLOG_DEFAULT_FORM_VALUES,
    mode: "onChange",
  });

  const onSubmit = async (data: BlogFormValues) => {
    if (isPending) return;
    setIsPending(true);
    console.log(data);
    setIsPending(false);
    if (isDone) setIsDone(false);
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
      // return await form.trigger("content");
      case 3:
        return await form.trigger("coverFile");
      case 4:
        return await form.trigger("quiz");
      default:
        return true;
    }
  };

  const handleNext = async () => {
    const isStepValid = await validateCurrentStep();
    if (isStepValid) {
      if (currentStep === 5) {
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
        return <Step2 />;
      case 3:
        return <Step3 />;
      case 4:
        return <Step4 />;
      case 5:
        return <Step5 />;
      default:
        return null;
    }
  };

  return (
    <div className="2xl:container mx-auto flex flex-col gap-4 min-h-[calc(100svh-6.5rem)] lg:min-h-[calc(100svh-3rem)]">
      <div className="space-y-1 shrink-0">
        <h2 className="text-xl font-bold tracking-tight">{t("title")}</h2>
        <p
          className="text-muted-foreground line-clamp-1"
          title={t("description")}
        >
          {t("description")}
        </p>
      </div>
      <div className="flex flex-1 gap-2 overflow-hidden">
        <div className="flex-1 flex flex-col max-w-72 border rounded-xl p-6">
          <Stepper value={currentStep} orientation="vertical">
            {[1, 2, 3, 4, 5].map((step) => (
              <StepperItem
                key={step}
                step={step}
                className="relative items-start not-last:flex-1"
                loading={isPending && step === 5}
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
                {step < 5 && (
                  <StepperSeparator className="absolute inset-y-0 top-[calc(1.5rem+0.125rem)] left-4 -order-1 m-0 -translate-x-1/2 group-data-[orientation=horizontal]/stepper:w-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:flex-none group-data-[orientation=vertical]/stepper:h-[calc(100%-1.5rem-0.25rem)]" />
                )}
              </StepperItem>
            ))}
          </Stepper>
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="border rounded-xl flex-1">
            <Form {...form}>
              <div className="w-full h-full flex-1 flex flex-col relative">
                <FadedAnimation k={currentStep}>
                  <ScrollArea className="h-full w-full">
                    <div className="w-full h-full">
                      <form
                        noValidate
                        className="flex flex-col gap-4 justify-center flex-1 h-full relative p-6"
                      >
                        {![2, 5].includes(currentStep) && (
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
                {currentStep === 4 ? tb("addBlog") : tb("next")}
              </SubmitButton>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wrapper;
