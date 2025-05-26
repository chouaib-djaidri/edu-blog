import { PASSWORD_REG } from "@/constants/reg";
import { useTranslations } from "next-intl";
import {
  check,
  forward,
  InferOutput,
  maxLength,
  minLength,
  nonEmpty,
  object,
  pipe,
  regex,
  string,
} from "valibot";

export const ResetPasswordServerFormSchema = pipe(
  object({
    newPassword: pipe(
      string(),
      nonEmpty(),
      minLength(8),
      maxLength(30),
      regex(PASSWORD_REG)
    ),
    confirmNewPassword: pipe(string(), nonEmpty()),
  }),
  forward(
    check((data) => {
      return data.newPassword === data.confirmNewPassword;
    }),
    ["confirmNewPassword"]
  )
);

export const ResetPasswordFormSchema = () => {
  const tv = useTranslations("Validation");
  return pipe(
    object({
      newPassword: pipe(
        string(tv("newPassword.invalid")),
        nonEmpty(tv("newPassword.required")),
        minLength(8, tv("newPassword.tooShort")),
        maxLength(30, tv("newPassword.tooLong")),
        regex(PASSWORD_REG, tv("newPassword.invalidFormat"))
      ),
      confirmNewPassword: pipe(
        string(tv("confirmNewPassword.invalid")),
        nonEmpty(tv("confirmNewPassword.required"))
      ),
    }),
    forward(
      check((data) => {
        return data.newPassword === data.confirmNewPassword;
      }, tv("confirmNewPassword.mismatch")),
      ["confirmNewPassword"]
    )
  );
};

export type ResetPasswordFormValues = InferOutput<
  ReturnType<typeof ResetPasswordFormSchema>
>;
export type ResetPasswordFormKeys = keyof ResetPasswordFormValues;

export const RESET_PASSWORD_DEFAULT_FORM_VALUES: ResetPasswordFormValues = {
  newPassword: "",
  confirmNewPassword: "",
};

export const ChangePasswordServerFormSchema = pipe(
  object({
    currentPassword: pipe(
      string(),
      nonEmpty(),
      minLength(8),
      maxLength(30),
      regex(PASSWORD_REG)
    ),
    newPassword: pipe(
      string(),
      nonEmpty(),
      minLength(8),
      maxLength(30),
      regex(PASSWORD_REG)
    ),
  })
);

export const ChangePasswordFormSchema = () => {
  const tv = useTranslations("Validation");
  return pipe(
    object({
      currentPassword: pipe(
        string(tv("currentPassword.invalid")),
        nonEmpty(tv("currentPassword.required")),
        minLength(8, tv("currentPassword.tooShort")),
        maxLength(30, tv("currentPassword.tooLong")),
        regex(PASSWORD_REG, tv("currentPassword.invalidFormat"))
      ),
      newPassword: pipe(
        string(tv("newPassword.invalid")),
        nonEmpty(tv("newPassword.required")),
        minLength(8, tv("newPassword.tooShort")),
        maxLength(30, tv("newPassword.tooLong")),
        regex(PASSWORD_REG, tv("newPassword.invalidFormat"))
      ),
    })
  );
};

export type ChangePasswordFormValues = InferOutput<
  ReturnType<typeof ChangePasswordFormSchema>
>;
export type ChangePasswordFormKeys = keyof ChangePasswordFormValues;

export const CHANGE_PASSWORD_DEFAULT_FORM_VALUES: ChangePasswordFormValues = {
  currentPassword: "",
  newPassword: "",
};
