import { motion } from "motion/react";
import { useLang } from "../LangContext";
import { t } from "../i18n";

interface HeroProps {
  onCtaclick: (id: string) => void;
  onOpenBuyerIntake: () => void;
  onOpenSellForm: () => void;
  onOpenDeveloperForm: () => void;
}

export default function Hero({ onCtaclick, onOpenBuyerIntake, onOpenSellForm, onOpenDeveloperForm }: HeroProps) {
  const { lang } = useLang();
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
          alt="Modern luxury skyscrapers in Egypt"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCE2nNhpO7ujaoerVS0i59vkfpMgiKCZcAEgxrPS-qCK8TAatlw1kM8J6z9CpPDD9OJg_MpSMqH0SY4plA-rYwb09gZnWTOPIEFV8qVIYW4PFL2rFn1va9v3Yrgr8c0wXEfv1-funRY_0Lp1KO4Ak3AF-FYX2Wy5AemLjlWd76AqmBE49e3uYY9XsMIESdnjXSbG_uCu3mDfueoNmSbT-TKbGdT9ef3JGl7T111TeIm5jwvSLHlzQdiGah_AZLjYDfjG1hS3Lo7yg"
        />
        <div className="absolute inset-0 bg-primary/65 backdrop-blur-[2px]"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 text-center text-white select-none">
        
        {/* Luxury Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 bg-secondary-fixed/10 border border-secondary-fixed/30 backdrop-blur-md px-4 py-1.5 rounded-full text-secondary-fixed text-xs font-semibold tracking-wide"
        >
          <span>❖</span>
          <span>{t(lang, "hero_badge")}</span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6"
        >
          {t(lang, "hero_title")} <span className="text-secondary-fixed block sm:inline mt-2 sm:mt-0">{t(lang, "hero_title_brand")}</span>
        </motion.h1>

        {/* Paragraph Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-sans text-base sm:text-lg md:text-xl text-surface-variant max-w-3xl mx-auto mb-12 leading-relaxed opacity-90"
        >
          {t(lang, "hero_desc")}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center px-4"
        >
          <button
            onClick={onOpenBuyerIntake}
            className="bg-secondary-fixed text-primary hover:bg-white hover:text-black hover:scale-[1.03] active:scale-[0.98] px-8 py-4 rounded-xl font-display text-base font-bold shadow-xl transition-all duration-300"
          >
            {t(lang, "hero_cta_buy")}
          </button>

          <button
            onClick={onOpenSellForm}
            className="border border-white/40 bg-white/15 hover:bg-white/25 text-white hover:scale-[1.03] active:scale-[0.98] px-8 py-4 rounded-xl font-display text-base font-semibold shadow-md transition-all duration-300"
          >
            {t(lang, "hero_cta_sell")}
          </button>

          <button
            onClick={onOpenDeveloperForm}
            className="border border-white/40 bg-white/15 hover:bg-white/25 text-white hover:scale-[1.03] active:scale-[0.98] px-8 py-4 rounded-xl font-display text-base font-semibold shadow-md transition-all duration-300"
          >
            {t(lang, "hero_cta_developer")}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
