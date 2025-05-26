"use client";

import SubmitPressedButton from "@/components/buttons/submit-pressed-button";
import { Input } from "@/components/ui/input";
import {
  FORGOT_PASSWORD_DEFAULT_FORM_VALUES,
  ForgotPasswordFormSchema,
  ForgotPasswordFormValues,
} from "@/schemas/auth/forgot-password.schema";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
import WrongSonner from "@/components/sonners/wrong-sonner";
import { createFormData } from "@/lib/utils";
import { forgotPasswordAction } from "@/actions/auth/forgot-password";
import { toast } from "sonner";
import SuccessSonner from "@/components/sonners/success-sonner";
import { useRouter } from "next/navigation";

const ForgotPasswordForm = () => {
  const t = useTranslations("ForgotPassword");
  const tf = useTranslations("Fields");
  const tb = useTranslations("Buttons");
  const to = useTranslations("Toasts");

  const [isPending, setIsPending] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: valibotResolver(ForgotPasswordFormSchema()),
    defaultValues: FORGOT_PASSWORD_DEFAULT_FORM_VALUES,
    mode: "onSubmit",
  });

  const router = useRouter();

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    if (isPending) return;
    setIsPending(true);
    const formData = createFormData(data);
    const state = await forgotPasswordAction(formData);
    if (state?.err) {
      toast.custom((id) => (
        <WrongSonner id={id} title={to(state.err as string)} />
      ));
      setIsPending(false);
    }
    if (state.msg) {
      toast.custom((id) => (
        <SuccessSonner id={id} title={to(state.msg as string)} />
      ));
      router.push(`/reset-password-verification?email=${data.email}`);
    }
  };

  return (
    <Card className="w-full max-w-[26rem] overflow-hidden max-sm:shadow-none border-none pt-2">
      <div className="w-full h-32 relative flex items-center justify-center">
        <Image
          src="/icons/shield.png"
          alt=""
          width={512}
          height={512}
          className="w-auto h-full absolute"
        />
      </div>
      <CardHeader className="text-center px-6 sm:px-10">
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
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
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>
                    {tf("email.label")}
                    <span className="text-destructive ms-0.5">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder={tf("email.placeholder")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SubmitPressedButton isPending={isPending}>
              {tb("sendResetCode")}
            </SubmitPressedButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordForm;
