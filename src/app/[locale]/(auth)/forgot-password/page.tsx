import ForgotPasswordForm from "@/components/forms/auth/forgot-password-form";

const ForgotPasswordPage = async () => {
  return (
    <main>
      <div className="min-h-[100dvh] flex flex-col items-center justify-center gap-0 py-6">
        <ForgotPasswordForm />
      </div>
    </main>
  );
};

export default ForgotPasswordPage;
