# 🚀 دليل رفع مشروع CircuitRack على GitHub

## 📋 الخطوات:

### 1️⃣ إنشاء ملف `.gitignore`

أولاً، تأكد من وجود ملف `.gitignore` لمنع رفع الملفات غير الضرورية:

```bash
# في مجلد المشروع
# الملف موجود بالفعل، لكن تأكد من محتوياته
```

**محتوى `.gitignore` المطلوب:**
```
# Dependencies
/node_modules
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env
.env*.local
.env.local
.env.development.local
.env.test.local
.env.production.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
Thumbs.db
```

---

### 2️⃣ إنشاء ملف `.env.example`

لحماية المعلومات الحساسة، أنشئ ملف `.env.example`:

```bash
# .env.example
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
ADMIN_EMAIL=admin@example.com
```

**ملاحظة:** لا ترفع ملف `.env` الأصلي أبداً!

---

### 3️⃣ تهيئة Git في المشروع

```bash
# في Terminal (PowerShell):
cd C:\Users\mylog\.gemini\antigravity\scratch\Circuitrack3

# تهيئة Git (إذا لم يكن مُهيّأ)
git init

# إضافة جميع الملفات
git add .

# إنشاء أول Commit
git commit -m "Initial commit: CircuitRack Multi-vendor Marketplace"
```

---

### 4️⃣ إنشاء Repository على GitHub

#### الطريقة الأولى (عبر الموقع):

