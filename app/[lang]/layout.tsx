export const dynamic = "force-dynamic";

import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import Header from "@/components/Header";

export default async function LocaleLayout({ children, params }) {
  const { lang } = params;

  const locales = ["en", "ar", "zh"];

  if (!locales.includes(lang)) notFound();

  const messages = (await import(`../../messages/${lang}.json`)).default;

  return (
    <html lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}>
      <body>
        {/* ← الهيدر هنا */}
        <Header lang={lang} />

        <NextIntlClientProvider locale={lang} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
