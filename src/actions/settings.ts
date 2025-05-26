"use server";
import "server-only";

import supabaseAdmin from "@/lib/supabase/admin";
import { safeParse } from "valibot";
import { FormActionResponse, SupabaseJwtPayload } from "@/types/globals";
import { ProfileFormSchema } from "@/schemas/profile.schema";
import { handleUploadFile } from "@/lib/bunny/upload-file";
import { supabaseServer } from "@/lib/supabase/server";
import { jwtDecode } from "jwt-decode";
import { revalidatePath } from "next/cache";

export const settingsAction = async (
  formData: FormData
): Promise<FormActionResponse> => {
  const userId = formData.get("userId") as string;
  const email = formData.get("email") as string;
  const fullName = formData.get("fullName") as string;
  const avatarFile = formData.get("avatarFile") as File | string;

  const validationResult = safeParse(ProfileFormSchema(), {
    email: email || "email@gmail.com",
    fullName: fullName || "fullName",
    avatarFile: avatarFile || "",
  });

  if (!validationResult.success || !userId) {
    return {
      err: "validationError",
    };
  }

  const supabase = supabaseAdmin();

  let avatarUrl: false | string = "";
  if (avatarFile && avatarFile instanceof File && avatarFile.size > 0) {
    avatarUrl = await handleUploadFile(avatarFile, "avatars");
    if (!avatarUrl) return { err: "settings.updateFailed" };
  }

  let updatedAt: string = "";
  if (email) {
    const { error: updateUserError } = await supabase.auth.admin.updateUserById(
      userId,
      {
        email,
      }
    );
    if (updateUserError) {
      return {
        err: "users.duplicatedEmail",
      };
    }
    await supabase
      .from("profiles")
      .update({ updated_at: new Date().toISOString() })
      .eq("user_id", userId);
    updatedAt = new Date().toISOString();
  }

  if (fullName || avatarUrl || avatarFile === "deleted") {
    const { error: updateRoleError, data } = await supabase
      .from("profiles")
      .update({
        ...(fullName && { full_name: fullName }),
        ...((avatarUrl || avatarFile) && { avatar_url: avatarUrl || null }),
      })
      .eq("user_id", userId)
      .select("updated_at")
      .single();
    if (updateRoleError) {
      return {
        err: "settings.updateFailed",
      };
    }
    if (data) updatedAt = data.updated_at;
  }

  return {
    msg: "settings.updateSuccess",
    data: {
      ...(email && { email }),
      ...(fullName && { fullName }),
      ...((avatarUrl || avatarFile === "deleted") && { avatarUrl: avatarUrl }),
      updatedAt: updatedAt,
    },
  };
};

export const deleteAccount = async (): Promise<FormActionResponse> => {
  const supabase = await supabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) return { err: "validationError" };
  const jwt = jwtDecode<SupabaseJwtPayload>(session.access_token);
  const userRole = jwt.user_role;

  if (userRole === "admin")
    return {
      err: "settings.deleteAccountFailed",
    };

  const supabaseAd = supabaseAdmin();
  const { error: deleteError } = await supabaseAd.auth.admin.deleteUser(
    session.user.id
  );

  if (deleteError) {
    return {
      err: "settings.deleteAccountFailed",
    };
  }
  revalidatePath("/", "layout");
  return {
    msg: "settings.deleteAccountSuccess",
  };
};
