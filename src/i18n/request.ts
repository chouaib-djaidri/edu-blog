import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
  return {
    locale,
    messages: {
      ...(await import(`../../messages/${locale}/globals.json`)).default,
      ...(await import(`../../messages/${locale}/forms.json`)).default,
      ...(await import(`../../messages/${locale}/pages/auth.json`)).default,
      ...(await import(`../../messages/${locale}/pages/admin.json`)).default,
      ...(await import(`../../messages/${locale}/pages/creator.json`)).default,
      ...(await import(`../../messages/${locale}/pages/user.json`)).default,
    },
  };
});
