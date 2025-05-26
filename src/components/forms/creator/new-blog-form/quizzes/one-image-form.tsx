/* eslint-disable @typescript-eslint/no-explicit-any */
import LogoIcon from "@/assets/icons/logo-icon";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UploadImageWithDrag } from "@/components/uploader/upload-image-with-drag";
import { getPreview } from "@/lib/paths";
import { cn } from "@/lib/utils";
import { BlogFormValues } from "@/schemas/creator/blog-form.schema";
import { ImageIdProps, QuizType } from "@/types/globals";
import { ImageIcon, Trash2, X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

const OneImageForm = ({
  setQuiz,
}: {
  setQuiz: Dispatch<SetStateAction<QuizType | "no-type">>;
}) => {
  const { control, watch, setValue, formState, clearErrors } =
    useFormContext<BlogFormValues>();
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "quiz.metadata.data",
  }) as unknown as {
    fields: ImageIdProps[];
    append: (value: ImageIdProps) => void;
    remove: (index: number) => void;
  };
  const correctAnswer = watch("quiz.metadata.correctAnswer.id");
  const { quiz: quizError } = formState.errors;

  const handleAddOption = () => {
    if (fields.length < 4) {
      append({
        id: crypto.randomUUID(),
        imageUrl: "",
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
      <div className="grid grid-cols-2 gap-2 w-full relative max-w-72">
        {fields.map((field, index) => (
          <div className="relative group" key={field.id}>
            <UploadImageWithDrag
              onUpload={(url) =>
                setValue(`quiz.metadata.data.${index}.imageUrl`, url, {
                  shouldValidate: true,
                })
              }
              mimeTypes={["image/jpeg", "image/png"]}
              onDelete={() => {
                if (fields.length > 2) handleDeleteOption(index);
                else setValue(`quiz.metadata.data.${index}.imageUrl`, "");
              }}
              className={cn(
                "w-full aspect-square",
                index === 0 &&
                  "[&>div.upload]:border-green-600 [&>div.upload]:bg-green-50 [&>div.upload]:hover:bg-green-100/70",
                (quizError as any)?.metadata?.data?.[index] &&
                  "[&>div.upload]:border-destructive [&>div.upload]:bg-destructive/5 [&>div.upload]:hover:bg-destructive/10"
              )}
              defaultPreview={getPreview(field.imageUrl, "quiz-images")}
            />
            {fields.length > 2 && !field.imageUrl && (
              <button
                className="group-hover:flex size-6 items-center justify-center absolute end-2 top-2 text-destructive hidden cursor-pointer"
                onClick={() => handleDeleteOption(index)}
              >
                <Trash2 className="size-4" strokeWidth={1.5} />
              </button>
            )}
          </div>
        ))}
        {fields.length < 4 && (
          <div
            className="w-full aspect-square relative overflow-hidden rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:bg-muted/75 cursor-pointer"
            onClick={handleAddOption}
          >
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <ImageIcon className="size-12" strokeWidth={1} />
              <p className="text-sm font-medium text-center">Add Card</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OneImageForm;
