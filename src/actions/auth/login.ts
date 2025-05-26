"use server";
import { supabaseServer } from "@/lib/supabase/server";
import { LoginServerFormSchema } from "@/schemas/auth/login.schema";
import { FormActionResponse } from "@/types/globals";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import "server-only";
import { safeParse } from "valibot";

export async function loginAction(
  formData: FormData
): Promise<FormActionResponse> {
  const loginData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const validationResult = safeParse(LoginServerFormSchema, loginData);
  if (!validationResult.success) {
    return {
      err: "validationError",
    };
  }
  const supabase = await supabaseServer();
  const { error } = await supabase.auth.signInWithPassword(loginData);
  if (error) {
    if (error.code === "email_not_confirmed") {
      redirect(`/email-verification?email=${loginData.email}`);
    }
    return {
      err:
        error.code === "invalid_credentials"
          ? "auth.incorrectCredentials"
          : "auth.loginFailed",
    };
  }
  revalidatePath("/", "layout");
  redirect("/dashboard");
}
