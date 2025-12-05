"use client";

import { useState } from "react";
import { products } from "@/lib/productsData";
import { ShoppingCart, Heart, Repeat2, Check, ZoomIn, Package } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { toast } from "sonner";
import { getTitle, getDesc, getConditionLabel } from "@/lib/productUtils";
import { useTranslations } from "next-intl";
import { notFound } from "next/navigation";

// Helper function to translate spec keys
function translateSpecKey(key: string, lang: string, t: any): string {
    const specKey = `productDetails.specs.${key}`;
    try {
        return t(specKey);
    } catch {
        // Fallback: format the key nicely
        return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
}

export default function ProductDetailsPage({ params: { lang, id } }: { params: { lang: string; id: string } }) {
    const t = useTranslations();
    const { addToCart, toggleWishlist, addToCompare, isInWishlist, isInCompare } = useStore();

    // Fetch product
    const product = products.find(p => p.id === id);

    if (!product) {
        notFound();
    }

    // State for image gallery
    const productImages = product.image ? [product.image] : [];
    const [selectedImage, setSelectedImage] = useState(productImages[0] || '');
    const [isZoomed, setIsZoomed] = useState(false);

    // Get localized content
    const displayTitle = getTitle(product, lang);
    const displayDesc = getDesc(product, lang);
    const displayCondition = getConditionLabel(product.condition, lang);

    // Related products (same category)
    const relatedProducts = products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    const isWishlisted = isInWishlist(product.id);
    const isCompared = isInCompare(product.id);

    const handleAddToCart = () => {
        addToCart(product);
        toast.success(t("productDetails.addToCart"));
    };

    const handleWishlist = () => {
        toggleWishlist(product);
        if (isWishlisted) {
            toast.info(lang === 'ar' ? "تمت إزالة المنتج من المفضلة" : "Removed from wishlist");
        } else {
            toast.success(t("productDetails.addToWishlist"));
        }
    };

    const handleCompare = () => {
        addToCompare(product);
        if (!isCompared) toast.success(t("productDetails.addToCompare"));
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <div className="container mx-auto px-4 py-10 mt-16 space-y-16">
                {/* Main Product Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div
                            className="relative bg-white border-2 border-slate-200 rounded-2xl p-8 overflow-hidden group"
                            onMouseEnter={() => setIsZoomed(true)}
                            onMouseLeave={() => setIsZoomed(false)}
                        >
                            <img
                                src={selectedImage}
                                alt={displayTitle}
                                className={`w-full h-[500px] object-contain mix-blend-multiply transition-transform duration-300 ${isZoomed ? 'scale-150' : 'scale-100'}`}
                            />
                            {isZoomed && (
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg text-sm text-slate-600 flex items-center gap-2">
                                    <ZoomIn size={16} />
                                    {lang === 'ar' ? 'تكبير' : 'Zoomed'}
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {productImages.length > 1 && (
                            <div className="flex gap-3">
                                {productImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(img)}
                                        className={`w-24 h-24 border-2 rounded-lg overflow-hidden transition-all ${selectedImage === img
                                                ? 'border-blue-500 shadow-lg'
                                                : 'border-slate-200 hover:border-blue-300'
                                            }`}
                                    >
                                        <img src={img} alt={`${displayTitle} ${idx + 1}`} className="w-full h-full object-contain p-2" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info Panel */}
                    <div className="space-y-6">
                        {/* Category Badge */}
                        <div className="flex items-center gap-2 text-sm">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                                {product.category}
                            </span>
                            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
                                {product.brand}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl font-bold text-slate-900 leading-tight">
                            {displayTitle}
                        </h1>

                        {/* Condition & Stock */}
                        <div className="flex items-center gap-4">
                            <span className={`px-4 py-2 rounded-lg font-semibold text-sm ${product.condition === 'new'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-amber-100 text-amber-700'
                                }`}>
                                {displayCondition}
                            </span>
                            <span className="flex items-center gap-2 text-sm text-slate-600">
                                <Package size={16} />
                                {t("productDetails.inStock")}
                            </span>
                        </div>

                        {/* Price */}
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-6">
                            <div className="text-sm text-slate-600 mb-2">
                                {lang === 'ar' ? 'السعر' : lang === 'zh' ? '价格' : 'Price'}
                            </div>
                            <div className="text-4xl font-bold text-blue-600" dir="rtl">
                                {product.price.toLocaleString()} ج.م
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                            >
                                <ShoppingCart size={24} />
                                {t("productDetails.addToCart")}
                            </button>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={handleWishlist}
                                    className={`border-2 py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${isWishlisted
                                            ? 'border-red-500 bg-red-50 text-red-600'
                                            : 'border-slate-300 hover:border-red-300 hover:bg-red-50 text-slate-700'
                                        }`}
                                >
                                    <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                                    {t("productDetails.addToWishlist")}
                                </button>

                                <button
                                    onClick={handleCompare}
                                    className={`border-2 py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${isCompared
                                            ? 'border-orange-500 bg-orange-50 text-orange-600'
                                            : 'border-slate-300 hover:border-orange-300 hover:bg-orange-50 text-slate-700'
                                        }`}
                                >
                                    {isCompared ? <Check size={20} /> : <Repeat2 size={20} />}
                                    {t("productDetails.addToCompare")}
                                </button>
                            </div>
                        </div>

                        {/* Vendor Info */}
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                            <div className="text-sm text-slate-600 mb-1">{t("productDetails.vendor")}</div>
                            <div className="font-semibold text-slate-900">CircuitRack Verified Vendor</div>
                        </div>
                    </div>
                </div>

                {/* Description Section */}
                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                        <div className="w-1 h-8 bg-blue-600 rounded"></div>
                        {t("productDetails.description")}
                    </h2>
                    <p className="text-slate-700 leading-relaxed text-lg">
                        {displayDesc}
                    </p>
                </div>

                {/* Technical Specifications */}
                {product.specs && Object.keys(product.specs).length > 0 && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                            <div className="w-1 h-8 bg-blue-600 rounded"></div>
                            {t("productDetails.specifications")}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(product.specs).map(([key, value]) => (
                                <div key={key} className="flex items-center justify-between py-3 px-4 bg-slate-50 rounded-lg border border-slate-200">
                                    <span className="font-semibold text-slate-700">
                                        {translateSpecKey(key, lang, t)}
                                    </span>
                                    <span className="text-slate-900 font-medium">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                            <div className="w-1 h-10 bg-blue-600 rounded"></div>
                            {t("productDetails.relatedProducts")}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((relatedProduct) => {
                                const relatedTitle = getTitle(relatedProduct, lang);
                                const relatedCondition = getConditionLabel(relatedProduct.condition, lang);

                                return (
                                    <Link
                                        key={relatedProduct.id}
                                        href={`/${lang}/products/${relatedProduct.id}`}
                                        className="group bg-white border-2 border-slate-100 rounded-xl shadow-sm hover:shadow-xl hover:border-blue-200 transition-all overflow-hidden"
                                    >
                                        <div className="relative h-48 bg-slate-50 flex items-center justify-center p-4">
                                            <img
                                                src={relatedProduct.image}
                                                alt={relatedTitle}
                                                className="object-contain max-h-full max-w-full mix-blend-multiply group-hover:scale-110 transition-transform"
                                            />
                                            <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                                                {relatedCondition}
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold text-slate-800 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                                                {relatedTitle}
                                            </h3>
                                            <div className="text-lg font-bold text-blue-600" dir="rtl">
                                                {relatedProduct.price.toLocaleString()} ج.م
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
