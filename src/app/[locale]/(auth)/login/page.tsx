import LoginForm from "@/components/forms/auth/login-form";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function LoginPage() {
  const t = useTranslations("Login");
  const tb = useTranslations("Buttons");

  return (
    <div className="flex flex-col items-center justify-center w-full pb-10 pt-14 gap-4 min-h-svh">
      <LoginForm />
      <p className="text-center text-muted-foreground">
        {t("notHaveAccount")}{" "}
        <Button variant="link" asChild>
          <Link href="/signup">{tb("signup")}</Link>
        </Button>
      </p>
    </div>
  );
}
