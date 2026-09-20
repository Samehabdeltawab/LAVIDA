// Writes the new simplified Projects.tsx
const fs = require('fs');
const fp = 'd:\\لافيدا\\Latest\\Lavida-Properties-main\\Lavida-Properties-main\\src\\components\\Projects.tsx';

const content = `import { motion } from "motion/react";
import { MapPin, Coins } from "lucide-react";
import { Project } from "../types";
import { useLang } from "../LangContext";
import { t } from "../i18n";

interface Props {
  onNavigate: (type: string) => void;
}

export default function Projects({ onNavigate }: Props) {
  const { lang } = useLang();

  const projects: Project[] = [
    {
      id: "residential",
      title: t(lang, "project1_title"),
      category: t(lang, "project1_category"),
      description: t(lang, "project1_desc"),
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDwFHe8whi0rCeTETSk0WjwmlQGokSNHHOXNmO3DS2NyAdNcBOLvVHPBspXZ-4Byg_i_IlTomvL2RhCKB2KJZREgDvrt_EzoYzbNevUdJMaIUne4Mc2iAE4Oz-j4T1XC8XzWosFRL_C0_ZQojBCZKSUB2dhxThm5halC9Ndie2SX5yt1rbBRmaJUVyEuOVjGqRzM96EYu12_AxGS0hdl9PR5GTkhR9NxVfDdRVKjqggyUBNiV8O-yQIJs-xj7rFJ2A84VLw8nWDww",
      location: t(lang, "project1_location"),
      priceStart: t(lang, "project1_price"),
      details:  [t(lang,"project1_detail1"),t(lang,"project1_detail2"),t(lang,"project1_detail3"),t(lang,"project1_detail4")],
      features: [t(lang,"project1_feature1"),t(lang,"project1_feature2"),t(lang,"project1_feature3"),t(lang,"project1_feature4"),t(lang,"project1_feature5")],
    },
    {
      id: "commercial",
      title: t(lang, "project2_title"),
      category: t(lang, "project2_category"),
      description: t(lang, "project2_desc"),
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtFAv2u3n41TS04MI7zd_M9Su30YiGBwg2x9CiislCTkZe1FUe4h7K8_WsbYUxDjgWbaDKL32jhGAUP5VHNGsE3xof2rkNYV_MpB63ltRM4Cf4JVa6kVLtRPhlXjY25nQKmfDXTYu26EKOEL6iFNaTYG8Fm_C0uqb7AHcr8Y6LVt97PBo5lr8EHYEjNayF6hzy5eA38Ur87P_NWOHf5SC80FItCrnRVZcHO091qj4RVdOfzAnqIK5WYJ35gPHP6tHxFheJyuwvSQ",
      location: t(lang, "project2_location"),
      priceStart: t(lang, "project2_price"),
      details:  [t(lang,"project2_detail1"),t(lang,"project2_detail2"),t(lang,"project2_detail3"),t(lang,"project2_detail4")],
      features: [t(lang,"project2_feature1"),t(lang,"project2_feature2"),t(lang,"project2_feature3"),t(lang,"project2_feature4"),t(lang,"project2_feature5")],
    },
    {
      id: "coastal",
      title: t(lang, "project3_title"),
      category: t(lang, "project3_category"),
      description: t(lang, "project3_desc"),
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD71JQvqIMbWrrA_prXpeR3GRWIeiiQzHAd1fJJxjXbBp6qkWHdrZIQoKxCzbwJh8UmghRLwDaHqmpGIf8KWmcUxNBdy9qhtl6IwO2sLNWz_sE2-pAx7fDI1eI_YCVr58ZPXp1AsiZIKXQhNbMh3IGeLXKCfZUpUzUQK6ATTYYRG8cSkU_Cxi9AmXGNvGbOm9DGCgJt_fYENsGf52DxFou9CooHzmDKq_VGqvxzxTrG0qCCoBuSjAoZd_34G6-ejFd3PDaHAiyfRg",
      location: t(lang, "project3_location"),
      priceStart: t(lang, "project3_price"),
      details:  [t(lang,"project3_detail1"),t(lang,"project3_detail2"),t(lang,"project3_detail3"),t(lang,"project3_detail4")],
      features: [t(lang,"project3_feature1"),t(lang,"project3_feature2"),t(lang,"project3_feature3"),t(lang,"project3_feature4"),t(lang,"project3_feature5")],
    },
  ];

  // Map project id to initial unit type shown in UnitsPage
  const typeMap: Record<string, string> = {
    residential: "\\u0633\\u0643\\u0646\\u064A",
    commercial:  "\\u062A\\u062C\\u0627\\u0631\\u064A",
    coastal:     "\\u0633\\u0627\\u062D\\u0644\\u064A",
  };

  const tabs = [
    { type: "All",                                      label: t(lang, "projects_all") },
    { type: "\\u0633\\u0643\\u0646\\u064A",            label: t(lang, "projects_residential") },
    { type: "\\u062A\\u062C\\u0627\\u0631\\u064A",    label: t(lang, "projects_commercial") },
    { type: "\\u0633\\u0627\\u062D\\u0644\\u064A",    label: t(lang, "projects_coastal") },
  ];

  return (
    <section id="projects" className="py-20 bg-surface relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Header */}
        <div className={\`mb-12 \${lang === "ar" ? "text-right" : "text-left"}\`}>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">
            {t(lang, "projects_title")}
          </h2>
          <p className="font-sans text-sm md:text-base text-on-surface-variant mt-2">
            {t(lang, "projects_subtitle")}
          </p>
        </div>

        {/* Category quick-nav tabs */}
        <div className={\`flex flex-row flex-wrap gap-3 mb-10 border-b border-outline-variant/30 pb-4 \${lang === "ar" ? "justify-end" : "justify-start"}\`}>
          {tabs.map(tab => (
            <button
              key={tab.type}
              onClick={() => onNavigate(tab.type)}
              className="font-display text-sm font-semibold px-5 py-2.5 rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer"
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map(p => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              onClick={() => onNavigate(typeMap[p.id] ?? "All")}
              className="group relative overflow-hidden rounded-2xl h-[480px] shadow-lg border border-outline-variant/10 cursor-pointer"
            >
              <img
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                alt={p.title}
                src={p.image}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/55 to-transparent z-10 group-hover:via-primary/65 transition-opacity duration-300" />
              <div className="absolute top-6 right-6 z-20 bg-secondary px-3.5 py-1.5 rounded-lg text-white font-display text-xs font-bold shadow-md">
                {p.category}
              </div>
              <div className={\`absolute bottom-0 left-0 right-0 p-8 z-20 space-y-4 \${lang === "ar" ? "text-right" : "text-left"}\`}>
                <div className="space-y-2">
                  <h3 className="font-display text-2xl font-bold text-white tracking-wide">{p.title}</h3>
                  <p className="font-sans text-sm text-surface-variant line-clamp-2 leading-relaxed opacity-95">{p.description}</p>
                </div>
                <div className={\`flex items-center gap-4 text-white/75 text-xs \${lang === "ar" ? "flex-row-reverse justify-end" : ""}\`}>
                  <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{p.location}</span>
                  <span className="flex items-center gap-1.5"><Coins className="h-3.5 w-3.5" />{p.priceStart}</span>
                </div>
                <div className="w-full bg-secondary hover:bg-secondary/90 text-white py-3 rounded-xl font-display text-sm font-bold shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-colors">
                  {t(lang, "projects_details")}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
`;

// Replace the Unicode escapes for Arabic chars in typeMap and tabs
const fixedContent = content
  .replace(/\\u0633\\u0643\\u0646\\u064A/g, '\u0633\u0643\u0646\u064A')
  .replace(/\\u062A\\u062C\\u0627\\u0631\\u064A/g, '\u062A\u062C\u0627\u0631\u064A')
  .replace(/\\u0633\\u0627\\u062D\\u0644\\u064A/g, '\u0633\u0627\u062D\u0644\u064A');

fs.writeFileSync(fp, fixedContent, 'utf8');
console.log('Projects.tsx written successfully. Lines:', fixedContent.split('\n').length);
