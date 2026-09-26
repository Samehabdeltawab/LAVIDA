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
    <footer className="bg-primary text-white py-12 border-t border-white/5 relative">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col items-center justify-center py-6 gap-6">

          {/* Logo */}
          <div className="shrink-0 cursor-pointer" onClick={() => onScrollTo("hero")}>
            <img
              alt="Lavida Real Estate Inverted Logo"
              referrerPolicy="no-referrer"
              className="h-14 md:h-16 object-contain brightness-0 invert"
              src="/logo5-clean.png"
            />
          </div>

          {/* Legal RTL anchor links + Admin, centered */}
          <div className="flex flex-row flex-wrap items-center justify-center gap-6 sm:gap-8 text-on-primary-container font-sans text-xs">
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
        <div className="border-t border-white/10 pt-6 flex justify-center">
          <p className="font-sans text-xs text-on-primary-container/60 text-center">
            {t(lang, "footer_rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
