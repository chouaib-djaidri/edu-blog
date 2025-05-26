import { EMAIL_REG, PIN_REG } from "@/constants/reg";
import { useTranslations } from "next-intl";
import {
  InferOutput,
  minLength,
  nonEmpty,
  object,
  pipe,
  string,
  regex,
  email,
} from "valibot";

export const OTPVerificationServerFormSchema = object({
  pin: pipe(string(), nonEmpty(), minLength(6)),
  email: pipe(string(), nonEmpty(), email(), regex(EMAIL_REG)),
});

export const OTPVerificationFormSchema = () => {
  const tv = useTranslations("Validation");
  return object({
    pin: pipe(
      string(tv("pin.invalid")),
      nonEmpty(tv("pin.required")),
      regex(PIN_REG, tv("pin.invalidFormat"))
    ),
    email: pipe(
      string(tv("email.invalid")),
      nonEmpty(tv("email.required")),
      email(tv("email.invalidEmail")),
      regex(EMAIL_REG, tv?.("email.invalidFormat"))
    ),
  });
};

export type OTPVerificationFormValues = InferOutput<
  ReturnType<typeof OTPVerificationFormSchema>
>;
export type OTPVerificationFormKeys = keyof OTPVerificationFormValues;
export const OTP_VERIFICATION_DEFAULT_FORM_VALUES = {
  pin: "",
};
