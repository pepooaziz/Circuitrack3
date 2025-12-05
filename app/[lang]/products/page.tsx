"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import { products } from "@/lib/productsData";
import { ShoppingCart, Heart, Repeat2, Check, Search } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { toast } from "sonner";
import { getTitle, getDesc, getConditionLabel } from "@/lib/productUtils";
import { useTranslations } from "next-intl";

export default function ProductsPage({ params: { lang } }: { params: { lang: string } }) {
    const t = useTranslations("products");
    const { addToCart, toggleWishlist, addToCompare, isInWishlist, isInCompare } = useStore();
    const [searchQuery, setSearchQuery] = useState("");

    // Filter products based on search
    const filteredProducts = products.filter(product => {
        if (!searchQuery) return true;
        const title = getTitle(product, lang).toLowerCase();
        const brand = product.brand?.toLowerCase() || "";
        const category = product.category?.toLowerCase() || "";
        const query = searchQuery.toLowerCase();
        return title.includes(query) || brand.includes(query) || category.includes(query);
    });

    const handleAddToCart = (product: Product) => {
        addToCart(product);
        toast.success(t("addToCart"));
    };

    const handleWishlist = (product: Product) => {
        toggleWishlist(product);
        if (isInWishlist(product.id)) {
            toast.info(lang === 'ar' ? "تمت إزالة المنتج من المفضلة" : "Removed from wishlist");
        } else {
            toast.success(t("addToWishlist"));
        }
    };

    const handleCompare = (product: Product) => {
        addToCompare(product);
        if (!isInCompare(product.id)) toast.success(t("compare"));
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-10 px-4 sm:px-6 lg:px-8 mt-16">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-slate-900 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
                        {t("title")}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        {t("subtitle")}
                    </p>
                </div>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-10">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder={t("search")}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-slate-700 placeholder-slate-400"
                        />
                    </div>
                </div>

                {/* Products Count */}
                {filteredProducts.length > 0 && (
                    <div className="mb-6 text-center text-sm text-slate-500">
                        {lang === 'ar'
                            ? `${filteredProducts.length} منتج متاح`
                            : lang === 'zh'
                                ? `找到 ${filteredProducts.length} 个产品`
                                : `${filteredProducts.length} products available`
                        }
                    </div>
                )}

                {/* Products Grid */}
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-slate-400 mb-4">
                            <ShoppingCart size={64} className="mx-auto" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-700 mb-2">
                            {t("noProducts")}
                        </h3>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                            >
                                {lang === 'ar' ? "مسح البحث" : lang === 'zh' ? "清除搜索" : "Clear search"}
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => {
                            const isWishlisted = isInWishlist(product.id);
                            const isCompared = isInCompare(product.id);
                            const displayTitle = getTitle(product, lang);
                            const displayDesc = getDesc(product, lang);
                            const displayCondition = getConditionLabel(product.condition, lang);

                            return (
                                <div
                                    key={product.id}
                                    className="group bg-white border-2 border-slate-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden flex flex-col"
                                >
                                    {/* Image Area */}
                                    <div className="relative h-52 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4 overflow-hidden">
                                        <img
                                            src={product.image}
                                            alt={displayTitle}
                                            className="object-contain max-h-full max-w-full mix-blend-multiply group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                                            {displayCondition}
                                        </div>

                                        {/* Quick Actions on Hover */}
                                        <div className="absolute top-3 left-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleWishlist(product)}
                                                className={`p-2 rounded-full backdrop-blur-sm transition-colors ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white/90 text-slate-600 hover:bg-red-50 hover:text-red-500'}`}
                                                title={t("addToWishlist")}
                                            >
                                                <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
                                            </button>
                                            <button
                                                onClick={() => handleCompare(product)}
                                                className={`p-2 rounded-full backdrop-blur-sm transition-colors ${isCompared ? 'bg-orange-500 text-white' : 'bg-white/90 text-slate-600 hover:bg-orange-50 hover:text-orange-500'}`}
                                                title={t("compare")}
                                            >
                                                {isCompared ? <Check size={16} /> : <Repeat2 size={16} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 flex flex-col flex-grow">
                                        <div className="text-xs text-blue-600 font-bold mb-2 uppercase tracking-wider">
                                            {product.category} • {product.brand}
                                        </div>

                                        <h3 className="text-base font-bold text-slate-800 mb-2 leading-snug line-clamp-2 min-h-[2.5rem]">
                                            <Link
                                                href={`/${lang}/products/${product.id}`}
                                                className="hover:text-blue-600 transition-colors"
                                            >
                                                {displayTitle}
                                            </Link>
                                        </h3>

                                        <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-grow">
                                            {displayDesc}
                                        </p>

                                        {/* Price & Add to Cart */}
                                        <div className="flex items-center justify-between border-t pt-4 mt-auto">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-slate-400 mb-1">
                                                    {lang === 'ar' ? 'السعر' : lang === 'zh' ? '价格' : 'Price'}
                                                </span>
                                                <div className="text-xl font-bold text-blue-600" dir="rtl">
                                                    {product.price.toLocaleString()} {product.currency || 'ج.م'}
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                                                title={t("addToCart")}
                                            >
                                                <ShoppingCart size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
