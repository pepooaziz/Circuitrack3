# 🌐 دليل نظام الترجمة والـ RTL/LTR - CircuitRack

## ✅ الحالة الحالية

النظام **يعمل بالفعل** ويدعم:
- ✅ 3 لغات (ar, en, zh)
- ✅ RTL/LTR تلقائي
- ✅ next-intl مُفعّل
- ✅ ملفات الترجمة موجودة

---

## 📁 هيكل الملفات

```
app/
├── [lang]/
│   ├── layout.tsx          ← يحدد dir="rtl" أو "ltr" تلقائياً
│   ├── page.tsx
│   ├── products/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── suggestions/
│   │   ├── page.tsx
│   │   └── new/page.tsx
│   └── ...
├── globals.css             ← يحتوي على RTL/LTR styles
messages/
├── ar.json                 ← الترجمة العربية
├── en.json                 ← الترجمة الإنجليزية
└── zh.json                 ← الترجمة الصينية
lib/
└── productUtils.ts         ← دوال الترجمة المساعدة
components/
└── header/
    └── Header.tsx          ← الهيدر الموحد
context/
└── StoreContext.tsx        ← إدارة الحالة العامة
```

---

## 🎯 كيفية استخدام الترجمة

### 1️⃣ في Server Components:

```typescript
import { useTranslations } from 'next-intl';

export default function MyPage({ params: { lang } }: { params: { lang: string } }) {
    const t = useTranslations('products');
    
    return (
        <div>
            <h1>{t('title')}</h1>
            <p>{t('subtitle')}</p>
        </div>
    );
}
```

### 2️⃣ في Client Components:

```typescript
"use client";

import { useTranslations } from 'next-intl';

export default function MyComponent() {
    const t = useTranslations('products');
    
    return <button>{t('addToCart')}</button>;
}
```

### 3️⃣ استخدام دوال المساعدة:

```typescript
import { getTitle, getDesc, getConditionLabel } from '@/lib/productUtils';

const displayTitle = getTitle(product, lang);
const displayCondition = getConditionLabel(product.condition, lang);
```

---

## 🔄 نظام الترجمة الحالي

### الدوال المتاحة في `lib/productUtils.ts`:

```typescript
// 1. ترجمة العنوان
getTitle(product, lang)
// ar → product.title_ar
// en → product.title_en
// zh → product.title_zh
// fallback → product.title_en

// 2. ترجمة الوصف
getDesc(product, lang)
// نفس المنطق

// 3. ترجمة حالة المنتج
getConditionLabel(condition, lang)
// ar: NEW → "جديد", USED → "مستعمل", REFURBISHED → "مُجدد"
// en: NEW → "NEW", USED → "USED", REFURBISHED → "REFURBISHED"
// zh: NEW → "新的", USED → "二手", REFURBISHED → "翻新"
```

---

## 🎨 RTL/LTR في التصميم

### التطبيق التلقائي:

```tsx
// في app/[lang]/layout.tsx
const direction = locale === 'ar' ? 'rtl' : 'ltr';

<html lang={locale} dir={direction}>
```

### Classes المتاحة:

```css
/* في globals.css */
html[dir="rtl"] { direction: rtl; text-align: right; }
html[dir="ltr"] { direction: ltr; text-align: left; }

/* للأسعار والأرقام */
.price, [data-price], .number {
  direction: ltr; /* دائماً من اليسار لليمين */
}
```

### استخدام في Tailwind:

```tsx
<div className="text-right rtl:text-right ltr:text-left">
    {/* المحتوى */}
</div>
```

---

## 📝 مثال: ProductCard مع 3 لغات

```typescript
"use client";

import { getTitle, getConditionLabel } from '@/lib/productUtils';
import { useTranslations } from 'next-intl';

export default function ProductCard({ product, lang }: { product: Product; lang: string }) {
    const t = useTranslations('products');
    
    const displayTitle = getTitle(product, lang);
    const displayCondition = getConditionLabel(product.condition, lang);
    
    return (
        <div className="border rounded-xl p-4">
            {/* الصورة */}
            <img src={product.image} alt={displayTitle} />
            
            {/* الحالة */}
            <span className="badge">{displayCondition}</span>
            
            {/* العنوان */}
            <h3>{displayTitle}</h3>
            
            {/* السعر - دائماً LTR */}
            <div className="price" dir="ltr">
                {product.price.toLocaleString()} ج.م
            </div>
            
            {/* الأزرار */}
            <button>{t('addToCart')}</button>
            <button>{t('addToWishlist')}</button>
        </div>
    );
}
```

