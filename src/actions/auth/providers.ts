"use server";
import "server-only";

import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { FormActionResponse } from "@/types/globals";

export const googleProviderAction = async (): Promise<FormActionResponse> => {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: process.env.NEXT_PUBLIC_ORIGIN_URL + "/auth/callback",
    },
  });
  if (data?.url) return redirect(data.url);
  return {
    err: "googleProviderError",
  };
};
