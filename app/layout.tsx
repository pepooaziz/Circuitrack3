"use client";

import "./globals.css";
import { dir } from "i18next";
import { languages } from "../i18n/settings";

export const metadata = {
  title: "CircuitRack",
  description: "Multi-vendor marketplace for power, control, and automation components",
};

export async function generateStaticParams() {
  return languages.map((lng) => ({ lang: lng }));
}

export default function RootLayout({ children, params }) {
  const lang = params?.lang ?? "en";

  return (
    <html lang={lang} dir={dir(lang)}>
      <body>{children}</body>
    </html>
  );
}

