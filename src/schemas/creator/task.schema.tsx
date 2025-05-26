import { useTranslations } from "next-intl";
import {
  date,
  InferOutput,
  maxLength,
  minLength,
  nonEmpty,
  object,
  pipe,
  string,
  minValue,
  enum_,
} from "valibot";

export const TaskPriority = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const;

export const TaskFormSchema = () => {
  const tv = useTranslations("Validation");

  return pipe(
    object({
      title: pipe(
        string(tv("task.title.invalid")),
        nonEmpty(tv("task.title.required")),
        minLength(2, tv("task.title.tooShort")),
        maxLength(100, tv("task.title.tooLong"))
      ),
      description: pipe(
        string(tv("task.description.invalid")),
        maxLength(255, tv("task.description.tooLong"))
      ),
      priority: pipe(enum_(TaskPriority, tv("task.priority.invalidOption"))),
      dueDate: pipe(
        date(tv("task.dueDate.invalid")),
        minValue(new Date(), tv("task.dueDate.min"))
      ),
    })
  );
};

export type TaskFormValues = InferOutput<ReturnType<typeof TaskFormSchema>>;
export type TaskFormKeys = keyof TaskFormValues;

export const TASK_DEFAULT_FORM_VALUES: TaskFormValues = {
  title: "",
  description: "",
  priority: TaskPriority.MEDIUM,
  dueDate: new Date(Date.now() + 86400000),
};
