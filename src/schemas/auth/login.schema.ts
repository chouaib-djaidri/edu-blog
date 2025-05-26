import { EMAIL_REG, PASSWORD_REG } from "@/constants/reg";
import { useTranslations } from "next-intl";
import {
  email,
  InferOutput,
  maxLength,
  minLength,
  nonEmpty,
  object,
  pipe,
  regex,
  string,
} from "valibot";

export const LoginServerFormSchema = object({
  email: pipe(string(), nonEmpty(), email(), regex(EMAIL_REG)),
  password: pipe(
    string(),
    nonEmpty(),
    minLength(8),
    maxLength(30),
    regex(PASSWORD_REG)
  ),
});

export const LoginFormSchema = () => {
  const tv = useTranslations("Validation");
  return object({
    email: pipe(
      string(tv("email.invalid")),
      nonEmpty(tv("email.required")),
      email(tv("email.invalidEmail")),
      regex(EMAIL_REG, tv?.("email.invalidFormat"))
    ),
    password: pipe(
      string(tv("password.invalid")),
      nonEmpty(tv("password.required")),
      minLength(8, tv("password.tooShort")),
      maxLength(30, tv("password.tooLong")),
      regex(PASSWORD_REG, tv("password.invalidFormat"))
    ),
  });
};

export type LoginFormValues = InferOutput<ReturnType<typeof LoginFormSchema>>;
export type LoginFormKeys = keyof LoginFormValues;

export const LOGIN_DEFAULT_FORM_VALUES: LoginFormValues = {
  email: "",
  password: "",
};
