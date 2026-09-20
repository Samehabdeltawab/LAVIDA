import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Sparkles, Linkedin } from "lucide-react";
import CEOImage from "../assets/CEO.png";
import { useLang } from "../LangContext";
import { t } from "../i18n";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function FounderModal({ isOpen, onClose }: Props) {
  const { lang } = useLang();

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
            initial={{ scale: 0.92, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
            className="bg-surface-container-low rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden relative"
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 left-4 z-20 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Decorative sparkle */}
            <div className="absolute right-8 top-8 text-secondary-fixed/20 pointer-events-none">
              <Sparkles className="h-16 w-16 animate-pulse" />
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 items-center p-8 md:p-12 ${lang === "ar" ? "text-right" : "text-left"}`}>

              {/* Photo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="md:col-span-1 flex justify-center"
              >
                <div className="relative w-full max-w-[200px] mx-auto">
                  <div className="absolute -bottom-3 -left-3 w-full h-full border-2 border-secondary-fixed-dim rounded-2xl -z-10" />
                  <img
                    className="w-full rounded-2xl shadow-xl aspect-[3/4] object-cover object-top"
                    alt="نادر بريك - مؤسس لاڤيدا بروبيرتز"
                    src={CEOImage}
                  />
                </div>
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, x: lang === "ar" ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="md:col-span-2 space-y-5"
              >
                <span className="text-secondary font-display text-xs font-bold block tracking-wider uppercase">
                  {t(lang, "founder_tag")}
                </span>

                <div className="space-y-0.5">
                  <h2 className="font-display text-2xl md:text-3xl font-extrabold text-primary">
                    {t(lang, "founder_name")}
                  </h2>
                  <p className="text-secondary font-display text-sm font-semibold">
                    {t(lang, "founder_title")}
                  </p>
                </div>

                <div className="w-10 h-1 bg-secondary rounded-full" />

                <blockquote className={`font-sans text-base text-on-surface-variant leading-relaxed italic ${lang === "ar" ? "pr-4 border-r-4 border-secondary-fixed-dim/70" : "pl-4 border-l-4 border-secondary-fixed-dim/70"}`}>
                  {t(lang, "founder_quote")}
                </blockquote>

                <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                  {t(lang, "founder_desc")}
                </p>

                <div className={`pt-2 flex gap-3 ${lang === "ar" ? "flex-row-reverse" : "flex-row"}`}>
                  <a
                    href="mailto:Lavidapropertieseg@gmail.com"
                    className="w-10 h-10 rounded-full bg-primary hover:bg-secondary text-white flex items-center justify-center transition-colors shadow"
                    aria-label="Email"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/naderborayek/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-primary hover:bg-secondary text-white flex items-center justify-center transition-colors shadow"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                </div>
              </motion.div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
