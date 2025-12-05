import { useTranslations } from 'next-intl';
import { ShieldCheck, Zap, Lock, Users, Briefcase, Award, Smile } from 'lucide-react';

export default function AboutPage() {
    const t = useTranslations('about');

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">

                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl mb-4">
                        {t('title')}
                    </h1>
                    <p className="text-xl text-blue-600 font-semibold max-w-2xl mx-auto">
                        {t('subtitle')}
                    </p>
                    <div className="mt-8 max-w-3xl mx-auto text-lg text-slate-700 leading-relaxed bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        {t('intro')}
                    </div>
                </div>

                {/* Pillars Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {/* Pillar 1: Reliability */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                            <ShieldCheck className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">{t('pillars.p1_title')}</h3>
                        <p className="text-slate-600 leading-relaxed text-sm">
                            {t('pillars.p1_desc')}
                        </p>
                    </div>

                    {/* Pillar 2: Intelligence */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                            <Zap className="w-8 h-8 text-orange-500" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">{t('pillars.p2_title')}</h3>
                        <p className="text-slate-600 leading-relaxed text-sm">
                            {t('pillars.p2_desc')}
                        </p>
                    </div>

                    {/* Pillar 3: Security */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mb-6">
                            <Lock className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">{t('pillars.p3_title')}</h3>
                        <p className="text-slate-600 leading-relaxed text-sm">
                            {t('pillars.p3_desc')}
                        </p>
                    </div>
                </div>

                {/* Closing Statement */}
                <div className="text-center mb-20">
                    <h2 className="text-2xl font-bold text-slate-800">
                        {t('closing')}
                    </h2>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
                    <div className="p-4">
                        <div className="flex justify-center mb-4 text-blue-600">
                            <Briefcase size={32} />
                        </div>
                        <div className="text-3xl font-bold text-slate-900 mb-1">+500</div>
                        <div className="text-sm text-slate-500 font-medium">{t('stats.vendors')}</div>
                    </div>
                    <div className="p-4">
                        <div className="flex justify-center mb-4 text-orange-500">
                            <Award size={32} />
                        </div>
                        <div className="text-3xl font-bold text-slate-900 mb-1">+12k</div>
                        <div className="text-sm text-slate-500 font-medium">{t('stats.products')}</div>
                    </div>
                    <div className="p-4">
                        <div className="flex justify-center mb-4 text-green-600">
                            <Users size={32} />
                        </div>
                        <div className="text-3xl font-bold text-slate-900 mb-1">+8500</div>
                        <div className="text-sm text-slate-500 font-medium">{t('stats.customers')}</div>
                    </div>
                    <div className="p-4">
                        <div className="flex justify-center mb-4 text-red-500">
                            <Smile size={32} />
                        </div>
                        <div className="text-3xl font-bold text-slate-900 mb-1">99%</div>
                        <div className="text-sm text-slate-500 font-medium">{t('stats.satisfaction')}</div>
                    </div>
                </div>

            </div>
        </div>
    );
}
