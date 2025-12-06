"use client";

import { usePathname, useRouter } from "next/navigation";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const languages = [
    { code: "en", label: "English" },
    { code: "ar", label: "العربية" },
    { code: "zh", label: "中文" }
  ];

  const changeLanguage = (lang: string) => {
    const segments = pathname.split("/");
    segments[1] = lang; // replace locale
    router.push(segments.join("/"));
  };

  return (
    <div className="flex gap-2">
      {languages.map((lng) => (
        <button
          key={lng.code}
          onClick={() => changeLanguage(lng.code)}
          className="px-2 py-1 rounded hover:bg-gray-200"
        >
          {lng.label}
        </button>
      ))}
    </div>
  );
}
