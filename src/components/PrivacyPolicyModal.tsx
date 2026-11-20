import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyPolicyModal({ isOpen, onClose }: Props) {
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
              <h2 className="font-display text-xl font-bold">سياسة الخصوصية</h2>
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
                لاڤيدا بروبيرتز (Lavida Properties) · lavida-eg.com · آخر تحديث: 20 نوفمبر 2026
              </p>

              <p>
                توضح هذه السياسة البيانات اللي بنجمعها لما تسيب بياناتك في نماذج الإعلانات على فيسبوك وإنستجرام أو تتواصل معانا بخصوص مشروع عقاري، وإزاي بنستخدمها.
              </p>

              <section className="space-y-2">
                <h3 className="font-display text-lg font-bold text-primary">البيانات اللي بنجمعها</h3>
                <ul className="list-disc pr-6 space-y-1">
                  <li>الاسم.</li>
                  <li>رقم التليفون.</li>
                  <li>
                    تفاصيل استفسارك العقاري وإجاباتك على أسئلة النموذج، زي المشروع ونوع الوحدة اللي بتسأل عنها، والغرض من الشراء، والتوقيت، وطريقة الدفع المفضلة.
                  </li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="font-display text-lg font-bold text-primary">إزاي بنستخدم البيانات</h3>
                <ul className="list-disc pr-6 space-y-1">
                  <li>بيستقبل المسؤول عندنا الطلبات ويوزعها على فريق المبيعات.</li>
                  <li>
                    فريق المبيعات بيتواصل معاك بخصوص الوحدات المتاحة والأسعار وأنظمة السداد للمشروع اللي سألت عنه، ومتابعة استفسارك.
                  </li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="font-display text-lg font-bold text-primary">مين يقدر يوصل للبيانات</h3>
                <p>
                  الوصول للبيانات مقصور على الموظفين المصرح لهم، ومقدمي الخدمات اللازمين لاستقبال الطلبات والتواصل معاك (زي منصة Meta اللي بيتم من خلالها ملء نماذج الإعلانات).
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-display text-lg font-bold text-primary">التواصل معانا</h3>
                <p>
                  لأي استفسار عن بياناتك أو عن السياسة دي، تواصل معانا على:{" "}
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
