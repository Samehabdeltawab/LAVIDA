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
      <div className={`flex flex-col ${lang === "ar" ? "md:flex-row-reverse" : "md:flex-row"} justify-between items-center px-6 md:px-12 py-6 w-full max-w-7xl mx-auto gap-8`}>
        
        {/* Right side: White inverted logo */}
        <div className="shrink-0 cursor-pointer" onClick={() => onScrollTo("hero")}>
          <img
            alt="Lavida Real Estate Inverted Logo"
            referrerPolicy="no-referrer"
            className="h-12 md:h-14 object-contain brightness-0 invert"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvGVh0fCaMCg2MP3nVvZXvzBJNaeoo67JBzQG3lY_Zy6cw26jjvraqVqpr5NqX-C9KcAJjvhUg6BYRCfaApVmuS1yVd7G4X5_eo2att-0IQDEW_hCcZZPmP8V-wwGMKxCdDlovPguFzYA9nx29Jqtf9i_4WGhyOR0b5OTnPXw5MqhOQmzLmTSCfNyFZ-8jr4Sin38feJUHwDK1LHsZoPj8zj2rBt7YH5r-vm3hZplsqIKtILpcW-dSNnlkpfdZJOjIiMoj74KuVQ"
          />
        </div>

        {/* Center: Legal RTL anchor links + Admin */}
        <div className={`flex flex-col ${lang === "ar" ? "sm:flex-row-reverse" : "sm:flex-row"} items-center gap-6 sm:gap-8 text-on-primary-container font-sans text-xs`}>
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

        {/* Left side: Copyrights */}
        <div className="flex flex-col items-center md:items-end gap-2">
          <p className="font-sans text-xs text-on-primary-container/60 text-center md:text-left">
            {t(lang, "footer_rights")}
          </p>
        </div>

      </div>
    </footer>
  );
}