1. افتح [GitHub.com](https://github.com)
2. سجل دخول أو أنشئ حساب
3. اضغط على **"New Repository"** (أو زر **+** في الأعلى)
4. املأ البيانات:
   - **Repository name:** `circuitRack` أو `Circuitrack3`
   - **Description:** "Multi-vendor electronics marketplace with auctions and CRM"
   - **Visibility:** اختر Public أو Private
   - ❌ **لا تختر** "Initialize with README" (لأن لديك ملفات بالفعل)
5. اضغط **"Create repository"**

---

### 5️⃣ ربط المشروع بـ GitHub

بعد إنشاء الـ Repository، ستظهر لك تعليمات. استخدم هذه الأوامر:

```bash
# إضافة Remote (استبدل USERNAME باسم المستخدم الخاص بك)
git remote add origin https://github.com/USERNAME/circuitRack.git

# تحديد الفرع الرئيسي
git branch -M main

# رفع الملفات
git push -u origin main
```

**مثال:**
```bash
git remote add origin https://github.com/mylog/circuitRack.git
git branch -M main
git push -u origin main
```

---

### 6️⃣ إدخال بيانات GitHub

عند أول رفع، سيطلب منك:
- **Username:** اسم المستخدم في GitHub
- **Password:** استخدم **Personal Access Token** (ليس كلمة المرور العادية)

#### كيفية إنشاء Personal Access Token:

1. اذهب إلى: [GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)](https://github.com/settings/tokens)
2. اضغط **"Generate new token"** → **"Generate new token (classic)"**
3. أعطه اسم: `CircuitRack Upload`
4. اختر Scope: `repo` (كامل)
5. اضغط **"Generate token"**
6. **انسخ الـ Token فوراً** (لن تراه مرة أخرى!)
7. استخدمه كـ Password عند الرفع

---

### 7️⃣ إنشاء README.md احترافي

```bash
# في مجلد المشروع
```

**محتوى `README.md`:**
```markdown
# 🛒 CircuitRack - Multi-Vendor Electronics Marketplace

A modern, full-featured e-commerce platform for electronics trading with multi-language support, auctions, and CRM system.

## ✨ Features

- 🌐 **Multi-language Support** (Arabic, English, Chinese)
- 🛍️ **Multi-vendor Marketplace**
- 🔥 **Live Auctions**
- 💼 **Vendor Dashboard**
- 🛒 **Shopping Cart & Wishlist**
- 📊 **Product Comparison**
- 💬 **CRM & Suggestions System**
- 🎨 **RTL/LTR Support**

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase
- **i18n:** next-intl
- **State Management:** React Context API

## 📦 Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/USERNAME/circuitRack.git

# Navigate to project
cd circuitRack

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
\`\`\`

## 🔐 Environment Variables

Create a `.env.local` file with:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_EMAIL=admin@example.com
\`\`\`

## 🌍 Supported Languages

- 🇸🇦 Arabic (العربية) - RTL
- 🇬🇧 English - LTR
- 🇨🇳 Chinese (中文) - LTR

## 📱 Pages

- `/[lang]` - Homepage
- `/[lang]/products` - Products listing
- `/[lang]/products/[id]` - Product details
- `/[lang]/cart` - Shopping cart
- `/[lang]/wishlist` - Wishlist
- `/[lang]/compare` - Product comparison
- `/[lang]/vendor/products` - Vendor dashboard
- `/[lang]/suggestions/new` - Submit suggestion
- `/[lang]/auth/login` - Login
- `/[lang]/auth/register` - Register

## 🗄️ Database Schema

Run the SQL migration in Supabase:
\`\`\`bash
supabase/migrations/001_crm_suggestions_schema.sql
\`\`\`

## 📚 Documentation

- [Translation Guide](docs/TRANSLATION_GUIDE.md)
- [CRM System](docs/CRM_SUGGESTIONS_SYSTEM.md)
- [i18n Complete System](docs/I18N_COMPLETE_SYSTEM.md)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Your Name - [GitHub](https://github.com/USERNAME)

## 🙏 Acknowledgments

- Next.js Team
- Supabase Team
- next-intl
```

---

### 8️⃣ الأوامر الكاملة (نسخ ولصق)

```bash
# 1. الانتقال لمجلد المشروع
cd C:\Users\mylog\.gemini\antigravity\scratch\Circuitrack3

# 2. تهيئة Git (إذا لم يكن مُهيّأ)
git init

# 3. إضافة جميع الملفات
git add .

# 4. إنشاء Commit
git commit -m "Initial commit: CircuitRack Multi-vendor Marketplace with i18n support"

# 5. إضافة Remote (استبدل USERNAME باسمك)
git remote add origin https://github.com/USERNAME/circuitRack.git

# 6. تحديد الفرع الرئيسي
git branch -M main

# 7. رفع الملفات
git push -u origin main
```

---

### 9️⃣ التحديثات المستقبلية

عند إجراء تعديلات لاحقة:

```bash
# إضافة الملفات المُعدّلة
git add .

# إنشاء Commit مع وصف التعديل
git commit -m "وصف التعديل"

# رفع التحديثات
git push
```

**أمثلة على رسائل Commit:**
```bash
git commit -m "Add Chinese language support"
git commit -m "Fix RTL layout issues"
git commit -m "Update product details page"
git commit -m "Add CRM system"
```

---

### 🔟 نصائح مهمة:

#### ✅ افعل:
- ✅ استخدم `.gitignore` لمنع رفع `node_modules` و `.env`
- ✅ اكتب رسائل Commit واضحة
- ✅ ارفع التحديثات بانتظام
- ✅ استخدم Branches للميزات الجديدة
- ✅ أنشئ README.md احترافي

#### ❌ لا تفعل:
- ❌ لا ترفع ملف `.env` أبداً
- ❌ لا ترفع `node_modules`
- ❌ لا تستخدم كلمة مرور GitHub العادية (استخدم Token)
- ❌ لا ترفع مفاتيح API أو Secrets

---

### 📊 هيكل المشروع على GitHub:

```
circuitRack/
├── .github/
├── app/
├── components/
├── context/
├── docs/
├── i18n/
├── lib/
├── messages/
├── public/
├── supabase/
├── types/
├── .env.example
├── .gitignore
├── README.md
├── package.json
├── tsconfig.json
└── ...
```

---

### 🎯 الخطوات السريعة:

```bash
# 1. إنشاء Repository على GitHub.com
# 2. في Terminal:

cd C:\Users\mylog\.gemini\antigravity\scratch\Circuitrack3
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/circuitRack.git
git branch -M main
git push -u origin main

# 3. أدخل Username و Token عند الطلب
```

---

### 🆘 حل المشاكل:

#### المشكلة: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/USERNAME/circuitRack.git
```

#### المشكلة: "failed to push"
```bash
git pull origin main --rebase
git push -u origin main
```

#### المشكلة: "Permission denied"
- تأكد من استخدام Personal Access Token وليس كلمة المرور

---

## ✅ النتيجة النهائية:

بعد اتباع هذه الخطوات، سيكون مشروعك:
- ✅ مرفوع على GitHub
- ✅ محمي (بدون ملفات حساسة)
- ✅ موثّق بشكل احترافي
- ✅ جاهز للمشاركة أو النشر

---

**ابدأ الآن!** 🚀
