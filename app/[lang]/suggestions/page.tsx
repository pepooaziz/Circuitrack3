export default function SuggestionsPage({ params: { lang } }: { params: { lang: string } }) {
    return (
        <div className="min-h-screen flex items-center justify-center mt-16 text-center">
            <h1 className="text-2xl font-bold text-slate-700">
                {lang === 'ar' ? "صفحة الاقتراحات (قيد الإنشاء)" : "Suggestions Page (Under Construction)"}
            </h1>
        </div>
    );
}
