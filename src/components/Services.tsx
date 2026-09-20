import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Megaphone, Tag, Users, Rocket, RefreshCw, Headphones, X } from "lucide-react";
import { useLang } from "../LangContext";
import { t } from "../i18n";

interface ServiceItem {
  id: string;
  title: string;
  icon: any;
  description: string;
  details: string[];
}

export default function Services() {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const { lang } = useLang();

  const getFirstWords = (text: string, count = 3) =>
    text.split(" ").slice(0, count).join(" ");

  const services: ServiceItem[] = [
    {
      id: "marketing",
      title: t(lang, "service1_title"),
      icon: Megaphone,
      description: t(lang, "service1_short"),
      details: [
        lang === "ar" ? "استهداف رقمي عالي الدقة للمستثمرين المهتمين في مصر والخليج العربي." : "Highly precise digital targeting of interested investors in Egypt and the Gulf.",
        lang === "ar" ? "تصوير احترافي وإنتاج جولات افتراضية ثلاثية الأبعاد لكل وحدة عقارية." : "Professional photography and 3D virtual tour production for each unit.",
        lang === "ar" ? "إعلانات موجهة عبر منصات التواصل الاجتماعي ومحركات البحث لضمان أقصى وصول." : "Targeted ads across social media and search engines for maximum reach.",
        lang === "ar" ? "تمثيل عقارك مع شبكتنا الكبرى لتحقيق بيع بأفضل سعر ممكن." : "Representing your property through our extensive network for the best possible price."
      ]
    },
    {
      id: "sales",
      title: t(lang, "service2_title"),
      icon: Tag,
      description: t(lang, "service2_short"),
      details: [
        lang === "ar" ? "فريق ذو خبرة يمتلك مهارات تفاوض عالية لضمان أفضل سعر لعقارك." : "An experienced team with high negotiation skills to ensure the best price for your property.",
        lang === "ar" ? "تسهيل عمليات التعاقد والتحقق من سلامة كافة المستندات القانونية." : "Facilitating contracting processes and verifying all legal documents.",
        lang === "ar" ? "تقديم خيارات تمويل عقاري مرنة وخطط سداد تناسب جميع الأهداف." : "Offering flexible mortgage options and payment plans for all goals.",
        lang === "ar" ? "مستشار مبيعات مخصص يتابع معك خطوة بخطوة حتى نهاية الصفقة." : "A dedicated sales consultant following up with you step by step until deal closure."
      ]
    },
    {
      id: "consultancy",
      title: t(lang, "service3_title"),
      icon: Users,
      description: t(lang, "service3_short"),
      details: [
        lang === "ar" ? "إعداد تقارير جدوى استثمارية مخصصة وعوائد إيجارية متوقعة." : "Preparing customized investment feasibility reports and projected rental yields.",
        lang === "ar" ? "تحليل مستمر وشفاف للتغيرات والاتجاهات الحديثة بالسوق المصري." : "Continuous and transparent analysis of changes and trends in the Egyptian market.",
        lang === "ar" ? "توجيه استراتيجي لاختيار المواقع ذات الكفاءة الأعلى لتنمية رأس المال." : "Strategic guidance for selecting highest-efficiency locations for capital growth.",
        lang === "ar" ? "جلسات استشارية فردية مجانية مصممة لتلبية تفضيلاتك الاستثمارية." : "Free individual consultation sessions designed to meet your investment preferences."
      ]
    },
    {
      id: "launch",
      title: t(lang, "service4_title"),
      icon: Rocket,
      description: t(lang, "service4_short"),
      details: [
        lang === "ar" ? "حملات تشويقية مسبقة التخطيط تضمن توليد اهتمام جماهيري هائل." : "Pre-planned teaser campaigns ensuring massive public interest.",
        lang === "ar" ? "تنظيم وإدارة فعاليات إطلاق حصرية لرجال الأعمال والمستثمرين الكبار." : "Organizing and managing exclusive launch events for businessmen and major investors.",
        lang === "ar" ? "دراسة متعمقة للمشروع لتحديد نقاط القوة وعناصر التميز الفريدة." : "In-depth project study to identify strengths and unique differentiating factors.",
        lang === "ar" ? "التنسيق الكامل مع قنوات البيع المباشرة والوسطاء لضمان انطلاقة ناجحة." : "Full coordination with direct sales channels and brokers for a successful launch."
      ]
    },
    {
      id: "resale",
      title: t(lang, "service5_title"),
      icon: RefreshCw,
      description: t(lang, "service5_short"),
      details: [
        lang === "ar" ? "تقييم عقاري عادل ودقيق يعتمد على مقارنات السوق وأرقام المبيعات الحية." : "Fair and accurate property valuation based on market comparisons and live sales data.",
        lang === "ar" ? "تسويق مستقل لوحدات إعادة البيع للوصول السريع للمشترين الجادين." : "Independent marketing of resale units for quick access to serious buyers.",
        lang === "ar" ? "إدارة تسوية المعاملات المالية المتبقية مع المطور العقاري الأصلي." : "Managing settlement of remaining financial transactions with the original developer.",
        lang === "ar" ? "الانتهاء من عقود التنازل والتحصيل المالي بأمان تام وبدون أي متاعب." : "Completing assignment contracts and financial collection safely and without hassle."
      ]
    },
    {
      id: "after_sales",
      title: t(lang, "service6_title"),
      icon: Headphones,
      description: t(lang, "service6_short"),
      details: [
        lang === "ar" ? "فحص فني دقيق للوحدة قبل الاستلام وتوثيق الملاحظات للمطور لمعالجتها." : "Precise technical inspection before handover and documenting notes for the developer.",
        lang === "ar" ? "مساعدة شاملة في اختيار وتنفيذ ديكور وتشطيب الوحدات بأفضل الأسعار." : "Comprehensive assistance in selecting and executing unit decoration and finishing.",
        lang === "ar" ? "إدارة وتأجير العقار لضمان تدفق نقدي دوري وعوائد منتظمة." : "Property management and leasing to ensure regular cash flow and returns.",
        lang === "ar" ? "دعم قانوني وفني مستمر للرد على أي استفسارات تتعلق بالتشغيل والخدمات." : "Continuous legal and technical support to answer any operational inquiries."
      ]
    }
  ];

  return (
    <section id="services" className="py-20 bg-surface-container-low relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Title */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">
            {t(lang, "services_title")}
          </h2>
          <div className="w-20 h-1.5 bg-secondary mx-auto rounded-full"></div>
          <p className="font-sans text-sm md:text-base text-on-surface-variant max-w-xl mx-auto">
            {t(lang, "services_subtitle")}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                whileHover={{ y: -6, boxShadow: "0 10px 30px -10px rgba(0, 51, 78, 0.12)" }}
                className={`bg-white p-8 rounded-xl border border-outline-variant/30 shadow-card transition-all duration-300 flex flex-col ${lang === "ar" ? "text-right" : "text-left"}`}
              >
                <div className="space-y-4">
                  <div className="inline-flex p-3 rounded-lg bg-secondary-fixed/30 text-secondary mb-2">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-primary">
                    {service.title}
                  </h3>
                  <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                    {getFirstWords(service.description)}...{" "}
                    <button
                      onClick={() => setSelectedService(service)}
                      className="text-secondary font-semibold hover:text-primary transition-colors cursor-pointer inline"
                    >
                      {lang === "ar" ? "اقرأ المزيد" : "Read more"}
                    </button>
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Detail Overlay Dialog (Service Modals) */}
        <AnimatePresence>
          {selectedService && (
            <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-outline-variant/30 relative ${lang === "ar" ? "text-right" : "text-left"}`}
              >
                {/* Modal Header */}
                <div className="bg-primary text-white p-6 relative">
                  <button
                    onClick={() => setSelectedService(null)}
                    className="absolute left-6 top-6 text-white/70 hover:text-white transition-colors cursor-pointer"
                    aria-label={t(lang, "services_close")}
                  >
                    <X className="h-6 w-6" />
                  </button>
                  <div className="inline-flex p-3 rounded-lg bg-white/10 text-secondary-fixed mb-3">
                    <selectedService.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-xl font-bold">
                    {selectedService.title}
                  </h3>
                </div>

                {/* Modal Body */}
                <div className="p-6 md:p-8 space-y-6">
                  <p className="font-sans text-sm text-on-surface leading-relaxed border-b border-outline-variant/20 pb-4">
                    {selectedService.description}
                  </p>

                  <div className="space-y-3">
                    <h4 className="font-display text-sm font-bold text-secondary">
                      {lang === "ar" ? "ما تشمله الخدمة بالتفصيل:" : "Service Details:"}
                    </h4>
                    <ul className="space-y-2.5 font-sans text-sm text-on-surface-variant">
                      {selectedService.details.map((detail, idx) => (
                        <li key={idx} className={`flex items-start gap-2.5 ${lang === "ar" ? "flex-row-reverse text-right" : "flex-row text-left"}`}>
                          <span className="h-5 w-5 rounded-full bg-secondary-fixed/50 text-secondary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                            ✓
                          </span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => {
                        setSelectedService(null);
                        const element = document.getElementById("contact");
                        if (element) {
                          element.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      className="bg-primary text-white hover:bg-secondary hover:text-white px-6 py-2.5 rounded-lg font-display text-xs font-bold transition-all shadow-md cursor-pointer"
                    >
                      {lang === "ar" ? "طلب استشارة بخصوص الخدمة" : "Request a Service Consultation"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
