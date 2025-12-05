"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Send, Upload, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = [
    'visitor_suggestion',
    'visitor_complaint',
    'buyer_purchase_issue',
    'buyer_pricing_issue',
    'buyer_payment_issue',
    'buyer_vendor_issue',
    'buyer_technical_issue',
    'vendor_product_listing_issue',
    'vendor_pricing_issue',
    'vendor_earnings_issue',
    'vendor_auction_issue',
    'vendor_dashboard_suggestion',
    'bug_report',
    'new_product_suggestion',
    'new_category_suggestion',
    'frontend_issue',
    'backend_api_issue',
    'design_suggestion',
    'ux_improvement_suggestion',
];

const REPORTER_TYPES = ['visitor', 'buyer', 'vendor', 'developer'];
const PRIORITIES = ['low', 'normal', 'high', 'critical'];

export default function NewSuggestionPage() {
    const router = useRouter();
    const params = useParams();
    const lang = params?.lang as string;
    const t = useTranslations('suggestions');
    const isArabic = lang === 'ar';

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [ticketNumber, setTicketNumber] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'visitor_suggestion',
        reporter_type: 'visitor',
        priority: 'normal',
        email: '',
        phone: '',
        reporter_name: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/suggestions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    user_lang: lang,
                    page_url: window.location.href,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(true);
                setTicketNumber(data.ticket_number);
                toast.success(isArabic ? 'تم إرسال مقترحك بنجاح!' : 'Suggestion submitted successfully!');

                // Redirect after 3 seconds
                setTimeout(() => {
                    router.push(`/${lang}/suggestions/my-tickets?email=${formData.email}`);
                }, 3000);
            } else {
                toast.error(data.message || (isArabic ? 'حدث خطأ' : 'An error occurred'));
            }
        } catch (error) {
            console.error('Submit error:', error);
            toast.error(isArabic ? 'فشل الإرسال' : 'Failed to submit');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white mt-16">
                <div className="max-w-md w-full mx-4">
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center border-2 border-green-200">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="text-green-600" size={48} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">
                            {isArabic ? 'تم الإرسال بنجاح!' : 'Successfully Submitted!'}
                        </h2>
                        <p className="text-slate-600 mb-6">
                            {isArabic ? 'رقم التذكرة:' : 'Ticket Number:'}
                        </p>
                        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
                            <span className="text-2xl font-bold text-blue-600">{ticketNumber}</span>
                        </div>
                        <p className="text-sm text-slate-500">
                            {isArabic
                                ? 'سيتم إعادة توجيهك لصفحة التذاكر...'
                                : 'Redirecting to your tickets...'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-10 px-4 mt-16">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-slate-900 mb-3">
                        {isArabic ? 'إرسال مقترح أو شكوى' : 'Submit Suggestion or Issue'}
                    </h1>
                    <p className="text-lg text-slate-600">
                        {isArabic
                            ? 'نحن نقدر ملاحظاتك ونعمل على تحسين خدماتنا'
                            : 'We value your feedback and work to improve our services'}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 p-8 space-y-6">
                    {/* Personal Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                {isArabic ? 'الاسم' : 'Name'} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="reporter_name"
                                value={formData.reporter_name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                placeholder={isArabic ? 'أدخل اسمك' : 'Enter your name'}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                {isArabic ? 'البريد الإلكتروني' : 'Email'} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                placeholder={isArabic ? 'example@email.com' : 'example@email.com'}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                {isArabic ? 'رقم الهاتف' : 'Phone'} ({isArabic ? 'اختياري' : 'Optional'})
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                placeholder="+20 123 456 7890"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                {isArabic ? 'أنت' : 'You are'} <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="reporter_type"
                                value={formData.reporter_type}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white"
                            >
                                {REPORTER_TYPES.map(type => (
                                    <option key={type} value={type}>
                                        {isArabic
                                            ? type === 'visitor' ? 'زائر' : type === 'buyer' ? 'مشتري' : type === 'vendor' ? 'بائع' : 'مطور'
                                            : type.charAt(0).toUpperCase() + type.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Issue Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                {isArabic ? 'نوع المقترح' : 'Category'} <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-sm"
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>
                                        {cat.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                {isArabic ? 'الأولوية' : 'Priority'} <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white"
                            >
                                {PRIORITIES.map(priority => (
                                    <option key={priority} value={priority}>
                                        {isArabic
                                            ? priority === 'low' ? 'منخفضة' : priority === 'normal' ? 'عادية' : priority === 'high' ? 'عالية' : 'حرجة'
                                            : priority.charAt(0).toUpperCase() + priority.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            {isArabic ? 'العنوان' : 'Title'} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                            placeholder={isArabic ? 'عنوان مختصر للمشكلة' : 'Brief title of the issue'}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            {isArabic ? 'الوصف التفصيلي' : 'Detailed Description'} <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={6}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none"
                            placeholder={isArabic ? 'اشرح المشكلة أو المقترح بالتفصيل...' : 'Explain the issue or suggestion in detail...'}
                        />
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 flex gap-3">
                        <AlertCircle className="text-blue-600 flex-shrink-0" size={24} />
                        <p className="text-sm text-blue-800">
                            {isArabic
                                ? 'سيتم إرسال رقم التذكرة إلى بريدك الإلكتروني. يمكنك متابعة حالة المقترح في أي وقت.'
                                : 'A ticket number will be sent to your email. You can track your suggestion status anytime.'}
                        </p>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                {isArabic ? 'جارٍ الإرسال...' : 'Submitting...'}
                            </>
                        ) : (
                            <>
                                <Send size={20} />
                                {isArabic ? 'إرسال المقترح' : 'Submit Suggestion'}
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
