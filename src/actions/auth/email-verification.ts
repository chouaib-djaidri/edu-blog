"use server";
import "server-only";

import EmailVerificationMail from "@/lib/mails/email-verification-mail";
import supabaseAdmin from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";
import { OTPVerificationServerFormSchema } from "@/schemas/auth/otp-verification.schema";
import { GenerateLinkParams } from "@supabase/supabase-js";
import { Resend } from "resend";
import { safeParse } from "valibot";
import { revalidatePath } from "next/cache";
import { FormActionResponse } from "@/types/globals";

const resend = new Resend(process.env.RESEND_API_KEY);

export const verifyEmailAction = async (
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
    type: "email",
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
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  return { msg: "auth.verificationSuccess" };
};

export const reVerifyEmailAction = async (
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
    "check_email_confirmation_cooldown",
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
    type: "signup",
    email,
  } as GenerateLinkParams);

  if (data.properties?.email_otp) {
    const { data: verifyData } = await resend.emails.send({
      from: `Edublog <team@atomic-code.uk>`,
      to: [email],
      subject: "Verify Email",
      react: EmailVerificationMail({
        verificationCode: data.properties?.email_otp,
      }),
    });
    if (verifyData?.id) return { msg: "auth.emailVerificationSent" };
  }
  return { err: "auth.emailNotSent" };
};
