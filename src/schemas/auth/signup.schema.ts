import { EMAIL_REG, FULL_NAME_REG, PASSWORD_REG } from "@/constants/reg";
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

export const MIN_BIRTH_DAY = new Date(1950, 0, 1);
export const MAX_BIRTH_DAY = new Date(new Date().getFullYear() - 3, 11, 31);

export const SignupServerFormSchema = pipe(
  object({
    fullName: pipe(
      string(),
      nonEmpty(),
      regex(FULL_NAME_REG),
      minLength(2),
      maxLength(50)
    ),
    email: pipe(string(), nonEmpty(), email(), regex(EMAIL_REG)),
    password: pipe(
      string(),
      nonEmpty(),
      minLength(8),
      maxLength(30),
      regex(PASSWORD_REG)
    ),
  })
);

export const SignupFormSchema = () => {
  const tv = useTranslations("Validation");
  return pipe(
    object({
      fullName: pipe(
        string(tv("fullName.invalid")),
        nonEmpty(tv("fullName.required")),
        regex(FULL_NAME_REG, tv?.("fullName.invalidFormat")),
        minLength(2, tv("fullName.tooShort")),
        maxLength(50, tv("fullName.tooLong"))
      ),
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
    })
  );
};

export type SignupFormValues = InferOutput<ReturnType<typeof SignupFormSchema>>;
export type SignupFormKeys = keyof SignupFormValues;

export const SIGNUP_DEFAULT_FORM_VALUES: SignupFormValues = {
  fullName: "",
  email: "",
  password: "",
};
