import { UserData, UserProvider } from "@/context/user";
import { InitialProgress, UserProgressProvider } from "@/context/user-progress";
import { routing } from "@/i18n/routing";
import { supabaseServer } from "@/lib/supabase/server";
import { EnglishLevel, Role, SupabaseJwtPayload } from "@/types/globals";
import { jwtDecode } from "jwt-decode";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Cairo, Roboto } from "next/font/google";
import { notFound } from "next/navigation";
import { Toaster } from "sonner";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["latin", "arabic"],
  weight: ["400", "500", "600", "700", "900", "1000"],
});

const roboto = Roboto({
  variable: "--font-cairo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

type Props = Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>;

export async function generateMetadata(props: Omit<Props, "children">) {
  const { locale } = await props.params;

  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("title"),
  };
}

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const { dir, font, variable } =
    locale === "ar"
      ? { dir: "rtl", variable: cairo.variable, font: "font-cairo" }
      : { dir: "ltr", variable: roboto.variable, font: "font-roboto" };

  const supabase = await supabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  let userData: null | UserData = null;
  let initialProgress: InitialProgress | null = null;
  if (session) {
    const jwt = jwtDecode<SupabaseJwtPayload>(session?.access_token);
    const userRole = jwt.user_role || "user";

    const { data: profileData } = await supabase
      .from("profiles")
      .select("full_name, avatar_url, updated_at, on_boarding_status")
      .eq("user_id", session.user.id)
      .single();
    if (profileData) {
      userData = {
        id: session.user.id,
        email: session.user.email as string,
        fullName: profileData.full_name,
        avatarUrl: profileData.avatar_url as string,
        role: (userRole || Role.USER) as Role,
        updatedAt: profileData.updated_at,
        createdAt: session.user.created_at,
        onBoardingStatus: profileData.on_boarding_status,
      };
    }
    if (userRole === Role.USER) {
      const { data } = await supabase
        .from("user_progress")
        .select()
        .eq("user_id", session.user.id)
        .single();
      if (data) {
        initialProgress = {
          initialQuizzesCompleted: data.quizzes_completed,
          initialTotalPoints: data.total_points,
          initialTestsCompleted: data.tests_completed,
          initialCurrentLevel: data.current_level as EnglishLevel,
        };
      }
    }
  }

  return (
    <html lang={locale} dir={dir}>
      <body className={`${font} ${variable} antialiased`}>
        <UserProvider initialUserData={userData}>
          <UserProgressProvider initialValues={initialProgress}>
            <NextIntlClientProvider>
              {children} <Toaster />
            </NextIntlClientProvider>
          </UserProgressProvider>
        </UserProvider>
      </body>
    </html>
  );
}
