"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Ticket, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function MyTicketsPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const lang = params?.lang as string;
    const isArabic = lang === 'ar';

    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState(searchParams?.get('email') || '');

    useEffect(() => {
        if (email) {
            fetchTickets();
        } else {
            setLoading(false);
        }
    }, [email]);

    const fetchTickets = async () => {
        try {
            const response = await fetch(`/api/suggestions?email=${encodeURIComponent(email)}`);
            const data = await response.json();

            if (data.success) {
                setTickets(data.suggestions || []);
            }
        } catch (error) {
            console.error('Failed to fetch tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open': return 'bg-blue-100 text-blue-700 border-blue-300';
            case 'in_progress': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
            case 'resolved': return 'bg-green-100 text-green-700 border-green-300';
            case 'closed': return 'bg-gray-100 text-gray-700 border-gray-300';
            default: return 'bg-slate-100 text-slate-700 border-slate-300';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'open': return <AlertCircle size={16} />;
            case 'in_progress': return <Clock size={16} />;
            case 'resolved': return <CheckCircle size={16} />;
            case 'closed': return <XCircle size={16} />;
            default: return <Ticket size={16} />;
        }
    };

    const getStatusLabel = (status: string) => {
        if (isArabic) {
            switch (status) {
                case 'open': return 'مفتوحة';
                case 'in_progress': return 'قيد المعالجة';
                case 'resolved': return 'تم الحل';
                case 'closed': return 'مغلقة';
                default: return status;
            }
        }
        return status.replace('_', ' ').toUpperCase();
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'low': return 'text-green-600';
            case 'normal': return 'text-blue-600';
            case 'high': return 'text-orange-600';
            case 'critical': return 'text-red-600';
            default: return 'text-slate-600';
        }
    };

    if (!email) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 mt-16">
                <div className="max-w-md w-full mx-4">
                    <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-slate-200">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">
                            {isArabic ? 'عرض تذاكري' : 'View My Tickets'}
                        </h2>
                        <p className="text-slate-600 mb-6">
                            {isArabic
                                ? 'أدخل بريدك الإلكتروني لعرض تذاكرك'
                                : 'Enter your email to view your tickets'}
                        </p>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={isArabic ? 'example@email.com' : 'example@email.com'}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none mb-4"
                        />
                        <button
                            onClick={() => email && fetchTickets()}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all"
                        >
                            {isArabic ? 'عرض التذاكر' : 'View Tickets'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center mt-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-10 px-4 mt-16">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-slate-900 mb-3">
                        {isArabic ? 'تذاكري' : 'My Tickets'}
                    </h1>
                    <p className="text-lg text-slate-600">
                        {isArabic ? `البريد: ${email}` : `Email: ${email}`}
                    </p>
                </div>

                {/* New Ticket Button */}
                <div className="mb-6">
                    <Link
                        href={`/${lang}/suggestions/new`}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
                    >
                        <Ticket size={20} />
                        {isArabic ? 'إرسال مقترح جديد' : 'Submit New Suggestion'}
                    </Link>
                </div>

                {/* Tickets List */}
                {tickets.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-slate-200">
                        <Ticket size={64} className="mx-auto text-slate-300 mb-4" />
                        <h3 className="text-xl font-semibold text-slate-700 mb-2">
                            {isArabic ? 'لا توجد تذاكر' : 'No Tickets Found'}
                        </h3>
                        <p className="text-slate-500">
                            {isArabic
                                ? 'لم تقم بإرسال أي مقترحات بعد'
                                : 'You haven\'t submitted any suggestions yet'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {tickets.map((ticket) => (
                            <div
                                key={ticket.id}
                                className="bg-white rounded-xl shadow-md border-2 border-slate-200 p-6 hover:shadow-lg transition-all"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="font-mono text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                                                {ticket.ticket_number}
                                            </span>
                                            <span className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-semibold border-2 ${getStatusColor(ticket.status)}`}>
                                                {getStatusIcon(ticket.status)}
                                                {getStatusLabel(ticket.status)}
                                            </span>
                                            <span className={`text-sm font-semibold ${getPriorityColor(ticket.priority)}`}>
                                                {ticket.priority.toUpperCase()}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                                            {ticket.title}
                                        </h3>
                                        <p className="text-slate-600 line-clamp-2">
                                            {ticket.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-sm text-slate-500 pt-4 border-t">
                                    <div>
                                        <span className="font-semibold">{isArabic ? 'النوع:' : 'Category:'}</span>{' '}
                                        {ticket.category.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                    </div>
                                    <div>
                                        {new Date(ticket.created_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
