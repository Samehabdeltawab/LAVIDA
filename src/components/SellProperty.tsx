import { motion } from "motion/react";
import { Home } from "lucide-react";
import { useLang } from "../LangContext";
import { t } from "../i18n";

interface SellPropertyProps {
  onCtaClick: (id: string) => void;
  onOpenSellForm: () => void;
}

export default function SellProperty({ onOpenSellForm }: SellPropertyProps) {
  const { lang } = useLang();

  return (
    <section id="sell-property" className="py-20 bg-primary text-white relative overflow-hidden">
      <div className="absolute -top-10 -left-10 w-56 h-56 bg-secondary/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className={`max-w-4xl mx-auto px-6 md:px-12 relative z-10 text-center space-y-6`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="w-16 h-16 mx-auto rounded-2xl bg-secondary-fixed/15 text-secondary-fixed flex items-center justify-center"
        >
          <Home className="h-8 w-8" />
        </motion.div>
        <h2 className="font-display text-3xl md:text-4xl font-bold">
          {t(lang, "sell_title")}
        </h2>
        <p className="font-sans text-base md:text-lg text-surface-variant max-w-2xl mx-auto opacity-90 leading-relaxed">
          {t(lang, "sell_desc")}
        </p>
        <button
          onClick={onOpenSellForm}
          className="bg-secondary-fixed text-primary hover:bg-white hover:scale-[1.03] active:scale-[0.98] px-8 py-4 rounded-xl font-display text-base font-bold shadow-xl transition-all duration-300"
        >
          {t(lang, "sell_cta")}
        </button>
      </div>
    </section>
  );
}
