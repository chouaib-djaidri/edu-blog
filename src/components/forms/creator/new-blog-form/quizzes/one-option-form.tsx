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
import { cn } from "@/lib/utils";
import { BlogFormValues } from "@/schemas/creator/blog-form.schema";
import { QuizType, TitleIdProps } from "@/types/globals";
import { CirclePlus, Trash2, X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

const OneOptionForm = ({
  setQuiz,
}: {
  setQuiz: Dispatch<SetStateAction<QuizType | "no-type">>;
}) => {
  const { control, watch, setValue, clearErrors } =
    useFormContext<BlogFormValues>();
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "quiz.metadata.data",
  }) as unknown as {
    fields: TitleIdProps[];
    append: (value: TitleIdProps) => void;
    remove: (index: number) => void;
  };
  const correctAnswer = watch("quiz.metadata.correctAnswer.id");
  const handleAddOption = () => {
    if (fields.length < 4) {
      append({
        id: crypto.randomUUID(),
        title: "",
      });
    }
  };
  const handleDeleteOption = (index: number) => {
    if (fields.length > 2) {
      const actualId = watch(`quiz.metadata.data.${index}.id`);
      const isCorrectAnswer = actualId === correctAnswer;
      remove(index);
      if (isCorrectAnswer) {
        setValue(
          "quiz.metadata.correctAnswer.id",
          watch(`quiz.metadata.data.${0}.id`)
        );
      }
    }
  };

  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="flex flex-col items-center gap-2 w-full">
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
      <div className="flex flex-col gap-2">
        {fields.map((field, index) => {
          const actualData = watch(`quiz.metadata.data.${index}`);
          const actualId = actualData?.id;
          return (
            <div key={field.id} className="flex items-center gap-2 relative">
              <div
                className={cn(
                  "size-4 bg-red-200 border-red-400 border absolute -start-6 rounded-full cursor-pointer",
                  correctAnswer === actualId && "bg-green-200 border-green-400"
                )}
                onClick={() => {
                  setValue(
                    "quiz.metadata.correctAnswer.id",
                    watch(`quiz.metadata.data.${index}.id`)
                  );
                }}
              />
              <FormField
                control={control}
                name={`quiz.metadata.data.${index}.title`}
                render={({ field: titleField }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="sr-only">
                      Option {index + 1}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`Enter Option ${index + 1}`}
                        {...titleField}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {fields.length > 2 && (
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
          );
        })}
        {fields.length < 4 && (
          <Button
            type="button"
            variant="outline"
            className="h-11"
            onClick={handleAddOption}
          >
            <CirclePlus className="size-4.5" strokeWidth={1.5} />
            Add New Option
          </Button>
        )}
      </div>
    </div>
  );
};

export default OneOptionForm;