---

## 🔗 تغيير اللغة

### في الهيدر (`components/header/Header.tsx`):

```typescript
const changeLang = (newLang: string) => {
    const segments = pathname.split("/");
    segments[1] = newLang; // تغيير جزء اللغة فقط
    router.push(segments.join("/")); // الانتقال للمسار الجديد
};
```

### الروابط:

```tsx
<Link href="/ar/products">العربية</Link>
<Link href="/en/products">English</Link>
<Link href="/zh/products">中文</Link>
```

---

## 📋 ملفات الترجمة

### البنية في `messages/{lang}.json`:

```json
{
  "products": {
    "title": "المنتجات",
    "subtitle": "تصفح منتجات...",
    "addToCart": "أضف للسلة",
    "addToWishlist": "أضف للمفضلة",
    "new": "جديد",
    "used": "مستعمل"
  },
  "productDetails": {
    "description": "وصف المنتج",
    "specifications": "المواصفات الفنية",
    "specs": {
      "current_rating": "التيار المقنن",
      "voltage": "الجهد"
    }
  }
}
```

---

## ✅ الصفحات المحدثة

### تم تطبيق الترجمة في:

- ✅ `app/[lang]/products/page.tsx`
- ✅ `app/[lang]/products/[id]/page.tsx`
- ✅ `app/[lang]/wishlist/page.tsx`
- ✅ `app/[lang]/compare/page.tsx`
- ✅ `app/[lang]/vendor/products/page.tsx`
- ✅ `app/[lang]/suggestions/page.tsx`
- ✅ `components/header/Header.tsx`

---

## 🐛 حل المشاكل الشائعة

### 1. الصفحة تظهر بدون CSS:
**السبب:** الصفحة خارج مسار `[lang]`
**الحل:** تأكد أن جميع الصفحات داخل `app/[lang]/`

### 2. الترجمة لا تعمل:
**السبب:** المفتاح غير موجود في ملف JSON
**الحل:** أضف المفتاح في `messages/{lang}.json`

### 3. RTL لا يعمل:
**السبب:** الـ `dir` غير محدد في HTML
**الحل:** تحقق من `app/[lang]/layout.tsx`

### 4. الأسعار تظهر معكوسة:
**الحل:** أضف `dir="ltr"` أو class `price`:
```tsx
<div className="price" dir="ltr">
    {price.toLocaleString()} ج.م
</div>
```

---

## 🚀 إضافة صفحة جديدة

### الخطوات:

1. **إنشاء الصفحة:**
```bash
app/[lang]/my-page/page.tsx
```

2. **استخدام الترجمة:**
```typescript
import { useTranslations } from 'next-intl';

export default function MyPage({ params: { lang } }: { params: { lang: string } }) {
    const t = useTranslations('myPage');
    return <h1>{t('title')}</h1>;
}
```

3. **إضافة الترجمات:**
```json
// messages/ar.json
{
  "myPage": {
    "title": "صفحتي"
  }
}
```

---

## 📊 الحالة النهائية

| الميزة | الحالة |
|--------|---------|
| RTL/LTR | ✅ يعمل |
| 3 لغات | ✅ مدعوم |
| ملفات الترجمة | ✅ موجودة |
| دوال المساعدة | ✅ جاهزة |
| الهيدر الموحد | ✅ يعمل |
| تغيير اللغة | ✅ يعمل |
| صفحة المنتجات | ✅ مترجمة |
| صفحة التفاصيل | ✅ مترجمة |
| CRM (قادم) | ⏳ جاهز للتطبيق |

---

## 🎯 الخلاصة

**النظام جاهز ويعمل بالكامل!**

لا حاجة لإعادة بناء أي شيء - فقط:
1. استخدم `useTranslations()` في أي صفحة
2. استخدم `getTitle()` و `getConditionLabel()` للمنتجات
3. أضف الترجمات في `messages/{lang}.json`
4. الـ RTL/LTR يعمل تلقائياً

---

*آخر تحديث: 2025-12-06*
