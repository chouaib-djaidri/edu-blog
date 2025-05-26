"use client";

import {
  reVerifyEmailAction,
  verifyEmailAction,
} from "@/actions/auth/email-verification";
import SubmitPressedButton from "@/components/buttons/submit-pressed-button";
import SuccessSonner from "@/components/sonners/success-sonner";
import WrongSonner from "@/components/sonners/wrong-sonner";
import { cn, createFormData } from "@/lib/utils";
import {
  OTP_VERIFICATION_DEFAULT_FORM_VALUES,
  OTPVerificationFormSchema,
  OTPVerificationFormValues,
} from "@/schemas/auth/otp-verification.schema";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { OTPInput } from "input-otp";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { OtpInputSlot } from "../../ui/otp-input";

const EmailVerificationForm = ({
  email,
  restTime,
}: {
  email: string;
  restTime: number;
}) => {
  const t = useTranslations("EmailVerification");
  const tf = useTranslations("Fields");
  const tb = useTranslations("Buttons");
  const to = useTranslations("Toasts");

  const [isPending, setIsPending] = useState<"verify" | "resend" | null>(null);
  const [timer, setTimer] = useState(restTime);
  const form = useForm<OTPVerificationFormValues>({
    resolver: valibotResolver(OTPVerificationFormSchema()),
    defaultValues: { ...OTP_VERIFICATION_DEFAULT_FORM_VALUES, email },
    mode: "onSubmit",
  });

  const { pin: pinError } = form.formState.errors;

  const router = useRouter();

  const onSubmit = async (data: OTPVerificationFormValues) => {
    if (!!isPending) return;
    setIsPending("verify");
    const formData = createFormData(data);
    const state = await verifyEmailAction(formData);
    if (state?.err) {
      const isTimeError = state.err === "auth.tooManyRequests";
      const timer = +(state?.msg || 60);
      if (isTimeError) setTimer(timer);
      toast.custom((id) => (
        <WrongSonner
          id={id}
          title={
            isTimeError
              ? to(state.err as string, { timer })
              : to(state.err as string)
          }
        />
      ));
      setIsPending(null);
    }
    if (state.msg) {
      toast.custom((id) => (
        <SuccessSonner id={id} title={to(state.msg as string)} />
      ));
      router.push("/login");
    }
  };

  const resendEmailVerificationHandler = async () => {
    if (!!isPending) return;
    setIsPending("resend");
    const formData = new FormData();
    formData.set("email", email);
    const state = await reVerifyEmailAction(formData);
    if (state?.err) {
      const isTimeError = state.err === "auth.tooManyRequests";
      const timer = +(state?.data || 60);
      if (isTimeError) setTimer(timer);
      toast.custom((id) => (
        <WrongSonner
          id={id}
          title={
            isTimeError
              ? to(state.err as string, { timer })
              : to(state.err as string)
          }
        />
      ));
    }
    if (state?.msg) {
      setTimer(60);
      toast.custom((id) => (
        <SuccessSonner id={id} title={to(state.msg as string)} />
      ));
    }
    setIsPending(null);
    form.setValue("pin", "");
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  return (
    <Card className="w-full max-w-[26rem] overflow-hidden max-sm:shadow-none border-none">
      <div className="w-full h-32 relative flex items-center justify-center">
        <Image
          src="/icons/email.png"
          alt=""
          width={512}
          height={512}
          className="w-auto h-full absolute"
        />
      </div>
      <CardHeader className="text-center px-6 sm:px-10">
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>
          {t.rich("description", {
            email,
            b: (chunks) => <strong>({chunks})</strong>,
          })}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 sm:px-10">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col gap-5 w-full"
          >
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">{tf("pin.label")}</FormLabel>
                  <FormControl className="flex flex-row justify-center">
                    <OTPInput
                      containerClassName="flex items-center justify-center has-disabled:opacity-50"
                      maxLength={6}
                      render={({ slots }) => (
                        <div className="flex gap-1.5">
                          {slots.map((slot, idx) => (
                            <OtpInputSlot
                              key={idx}
                              {...slot}
                              invalid={!!pinError}
                            />
                          ))}
                        </div>
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-center pt-1" />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-3 items-center">
              <SubmitPressedButton
                isPending={isPending === "verify"}
                disabled={isPending === "resend"}
              >
                {tb("verify")}
              </SubmitPressedButton>
              <div className="text-muted-foreground">
                {!timer && isPending !== "resend" && (
                  <span>{tb("noReceive")} </span>
                )}
                <Button
                  variant="link"
                  className={cn(
                    (timer || isPending === "resend") &&
                      "no-underline font-normal"
                  )}
                  onClick={resendEmailVerificationHandler}
                  type="button"
                  disabled={!!timer || !!isPending}
                >
                  {!!timer
                    ? tb("resendTimer", { timer })
                    : isPending === "resend"
                      ? tb("sending")
                      : tb("resend")}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EmailVerificationForm;
