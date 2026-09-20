import { motion } from "motion/react";
import { Mail, Sparkles, Linkedin } from "lucide-react";
import CEOImage from "../assets/CEO.png";
import { useLang } from "../LangContext";
import { t } from "../i18n";

export default function Founder() {
  const { lang } = useLang();
  return (
    <section className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="bg-surface-container-low rounded-3xl p-6 md:p-12 lg:p-16 border border-outline-variant/10 shadow-sm relative overflow-hidden">
          
          {/* Subtle Decorative sparkles background */}
          <div className="absolute right-10 top-10 text-secondary-fixed/30 pointer-events-none">
            <Sparkles className="h-20 w-20 animate-pulse" />
          </div>

          <div className={`grid grid-cols-1 lg:grid-cols-3 gap-12 items-center ${lang === "ar" ? "text-right" : "text-left"}`}>
            
            {/* Left Column on Desktop: Styled Image Container (RTL places this flow appropriately) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-1 flex justify-center"
            >
              <div className="relative w-full max-w-[260px] sm:max-w-sm mx-auto">
                {/* Visual backframe mimicking design */}
                <div className="absolute -bottom-4 -left-4 w-full h-full border-2 border-secondary-fixed-dim rounded-2xl -z-10"></div>
                
                <img
                  className="w-full rounded-2xl shadow-xl aspect-[3/4] object-cover object-top hover:scale-[1.02] transition-transform duration-500"
                  alt="نادر بريك - مؤسس لاڤيدا بروبيرتز"
                  src={CEOImage}
                />
              </div>
            </motion.div>

            {/* Right Column/Spans: Detailed Text Summary in RTL (Right-aligned text) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-2 space-y-6"
            >
              <span className="text-secondary font-display text-sm font-bold block tracking-wider uppercase">
                {t(lang, "founder_tag")}
              </span>
              
              <div className="space-y-1">
                <h2 className="font-display text-3xl md:text-4xl font-extrabold text-primary">
                  {t(lang, "founder_name")}
                </h2>
                <p className="text-secondary font-display text-base font-semibold">
                  {t(lang, "founder_title")}
                </p>
              </div>

              <div className="w-12 h-1 bg-secondary rounded-full"></div>

              <blockquote className={`font-sans text-lg md:text-xl text-on-surface-variant leading-relaxed italic ${lang === "ar" ? "pr-4 border-r-4 border-secondary-fixed-dim/70" : "pl-4 border-l-4 border-secondary-fixed-dim/70"}`}>
                {t(lang, "founder_quote")}
              </blockquote>

              <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                {t(lang, "founder_desc")}
              </p>

              {/* Social Contact links */}
              <div className={`pt-4 flex gap-3.5 ${lang === "ar" ? "flex-row-reverse" : "flex-row"}`}>
                <a
                  href="mailto:Lavidapropertieseg@gmail.com"
                  className="w-11 h-11 rounded-full bg-primary hover:bg-secondary text-white flex items-center justify-center transition-colors duration-300 shadow shadow-primary/10"
                  aria-label="البريد الإلكتروني للمؤسس"
                >
                  <Mail className="h-5 w-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/naderborayek/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-primary hover:bg-secondary text-white flex items-center justify-center transition-colors duration-300 shadow shadow-primary/10"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>

            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
