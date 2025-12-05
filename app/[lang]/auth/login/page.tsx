export default function LoginPage() {
    return (
        <div className="max-w-md mx-auto mt-24 p-6 border rounded-lg shadow bg-white">
            <h1 className="text-2xl font-bold mb-4 text-center">تسجيل الدخول</h1>

            <form className="flex flex-col gap-4">
                <input type="email" placeholder="البريد الإلكتروني" className="border p-2 rounded" />
                <input type="password" placeholder="كلمة المرور" className="border p-2 rounded" />

                <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    دخول
                </button>
            </form>

            <div className="mt-4 text-center text-sm">
                <a href="register" className="text-blue-600 hover:underline">ليس لديك حساب؟ إنشاء حساب جديد</a>
            </div>
        </div>
    );
}
