
export const getTitle = (product: any, lang: string) => {
    if (!product) return "";
    if (lang === 'ar' && product.title_ar) return product.title_ar;
    if (lang === 'zh' && product.title_zh) return product.title_zh;
    return product.title_en || product.title || "";
};

export const getDesc = (product: any, lang: string) => {
    if (!product) return "";

    // Check if detailed_description exists as an object (DB structure)
    if (product.detailed_description) {
        if (lang === 'ar' && product.detailed_description.ar) return product.detailed_description.ar;
        if (lang === 'zh' && product.detailed_description.zh) return product.detailed_description.zh;
        return product.detailed_description.en || "";
    }

    // Fallback to flat fields if they exist (old structure or API response)
    if (lang === 'ar' && product.description_ar) return product.description_ar;
    if (lang === 'zh' && product.description_zh) return product.description_zh;

    return product.description_en || product.description || "";
};

export const getConditionLabel = (condition: string, lang: string) => {
    if (!condition) return "";
    const c = condition.toUpperCase();

    if (lang === 'ar') {
        if (c === 'NEW') return "جديد";
        if (c === 'USED') return "مستعمل";
        if (c === 'REFURBISHED' || c === 'REFURB') return "مُجدد";
        return c;
    }
    if (lang === 'zh') {
        if (c === 'NEW') return "新的";
        if (c === 'USED') return "二手";
        if (c === 'REFURBISHED' || c === 'REFURB') return "翻新";
        return c;
    }

    // Default EN
    if (c === 'NEW') return "NEW";
    if (c === 'USED') return "USED";
    if (c === 'REFURBISHED' || c === 'REFURB') return "REFURBISHED";
    return c;
};
