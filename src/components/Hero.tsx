import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  const [showFullDesc, setShowFullDesc] = useState(false);

  const stats = [
    { value: t(lang, "about_stat1_value"), label: t(lang, "about_stat1_label") },
    { value: t(lang, "about_stat2_value"), label: t(lang, "about_stat2_label") },
  ];

  const desc1Full = t(lang, "about_desc1");
  const lastPhrase = lang === "ar" ? "بناء للمجتمعات" : "building of communities";
  const splitIdx = desc1Full.lastIndexOf(lastPhrase);
  const desc1Before = splitIdx >= 0 ? desc1Full.slice(0, splitIdx) : desc1Full;
  const desc1After = splitIdx >= 0 ? desc1Full.slice(splitIdx) : "";

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col overflow-hidden pt-20"
    >
      {/* Background Image & Overlay (covers the whole merged section) */}
      <div className="absolute inset-0 z-0">
        <img
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
          alt="Modern luxury skyscrapers in Egypt"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCE2nNhpO7ujaoerVS0i59vkfpMgiKCZcAEgxrPS-qCK8TAatlw1kM8J6z9CpPDD9OJg_MpSMqH0SY4plA-rYwb09gZnWTOPIEFV8qVIYW4PFL2rFn1va9v3Yrgr8c0wXEfv1-funRY_0Lp1KO4Ak3AF-FYX2Wy5AemLjlWd76AqmBE49e3uYY9XsMIESdnjXSbG_uCu3mDfueoNmSbT-TKbGdT9ef3JGl7T111TeIm5jwvSLHlzQdiGah_AZLjYDfjG1hS3Lo7yg"
        />
        <div className="absolute inset-0 bg-primary/70 backdrop-blur-[2px]"></div>
      </div>

      {/* Hero Content (top half) */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <div className="max-w-5xl mx-auto px-6 md:px-12 text-center text-white select-none">

          {/* Luxury Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 inline-flex items-center gap-2 bg-secondary-fixed/10 border border-secondary-fixed/30 backdrop-blur-md px-4 py-1.5 rounded-full text-secondary-fixed text-xs font-semibold tracking-wide"
          >
            <span>❖</span>
            <span>{t(lang, "hero_badge")}</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight mb-4"
          >
            {t(lang, "hero_title")} <span className="text-secondary-fixed block sm:inline mt-2 sm:mt-0">{t(lang, "hero_title_brand")}</span>
          </motion.h1>

          {/* Paragraph Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-sans text-sm sm:text-base md:text-lg text-surface-variant max-w-3xl mx-auto mb-6 leading-relaxed opacity-90"
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
              className="bg-secondary-fixed text-primary hover:bg-white hover:text-black hover:scale-[1.03] active:scale-[0.98] px-8 py-3.5 rounded-xl font-display text-base font-bold shadow-xl transition-all duration-300"
            >
              {t(lang, "hero_cta_buy")}
            </button>

            <button
              onClick={onOpenSellForm}
              className="border border-white/40 bg-white/15 hover:bg-white/25 text-white hover:scale-[1.03] active:scale-[0.98] px-8 py-3.5 rounded-xl font-display text-base font-semibold shadow-md transition-all duration-300"
            >
              {t(lang, "hero_cta_sell")}
            </button>

            {/* "I'm a developer" CTA - temporarily hidden, remove this comment wrapper to re-enable */}
            {/* <button
              onClick={onOpenDeveloperForm}
              className="border border-white/40 bg-white/15 hover:bg-white/25 text-white hover:scale-[1.03] active:scale-[0.98] px-8 py-4 rounded-xl font-display text-base font-semibold shadow-md transition-all duration-300"
            >
              {t(lang, "hero_cta_developer")}
            </button> */}
          </motion.div>
        </div>
      </div>

      {/* About Content (bottom half, same page/section, no scroll needed) */}
      <div id="about" className="relative z-10 border-t border-white/15 bg-black/10">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-6 md:py-8">
          <div className={`flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 text-white ${lang === "ar" ? "text-right" : "text-left"}`}>

            {/* Text block */}
            <div className="flex-1 space-y-3">
              <div className="inline-block bg-secondary-fixed/10 border border-secondary-fixed/30 rounded-full px-3 py-1 text-secondary-fixed font-display text-xs font-semibold">
                {t(lang, "about_tag")}
              </div>

              <h2 className="font-display text-xl md:text-2xl font-bold leading-tight">
                {t(lang, "about_title")}
              </h2>

              <p className="font-sans text-sm md:text-base text-surface-variant leading-relaxed opacity-90 max-w-2xl">
                {desc1Before}
                <span
                  className="relative inline-block cursor-help border-b border-dotted border-secondary-fixed text-secondary-fixed font-semibold"
                  onMouseEnter={() => setShowFullDesc(true)}
                  onMouseLeave={() => setShowFullDesc(false)}
                >
                  {desc1After}
                  <AnimatePresence>
                    {showFullDesc && (
                      <motion.span
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute z-30 bottom-full mb-2 w-72 sm:w-96 bg-primary text-white text-sm font-normal font-sans leading-relaxed rounded-xl shadow-2xl p-4 ${
                          lang === "ar" ? "right-0 text-right" : "left-0 text-left"
                        }`}
                      >
                        {t(lang, "about_desc2")}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </p>
            </div>

            {/* Stats block */}
            <div className="flex gap-6 md:gap-8 shrink-0">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className={`font-sans ${
                    lang === "ar"
                      ? "border-r-4 border-secondary-fixed pr-3 text-right"
                      : "border-l-4 border-secondary-fixed pl-3 text-left"
                  }`}
                >
                  <span className="font-display text-2xl md:text-3xl font-extrabold text-secondary-fixed block">
                    {stat.value}
                  </span>
                  <span className="text-xs md:text-sm font-medium text-surface-variant mt-1 block opacity-90">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
