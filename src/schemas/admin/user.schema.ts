/* eslint-disable @typescript-eslint/no-explicit-any */
import { EMAIL_REG, FULL_NAME_REG, PASSWORD_REG } from "@/constants/reg";
import { EnglishLevel, Role } from "@/types/globals";
import {
  email,
  enum_,
  file,
  InferOutput,
  literal,
  maxLength,
  maxSize,
  mimeType,
  minLength,
  nonEmpty,
  object,
  pipe,
  regex,
  string,
  union,
} from "valibot";

export const UserFormSchema = (isUpdate: boolean = false, t?: any) => {
  return pipe(
    object({
      fullName: pipe(
        string(t?.("fullName.invalid")),
        nonEmpty(t?.("fullName.required")),
        regex(FULL_NAME_REG, t?.("fullName.invalidFormat")),
        minLength(2, t?.("fullName.tooShort")),
        maxLength(50, t?.("fullName.tooLong"))
      ),
      email: pipe(
        string(t?.("email.invalid")),
        nonEmpty(t?.("email.required")),
        email(t?.("email.invalidEmail")),
        regex(EMAIL_REG, t?.("email.invalidFormat"))
      ),
      password: isUpdate
        ? union([
            pipe(
              string(t?.("password.invalid")),
              nonEmpty(t?.("password.required")),
              minLength(8, t?.("password.tooShort")),
              maxLength(30, t?.("password.tooLong")),
              regex(PASSWORD_REG, t?.("password.invalidFormat"))
            ),
            literal(""),
          ])
        : pipe(
            string(t?.("password.invalid")),
            nonEmpty(t?.("password.required")),
            minLength(8, t?.("password.tooShort")),
            maxLength(30, t?.("password.tooLong")),
            regex(PASSWORD_REG, t?.("password.invalidFormat"))
          ),
      level: enum_(EnglishLevel, t?.("level.invalid")),
      role: enum_(Role, t?.("level.invalid")),
      avatarFile: union(
        [
          pipe(
            file(t?.("avatarFile.required")),
            mimeType(
              ["image/jpeg", "image/png"],
              t?.("avatarFile.invalidMime")
            ),
            maxSize(1024 * 1024 * 5, t?.("avatarFile.tooLarge"))
          ),
          pipe(string(), nonEmpty(t?.("avatarFile.required"))),
          literal(""),
        ],
        t?.("avatarFile.invalid")
      ),
    })
  );
};

export type UserFormValues = InferOutput<ReturnType<typeof UserFormSchema>>;
export type UserFormKeys = keyof UserFormValues;

export const USER_DEFAULT_FORM_VALUES: UserFormValues = {
  fullName: "",
  email: "",
  password: "",
  level: EnglishLevel.A1,
  role: Role.USER,
  avatarFile: "",
};
