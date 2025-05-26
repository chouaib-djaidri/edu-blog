"use server";
import "server-only";

import { supabaseServer } from "@/lib/supabase/server";
import {
  ChangePasswordServerFormSchema,
  ResetPasswordServerFormSchema,
} from "@/schemas/auth/reset-password.schema";
import { revalidatePath } from "next/cache";
import { safeParse } from "valibot";
import { FormActionResponse } from "@/types/globals";

export const resetPasswordAction = async (
  formData: FormData
): Promise<FormActionResponse> => {
  const supabase = await supabaseServer();
  const { data: amrMethod } = await supabase.rpc("get_session_amr");
  if (!["otp", "oauth"].includes(amrMethod || ""))
    return { err: "auth.resetPasswordError" };

  const newPassword = formData.get("newPassword") as string;
  const confirmNewPassword = formData.get("confirmNewPassword") as string;

  const validationResult = safeParse(ResetPasswordServerFormSchema, {
    newPassword,
    confirmNewPassword,
  });
  if (!validationResult.success) {
    return {
      err: "validationError",
    };
  }
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  if (error?.code === "same_password") return { err: "auth.samePassword" };
  if (error) return { err: "auth.resetPasswordError" };
  if (amrMethod === "otp") {
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    return { msg: "auth.resetPasswordSuccess", data: "/login" };
  }
  return { msg: "auth.resetPasswordSuccess", data: "/settings" };
};

export const changePasswordAction = async (
  formData: FormData
): Promise<FormActionResponse> => {
  const supabase = await supabaseServer();
  const { data: amrMethod } = await supabase.rpc("get_session_amr");
  if (!["password", "oauth"].includes(amrMethod || ""))
    return { err: "auth.resetPasswordError" };
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmNewPassword = formData.get("confirmNewPassword") as string;
  const validationResult = safeParse(ChangePasswordServerFormSchema, {
    newPassword,
    confirmNewPassword,
    currentPassword,
  });
  if (!validationResult.success) {
    return {
      err: "validationError",
    };
  }
  const { data, error } = await supabase.rpc("change_password", {
    current_password: currentPassword,
    new_password: newPassword,
  });
  if (error) return { err: "auth.resetPasswordError" };
  if (data !== "resetPasswordSuccess") return { err: `auth.${data}` };
  return { msg: "auth.resetPasswordSuccess", data: "/settings" };
};
