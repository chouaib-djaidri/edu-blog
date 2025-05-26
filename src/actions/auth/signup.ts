"use server";
import "server-only";

import EmailVerificationMail from "@/lib/mails/email-verification-mail";
import { SignupServerFormSchema } from "@/schemas/auth/signup.schema";
import { redirect } from "next/navigation";
import { Resend } from "resend";
import { safeParse } from "valibot";
import { FormActionResponse } from "@/types/globals";
import supabaseAdmin from "@/lib/supabase/admin";

const resend = new Resend(process.env.RESEND_API_KEY);

export const signupAction = async (
  formData: FormData
): Promise<FormActionResponse> => {
  const signUpData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const signUpAdditionalData = {
    fullName: formData.get("fullName") as string,
  };
  const validationResult = safeParse(SignupServerFormSchema, {
    ...signUpData,
    ...signUpAdditionalData,
  });
  if (!validationResult.success) {
    return {
      err: "validationError",
    };
  }
  const supabase = supabaseAdmin();
  const { data, error } = await supabase.auth.admin.generateLink({
    type: "signup",
    ...signUpData,
    options: {
      data: {
        ...signUpAdditionalData,
      },
    },
  });
  if (data.properties?.email_otp) {
    const { data: verifyData } = await resend.emails.send({
      from: `Edublog <team@atomic-code.uk>`,
      to: [signUpData.email],
      subject: "Verify Email",
      react: EmailVerificationMail({
        verificationCode: data.properties?.email_otp,
      }),
    });
    if (verifyData?.id)
      redirect(`/email-verification?email=${signUpData.email}`);
  }
  if (error)
    return {
      err:
        error.code === "email_exists"
          ? "auth.duplicatedCredentials"
          : "auth.signupFailed",
    };
  return { err: "auth.emailNotSent" };
};
