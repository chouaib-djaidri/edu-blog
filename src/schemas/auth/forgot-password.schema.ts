import { EMAIL_REG } from "@/constants/reg";
import { useTranslations } from "next-intl";
import {
  email,
  InferOutput,
  nonEmpty,
  object,
  pipe,
  regex,
  string,
} from "valibot";

export const ForgotPasswordServerFormSchema = object({
  email: pipe(string(), nonEmpty(), email(), regex(EMAIL_REG)),
});

export const ForgotPasswordFormSchema = () => {
  const tv = useTranslations("Validation");
  return object({
    email: pipe(
      string(tv("email.invalid")),
      nonEmpty(tv("email.required")),
      email(tv("email.invalidEmail")),
      regex(EMAIL_REG, tv?.("email.invalidFormat"))
    ),
  });
};

export type ForgotPasswordFormValues = InferOutput<
  ReturnType<typeof ForgotPasswordFormSchema>
>;
export type ForgotPasswordFormKeys = keyof ForgotPasswordFormValues;

export const FORGOT_PASSWORD_DEFAULT_FORM_VALUES: ForgotPasswordFormValues = {
  email: "",
};
