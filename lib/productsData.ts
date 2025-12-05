import { Product } from "@/types/product";

export const products: Product[] = [
    {
        id: "p1",
        title: "Siemens 3VT3 MCCB 630A – Industrial Molded Case Circuit Breaker",
        category: "MCCB",
        brand: "Siemens",
        model: "3VT3 3AA46-0AA0",
        condition: "used",
        price: 16750, // Converted from $335
        image: "/products/siemens-3vt3-mccb.jpg",
        specs: {
            current_rating: "630A",
            rated_voltage: "690V",
            impulse_voltage: "8kV",
            Icu: "100kA @ 230V",
            Ics: "70kA",
            standard: "IEC 60947-2"
        },
        description: "قاطع قدرة MCCB صناعي عالي التحمل من سيمنز بقدرة 630 أمبير، مزود بوحدة اختبار TEST، مناسب للدوائر الرئيسية في تطبيقات الباور عالية الجهد. يتميز بقدرات فصل مرتفعة تصل إلى 100kA.",
        usage_applications: "لوحات التوزيع الرئيسية، محطات الباور، مصانع الإنتاج، أنظمة الحماية عالية السعة",
        seo_keywords: ["Siemens MCCB", "3VT3 630A", "Industrial Circuit Breaker", "MCCB 630A"],
        notes: "يُنصح بفحص نقاط التوصيل وتنظيف البارات النحاسية قبل التشغيل."
    },
    {
        id: "p2",
        title: "Siemens Heavy-Duty Power Contactor – 3-Pole High Current",
        category: "Contactor",
        brand: "Siemens",
        model: "Unknown",
        condition: "used",
        price: 11250, // Converted from $225
        image: "/products/siemens-power-contactor-hd.jpg",
        specs: {
            poles: 3,
            connection: "Copper busbar terminals",
            mounting: "Base mount",
            typical_current: "200–400A (estimated)"
        },
        description: "كونتاكتور قدرة صناعي من Siemens مصمم لتطبيقات الباور الثقيلة. مزود ببارات توصيل نحاسية واسعة مما يشير لقدرته العالية على تحمل التيارات الكبيرة.",
        usage_applications: "المحركات الصناعية الكبيرة، الرافعات، الضواغط، خطوط الإنتاج",
        seo_keywords: ["Siemens Power Contactor", "High Current Contactor", "Industrial Contactor"],
        notes: "يجب التأكد من جهد ملف التشغيل قبل التوصيل."
    },
    {
        id: "p3",
        title: "Siemens STT5 7400 Contactor – 40A AC3",
        category: "Contactor",
        brand: "Siemens",
        model: "STT5 7400",
        condition: "used",
        price: 1500, // Converted from $30
        image: "/products/siemens-stt5-7400.jpg",
        specs: {
            AC1_current: "40A",
            AC3_power: "11kW (3-phase)",
            rated_voltage: "400V",
            coil_voltage: "230V AC / 220V DC"
        },
        description: "كونتاكتور Siemens STT5 7400 بقدرة 40 أمبير، مناسب لتشغيل المحركات حتى 11kW. يتميز بحجم صغير وسهولة التركيب على قضبان التوزيع.",
        usage_applications: "لوحات الكنترول، أنظمة تشغيل المحركات، الأتمتة الصناعية",
        seo_keywords: ["Siemens STT5", "STT5 7400", "40A Contactor", "Motor Starter"],
        notes: "يُفضل اختبار ملف الكونتاكتور قبل إعادة التشغيل."
    },
    {
        id: "p4",
        title: "Siemens STT5 7300 Contactor – 24A AC-3",
        category: "Contactor",
        brand: "Siemens",
        model: "STT5 7300",
        condition: "used",
        price: 900, // Converted from $18
        image: "/placeholder?text=Siemens+STT5+7300",
        specs: {
            AC1_current: "24A",
            AC3_power: "4kW (3-phase)",
            rated_voltage: "400V",
            coil_voltage: "230V AC / 220V DC"
        },
        description: "كونتاكتور صغير الحجم من Siemens بقدرة 24A مناسب لتطبيقات الكنترول الخفيفة وتشغيل أحمال صغيرة. مثالي للوحات التحكم والأتمتة.",
        usage_applications: "لوحات التحكم الصغيرة، تشغيل مضخات صغيرة، أنظمة إضاءة صناعية",
        seo_keywords: ["Siemens STT5 7300", "24A Contactor", "Mini Contactor"],
        notes: "قد يحتاج تنظيف نقاط التلامس."
    },
    {
        id: "p5",
        title: "Cutler-Hammer HFWF 160A MCCB – 70kA Industrial Breaker",
        category: "MCCB",
        brand: "Cutler-Hammer",
        model: "HFWF160L",
        condition: "used",
        price: 6000, // Converted from $120
        image: "/placeholder?text=Cutler+Hammer+MCCB",
        specs: {
            current_rating: "160A",
            poles: 3,
            voltage: "690V AC",
            interrupt_capacity: "70kA",
            standard: "IEC 60947-2"
        },
        description: "قاطع MCCB صناعي عالي المتانة من Cutler-Hammer بقدرة 160A وقدرة فصل 70kA، مناسب لتطبيقات الحماية الصناعية الثقيلة واللوحات الرئيسية.",
        usage_applications: "لوحات توزيع – مصانع – حماية المحركات",
        seo_keywords: ["Cutler Hammer MCCB", "HFWF 160A", "Industrial Breaker"],
        notes: "صنع في الولايات المتحدة – يفضل قياس مقاومة العزل قبل التشغيل."
    },
    {
        id: "p6",
        title: "ABB AF265-30 Contactor – 265A Heavy Duty Industrial Contactor",
        category: "Contactor",
        brand: "ABB",
        model: "AF265-30",
        condition: "used",
        price: 12000, // Converted from $240
        image: "/placeholder?text=ABB+AF265",
        specs: {
            rated_current: "265A",
            AC3_power: "110kW",
            coil_voltage: "100–250V AC/DC",
            standards: "IEC 60947-4-1"
        },
        description: "كونتاكتور قدرة ضخم من ABB بقدرة 265 أمبير، مناسب لتشغيل المحركات العملاقة والرافعات الصناعية. يتميز بتكنولوجيا AF التي تضمن عمل مستقر تحت فروق الجهد.",
        usage_applications: "الرافعات – المصانع الكبرى – الضواغط – أنظمة الضخ العملاقة",
        seo_keywords: ["ABB AF265", "High Power Contactor", "265A Contactor"],
        notes: "يحتاج فحص ميكانيكي لنقاط التوصيل."
    },
    {
        id: "p7",
        title: "RDS Protection Relay – Overcurrent Adjustable Protection Unit",
        category: "Relay",
        brand: "RDS",
        model: "RDS Series",
        condition: "used",
        price: 1100, // Converted from $22
        image: "/placeholder?text=RDS+Protection+Relay",
        specs: {
            voltage: "220V AC",
            protection_type: "Overcurrent / Leakage",
            adjustable_range: "Visible via selector switches"
        },
        description: "ريلاي حماية صناعي قابل للضبط يستخدم لحماية الدوائر من التيار الزائد. مزود بزر Reset و Test لاختبار الوظائف.",
        usage_applications: "حماية محركات – لوحات توزيع – أنظمة مراقبة",
        seo_keywords: ["RDS Relay", "Protection Relay", "Industrial Overcurrent Relay"],
        notes: "يحتاج تنظيف وتثبيت الغطاء الأمامي."
    },
    {
        id: "p8",
        title: "WAIRCOM Pneumatic Directional Valve – Model U0505T0KUC",
        category: "Pneumatic Valve",
        brand: "Waircom",
        model: "U0505T0KUC",
        condition: "used",
        price: 1500, // Converted from $30
        image: "/placeholder?text=Waircom+Pneumatic+Valve",
        specs: {
            type: "Directional Control Valve",
            ports: "Likely 5/2 or 5/3 configuration",
            made_in: "Italy"
        },
        description: "صمام تحكم نيوماتيكي من شركة Waircom الإيطالية يستخدم للتحكم في حركة الأسطوانات الهوائية. يتميز ببنية معدنية قوية ومتانة عالية.",
        usage_applications: "خطوط الإنتاج – الروبوتات – أنظمة النيوماتيك الصناعية",
        seo_keywords: ["Waircom Pneumatic Valve", "U0505T0KUC", "Directional Valve"],
        notes: "يفضل فحص التسريب قبل الاستخدام."
    },
    {
        id: "p9",
        title: "Industrial Crane Remote Control – 8-Button Wireless Transmitter",
        category: "Remote Control",
        brand: "Generic / OEM",
        model: "Not specified",
        condition: "used",
        price: 3000, // Converted from $60
        image: "/placeholder?text=Crane+Remote+Control",
        specs: {
            buttons: 8,
            functions: "Up, Down, East, West, South, North, Stop, Start Alarm",
            application: "Industrial crane control"
        },
        description: "ريموت لاسلكي للتحكم في الرافعات الصناعية يحتوي على 8 أزرار للحركة في جميع الاتجاهات بالإضافة إلى زر توقف طارئ STOP وزر إنذار.",
        usage_applications: "الرافعات – الونشات – المصانع – مخازن الرفع",
        seo_keywords: ["Crane Remote Control", "Industrial Wireless Remote", "Hoist Controller"],
        notes: "يجب برمجته على الريسيفر قبل التشغيل."
    }
];
