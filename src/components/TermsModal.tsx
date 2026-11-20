import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SECTIONS: { title: string; items: string[] }[] = [
  {
    title: "نبذة عن خدماتنا",
    items: [
      "لاڤيدا بروبيرتز شركة تسويق ووساطة عقارية. إحنا مش المطور ولا مالك الوحدات، وبنعرض مشاريع المطورين وبنربطك بفريق المبيعات.",
    ],
  },
  {
    title: "استخدام الموقع",
    items: [
      "الموقع مخصص للتعريف بالمشاريع والتواصل معانا.",
      "بتوافق إن البيانات اللي بتدخلها صحيحة، وإنك مش هتستخدم الموقع بشكل مسيء أو تبعت بيانات مزيفة.",
    ],
  },
  {
    title: "دقة المعلومات والأسعار",
    items: [
      "الأسعار والمساحات وأنظمة السداد وتوافر الوحدات المعروضة استرشادية، وممكن يحدّثها المطور من وقت لآخر.",
      "التفاصيل النهائية بتتحدد في العقد المبرم بينك وبين المطور.",
    ],
  },
  {
    title: "إرسال الطلبات والتواصل",
    items: [
      "إرسال النموذج مش عقد بيع ولا حجز، ومعناه موافقتك إن فريق المبيعات يتواصل معاك بالتليفون أو واتساب بخصوص استفسارك.",
    ],
  },
  {
    title: "العمولات والمدفوعات",
    items: [
      "خدمتنا للمشتري مجانية، ومبناخدش منه أي رسوم عند شراء وحدة من مشروع مطور.",
      "بناخد عمولتنا من المطور.",
      "في حالة إعادة البيع (ريسيل) فقط، ممكن تُحصّل عمولة من العميل، وبيتم الاتفاق عليها بشكل واضح قبل أي إجراء.",
      "لا تدفع أي مبالغ لأي شخص يدّعي إنه بيمثلنا إلا بإيصال رسمي وبعد التأكد من الاتفاق مع الشركة.",
    ],
  },
  {
    title: "الحجز والتعاقد",
    items: [
      "أي حجز أو تعاقد بيتم بينك وبين المطور وفق شروطه وسياساته، ولاڤيدا مش طرف في العقد.",
    ],
  },
  {
    title: "الملكية الفكرية",
    items: [
      "الشعار والنصوص والتصميمات والصور على الموقع ملك لاڤيدا بروبيرتز أو أصحابها، ولا يجوز نسخها أو استخدامها بدون إذن كتابي.",
    ],
  },
  {
    title: "التزامنا تجاهك",
    items: [
      "هدفنا نوصلك لأفضل المطورين وأنسب الفرص العقارية، وبنختار المشاريع اللي بنعرضها بعناية.",
      "بنقف جنبك وبنتابع معاك لحد ما تاخد قرارك بكل وضوح وثقة.",
      "قرار الشراء النهائي بيبقى قرارك، وبنوفر لك كل المعلومات اللي تساعدك تاخده.",
    ],
  },
  {
    title: "الخصوصية",
    items: [
      "بنتعامل مع بياناتك وفق سياسة الخصوصية الموجودة على الموقع.",
    ],
  },
  {
    title: "تعديل الشروط",
    items: [
      "ممكن نحدّث الشروط والأحكام من وقت لآخر، واستمرارك في استخدام الموقع معناه موافقتك على النسخة المحدّثة.",
    ],
  },
  {
    title: "القانون المختص",
    items: [
      "تخضع هذه الشروط للقانون المصري.",
    ],
  },
];

export default function TermsModal({ isOpen, onClose }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
            dir="rtl"
            className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] shadow-2xl overflow-hidden relative flex flex-col text-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-primary text-white px-6 py-4 flex items-center justify-between shrink-0">
              <h2 className="font-display text-xl font-bold">الشروط والأحكام</h2>
              <button
                onClick={onClose}
                className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="إغلاق"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto px-6 md:px-8 py-6 space-y-5 font-sans text-sm md:text-base text-gray-700 leading-relaxed">
              <p className="text-xs text-gray-500">
                لاڤيدا بروبيرتز (Lavida Properties) · lavida-eg.com · آخر تحديث: 21 نوفمبر 2026
              </p>
              <p>باستخدامك الموقع أو إرسال بياناتك لينا، بتوافق على الشروط والأحكام دي.</p>

              {SECTIONS.map((s) => (
                <section key={s.title} className="space-y-2">
                  <h3 className="font-display text-lg font-bold text-primary">{s.title}</h3>
                  <ul className="list-disc pr-6 space-y-1">
                    {s.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              ))}

              <section className="space-y-2">
                <h3 className="font-display text-lg font-bold text-primary">التواصل معانا</h3>
                <p>
                  لأي استفسار عن الشروط دي، تواصل معانا على:{" "}
                  <a
                    href="mailto:contact@lavida-eg.com"
                    className="text-secondary font-semibold hover:underline"
                    dir="ltr"
                  >
                    contact@lavida-eg.com
                  </a>
                </p>
              </section>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
