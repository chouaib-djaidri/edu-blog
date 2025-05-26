"use server";
import "server-only";

import ForgotPasswordMail from "@/lib/mails/forgot-password-mail";
import supabaseAdmin from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";
import { OTPVerificationServerFormSchema } from "@/schemas/auth/otp-verification.schema";
import { GenerateLinkParams } from "@supabase/supabase-js";
import { Resend } from "resend";
import { safeParse } from "valibot";
import { redirect } from "next/navigation";
import { FormActionResponse } from "@/types/globals";

const resend = new Resend(process.env.RESEND_API_KEY);

export const verifyPasswordResetAction = async (
  formData: FormData
): Promise<FormActionResponse> => {
  const email = formData.get("email") as string;
  const token = formData.get("pin") as string;

  const validationResult = safeParse(OTPVerificationServerFormSchema, {
    pin: token,
    email,
  });

  if (!validationResult.success) {
    return {
      err: "validationError",
    };
  }

  const supabase = await supabaseServer();
  const { data, error } = await supabase.auth.verifyOtp({
    type: "recovery",
    email,
    token,
  });

  if (!data.session || error)
    return {
      err:
        error?.code === "otp_expired"
          ? "auth.expiredCode"
          : "auth.verificationError",
    };

  return redirect("/reset-password");
};

export const reVerifyPasswordResetAction = async (
  formData: FormData
): Promise<FormActionResponse> => {
  const email = formData.get("email") as string;

  const validationResult = safeParse(OTPVerificationServerFormSchema, {
    pin: "999999",
    email,
  });

  if (!validationResult.success) {
    return {
      err: "validationError",
    };
  }

  const supabase = supabaseAdmin();

  const { data: restTime } = await supabase.rpc(
    "check_reset_password_cooldown",
    {
      user_email: email,
    }
  );

  if (!!restTime) {
    return {
      err: "auth.tooManyRequests",
      data: restTime.toString(),
    };
  }

  const { data } = await supabase.auth.admin.generateLink({
    type: "recovery",
    email,
  } as GenerateLinkParams);

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
