import ChangePasswordForm from "@/components/forms/auth/change-password-form";
import ResetPasswordForm from "@/components/forms/auth/reset-password-form";
import { supabaseServer } from "@/lib/supabase/server";

const ResetPasswordPage = async () => {
  let showResetForm = false;
  const supabase = await supabaseServer();
  const { data: amrMethod } = await supabase.rpc("get_session_amr");

  if (amrMethod === "oauth") {
    const { data } = await supabase.rpc("check_user_password");
    if (data === false) showResetForm = true;
  }
  if (amrMethod === "otp") showResetForm = true;
  return (
    <main>
      <div className="min-h-[100dvh] flex flex-col items-center justify-center gap-0 py-6">
        {showResetForm ? <ResetPasswordForm /> : <ChangePasswordForm />}
      </div>
    </main>
  );
};

export default ResetPasswordPage;
