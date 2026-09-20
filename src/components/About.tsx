import { motion } from "motion/react";
import { useLang } from "../LangContext";
import { t } from "../i18n";

export default function About() {
  const { lang } = useLang();

  const stats = [
    { value: t(lang, "about_stat1_value"), label: t(lang, "about_stat1_label") },
    { value: t(lang, "about_stat2_value"), label: t(lang, "about_stat2_label") },
  ];

  return (
    <section id="about" className="py-20 bg-surface relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Animated Image Showcase (Left on desktop) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative order-2 lg:order-1"
          >
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-secondary-fixed-dim/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary-container/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-outline-variant/30 group">
              <img
                referrerPolicy="no-referrer"
                className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
                alt="Lavida Properties Executive Office in Egypt"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAc1Kd6PT0DHWc-IDUfcuRVU_AUdTLsNPRTUmfofZERFEdeE98CkcgYJ3PIk061DT5n3vyMDy8VRuG67tVsbdlUDQlz4a9E2bJxW6N7XF2Uedy1QD5XkPZBodrW6XCrJN7sSMl_qJSF60Gg_KqdI_Pra8mmzlfM0nXvg72NpLmUITlPszfvvBXgEEfL1l4ZBLJwHPSEFuRQxsT2L_JSd7cG-CN8sp_WHVQNMRbi9qA0YPirCd2LSXOScotuSBZSc9RvbPuHha9XGA"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent pointer-events-none"></div>
            </div>
          </motion.div>

          {/* About Text Content (Right on desktop) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`order-1 lg:order-2 space-y-6 ${lang === "ar" ? "text-right" : "text-left"}`}
          >
            <div className="inline-block bg-secondary/10 border border-secondary/20 rounded-full px-4 py-1 text-secondary font-display text-sm font-semibold">
              {t(lang, "about_tag")}
            </div>
            
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary leading-tight">
              {t(lang, "about_title")}
            </h2>
            
            <div className="space-y-4 font-sans text-on-surface-variant leading-relaxed">
              <p className="text-lg text-on-surface">
                {t(lang, "about_desc1")}
              </p>
              <p className="text-base text-on-surface-variant">
                {t(lang, "about_desc2")}
              </p>
            </div>

            {/* Metric Counters Grid */}
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-outline-variant/30">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className={`font-sans ${
                    lang === "ar"
                      ? "border-r-4 border-secondary pr-4 text-right"
                      : "border-l-4 border-secondary pl-4 text-left"
                  }`}
                >
                  <span className="font-display text-3xl md:text-4xl font-extrabold text-primary block">
                    {stat.value}
                  </span>
                  <span className="text-sm font-medium text-on-surface-variant mt-1 block">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
