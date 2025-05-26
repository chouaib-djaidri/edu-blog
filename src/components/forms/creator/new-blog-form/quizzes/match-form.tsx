import LogoIcon from "@/assets/icons/logo-icon";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BlogFormValues } from "@/schemas/creator/blog-form.schema";
import { OrderIdProps, QuizType, TitleIdProps } from "@/types/globals";
import { CircleArrowRight, CirclePlus, Trash2, X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

const MatchForm = ({
  setQuiz,
}: {
  setQuiz: Dispatch<SetStateAction<QuizType | "no-type">>;
}) => {
  const { control, watch, setValue, clearErrors } =
    useFormContext<BlogFormValues>();
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "quiz.metadata.data.r",
  }) as unknown as {
    fields: TitleIdProps[];
    append: (value: TitleIdProps) => void;
    remove: (index: number) => void;
  };
  const { append: lAppend, remove: lRemove } = useFieldArray({
    control: control,
    name: "quiz.metadata.data.l",
  }) as unknown as {
    fields: TitleIdProps[];
    append: (value: TitleIdProps) => void;
    remove: (index: number) => void;
  };

  const handleAddOption = () => {
    if (fields.length < 9) {
      append({
        id: crypto.randomUUID(),
        title: "",
      });
      lAppend({
        id: crypto.randomUUID(),
        title: "",
      });
    }
  };

  const handleDeleteOption = (index: number) => {
    if (fields.length > 3) {
      const removedItemId = watch(`quiz.metadata.data.${index}.id`);
      const currentCorrectAnswer = watch(
        "quiz.metadata.correctAnswer"
      ) as OrderIdProps[];
      remove(index);
      lRemove(index);
      const updatedCorrectAnswer = currentCorrectAnswer
        .filter((item) => item.id !== removedItemId)
        .map((item, idx) => ({ id: item.id, order: idx }));
      setValue("quiz.metadata.correctAnswer", updatedCorrectAnswer);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 items-center">
      <div className="flex flex-col items-center gap-2 w-full max-w-sm">
        <div className="w-full flex items-center justify-center h-9 relative">
          <LogoIcon className="h-9 w-auto absolute" />
          <button
            className="absolute end-0 cursor-pointer"
            onClick={() => {
              setValue("quiz", "");
              setQuiz("no-type");
              clearErrors();
            }}
          >
            <X className="size-4.5 text-foreground hover:text-destructive transition-colors" />
          </button>
        </div>
        <FormField
          control={control}
          name="quiz.question"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="sr-only">
                Quiz Question: <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Write your question here..."
                  className="text-center"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex flex-wrap gap-2 w-full max-w-lg">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex gap-3 w-full items-center relative"
          >
            <FormField
              control={control}
              name={`quiz.metadata.data.l.${index}.title`}
              render={({ field: titleField }) => (
                <FormItem className="flex-1">
                  <FormLabel className="sr-only">Option {index + 1}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={`Option ${index + 1}`}
                      {...titleField}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex items-center">
              <CircleArrowRight
                className="size-5 text-muted-foreground"
                strokeWidth={1.5}
              />
            </div>
            <FormField
              control={control}
              name={`quiz.metadata.data.r.${index}.title`}
              render={({ field: titleField }) => (
                <FormItem className="flex-1">
                  <FormLabel className="sr-only">Answer {index + 1}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={`Answer ${index + 1}`}
                      {...titleField}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {fields.length > 3 && (
              <button
                type="button"
                className="size-6 shrink-0 text-destructive cursor-pointer absolute -end-8"
                onClick={() => {
                  handleDeleteOption(index);
                }}
              >
                <Trash2 className="size-4" strokeWidth={1.5} />
              </button>
            )}
          </div>
        ))}
        {fields.length < 4 && (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleAddOption}
          >
            <CirclePlus className="size-4.5" strokeWidth={1.5} />
            Add Option
          </Button>
        )}
      </div>
    </div>
  );
};

export default MatchForm;
