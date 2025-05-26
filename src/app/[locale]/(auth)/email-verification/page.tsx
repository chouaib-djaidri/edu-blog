import EmailVerificationForm from "@/components/forms/auth/email-verification-form";
import { supabaseServer } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

const EmailVerificationPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const email = (await searchParams)?.email as string;
  if (!email) return notFound();
  const supabase = await supabaseServer();
  const { data: userData } = await supabase.rpc(
    "check_email_confirmation_token",
    {
      user_email: email,
    }
  );
  if (userData === "not-exist") return notFound();
  const { data: restTime } = await supabase.rpc(
    "check_email_confirmation_cooldown",
    {
      user_email: email,
    }
  );
  return (
    <main>
      <div className="min-h-[100dvh] flex flex-col items-center justify-center gap-0 py-6">
        <EmailVerificationForm email={email} restTime={restTime || 0} />
      </div>
    </main>
  );
};

export default EmailVerificationPage;
