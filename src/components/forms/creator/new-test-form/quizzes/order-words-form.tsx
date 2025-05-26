"use client";

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
import { TestFormValues } from "@/schemas/creator/test-form.schema";
import { OrderIdProps, TitleIdProps } from "@/types/globals";
import { CirclePlus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

const OrderWordsForm = ({ currentQuiz }: { currentQuiz: number }) => {
  const { control, watch, setValue } = useFormContext<TestFormValues>();
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: `quizzes.${currentQuiz}.metadata.data`,
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
    }
  };

  const handleDeleteOption = (index: number) => {
    if (fields.length > 3) {
      const removedItemId = watch(
        `quizzes.${currentQuiz}.metadata.data.${index}.id`
      );
      const currentCorrectAnswer = watch(
        `quizzes.${currentQuiz}.metadata.correctAnswer`
      ) as OrderIdProps[];
      remove(index);
      const updatedCorrectAnswer = currentCorrectAnswer
        .filter((item) => item.id !== removedItemId)
        .map((item, idx) => ({ id: item.id, order: idx }));
      setValue(
        `quizzes.${currentQuiz}.metadata.correctAnswer`,
        updatedCorrectAnswer
      );
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 items-center">
      <div className="flex flex-col items-center gap-2 w-full max-w-sm">
        <div className="w-full flex items-center justify-center h-9 relative">
          <LogoIcon className="h-9 w-auto absolute" />
        </div>
        <FormField
          control={control}
          name={`quizzes.${currentQuiz}.question`}
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
      <div className="grid grid-cols-3 gap-2 w-full max-w-lg">
        {fields.map((field, index) => (
          <FormField
            key={field.id}
            control={control}
            name={`quizzes.${currentQuiz}.metadata.data.${index}.title`}
            render={({ field: titleField }) => (
              <FormItem>
                <FormLabel className="sr-only">Word {index + 1}</FormLabel>
                <FormControl>
                  <div className="relative flex items-center group">
                    <Input placeholder={`Word ${index + 1}`} {...titleField} />
                    {fields.length > 3 && (
                      <button
                        className="group-hover:flex size-6 items-center justify-center absolute end-1 text-destructive hidden cursor-pointer"
                        onClick={() => handleDeleteOption(index)}
                      >
                        <Trash2 className="size-4" strokeWidth={1.5} />
                      </button>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        {fields.length < 9 && (
          <Button type="button" variant="outline" onClick={handleAddOption}>
            <CirclePlus className="size-4.5" strokeWidth={1.5} />
            Add Word
          </Button>
        )}
      </div>
    </div>
  );
};

export default OrderWordsForm;
