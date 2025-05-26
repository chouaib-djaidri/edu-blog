"use client";

import { addUserAction, updateUserAction } from "@/actions/admin/users";
import SubmitButton from "@/components/buttons/submit-button";
import { usersQueries } from "@/components/data-table/users/queries";
import { UserProps } from "@/components/data-table/users/types";
import WrongSonner from "@/components/sonners/wrong-sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadAvatarWithDrag } from "@/components/uploader/upload-avatar-with-drag";
import { getPreview } from "@/lib/paths";
import {
  cn,
  compareStr,
  createFormData,
  getLevelBadgeClasses,
  getRoleBadgeClasses,
} from "@/lib/utils";
import {
  USER_DEFAULT_FORM_VALUES,
  UserFormSchema,
  UserFormValues,
} from "@/schemas/admin/user.schema";
import { EnglishLevel, Role } from "@/types/globals";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Table } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import ShowPasswordButton from "../../buttons/show-password-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import SuccessSonner from "@/components/sonners/success-sonner";

const UserForm = ({
  table,
  setIsOpen,
  userToUpdate,
}: {
  table: Table<UserProps>;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  userToUpdate: UserProps | null;
}) => {
  const isUpdating = !!userToUpdate;
  const tf = useTranslations("Fields");
  const tb = useTranslations("Buttons");
  const to = useTranslations("Toasts");
  const tv = useTranslations("Validation");

  const [showPwd, setShowPwd] = useState({
    new: false,
    confirm: false,
  });

  const form = useForm<UserFormValues>({
    resolver: valibotResolver(UserFormSchema(isUpdating, tv)),
    defaultValues: userToUpdate
      ? {
          avatarFile: userToUpdate.avatarUrl || "",
          email: userToUpdate.email,
          fullName: userToUpdate.fullName,
          level:
            userToUpdate.role !== Role.USER
              ? EnglishLevel.A1
              : userToUpdate.level,
          role: userToUpdate.role,
          password: "",
        }
      : USER_DEFAULT_FORM_VALUES,
    mode: "onSubmit",
  });

  const queryClient = useQueryClient();

  const bulkAddMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const action = isUpdating ? updateUserAction : addUserAction;
      const state = await action(formData);
      if (state.msg) return state.msg;
      throw new Error(state.err);
    },
    onSuccess: (e) => {
      queryClient.invalidateQueries({
        queryKey: usersQueries.all,
      });
      toast.custom((id) => <SuccessSonner id={id} title={to(e)} />);
      table.resetRowSelection();
      form.reset();
      setIsOpen(false);
    },
    onError: (e) => {
      toast.custom((id) => <WrongSonner id={id} title={to(e.message)} />);
    },
  });

  const onSubmit = async (data: UserFormValues) => {
    const realData = isUpdating
      ? {
          ...(!compareStr(data.email, userToUpdate.email) && {
            email: data.email,
          }),
          ...(!compareStr(data.fullName, userToUpdate.fullName) && {
            fullName: data.fullName,
          }),
          ...((!compareStr(data.role, userToUpdate.role) ||
            (data.role === Role.USER &&
              !compareStr(data.level, userToUpdate.level) &&
              compareStr(data.role, userToUpdate.role))) && {
            role: data.role,
            currentRole: userToUpdate.role,
          }),
          ...((data.avatarFile instanceof File ||
            (!!userToUpdate.avatarUrl && data.avatarFile === "")) && {
            avatarFile: data.avatarFile === "" ? "deleted" : data.avatarFile,
          }),
          ...(role === Role.USER &&
            !compareStr(data.level, userToUpdate.level) && {
              level: data.level,
            }),
          ...(!!data.password && {
            password: data.password,
          }),
          userId: userToUpdate.id,
        }
      : data;
    const formData = createFormData(realData);
    bulkAddMutation.mutate(formData);
  };

  const { avatarFile: avatarFileError, password: passwordError } =
    form.formState.errors;

  const { avatarFile, email, fullName, level, password, role } = form.watch();

  const allowSubmit = isUpdating
    ? !compareStr(fullName, userToUpdate.fullName) ||
      !compareStr(email, userToUpdate.email) ||
      !compareStr(role, userToUpdate.role) ||
      (role === Role.USER && !compareStr(level, userToUpdate.level)) ||
      !!password ||
      avatarFile instanceof File ||
      (!!userToUpdate.avatarUrl && avatarFile === "")
    : true;
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col"
        noValidate
      >
        <ScrollArea className="w-full h-full max-h-[calc(100svh-12rem)]">
          <div className="flex flex-col items-center w-full">
            <div className="h-20 bg-foreground w-full">
              <FormField
                control={form.control}
                name="avatarFile"
                render={({ field }) => (
                  <FormItem
                    className="absolute start-5"
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
              <div className="flex gap-2">
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      {tf("password.label")}
                      <span className="text-destructive ms-0.5">*</span>
                    </FormLabel>
                    <div className="flex relative items-center">
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder={tf("password.userPlaceholder")}
                        />
                      </FormControl>
                      <ShowPasswordButton
                        className={cn(
                          passwordError &&
                            "text-destructive/60 hover:text-destructive"
                        )}
                        onClick={() => {
                          setShowPwd((prev) => ({
                            ...prev,
                            new: !prev.new,
                          }));
                        }}
                        show={showPwd.new}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      {tf("role.label")}
                      <span className="text-destructive ms-0.5">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="[&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0 w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="[&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0">
                        {Object.keys(Role).map((role) => {
                          const roleValue = Role[role as keyof typeof Role];
                          return (
                            <SelectItem value={roleValue} key={role}>
                              <span className="flex items-center gap-2">
                                <div
                                  className={cn(
                                    "shrink-0 size-2 rounded-full",
                                    getRoleBadgeClasses(roleValue)
                                  )}
                                />
                                <span className="truncate capitalize">
                                  {roleValue}
                                </span>
                              </span>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem className={cn(role !== Role.USER && "opacity-50")}>
                    <FormLabel>
                      {tf("level.label")}
                      <span className="text-destructive ms-0.5">*</span>
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        className="flex flex-wrap gap-1.5"
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={role !== Role.USER}
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
                                (item !== field.value || role !== Role.USER) &&
                                  "opacity-50"
                              )}
                            >
                              <FormLabel>{item} Level</FormLabel>
                            </Badge>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="shrink-0">
          <DialogClose asChild>
            <Button
              type="button"
              onClick={() => setIsOpen(false)}
              variant="outline"
              className="flex-1"
              disabled={bulkAddMutation.isPending}
            >
              {tb("cancel")}
            </Button>
          </DialogClose>
          <SubmitButton
            type="submit"
            isPending={bulkAddMutation.isPending}
            disabled={!allowSubmit}
            className="flex-1"
          >
            {isUpdating ? tb("updateUser") : tb("addNewUser")}
          </SubmitButton>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default UserForm;
