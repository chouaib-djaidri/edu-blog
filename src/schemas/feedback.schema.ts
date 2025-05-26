/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  InferOutput,
  maxLength,
  minLength,
  nonEmpty,
  number,
  object,
  pipe,
  string,
  integer,
  minValue,
  maxValue,
} from "valibot";

export const FeedbackFormSchema = (t?: any) => {
  return object({
    feedback: pipe(
      string(t?.("feedback.invalid")),
      nonEmpty(t?.("feedback.required")),
      minLength(1, t?.("feedback.tooShort")),
      maxLength(500, t?.("feedback.tooLong"))
    ),
    rate: pipe(
      number(t?.("rate.invalid")),
      integer(t?.("rate.mustBeInteger")),
      minValue(1, t?.("rate.tooLow")),
      maxValue(5, t?.("rate.tooHigh"))
    ),
  });
};

export type FeedbackFormValues = InferOutput<
  ReturnType<typeof FeedbackFormSchema>
>;
export type FeedbackFormKeys = keyof FeedbackFormValues;

export const FEEDBACK_DEFAULT_FORM_VALUES: FeedbackFormValues = {
  feedback: "",
  rate: 5,
};
