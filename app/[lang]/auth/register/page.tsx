export default function RegisterPage() {
    return (
        <div className="max-w-md mx-auto mt-24 p-6 border rounded-lg shadow bg-white">
            <h1 className="text-2xl font-bold mb-4 text-center">إنشاء حساب جديد</h1>

            <form className="flex flex-col gap-4">
                <input type="text" placeholder="الاسم" className="border p-2 rounded" />
                <input type="email" placeholder="البريد الإلكتروني" className="border p-2 rounded" />
                <input type="password" placeholder="كلمة المرور" className="border p-2 rounded" />

                <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    إنشاء حساب
                </button>
            </form>

            <div className="mt-4 text-center text-sm">
                <a href="login" className="text-blue-600 hover:underline">لديك حساب بالفعل؟ تسجيل الدخول</a>
            </div>
        </div>
    );
}
