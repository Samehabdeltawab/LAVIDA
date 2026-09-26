import { useState, useEffect } from "react";
import { Menu, X, Languages } from "lucide-react";
import { useLang } from "../LangContext";
import { t } from "../i18n";

interface HeaderProps {
  onAdminToggle?: () => void;
  showAdminPortal?: boolean;
}

export default function Header({ onAdminToggle, showAdminPortal }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const { lang, toggleLang } = useLang();

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "about", "projects", "services", "whyus", "contact"];
      const scrollPosition = window.scrollY + 120;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTo = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of fixed header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const navLinks = [
    { id: "hero", label: t(lang, "nav_home") },
    { id: "about", label: t(lang, "nav_about") },
    { id: "projects", label: t(lang, "nav_projects") },
  ];

  return (
    <header id="app-header" className="bg-surface/90 backdrop-blur-md fixed top-0 w-full z-50 border-b border-outline-variant/30 shadow-sm transition-all duration-300">
      <div className="flex flex-row justify-between items-center w-full px-4 md:px-12 py-4 max-w-7xl mx-auto">
        
        {/* Right side: Logo (strictly RTL aligned) */}
        <div className="flex items-center cursor-pointer" onClick={() => handleScrollTo("hero")}>
          <img
            alt="Lavida Real Estate"
            referrerPolicy="no-referrer"
            className="h-14 md:h-16 object-contain"
            src="/logo5-clean.png"
          />
        </div>

        {/* Center: Navigation Links for Desktop (RTL layout: links ordered correctly) */}
        <nav className="hidden md:flex flex-row gap-8 items-center">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleScrollTo(link.id)}
              className={`font-display text-base font-semibold py-1 transition-all duration-300 border-b-2 hover:text-secondary ${
                activeSection === link.id
                  ? "text-secondary border-secondary"
                  : "text-on-surface border-transparent"
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Left side: CTA Button & Burger toggle */}
        <div className="flex items-center gap-3">
          {/* Language Toggle Button */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 border border-outline-variant/50 hover:border-secondary text-on-surface hover:text-secondary px-3 py-2 rounded-lg font-display text-sm font-bold transition-all duration-300 cursor-pointer"
            aria-label="Toggle language"
          >
            <Languages className="h-4 w-4" />
            <span>{lang === "ar" ? "EN" : "عربي"}</span>
          </button>

          <button
            onClick={() => handleScrollTo("contact")}
            className="bg-primary text-white hover:bg-primary-container px-6 py-2.5 rounded-lg font-display text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            {t(lang, "nav_contact")}
          </button>

          {/* Hamburger Menu Toggle for Mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-on-surface hover:text-secondary transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <div className="md:hidden absolute top-[72px] right-0 w-full bg-surface border-b border-outline-variant/30 shadow-lg py-6 px-6 animate-fade-in z-40">
          <nav className="flex flex-col gap-4 text-right">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleScrollTo(link.id)}
                className={`font-display text-lg font-semibold py-2 block border-r-4 pr-3 ${
                  activeSection === link.id
                    ? "text-secondary border-secondary bg-secondary/5"
                    : "text-on-surface border-transparent"
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
