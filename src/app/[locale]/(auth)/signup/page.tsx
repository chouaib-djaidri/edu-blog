import SignupForm from "@/components/forms/auth/signup-form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function SignupPage() {
  const t = useTranslations("Signup");
  const tb = useTranslations("Buttons");
  return (
    <div className="flex flex-col items-center justify-center w-full pb-10 pt-14 gap-4 min-h-svh">
      <SignupForm />
      <div className="flex flex-col gap-1.5 max-w-md">
        <p className="text-center text-muted-foreground">
          {t("haveAccount")}{" "}
          <Button variant="link" asChild>
            <Link href="/login">{tb("login")}</Link>
          </Button>
        </p>
        <div>
          <Separator />
        </div>
        <p className="text-center text-muted-foreground">
          {t.rich("rules", {
            link: (chunks) => (
              <Button variant="link" asChild>
                <Link href="#">{chunks}</Link>
              </Button>
            ),
          })}
        </p>
      </div>
    </div>
  );
}
