"use client";

import SubmitPressedButton from "@/components/buttons/submit-pressed-button";
import { Input } from "@/components/ui/input";
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
import {
  CHANGE_PASSWORD_DEFAULT_FORM_VALUES,
  ChangePasswordFormSchema,
  ChangePasswordFormValues,
} from "@/schemas/auth/reset-password.schema";
import ShowPasswordButton from "@/components/buttons/show-password-button";
import { cn, createFormData } from "@/lib/utils";
import SuccessSonner from "@/components/sonners/success-sonner";
import WrongSonner from "@/components/sonners/wrong-sonner";
import { toast } from "sonner";
import { changePasswordAction } from "@/actions/auth/reset-password";
import { useRouter } from "next/navigation";

const ChangePasswordForm = () => {
  const t = useTranslations("ResetPassword");
  const tf = useTranslations("Fields");
  const tb = useTranslations("Buttons");
  const to = useTranslations("Toasts");

  const [isPending, setIsPending] = useState(false);
  const [showPwd, setShowPwd] = useState({
    new: false,
    current: false,
  });

  const form = useForm<ChangePasswordFormValues>({
    resolver: valibotResolver(ChangePasswordFormSchema()),
    defaultValues: CHANGE_PASSWORD_DEFAULT_FORM_VALUES,
    mode: "onSubmit",
  });

  const {
    currentPassword: currentPasswordError,
    newPassword: newPasswordError,
  } = form.formState.errors;

  const router = useRouter();

  const onSubmit = async (data: ChangePasswordFormValues) => {
    if (isPending) return;
    setIsPending(true);
    const formData = createFormData(data);
    const state = await changePasswordAction(formData);
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
        <CardTitle>{t("changeTitle")}</CardTitle>
        <CardDescription>{t("changeDescription")}</CardDescription>
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
              name="currentPassword"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>
                    {tf("currentPassword.label")}
                    <span className="text-destructive ms-0.5">*</span>
                  </FormLabel>
                  <div className="flex relative items-center">
                    <FormControl>
                      <Input
                        {...field}
                        type={showPwd.current ? "text" : "password"}
                        placeholder={tf("currentPassword.placeholder")}
                      />
                    </FormControl>
                    <ShowPasswordButton
                      className={cn(
                        currentPasswordError &&
                          "text-destructive/60 hover:text-destructive"
                      )}
                      onClick={() => {
                        setShowPwd((prev) => ({
                          ...prev,
                          current: !prev.current,
                        }));
                      }}
                      show={showPwd.current}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <SubmitPressedButton isPending={isPending} parentClassName="mt-1">
              {tb("changePassword")}
            </SubmitPressedButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ChangePasswordForm;
