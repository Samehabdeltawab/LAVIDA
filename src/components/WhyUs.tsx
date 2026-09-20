import { motion } from "motion/react";
import { Brain, Network, UserCheck, Users, TrendingUp, ShieldCheck } from "lucide-react";
import { useLang } from "../LangContext";
import { t } from "../i18n";

export default function WhyUs() {
  const { lang } = useLang();

  const bentoItems = [
    { colSpan: "lg:col-span-2", icon: Brain,       title: t(lang, "whyus1_title"), description: t(lang, "whyus1_desc"), isSpecial: false },
    { colSpan: "lg:col-span-4", icon: Network,     title: t(lang, "whyus2_title"), description: t(lang, "whyus2_desc"), isSpecial: false },
    { colSpan: "lg:col-span-3", icon: UserCheck,   title: t(lang, "whyus3_title"), description: t(lang, "whyus3_desc"), isSpecial: false },
    { colSpan: "lg:col-span-3", icon: Users,       title: t(lang, "whyus4_title"), description: t(lang, "whyus4_desc"), isSpecial: false },
    { colSpan: "lg:col-span-4", icon: TrendingUp,  title: t(lang, "whyus5_title"), description: t(lang, "whyus5_desc"), isSpecial: false },
    { colSpan: "lg:col-span-2", icon: ShieldCheck, title: t(lang, "whyus6_title"), description: t(lang, "whyus6_desc"), isSpecial: true  },
  ];

  return (
    <section id="whyus" className="py-20 bg-primary text-white overflow-hidden relative">
      
      {/* Absolute Decorative Circles */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-secondary/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-primary-container/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className={`max-w-7xl mx-auto px-6 md:px-12 relative z-10 ${lang === "ar" ? "text-right" : "text-left"}`}>
        
        {/* Section Heading */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-secondary-fixed">
            {t(lang, "whyus_title")}
          </h2>
          <div className="w-16 h-1 bg-secondary-fixed mx-auto rounded-full"></div>
          <p className="font-sans text-sm md:text-base text-surface-variant max-w-xl mx-auto">
            {t(lang, "whyus_subtitle")}
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
          {bentoItems.map((item, index) => {
            const IconComponent = item.icon;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`${item.colSpan} rounded-2xl p-6 md:p-8 border transition-all duration-300 flex flex-col ${
                  item.isSpecial
                    ? "bg-secondary-fixed text-primary border-transparent shadow-xl"
                    : "bg-white/[0.04] border-white/10 hover:bg-white/[0.08]"
                }`}
              >
                <div className={`flex items-start gap-4 ${lang === "ar" ? "flex-row text-right" : "flex-row text-left"}`}>
                  <div className={`p-3 rounded-xl flex-shrink-0 ${
                    item.isSpecial 
                      ? "bg-primary text-secondary-fixed" 
                      : "bg-white/5 text-secondary-fixed"
                  }`}>
                    <IconComponent className="h-6 w-6" />
                  </div>

                  <div className="space-y-2 flex-grow">
                    <h4 className="font-display text-lg font-bold">
                      {item.title}
                    </h4>
                    <p className={`font-sans text-sm leading-relaxed ${
                      item.isSpecial ? "text-primary/80" : "text-surface-variant/80"
                    }`}>
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
