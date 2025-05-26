"use client";

import { resetPasswordAction } from "@/actions/auth/reset-password";
import ShowPasswordButton from "@/components/buttons/show-password-button";
import SubmitPressedButton from "@/components/buttons/submit-pressed-button";
import SuccessSonner from "@/components/sonners/success-sonner";
import WrongSonner from "@/components/sonners/wrong-sonner";
import { Input } from "@/components/ui/input";
import { cn, createFormData } from "@/lib/utils";
import {
  RESET_PASSWORD_DEFAULT_FORM_VALUES,
  ResetPasswordFormSchema,
  ResetPasswordFormValues,
} from "@/schemas/auth/reset-password.schema";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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

const ResetPasswordForm = () => {
  const t = useTranslations("ResetPassword");
  const tf = useTranslations("Fields");
  const tb = useTranslations("Buttons");
  const to = useTranslations("Toasts");

  const [isPending, setIsPending] = useState(false);
  const [showPwd, setShowPwd] = useState({
    new: false,
    confirm: false,
  });

  const form = useForm<ResetPasswordFormValues>({
    resolver: valibotResolver(ResetPasswordFormSchema()),
    defaultValues: RESET_PASSWORD_DEFAULT_FORM_VALUES,
    mode: "onSubmit",
  });

  form.watch((data, { name }) => {
    if (data.confirmNewPassword && name === "newPassword") {
      form.trigger("confirmNewPassword");
    }
  });

  const {
    newPassword: newPasswordError,
    confirmNewPassword: confirmNewPasswordError,
  } = form.formState.errors;

  const router = useRouter();

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (isPending) return;
    setIsPending(true);
    const formData = createFormData(data);
    const state = await resetPasswordAction(formData);
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
      router.push(state.data as string);
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
            className="flex flex-col gap-4 w-full"
          >
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>
                    {tf("newPassword.label")}
                    <span className="text-destructive ms-0.5">*</span>
                  </FormLabel>
                  <div className="flex relative items-center">
                    <FormControl>
                      <Input
                        {...field}
                        type={showPwd.new ? "text" : "password"}
                        placeholder={tf("newPassword.placeholder")}
                      />
                    </FormControl>
                    <ShowPasswordButton
                      className={cn(
                        newPasswordError &&
                          "text-destructive/60 hover:text-destructive"
                      )}
                      onClick={() => {
                        setShowPwd((prev) => ({
                          ...prev,
                          new: !prev.new,
                        }));
                      }}
                      show={showPwd.new}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>
                    {tf("confirmNewPassword.label")}
                    <span className="text-destructive ms-0.5">*</span>
                  </FormLabel>
                  <div className="flex relative items-center">
                    <FormControl>
                      <Input
                        {...field}
                        type={showPwd.confirm ? "text" : "password"}
                        placeholder={tf("confirmNewPassword.placeholder")}
                      />
                    </FormControl>
                    <ShowPasswordButton
                      className={cn(
                        confirmNewPasswordError &&
                          "text-destructive/60 hover:text-destructive"
                      )}
                      onClick={() => {
                        setShowPwd((prev) => ({
                          ...prev,
                          confirm: !prev.confirm,
                        }));
                      }}
                      show={showPwd.confirm}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SubmitPressedButton isPending={isPending} parentClassName="mt-1">
              {tb("resetPassword")}
            </SubmitPressedButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ResetPasswordForm;
