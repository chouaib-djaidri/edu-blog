"use client";

import SubmitButton from "@/components/buttons/submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/user";
import { getPreview } from "@/lib/paths";
import { ProfileFormSchema, ProfileFormValues } from "@/schemas/profile.schema";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { UploadAvatarWithDrag } from "../uploader/upload-avatar-with-drag";
import { useState } from "react";
import { toast } from "sonner";
import SuccessSonner from "../sonners/success-sonner";
import WrongSonner from "../sonners/wrong-sonner";
import { compareStr, createFormData } from "@/lib/utils";
import { settingsAction } from "@/actions/settings";

const ProfileForm = () => {
  const [isPending, setIsPending] = useState(false);
  const tb = useTranslations("Buttons");
  const tf = useTranslations("Fields");
  const to = useTranslations("Toasts");
  const { userData, setUserData } = useUser();

  const form = useForm<ProfileFormValues>({
    resolver: valibotResolver(ProfileFormSchema()),
    defaultValues: {
      fullName: userData?.fullName || "",
      email: userData?.email || "",
      avatarFile: userData?.avatarUrl || "",
    },
    mode: "onSubmit",
  });

  if (!userData) return <></>;

  const { fullName, avatarFile, email } = form.watch();
  const { avatarFile: avatarFileError } = form.formState.errors;

  const allowSubmit =
    !compareStr(fullName, userData.fullName) ||
    !compareStr(email, userData.email) ||
    avatarFile instanceof File ||
    (!!userData.avatarUrl && avatarFile === "");

  const onSubmit = async (data: ProfileFormValues) => {
    if (isPending) return;
    const realData = {
      ...(!compareStr(data.email, userData.email) && {
        email: data.email,
      }),
      ...(!compareStr(data.fullName, userData.fullName) && {
        fullName: data.fullName,
      }),
      ...((data.avatarFile instanceof File ||
        (!!userData.avatarUrl && data.avatarFile === "")) && {
        avatarFile: data.avatarFile === "" ? "deleted" : data.avatarFile,
      }),
      userId: userData.id,
    };
    setIsPending(true);
    const formData = createFormData(realData);
    const state = await settingsAction(formData);
    if (state?.err) {
      toast.custom((id) => (
        <WrongSonner id={id} title={to(state.err as string)} />
      ));
    }
    if (state.msg) {
      toast.custom((id) => (
        <SuccessSonner id={id} title={to(state.msg as string)} />
      ));
      setUserData({
        ...userData,
        ...state?.data,
      });
    }
    setIsPending(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="flex-1 flex flex-col items-center border rounded-xl overflow-hidden"
      >
        <div className="h-20 bg-foreground w-full">
          <FormField
            control={form.control}
            name="avatarFile"
            render={({ field }) => (
              <FormItem
                className="absolute start-7"
                title={tf("avatarFile.label")}
              >
                <FormLabel className="sr-only">
                  {tf("avatarFile.label")}
                  <span className="text-destructive ms-0.5">*</span>
                </FormLabel>
                <FormControl>
                  <UploadAvatarWithDrag
                    error={avatarFileError?.message}
                    onUpload={field.onChange}
                    onDelete={() => form.setValue("avatarFile", "")}
                    defaultPreview={getPreview(field.value, "avatars")}
                    className="border-4 border-background rounded-full translate-y-[50%] w-20"
                    fallBack={fullName?.[0]}
                  />
                </FormControl>
                <FormMessage className="ps-24" />
              </FormItem>
            )}
          />
        </div>
        <div className="px-6 pb-8 pt-15 w-full flex flex-col gap-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>
                  {tf("fullName.label")}
                  <span className="text-destructive ms-0.5">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={tf("fullName.userPlaceholder")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>
                  {tf("email.label")}
                  <span className="text-destructive ms-0.5">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder={tf("email.userPlaceholder")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex items-center gap-4 px-6 py-3 border-t w-full">
          <SubmitButton
            disabled={!allowSubmit}
            isPending={isPending}
            className="flex-1 disabled:opacity-60"
          >
            {tb("saveChanges")}
          </SubmitButton>
          <Button
            variant="link"
            type="button"
            onClick={() => {
              form.reset();
              form.setValue("avatarFile", userData.avatarUrl);
            }}
            className="disabled:text-muted-foreground flex-1"
            disabled={!allowSubmit || isPending}
          >
            {tb("reset")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
