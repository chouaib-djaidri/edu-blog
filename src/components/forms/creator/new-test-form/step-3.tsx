"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { UploadImageWithDrag } from "@/components/uploader/upload-image-with-drag";
import { getPreview } from "@/lib/paths";
import { TestFormValues } from "@/schemas/creator/test-form.schema";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

const Step3 = () => {
  const tf = useTranslations("Fields");
  const { setValue, formState, control } = useFormContext<TestFormValues>();
  const { coverFile: coverFileError } = formState.errors;
  return (
    <div className="p-6 w-full">
      <FormField
        control={control}
        name="coverFile"
        render={({ field }) => (
          <FormItem
            className="flex-1 max-w-lg mx-auto"
            title={tf("cover.label")}
          >
            <FormLabel className="sr-only">
              {tf("cover.label")}
              <span className="text-destructive ms-0.5">*</span>
            </FormLabel>
            <FormControl>
              <UploadImageWithDrag
                error={coverFileError?.message}
                onUpload={field.onChange}
                mimeTypes={["image/jpeg", "image/png"]}
                onDelete={() => setValue("coverFile", "")}
                defaultPreview={getPreview(field.value, "test-covers")}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default Step3;
