import { motion } from "motion/react";
import { Building2 } from "lucide-react";
import { useLang } from "../LangContext";
import { t } from "../i18n";

interface DevelopersProps {
  onCtaClick: (id: string) => void;
  onOpenDeveloperForm: () => void;
}

export default function Developers({ onOpenDeveloperForm }: DevelopersProps) {
  const { lang } = useLang();

  return (
    <section id="developers" className="py-20 bg-surface-container relative">
      <div className={`max-w-4xl mx-auto px-6 md:px-12 relative z-10 text-center space-y-6`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center"
        >
          <Building2 className="h-8 w-8" />
        </motion.div>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">
          {t(lang, "developers_title")}
        </h2>
        <p className="font-sans text-base md:text-lg text-on-surface/70 max-w-2xl mx-auto leading-relaxed">
          {t(lang, "developers_desc")}
        </p>
        <button
          onClick={onOpenDeveloperForm}
          className="bg-primary text-secondary-fixed hover:bg-primary/90 hover:scale-[1.03] active:scale-[0.98] px-8 py-4 rounded-xl font-display text-base font-bold shadow-lg transition-all duration-300"
        >
          {t(lang, "developers_cta")}
        </button>
      </div>
    </section>
  );
}
