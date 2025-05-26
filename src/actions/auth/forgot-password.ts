"use server";
import "server-only";

import supabaseAdmin from "@/lib/supabase/admin";
import { GenerateLinkParams } from "@supabase/supabase-js";
import { Resend } from "resend";
import { FormActionResponse } from "@/types/globals";
import ForgotPasswordMail from "@/lib/mails/forgot-password-mail";

const resend = new Resend(process.env.RESEND_API_KEY);

export const forgotPasswordAction = async (
  formData: FormData
): Promise<FormActionResponse> => {
  const email = formData.get("email") as string;
  const supabase = supabaseAdmin();

  const { data, error } = await supabase.auth.admin.generateLink({
    type: "recovery",
    email,
  } as GenerateLinkParams);

  if (error?.code === "user_not_found") return { err: "auth.userNotFound" };

  if (data.properties?.email_otp) {
    const { data: verifyData } = await resend.emails.send({
      from: `Edublog <team@atomic-code.uk>`,
      to: [email],
      subject: "Reset Password",
      react: ForgotPasswordMail({
        verificationCode: data.properties?.email_otp,
      }),
    });
    if (verifyData?.id) return { msg: "auth.emailResetSent" };
  }
  return { err: "auth.emailNotSent" };
};
