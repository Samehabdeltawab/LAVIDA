import { useEffect, useState } from "react";
import { useLang } from "../LangContext";
import { getBlobUrl } from "../utils/mediaDB";
import { DEV_PARTNERS_KEY, PublishedDeveloperPartner } from "./UnitsManager";

// Fixed/static partners that are always shown on the site regardless of
// admin approvals. These were requested to be permanently pinned.
const STATIC_PARTNERS: PublishedDeveloperPartner[] = [
  {
    id: "static-nawy",
    companyName: "Nawy",
    companyLogo: "https://www.google.com/s2/favicons?domain=nawy.com&sz=256",
    projectName: "",
    location: "",
    unitsAvailable: "",
    startingPrice: "",
    propertyTypes: [],
    deliveryTimeline: "",
    phone: "",
    whatsapp: "",
    website: "https://www.nawy.com/ar",
    addedDate: new Date().toISOString(),
  },
  {
    id: "static-kunouz",
    companyName: "Kunouz",
    companyLogo: "https://www.google.com/s2/favicons?domain=kunouz.com.eg&sz=256",
    projectName: "",
    location: "",
    unitsAvailable: "",
    startingPrice: "",
    propertyTypes: [],
    deliveryTimeline: "",
    phone: "",
    whatsapp: "",
    website: "https://www.kunouz.com.eg/",
    addedDate: new Date().toISOString(),
  },
  {
    id: "static-elm",
    companyName: "Elm",
    companyLogo: "https://elm-developments.com/wp-content/themes/elm/img/elm-logo.svg",
    projectName: "",
    location: "",
    unitsAvailable: "",
    startingPrice: "",
    propertyTypes: [],
    deliveryTimeline: "",
    phone: "",
    whatsapp: "",
    website: "https://elm-developments.com/",
    addedDate: new Date().toISOString(),
  },
];

function PartnerLogo({ src, name }: { src: string; name: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
    if (!src) {
      setUrl(null);
      return;
    }
    if (src.startsWith("idb:")) {
      getBlobUrl(src.slice(4)).then((u) => setUrl(u));
    } else {
      setUrl(src);
    }
  }, [src]);

  if (!src || !url || failed) {
    return (
      <div className="px-4 h-12 rounded-lg bg-primary/5 text-primary flex items-center justify-center font-display font-bold text-lg shrink-0 whitespace-nowrap">
        {name}
      </div>
    );
  }
  return (
    <img
      src={url}
      alt={name}
      title={name}
      onError={() => setFailed(true)}
      className="max-w-full max-h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300"
    />
  );
}

export default function DeveloperPartners() {
  const { lang } = useLang();
  const L = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const [approvedPartners, setApprovedPartners] = useState<PublishedDeveloperPartner[]>([]);

  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem(DEV_PARTNERS_KEY);
        setApprovedPartners(raw ? JSON.parse(raw) : []);
      } catch {
        setApprovedPartners([]);
      }
    };
    load();
    // Refresh if data changes in another tab / after admin approval
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);

  // Static partners are always shown; approved ones (that aren't duplicates
  // by name) are appended after them.
  const staticNames = new Set(STATIC_PARTNERS.map((p) => p.companyName.trim().toLowerCase()));
  const dynamicPartners = approvedPartners.filter(
    (p) => !staticNames.has(p.companyName.trim().toLowerCase())
  );
  const partners = [...STATIC_PARTNERS, ...dynamicPartners];

  if (partners.length === 0) return null;

  const marqueeDir = lang === "ar" ? "animate-marquee-rtl" : "animate-marquee-ltr";

  const renderLogo = (p: PublishedDeveloperPartner, key: string) => {
    const content = (
      <div className="flex items-center justify-center h-14 w-32 shrink-0">
        <PartnerLogo src={p.companyLogo} name={p.companyName} />
      </div>
    );

    return p.website ? (
      <a
        key={key}
        href={p.website}
        target="_blank"
        rel="noreferrer"
        title={p.companyName}
        className="focus:outline-none focus:ring-2 focus:ring-primary/40 rounded-xl"
      >
        {content}
      </a>
    ) : (
      <div key={key} title={p.companyName}>
        {content}
      </div>
    );
  };

  return (
    <section id="our-partners" className="py-10 bg-surface-container relative overflow-hidden" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-8 space-y-1">
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-on-surface">
            {partners.length}+ {L("شراكة", "Partnerships")}
          </h2>
          <p className="font-sans text-sm text-on-surface/70 max-w-2xl mx-auto">
            {L("نتعاون مع نخبة من المطورين العقاريين لتقديم أفضل الفرص الاستثمارية لعملائنا.", "We partner with leading real-estate developers to bring the best investment opportunities to our clients.")}
          </p>
        </div>

        <div className="marquee-wrapper relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className={`flex items-center gap-14 w-max ${marqueeDir}`}>
            {partners.map((p, i) => renderLogo(p, `a-${i}`))}
            {partners.map((p, i) => renderLogo(p, `b-${i}`))}
          </div>
        </div>
      </div>
    </section>
  );
}
