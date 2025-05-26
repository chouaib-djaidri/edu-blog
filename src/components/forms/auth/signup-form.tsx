"use client";

import { signupAction } from "@/actions/auth/signup";
import SubmitPressedButton from "@/components/buttons/submit-pressed-button";
import { cn, createFormData } from "@/lib/utils";
import {
  SIGNUP_DEFAULT_FORM_VALUES,
  SignupFormSchema,
  SignupFormValues,
} from "@/schemas/auth/signup.schema";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import GoogleProviderButton from "../../buttons/google-provider-button";
import ShowPasswordButton from "../../buttons/show-password-button";
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
import { googleProviderAction } from "@/actions/auth/providers";

const SignupForm = () => {
  const tf = useTranslations("Fields");
  const t = useTranslations("Signup");
  const tb = useTranslations("Buttons");
  const to = useTranslations("Toasts");

  const [isPending, setIsPending] = useState<"google" | "email" | null>(null);
  const [showPwd, setShowPwd] = useState({
    new: false,
    confirm: false,
  });

  const form = useForm<SignupFormValues>({
    resolver: valibotResolver(SignupFormSchema()),
    defaultValues: SIGNUP_DEFAULT_FORM_VALUES,
    mode: "onSubmit",
  });

  const { password: passwordError } = form.formState.errors;

  const onSubmit = async (data: SignupFormValues) => {
    if (isPending) return;
    setIsPending("email");
    const formData = createFormData(data);
    const state = await signupAction(formData);
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
        <CardDescription>{t("description")}</CardDescription>
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
              name="fullName"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>
                    {tf("fullName.label")}
                    <span className="text-destructive ms-0.5">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={tf("fullName.placeholder")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                    <ShowPasswordButton
                      className={cn(
                        passwordError &&
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
            <SubmitPressedButton
              isPending={isPending === "email"}
              parentClassName="mt-1"
            >
              {tb("createNewAcc")}
            </SubmitPressedButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SignupForm;
