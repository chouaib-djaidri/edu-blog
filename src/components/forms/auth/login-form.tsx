"use client";

import SubmitPressedButton from "@/components/buttons/submit-pressed-button";
import {
  LOGIN_DEFAULT_FORM_VALUES,
  LoginFormSchema,
  LoginFormValues,
} from "@/schemas/auth/login.schema";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import GoogleProviderButton from "../../buttons/google-provider-button";
import WrongSonner from "../../sonners/wrong-sonner";
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
import { Input } from "../../ui/input";
import { Separator } from "../../ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createFormData } from "@/lib/utils";
import { loginAction } from "@/actions/auth/login";
import { googleProviderAction } from "@/actions/auth/providers";

const LoginForm = () => {
  const tf = useTranslations("Fields");
  const t = useTranslations("Login");
  const tb = useTranslations("Buttons");
  const to = useTranslations("Toasts");

  const [isPending, setIsPending] = useState<"google" | "email" | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: valibotResolver(LoginFormSchema()),
    defaultValues: LOGIN_DEFAULT_FORM_VALUES,
    mode: "onSubmit",
  });

  const onSubmit = async (data: LoginFormValues) => {
    if (isPending) return;
    setIsPending("email");
    const formData = createFormData(data);
    const state = await loginAction(formData);
    if (state?.err) {
      toast.custom((id) => (
        <WrongSonner id={id} title={to(state.err as string)} />
      ));
      setIsPending(null);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const hash = window.location.hash;
      const hashParams = new URLSearchParams(hash.replace("#", ""));
      const error = hashParams.get("error");
      if (error) {
        const errorKey =
          error === "access_denied"
            ? "accessDenied"
            : error === "unauthorized_client"
              ? "unauthorizedClient"
              : "default";
        toast.custom((id) => (
          <WrongSonner
            id={id}
            title={to(`auth.googleProviderError.${errorKey}`)}
          />
        ));
      }
    }, 0);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="w-full max-w-md shadow-none border-none px-6 py-0">
      <CardHeader className="px-0">
        <CardTitle className="text-2xl">{t("title")}</CardTitle>
        <CardDescription className="text-sm">
          {t("description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-0">
        <GoogleProviderButton
          isPending={isPending === "google"}
          disabled={isPending === "email"}
          onClick={async () => {
            setIsPending("google");
            const state = await googleProviderAction();
            if (state?.err) {
              setIsPending(null);
            }
          }}
        >
          {tb("continueWithGoogle")}
        </GoogleProviderButton>
        <div className="flex items-center gap-2 w-full">
          <Separator className="flex-1 bg-border" />
          <span className="text-muted-foreground pb-0.5">
            {tb("orContinueWithEmail")}
          </span>
          <Separator className="flex-1 bg-border" />
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col gap-4 w-full"
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
            <div className="space-y-1">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>
                      {tf("password.label")}
                      <span className="text-destructive ms-0.5">*</span>
                    </FormLabel>
                    <div className="flex relative items-center">
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder={tf("password.placeholder")}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end pt-2.5 pb-1">
                <Button
                  asChild
                  variant="link"
                  className="font-normal text-muted-foreground text-sm"
                >
                  <Link href="/forgot-password">{tb("forgotPass")}</Link>
                </Button>
              </div>
              <SubmitPressedButton
                isPending={isPending === "email"}
                parentClassName="mt-3"
              >
                {tb("login")}
              </SubmitPressedButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
