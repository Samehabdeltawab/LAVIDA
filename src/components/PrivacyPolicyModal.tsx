import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { useLang } from "../LangContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyPolicyModal({ isOpen, onClose }: Props) {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const L = (ar: string, en: string) => (isAr ? ar : en);
  const listPad = isAr ? "pr-6" : "pl-6";
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
              <h2 className="font-display text-xl font-bold">{L("سياسة الخصوصية", "Privacy Policy")}</h2>
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
                {L("لاڤيدا بروبيرتز (Lavida Properties) · lavida-eg.com · آخر تحديث: 20 نوفمبر 2026", "Lavida Properties · lavida-eg.com · Last updated: November 20, 2026")}
              </p>

              <p>
                {L(
                  "توضح هذه السياسة البيانات التي نجمعها عند تركك بياناتك في نماذج الإعلانات على فيسبوك وإنستجرام، أو عند تواصلك معنا بخصوص مشروع عقاري، وكيفية استخدامنا لها.",
                  "This policy explains the data we collect when you leave your details in our Facebook and Instagram ad forms, or contact us about a real estate project, and how we use it."
                )}
              </p>

              <section className="space-y-2">
                <h3 className="font-display text-lg font-bold text-primary">{L("البيانات التي نجمعها", "Data We Collect")}</h3>
                <ul className={`list-disc ${listPad} space-y-1`}>
                  <li>{L("الاسم.", "Name.")}</li>
                  <li>{L("رقم الهاتف.", "Phone number.")}</li>
                  <li>
                    {L(
                      "تفاصيل استفسارك العقاري وإجاباتك على أسئلة النموذج، مثل المشروع ونوع الوحدة التي تستفسر عنها، والغرض من الشراء، والتوقيت، وطريقة الدفع المفضلة.",
                      "The details of your property inquiry and your answers to the form questions, such as the project and unit type you are asking about, the purpose of purchase, timing, and preferred payment method."
                    )}
                  </li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="font-display text-lg font-bold text-primary">{L("كيف نستخدم البيانات", "How We Use Your Data")}</h3>
                <ul className={`list-disc ${listPad} space-y-1`}>
                  <li>{L("يستقبل المسؤول لدينا الطلبات ويوزعها على فريق المبيعات.", "Our administrator receives requests and assigns them to the sales team.")}</li>
                  <li>
                    {L(
                      "يتواصل معك فريق المبيعات بخصوص الوحدات المتاحة والأسعار وأنظمة السداد للمشروع الذي استفسرت عنه، ومتابعة استفسارك.",
                      "The sales team contacts you about available units, prices and payment plans for the project you asked about, and follows up on your inquiry."
                    )}
                  </li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="font-display text-lg font-bold text-primary">{L("من يمكنه الاطلاع على البيانات", "Who Can Access Your Data")}</h3>
                <p>
                  {L(
                    "الاطلاع على البيانات مقصور على الموظفين المصرح لهم، ومقدمي الخدمات اللازمين لاستقبال الطلبات والتواصل معك (مثل منصة Meta التي تُملأ من خلالها نماذج الإعلانات).",
                    "Access to data is limited to authorized employees and the service providers needed to receive requests and contact you (such as the Meta platform through which ad forms are filled in)."
                  )}
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-display text-lg font-bold text-primary">{L("التواصل معنا", "Contact Us")}</h3>
                <p>
                  {L("لأي استفسار عن بياناتك أو عن هذه السياسة، تواصل معنا على:", "For any questions about your data or this policy, contact us at:")}{" "}
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
