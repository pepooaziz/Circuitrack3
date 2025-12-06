import "../globals.css";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, useMessages } from "next-intl";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "ar" }, { lang: "zh" }];
}

export default async function LocaleLayout({ children, params }) {
  let { lang } = params;

  // Ensure locale is supported
  const locales = ["en", "ar", "zh"];
  if (!locales.includes(lang)) notFound();

  // Load translation messages
  const messages = (await import(`../../messages/${lang}.json`)).default;

  return (
    <html lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}>
      <body>
        <NextIntlClientProvider locale={lang} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
