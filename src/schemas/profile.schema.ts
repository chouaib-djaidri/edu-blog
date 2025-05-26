/* eslint-disable @typescript-eslint/no-explicit-any */
import { EMAIL_REG, FULL_NAME_REG } from "@/constants/reg";
import {
  email,
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

export const ProfileFormSchema = (t?: any) => {
  return object({
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
    avatarFile: union(
      [
        pipe(
          file(t?.("avatarFile.required")),
          mimeType(["image/jpeg", "image/png"], t?.("avatarFile.invalidMime")),
          maxSize(1024 * 1024 * 5, t?.("avatarFile.tooLarge"))
        ),
        pipe(string(), nonEmpty(t?.("avatarFile.required"))),
        literal(""),
      ],
      t?.("avatarFile.invalid")
    ),
  });
};

export type ProfileFormValues = InferOutput<
  ReturnType<typeof ProfileFormSchema>
>;
export type ProfileFormKeys = keyof ProfileFormValues;
