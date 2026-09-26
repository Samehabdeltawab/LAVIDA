import { useLang } from "../LangContext";
import { t } from "../i18n";
import { Settings2 } from "lucide-react";

interface FooterProps {
  onScrollTo: (id: string) => void;
  onOpenAdmin: () => void;
  onOpenFounder: () => void;
  onOpenSubmitProject?: () => void;
}

export default function Footer({ onScrollTo, onOpenAdmin, onOpenFounder, onOpenSubmitProject }: FooterProps) {
  const { lang } = useLang();
  return (
    <footer className="bg-primary text-white py-6 border-t border-white/5 relative">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12">
        <div dir="ltr" className="flex flex-row items-center justify-between py-3 gap-4 flex-wrap">

          {/* Logo - always physically on the left, regardless of language */}
          <div className="shrink-0 cursor-pointer order-1" onClick={() => onScrollTo("hero")}>
            <img
              alt="Lavida Real Estate Inverted Logo"
              referrerPolicy="no-referrer"
              className="h-10 md:h-12 object-contain brightness-0 invert"
              src="/logo5-clean.png"
            />
          </div>

          {/* Legal links + Admin - always physically on the right, regardless of language */}
          <div className="flex flex-row flex-wrap items-center justify-end gap-5 sm:gap-7 text-on-primary-container font-sans text-xs order-2">
            <a href="#privacy" className="hover:text-secondary-fixed transition-colors">
              {t(lang, "footer_privacy")}
            </a>
            <a href="#terms" className="hover:text-secondary-fixed transition-colors">
              {t(lang, "footer_terms")}
            </a>
            <a href="#sitemap" className="hover:text-secondary-fixed transition-colors">
              {t(lang, "footer_sitemap")}
            </a>
            <button
              onClick={onOpenFounder}
              className="hover:text-secondary-fixed transition-colors cursor-pointer"
            >
              {lang === "ar" ? "المؤسس" : "Founder"}
            </button>
            {onOpenSubmitProject && (
              <button
                onClick={onOpenSubmitProject}
                className="hover:text-secondary-fixed transition-colors cursor-pointer"
              >
                {lang === "ar" ? "أضف مشروعك" : "Submit Project"}
              </button>
            )}
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 text-white/30 hover:text-secondary transition-colors cursor-pointer"
            >
              <Settings2 className="h-3.5 w-3.5" />
              {lang === "ar" ? "أدمن" : "Admin"}
            </button>
          </div>

        </div>

        {/* Bottom: Copyrights centered */}
        <div className="border-t border-white/10 pt-3 pb-1 flex justify-center">
          <p className="font-sans text-xs text-on-primary-container/60 text-center">
            {t(lang, "footer_rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
