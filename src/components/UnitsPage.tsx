import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight, Home, Play, MapPin, Building2 } from "lucide-react";
import { PropertyUnit } from "../types";
import { useLang } from "../LangContext";
import { getBlobUrl } from "../utils/mediaDB";

interface Props {
  initialType: string; // "All" | "سكني" | "فندقي" | "تجاري" | "إداري" | "طبي" | "ساحلي"
  onBack: () => void;
}

const TYPES = [
  { value: "All",    ar: "الكل",  en: "All" },
  { value: "سكني",   ar: "سكني",  en: "Residential" },
  { value: "فندقي",  ar: "فندقي", en: "Hotel" },
  { value: "تجاري",  ar: "تجاري", en: "Commercial" },
  { value: "إداري",  ar: "إداري", en: "Administrative" },
  { value: "طبي",    ar: "طبي",   en: "Medical" },
  { value: "ساحلي",  ar: "ساحلي", en: "Coastal" },
];

function getEmbedUrl(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?rel=0`;
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return null;
}

// Translate stored Arabic type → display label based on current lang
function getTypeLabel(type: string, lang: string): string {
  const found = TYPES.find(t => t.value === type);
  if (!found) return type;
  return lang === "ar" ? found.ar : found.en;
}

// Translate stored Arabic status → display label based on current lang
const STATUS_MAP: Record<string, { ar: string; en: string; cls: string }> = {
  "متاح":  { ar: "متاح",  en: "Available", cls: "bg-emerald-500 text-white" },
  "محجوز": { ar: "محجوز", en: "Reserved",  cls: "bg-amber-500  text-white" },
  "مباع":  { ar: "مباع",  en: "Sold",      cls: "bg-red-500    text-white" },
};
function getStatusInfo(s?: string) {
  if (!s) return null;
  return STATUS_MAP[s] ?? { ar: s, en: s, cls: "bg-gray-400 text-white" };
}

// Loads an image from IndexedDB if src starts with "idb:", otherwise renders directly
function IdbImg({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (src.startsWith("idb:")) {
      getBlobUrl(src.slice(4)).then(u => setUrl(u ?? null));
    } else {
      setUrl(src);
    }
  }, [src]);
  if (!url) return <div className={`${className} bg-gray-100 animate-pulse`} />;
  return <img src={url} alt={alt} className={className} />;
}

export default function UnitsPage({ initialType, onBack }: Props) {
  const { lang } = useLang();
  const [units, setUnits] = useState<PropertyUnit[]>([]);
  const [filter, setFilter] = useState(initialType);
  const [selected, setSelected] = useState<PropertyUnit | null>(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("lavida_units_list");
    if (saved) { try { setUnits(JSON.parse(saved)); } catch { /* ignore */ } }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    if (!selected?.videoUrl) { setVideoUrl(null); return; }
    if (selected.videoUrl.startsWith("idb:")) {
      getBlobUrl(selected.videoUrl.slice(4)).then(setVideoUrl);
    } else {
      setVideoUrl(getEmbedUrl(selected.videoUrl));
    }
  }, [selected]);

  const displayed = filter === "All" ? units : units.filter(u => u.type === filter);

  return (
    <div className="min-h-screen bg-surface" dir={lang === "ar" ? "rtl" : "ltr"}>

      {/* ── Sticky top breadcrumb ─────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-outline-variant/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-primary hover:text-secondary transition-colors font-semibold text-sm cursor-pointer"
          >
            {lang === "ar" ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            {lang === "ar" ? "الرئيسية" : "Home"}
          </button>
          <span className="text-outline-variant">/</span>
          <span className="font-display font-bold text-primary text-sm">
            {lang === "ar" ? "الوحدات المتاحة" : "Available Units"}
          </span>
          <span className="ms-auto text-xs text-on-surface-variant bg-surface-container-low px-3 py-1 rounded-full">
            {displayed.length} {lang === "ar" ? "وحدة" : "unit(s)"}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">

        {/* ── Filter tabs ─────────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-10 justify-start">
          {TYPES.map(type => (
            <button
              key={type.value}
              onClick={() => setFilter(type.value)}
              className={`px-4 py-2 rounded-full text-sm font-display font-semibold transition-all cursor-pointer ${
                filter === type.value
                  ? "bg-primary text-white shadow-md"
                  : "bg-white border border-outline-variant/40 text-on-surface-variant hover:border-secondary hover:text-secondary"
              }`}
            >
              {lang === "ar" ? type.ar : type.en}
            </button>
          ))}
        </div>

        {/* ── Empty state ─────────────────────────────────────────────────── */}
        {displayed.length === 0 && (
          <div className="flex flex-col items-center justify-center py-28 gap-4 text-on-surface-variant">
            <Building2 className="h-14 w-14 opacity-20" />
            <p className="font-display text-lg text-center">
              {lang === "ar" ? "لا توجد وحدات في هذه الفئة حتى الآن" : "No units in this category yet"}
            </p>
            <p className="text-sm text-center opacity-70">
              {lang === "ar" ? "يمكن للإدارة إضافة وحدات من لوحة التحكم" : "Admin can add units from the control panel"}
            </p>
          </div>
        )}

        {/* ── Units grid ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {displayed.map(unit => (
              <motion.div
                key={unit.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                whileHover={{ y: -4 }}
                onClick={() => { setSelected(unit); setImgIdx(0); }}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl cursor-pointer transition-shadow border border-outline-variant/10 group"
              >
                {/* Image */}
                <div className="relative h-52 bg-primary/5 overflow-hidden">
                  {unit.images?.[0]
                    ? <IdbImg src={unit.images[0]} alt={unit.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    : <div className="w-full h-full flex items-center justify-center"><Home className="h-16 w-16 text-primary/20" /></div>
                  }
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent" />
                  {unit.videoUrl && (
                    <div className="absolute top-3 right-3 bg-red-500/90 text-white rounded-lg px-2 py-1 flex items-center gap-1 z-10">
                      <Play className="h-3 w-3 fill-white" />
                      <span className="text-[10px] font-bold">VIDEO</span>
                    </div>
                  )}
                  {unit.status && (() => { const si = getStatusInfo(unit.status); return si ? (
                    <span className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full z-10 ${si.cls}`}>
                      {lang === "ar" ? si.ar : si.en}
                    </span>
                  ) : null; })()}
                  <div className={`absolute bottom-3 ${lang === "ar" ? "right-3" : "left-3"} z-10`}>
                    <span className="bg-secondary text-white text-[11px] font-bold px-2.5 py-1 rounded-full">{getTypeLabel(unit.type, lang)}</span>
                  </div>
                </div>

                {/* Info */}
                <div className={`p-4 space-y-2 ${lang === "ar" ? "text-right" : "text-left"}`}>
                  <h3 className="font-display font-bold text-primary text-base leading-snug">{unit.name}</h3>
                  {(unit.projectName || unit.developerName) && (
                    <p className="text-xs text-on-surface-variant">
                      {unit.projectName}{unit.developerName ? ` · ${unit.developerName}` : ""}
                    </p>
                  )}
                  {unit.address && (
                    <p className={`text-xs text-on-surface-variant flex items-center gap-1 ${lang === "ar" ? "justify-end flex-row-reverse" : ""}`}>
                      <MapPin className="h-3 w-3 shrink-0" />{unit.address}
                    </p>
                  )}
                  <div className={`flex items-center justify-between pt-1 ${lang === "ar" ? "flex-row-reverse" : ""}`}>
                    <span className="text-xs text-on-surface-variant">
                      {[
                        unit.area  && `${unit.area}م²`,
                        unit.rooms && `${unit.rooms} ${lang === "ar" ? "غرف" : "rms"}`,
                        unit.floor && `${lang === "ar" ? "دور" : "Fl."} ${unit.floor}`,
                      ].filter(Boolean).join(" · ")}
                    </span>
                    {unit.totalPrice && (
                      <span className="text-secondary font-display font-bold text-sm">
                        {Number(unit.totalPrice).toLocaleString()} {lang === "ar" ? "ج.م" : "EGP"}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Unit Detail Modal ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <div
            className="fixed inset-0 bg-primary/50 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              onClick={e => e.stopPropagation()}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              className={`bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col relative ${lang === "ar" ? "text-right" : "text-left"}`}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute left-4 top-4 z-20 bg-black/40 text-white hover:bg-black/70 rounded-full p-2.5 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Gallery */}
              {selected.images && selected.images.length > 0 && (
                <div className="relative h-64 md:h-72 shrink-0 overflow-hidden rounded-t-2xl">
                  <IdbImg src={selected.images[imgIdx]} alt={selected.name} className="w-full h-full object-cover" />
                  {selected.images.length > 1 && (
                    <>
                      <button
                        disabled={imgIdx === 0}
                        onClick={() => setImgIdx(i => Math.max(0, i - 1))}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/70 disabled:opacity-30 cursor-pointer"
                      ><ChevronLeft className="h-5 w-5" /></button>
                      <button
                        disabled={imgIdx === selected.images.length - 1}
                        onClick={() => setImgIdx(i => Math.min(selected.images.length - 1, i + 1))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/70 disabled:opacity-30 cursor-pointer"
                      ><ChevronRight className="h-5 w-5" /></button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {selected.images.map((_, i) => (
                          <button key={i} onClick={() => setImgIdx(i)}
                            className={`h-1.5 rounded-full cursor-pointer transition-all ${i === imgIdx ? "w-4 bg-white" : "w-1.5 bg-white/50"}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent pointer-events-none" />
                  <div className={`absolute bottom-4 ${lang === "ar" ? "right-5" : "left-5"} text-white`}>
                    <span className="bg-secondary text-xs font-bold px-3 py-1 rounded-full">{getTypeLabel(selected.type, lang)}</span>
                    <h3 className="font-display text-xl font-bold mt-1">{selected.name}</h3>
                  </div>
                </div>
              )}

              {/* Video */}
              {videoUrl && (
                <div className="px-6 pt-5">
                  <iframe src={videoUrl} className="w-full rounded-xl aspect-video" allowFullScreen />
                </div>
              )}

              {/* Details grid */}
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: lang === "ar" ? "المشروع"        : "Project",     value: selected.projectName },
                    { label: lang === "ar" ? "المطور"         : "Developer",   value: selected.developerName },
                    { label: lang === "ar" ? "العنوان"        : "Address",     value: selected.address },
                    { label: lang === "ar" ? "المساحة"        : "Area",        value: selected.area ? `${selected.area} م²` : "" },
                    { label: lang === "ar" ? "الدور"          : "Floor",       value: selected.floor },
                    { label: lang === "ar" ? "الغرف"          : "Rooms",       value: selected.rooms },
                    { label: lang === "ar" ? "الحمامات"       : "Bathrooms",   value: selected.bathrooms },
                    { label: lang === "ar" ? "التشطيب"        : "Finishing",   value: selected.finishing },
                    { label: lang === "ar" ? "السعر الإجمالي" : "Total Price", value: selected.totalPrice ? `${Number(selected.totalPrice).toLocaleString()} ج.م` : "" },
                    { label: lang === "ar" ? "سعر المتر"      : "Price/m²",   value: selected.pricePerMeter ? `${Number(selected.pricePerMeter).toLocaleString()} ج.م` : "" },
                  ].filter(r => r.value).map((r, i) => (
                    <div key={i} className="bg-surface/60 rounded-lg p-3 border border-outline-variant/20">
                      <span className="text-[11px] text-on-surface-variant block mb-0.5">{r.label}</span>
                      <span className="font-semibold text-primary text-sm">{r.value}</span>
                    </div>
                  ))}
                </div>

                {selected.notes && (
                  <div className="bg-secondary/5 rounded-xl p-4 border border-secondary/20">
                    <p className="text-xs text-secondary font-bold mb-1">{lang === "ar" ? "ملاحظات" : "Notes"}</p>
                    <p className="text-sm text-primary leading-relaxed">{selected.notes}</p>
                  </div>
                )}

                <button
                  onClick={() => {
                    setSelected(null);
                    onBack();
                    setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 300);
                  }}
                  className="w-full bg-primary text-white hover:bg-secondary py-3.5 rounded-xl font-display font-bold text-sm transition-all cursor-pointer shadow-lg shadow-primary/20"
                >
                  {lang === "ar" ? "تواصل معنا بشأن هذه الوحدة" : "Contact Us About This Unit"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
