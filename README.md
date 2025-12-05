# 🛒 CircuitRack - Multi-Vendor Electronics Marketplace

<div align="center">

![CircuitRack Logo](public/logo-circuitrack.png)

**منصة تجارة إلكترونية متعددة البائعين للإلكترونيات مع دعم المزادات ونظام CRM**

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green)](https://supabase.com/)

[العربية](#-المميزات) | [English](#-features) | [中文](#-特点)

</div>

---

## ✨ Features

- 🌐 **Multi-language Support** - Arabic (RTL), English, Chinese
- 🛍️ **Multi-vendor Marketplace** - Multiple sellers in one platform
- 🔥 **Live Auctions** - Real-time bidding system
- 💼 **Vendor Dashboard** - Complete seller management
- 🛒 **Shopping Cart & Wishlist** - Full e-commerce functionality
- 📊 **Product Comparison** - Compare up to 4 products
- 💬 **CRM & Suggestions System** - Customer relationship management
- 🎨 **RTL/LTR Support** - Automatic text direction
- 📱 **Responsive Design** - Works on all devices
- 🔐 **Secure Authentication** - Supabase Auth integration

## 🌍 المميزات

- 🌐 **دعم متعدد اللغات** - العربية (RTL)، الإنجليزية، الصينية
- 🛍️ **منصة متعددة البائعين** - عدة بائعين في منصة واحدة
- 🔥 **مزادات مباشرة** - نظام مزايدة فوري
- 💼 **لوحة تحكم البائع** - إدارة كاملة للبائعين
- 🛒 **سلة التسوق والمفضلة** - وظائف تجارة إلكترونية كاملة
- 📊 **مقارنة المنتجات** - قارن حتى 4 منتجات
- 💬 **نظام CRM والمقترحات** - إدارة علاقات العملاء
- 🎨 **دعم RTL/LTR** - اتجاه النص التلقائي
- 📱 **تصميم متجاوب** - يعمل على جميع الأجهزة
- 🔐 **مصادقة آمنة** - تكامل Supabase Auth

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **i18n:** next-intl
- **State Management:** React Context API
- **Icons:** Lucide React
- **Notifications:** Sonner

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/circuitRack.git

# Navigate to project directory
cd circuitRack

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ADMIN_EMAIL=admin@circuitrack.com
```

## 🗄️ Database Setup

1. Create a Supabase project
2. Run the migration file:
   ```bash
   # In Supabase SQL Editor, run:
   supabase/migrations/001_crm_suggestions_schema.sql
   ```

## 📱 Pages & Routes

### Public Pages
- `/[lang]` - Homepage
- `/[lang]/products` - Products listing
- `/[lang]/products/[id]` - Product details
- `/[lang]/auctions` - Live auctions
- `/[lang]/vendors` - Vendor directory
- `/[lang]/about` - About us

### User Pages
- `/[lang]/cart` - Shopping cart
- `/[lang]/wishlist` - Wishlist
- `/[lang]/compare` - Product comparison
- `/[lang]/suggestions/new` - Submit suggestion
- `/[lang]/suggestions/my-tickets` - My tickets

### Vendor Pages
- `/[lang]/vendor/products` - Manage products
- `/[lang]/vendor/products/new` - Add new product
- `/[lang]/vendor/products/edit/[id]` - Edit product

### Auth Pages
- `/[lang]/auth/login` - Login
- `/[lang]/auth/register` - Register

## 🌍 Supported Languages

| Language | Code | Direction | Status |
|----------|------|-----------|--------|
| العربية | `ar` | RTL | ✅ Complete |
| English | `en` | LTR | ✅ Complete |
| 中文 | `zh` | LTR | ✅ Complete |

## 📚 Project Structure

```
circuitRack/
├── app/
│   ├── [lang]/              # Localized routes
│   │   ├── layout.tsx       # Root layout with i18n
│   │   ├── page.tsx         # Homepage
│   │   ├── products/        # Products pages
│   │   ├── cart/            # Cart page
│   │   ├── vendor/          # Vendor dashboard
│   │   └── ...
│   ├── api/                 # API routes
│   │   ├── products/
│   │   ├── suggestions/
│   │   └── ...
│   └── globals.css          # Global styles
├── components/
│   ├── header/              # Header component
│   └── ui/                  # shadcn/ui components
├── context/
│   └── StoreContext.tsx     # Global state management
├── i18n/
│   └── request.ts           # next-intl configuration
├── lib/
│   ├── hooks/               # Custom hooks
│   ├── productUtils.ts      # Product utilities
│   └── supabase/            # Supabase client
├── messages/
│   ├── ar.json              # Arabic translations
│   ├── en.json              # English translations
│   └── zh.json              # Chinese translations
├── supabase/
│   └── migrations/          # Database migrations
├── types/
│   └── product.ts           # TypeScript types
├── docs/                    # Documentation
├── middleware.ts            # Next.js middleware
└── i18n.ts                  # i18n config
```

## 🎯 Key Features Explained

### Multi-language Support
- Automatic language detection from URL (`/ar`, `/en`, `/zh`)
- RTL support for Arabic
- Translation files in `messages/` directory
- Uses `next-intl` for seamless i18n

### Product Management
- Add, edit, delete products
- Multi-language product titles and descriptions
- Product conditions: NEW, USED, REFURBISHED
- Image gallery support
- Technical specifications

### CRM System
- Customer suggestions and complaints
- Ticket management
- Lead scoring algorithm
- Activity tracking
- Email notifications (ready to activate)

### Shopping Features
- Add to cart with quantity management
- Wishlist functionality
- Product comparison (up to 4 items)
- Real-time cart count in header

## 📖 Documentation

- [Translation Guide](docs/TRANSLATION_GUIDE.md)
- [CRM System Documentation](docs/CRM_SUGGESTIONS_SYSTEM.md)
- [i18n Complete System](docs/I18N_COMPLETE_SYSTEM.md)
- [GitHub Upload Guide](docs/GITHUB_UPLOAD_GUIDE.md)

## 🛠️ Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@YOUR_USERNAME](https://github.com/YOUR_USERNAME)
- Email: your.email@example.com

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [next-intl](https://next-intl-docs.vercel.app/) - Internationalization
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) - Re-usable components
- [Lucide](https://lucide.dev/) - Beautiful icons

## 📊 Project Status

- ✅ Core functionality: Complete
- ✅ Multi-language support: Complete
- ✅ Product management: Complete
- ✅ Shopping cart: Complete
- ✅ CRM system: 90% Complete
- ⏳ Payment integration: Planned
- ⏳ Live auctions: Planned
- ⏳ Admin dashboard: Planned

## 🔮 Future Enhancements

- [ ] Payment gateway integration
- [ ] Real-time auction system
- [ ] Admin dashboard with analytics
- [ ] Email automation
- [ ] Mobile app (React Native)
- [ ] Advanced search and filters
- [ ] Product reviews and ratings
- [ ] Seller verification system

---

<div align="center">

**Made with ❤️ using Next.js and Supabase**

[⬆ Back to top](#-circuitrack---multi-vendor-electronics-marketplace)

</div>
