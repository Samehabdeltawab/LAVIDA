import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { useLang } from "../LangContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SECTIONS_AR: { title: string; items: string[] }[] = [
  {
    title: "نبذة عن خدماتنا",
    items: [
      "لاڤيدا بروبيرتز شركة تسويق ووساطة عقارية. نحن لسنا المطور ولا مالك الوحدات، بل نعرض مشاريع المطورين ونربطك بفريق المبيعات.",
    ],
  },
  {
    title: "استخدام الموقع",
    items: [
      "الموقع مخصص للتعريف بالمشاريع والتواصل معنا.",
      "توافق على أن البيانات التي تدخلها صحيحة، وأنك لن تستخدم الموقع بشكل مسيء أو ترسل بيانات مزيفة.",
    ],
  },
  {
    title: "دقة المعلومات والأسعار",
    items: [
      "الأسعار والمساحات وأنظمة السداد وتوافر الوحدات المعروضة استرشادية، وقد يحدّثها المطور من وقت لآخر.",
      "تُحدَّد التفاصيل النهائية في العقد المبرم بينك وبين المطور.",
    ],
  },
  {
    title: "إرسال الطلبات والتواصل",
    items: [
      "إرسال النموذج ليس عقد بيع ولا حجزًا، ويعني موافقتك على أن يتواصل معك فريق المبيعات عبر الهاتف أو واتساب بخصوص استفسارك.",
    ],
  },
  {
    title: "العمولات والمدفوعات",
    items: [
      "خدمتنا للمشتري مجانية، ولا نتقاضى منه أي رسوم عند شراء وحدة من مشروع مطور.",
      "نحصل على عمولتنا من المطور.",
      "في حالة إعادة البيع (ريسيل) فقط، قد تُحصَّل عمولة من العميل، ويتم الاتفاق عليها بوضوح قبل أي إجراء.",
      "لا تدفع أي مبالغ لأي شخص يدّعي أنه يمثلنا إلا بإيصال رسمي وبعد التأكد من الاتفاق مع الشركة.",
    ],
  },
  {
    title: "الحجز والتعاقد",
    items: [
      "يتم أي حجز أو تعاقد بينك وبين المطور وفق شروطه وسياساته، ولاڤيدا ليست طرفًا في العقد.",
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
      "هدفنا أن نوصلك إلى أفضل المطورين وأنسب الفرص العقارية، ونختار المشاريع التي نعرضها بعناية.",
      "نقف بجانبك ونتابع معك حتى تتخذ قرارك بكل وضوح وثقة.",
      "قرار الشراء النهائي قرارك، ونوفر لك كل المعلومات التي تساعدك على اتخاذه.",
    ],
  },
  {
    title: "الخصوصية",
    items: [
      "نتعامل مع بياناتك وفق سياسة الخصوصية الموجودة على الموقع.",
    ],
  },
  {
    title: "تعديل الشروط",
    items: [
      "قد نحدّث الشروط والأحكام من وقت لآخر، واستمرارك في استخدام الموقع يعني موافقتك على النسخة المحدّثة.",
    ],
  },
  {
    title: "القانون المختص",
    items: [
      "تخضع هذه الشروط للقانون المصري.",
    ],
  },
];

const SECTIONS_EN: { title: string; items: string[] }[] = [
  {
    title: "About Our Services",
    items: [
      "Lavida Properties is a real estate marketing and brokerage company. We are not the developer or the owner of the units; we showcase developers' projects and connect you with their sales teams.",
    ],
  },
  {
    title: "Using the Website",
    items: [
      "The website is intended to introduce projects and help you get in touch with us.",
      "You agree that the information you provide is accurate and that you will not misuse the website or submit false information.",
    ],
  },
  {
    title: "Accuracy of Information and Prices",
    items: [
      "Prices, areas, payment plans and unit availability shown are indicative and may be updated by the developer from time to time.",
      "Final details are determined in the contract between you and the developer.",
    ],
  },
  {
    title: "Submitting Requests and Communication",
    items: [
      "Submitting a form is not a sale contract or a reservation. It means you agree that our sales team may contact you by phone or WhatsApp regarding your inquiry.",
    ],
  },
  {
    title: "Commissions and Payments",
    items: [
      "Our service is free for buyers; we do not charge buyers any fees when purchasing a unit in a developer's project.",
      "We receive our commission from the developer.",
      "In resale cases only, a commission may be charged to the client, and it is clearly agreed upon before any action is taken.",
      "Do not pay any amount to anyone claiming to represent us unless against an official receipt and after confirming the arrangement with the company.",
    ],
  },
  {
    title: "Reservation and Contracting",
    items: [
      "Any reservation or contract is made between you and the developer under the developer's terms and policies. Lavida is not a party to the contract.",
    ],
  },
  {
    title: "Intellectual Property",
    items: [
      "The logo, texts, designs and images on the website belong to Lavida Properties or their respective owners and may not be copied or used without written permission.",
    ],
  },
  {
    title: "Our Commitment to You",
    items: [
      "Our goal is to connect you with the best developers and the most suitable real estate opportunities, and we carefully select the projects we showcase.",
      "We stand by you and follow up with you until you make your decision with full clarity and confidence.",
      "The final purchase decision is yours, and we provide you with all the information that helps you make it.",
    ],
  },
  {
    title: "Privacy",
    items: [
      "We handle your data in accordance with the Privacy Policy available on the website.",
    ],
  },
  {
    title: "Changes to the Terms",
    items: [
      "We may update these Terms and Conditions from time to time. Your continued use of the website means you accept the updated version.",
    ],
  },
  {
    title: "Governing Law",
    items: [
      "These terms are governed by Egyptian law.",
    ],
  },
];

export default function TermsModal({ isOpen, onClose }: Props) {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const SECTIONS = isAr ? SECTIONS_AR : SECTIONS_EN;
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
            dir={isAr ? "rtl" : "ltr"}
            className={`bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] shadow-2xl overflow-hidden relative flex flex-col ${isAr ? "text-right" : "text-left"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-primary text-white px-6 py-4 flex items-center justify-between shrink-0">
              <h2 className="font-display text-xl font-bold">{isAr ? "الشروط والأحكام" : "Terms & Conditions"}</h2>
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
                {isAr
                  ? "لاڤيدا بروبيرتز (Lavida Properties) · lavida-eg.com · آخر تحديث: 21 نوفمبر 2026"
                  : "Lavida Properties · lavida-eg.com · Last updated: November 21, 2026"}
              </p>
              <p>
                {isAr
                  ? "باستخدامك الموقع أو إرسال بياناتك إلينا، فإنك توافق على هذه الشروط والأحكام."
                  : "By using the website or submitting your information to us, you agree to these Terms and Conditions."}
              </p>

              {SECTIONS.map((s) => (
                <section key={s.title} className="space-y-2">
                  <h3 className="font-display text-lg font-bold text-primary">{s.title}</h3>
                  <ul className={`list-disc ${isAr ? "pr-6" : "pl-6"} space-y-1`}>
                    {s.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              ))}

              <section className="space-y-2">
                <h3 className="font-display text-lg font-bold text-primary">{isAr ? "التواصل معنا" : "Contact Us"}</h3>
                <p>
                  {isAr ? "لأي استفسار عن هذه الشروط، تواصل معنا على:" : "For any questions about these terms, contact us at:"}{" "}
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
