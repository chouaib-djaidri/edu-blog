"use client";

import { Badge } from "@/components/ui/badge";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TagField } from "@/components/ui/tag-field";
import { Textarea } from "@/components/ui/textarea";
import { cn, getLevelBadgeClasses } from "@/lib/utils";
import { TestFormValues } from "@/schemas/creator/test-form.schema";
import { EnglishLevel } from "@/types/globals";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

const Step1 = () => {
  const tf = useTranslations("Fields");
  const { control } = useFormContext<TestFormValues>();

  return (
    <div className="flex flex-col gap-4">
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {tf("title.label")}
              <span className="text-destructive ms-0.5">*</span>
            </FormLabel>
            <FormControl>
              <Input {...field} placeholder={tf("title.testPlaceholder")} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="categories"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {tf("categories.label")}
              <span className="text-destructive ms-0.5">*</span>
            </FormLabel>
            <FormControl>
              <TagField
                placeholder={tf("categories.placeholder")}
                value={field.value}
                onChange={field.onChange}
                maxTags={3}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="level"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {tf("level.label")}
              <span className="text-destructive ms-0.5">*</span>
            </FormLabel>
            <FormControl>
              <RadioGroup
                className="flex flex-wrap gap-1.5"
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                {Object.keys(EnglishLevel).map((item) => (
                  <FormItem
                    key={item}
                    className="flex items-center space-x-0 space-y-0"
                  >
                    <FormControl>
                      <RadioGroupItem
                        className="sr-only after:absolute after:inset-0"
                        value={item}
                      />
                    </FormControl>
                    <Badge
                      asChild
                      className={cn(
                        "cursor-pointer",
                        getLevelBadgeClasses(item),
                        item !== field.value && "opacity-50"
                      )}
                    >
                      <FormLabel>
                        {item} {tf("level.title")}
                      </FormLabel>
                    </Badge>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel>
              {tf("description.label")}
              <span className="text-destructive ms-0.5">*</span>
            </FormLabel>
            <FormControl>
              <Textarea
                {...field}
                className="resize-none min-h-20"
                placeholder={tf("description.testPlaceholder")}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default Step1;
