import { motion } from "motion/react";
import { MessageSquareText, Search, UserRound } from "lucide-react";
import { useLang } from "../LangContext";
import { t } from "../i18n";

interface BuyerJourneyProps {
  onCtaClick: (id: string) => void;
  onOpenBuyerIntake: () => void;
}

export default function BuyerJourney({ onCtaClick, onOpenBuyerIntake }: BuyerJourneyProps) {
  const { lang } = useLang();

  const steps = [
    { icon: MessageSquareText, title: t(lang, "journey_step1_title"), desc: t(lang, "journey_step1_desc") },
    { icon: Search, title: t(lang, "journey_step2_title"), desc: t(lang, "journey_step2_desc") },
    { icon: UserRound, title: t(lang, "journey_step3_title"), desc: t(lang, "journey_step3_desc") },
  ];

  return (
    <section id="buyer-journey" className="py-20 bg-surface-container relative">
      <div className={`max-w-6xl mx-auto px-6 md:px-12 ${lang === "ar" ? "text-right" : "text-left"}`}>
        {/* Heading */}
        <div className="text-center mb-16 space-y-4">
          <span className="inline-block text-secondary font-display text-sm font-bold tracking-wide uppercase">
            {t(lang, "journey_tag")}
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">
            {t(lang, "journey_title")}
          </h2>
          <div className="w-16 h-1 bg-secondary mx-auto rounded-full"></div>
          <p className="font-sans text-sm md:text-base text-on-surface/70 max-w-xl mx-auto">
            {t(lang, "journey_subtitle")}
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative bg-surface rounded-2xl p-8 border border-outline-variant/20 shadow-sm text-center flex flex-col items-center gap-4"
              >
                <div className="absolute -top-4 w-8 h-8 rounded-full bg-primary text-secondary-fixed font-display font-bold text-sm flex items-center justify-center shadow-md">
                  {index + 1}
                </div>
                <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mt-4">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="font-display text-lg font-bold text-primary">{step.title}</h3>
                <p className="font-sans text-sm text-on-surface/70 leading-relaxed">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button
            onClick={onOpenBuyerIntake}
            className="bg-primary text-secondary-fixed hover:bg-primary/90 hover:scale-[1.03] active:scale-[0.98] px-8 py-4 rounded-xl font-display text-base font-bold shadow-lg transition-all duration-300"
          >
            {t(lang, "journey_cta")}
          </button>
        </div>
      </div>
    </section>
  );
}
