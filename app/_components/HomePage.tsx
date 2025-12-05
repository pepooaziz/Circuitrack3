"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
    const params = useParams();
    const lang = params?.lang as string || 'ar';
    const t = useTranslations();

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* HERO */}
            <section className="container mx-auto px-4 pt-16 pb-10 text-center">
                <span className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1 text-xs font-medium text-blue-700 mb-4">
                    {t("home.badge")}
                </span>

                <h1 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight mb-4">
                    {t("home.title")}
                </h1>

                <p className="max-w-2xl mx-auto text-slate-600 mb-6">
                    {t("home.subtitle")}
                </p>

                <p className="max-w-2xl mx-auto text-slate-500 mb-8">
                    {t("home.description")}
                </p>

                <div className="flex flex-wrap justify-center gap-3 mb-10">
                    <Link
                        href={`/${lang}/vendor/products`}
                        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
                    >
                        {t("home.ctaSell")}
                    </Link>

                    <Link
                        href={`/${lang}/products`}
                        className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-800 bg-white hover:bg-slate-50 transition"
                    >
                        {t("home.ctaBrowse")}
                    </Link>
                </div>
            </section>

            {/* FEATURES */}
            <section className="container mx-auto px-4 pb-12">
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="rounded-xl border bg-white p-5 shadow-sm">
                        <div className="mb-3 text-2xl">📦</div>
                        <h3 className="font-semibold mb-2">
                            {t("home.featureMultiVendorTitle")}
                        </h3>
                        <p className="text-sm text-slate-600">
                            {t("home.featureMultiVendorDesc")}
                        </p>
                    </div>

                    <div className="rounded-xl border bg-white p-5 shadow-sm">
                        <div className="mb-3 text-2xl">🔥</div>
                        <h3 className="font-semibold mb-2">
                            {t("home.featureAuctionsTitle")}
                        </h3>
                        <p className="text-sm text-slate-600">
                            {t("home.featureAuctionsDesc")}
                        </p>
                    </div>

                    <div className="rounded-xl border bg-white p-5 shadow-sm">
                        <div className="mb-3 text-2xl">💼</div>
                        <h3 className="font-semibold mb-2">
                            {t("home.featureTradePricingTitle")}
                        </h3>
                        <p className="text-sm text-slate-600">
                            {t("home.featureTradePricingDesc")}
                        </p>
                    </div>
                </div>
            </section>

            {/* STATS */}
            <section className="container mx-auto px-4 pb-14">
                <div className="grid gap-4 md:grid-cols-4">
                    <StatCard
                        value={t("stats.vendorsValue")}
                        label={t("stats.vendorsLabel")}
                    />
                    <StatCard
                        value={t("stats.productsValue")}
                        label={t("stats.productsLabel")}
                    />
                    <StatCard
                        value={t("stats.customersValue")}
                        label={t("stats.customersLabel")}
                    />
                    <StatCard
                        value={t("stats.satisfactionValue")}
                        label={t("stats.satisfactionLabel")}
                    />
                </div>
            </section>
        </div>
    );
}

function StatCard({ value, label }: { value: string; label: string }) {
    return (
        <div className="rounded-xl border bg-white p-5 text-center shadow-sm">
            <div className="text-2xl font-bold text-slate-900 mb-1">{value}</div>
            <div className="text-xs text-slate-500">{label}</div>
        </div>
    );
}
