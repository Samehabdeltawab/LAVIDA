import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle2, XCircle, Trash2, ClipboardList, Phone, MapPin, Coins } from "lucide-react";
import { useLang } from "../LangContext";
import { DeveloperProjectSubmission } from "../types";
import { getBlobUrl, removeBlob } from "../utils/mediaDB";
import { PROJECT_SUBMISSIONS_KEY } from "./SubmitProjectModal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_LABEL: Record<string, { ar: string; en: string }> = {
  "سكني": { ar: "سكني", en: "Residential" },
  "تجاري": { ar: "تجاري", en: "Commercial" },
  "ساحلي": { ar: "ساحلي", en: "Coastal" },
};

function SubmissionImage({ src }: { src: string }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (src?.startsWith("idb:")) {
      getBlobUrl(src.slice(4)).then(setUrl);
    } else {
      setUrl(src || null);
    }
  }, [src]);
  if (!url) return <div className="w-24 h-24 rounded-xl bg-gray-100 animate-pulse shrink-0" />;
  return <img src={url} alt="" className="w-24 h-24 rounded-xl object-cover shrink-0 border border-gray-100" />;
}

export default function ProjectApprovalsManager({ isOpen, onClose }: Props) {
  const { lang } = useLang();
  const L = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const [list, setList] = useState<DeveloperProjectSubmission[]>([]);
  const [tab, setTab] = useState<"pending" | "approved" | "rejected">("pending");

  const load = () => {
    try {
      const raw = localStorage.getItem(PROJECT_SUBMISSIONS_KEY);
      setList(raw ? JSON.parse(raw) : []);
    } catch { setList([]); }
  };

  useEffect(() => { if (isOpen) load(); }, [isOpen]);

  const persist = (updated: DeveloperProjectSubmission[]) => {
    setList(updated);
    localStorage.setItem(PROJECT_SUBMISSIONS_KEY, JSON.stringify(updated));
  };

  const setStatus = (id: string, status: DeveloperProjectSubmission["status"]) => {
    persist(list.map(s => (s.id === id ? { ...s, status } : s)));
  };

  const handleDelete = async (item: DeveloperProjectSubmission) => {
    if (item.image?.startsWith("idb:")) {
      await removeBlob(item.image.slice(4)).catch(() => {});
    }
    persist(list.filter(s => s.id !== item.id));
  };

  if (!isOpen) return null;

  const filtered = list.filter(s => s.status === tab);
  const counts = {
    pending: list.filter(s => s.status === "pending").length,
    approved: list.filter(s => s.status === "approved").length,
    rejected: list.filter(s => s.status === "rejected").length,
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 20 }}
          dir={lang === "ar" ? "rtl" : "ltr"}
          className="relative z-10 bg-gray-50 w-full max-w-3xl mx-auto rounded-2xl shadow-2xl overflow-hidden flex flex-col font-sans"
          style={{ maxHeight: "calc(100vh - 2rem)" }}
          onClick={e => e.stopPropagation()}
        >
          <div className="bg-primary text-white px-6 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-secondary rounded-xl">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold">{L("طلبات مشاريع المطورين","Developer Project Submissions")}</h2>
                <p className="text-xs text-white/60">{L("مراجعة واعتماد المشاريع المرسلة من المطورين","Review and approve submitted projects")}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex gap-2 px-6 py-3 bg-white border-b border-gray-200 shrink-0">
            {([
              { key: "pending", label: L("قيد المراجعة","Pending"), count: counts.pending },
              { key: "approved", label: L("موافق عليها","Approved"), count: counts.approved },
              { key: "rejected", label: L("مرفوضة","Rejected"), count: counts.rejected },
            ] as const).map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  tab === t.key ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {t.label} ({t.count})
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400 gap-2">
                <ClipboardList className="h-10 w-10" />
                <span className="text-sm">{L("لا توجد طلبات في هذا القسم","No submissions here")}</span>
              </div>
            ) : (
              filtered.map(item => (
                <div key={item.id} className="bg-white border border-gray-100 rounded-xl p-4 flex gap-4">
                  <SubmissionImage src={item.image} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-display font-bold text-primary truncate">{item.title}</h4>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-secondary-fixed/40 text-secondary font-semibold shrink-0">
                        {CATEGORY_LABEL[item.category]?.[lang] ?? item.category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                      {item.location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{item.location}</span>}
                      {item.priceStart && <span className="flex items-center gap-1"><Coins className="h-3.5 w-3.5" />{item.priceStart}</span>}
                      {item.phone && <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{item.phone}</span>}
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">
                      {L("المطور","Developer")}: {item.developerName}
                    </p>

                    <div className="flex gap-2 mt-3">
                      {tab !== "approved" && (
                        <button
                          onClick={() => setStatus(item.id, "approved")}
                          className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {L("موافقة","Approve")}
                        </button>
                      )}
                      {tab !== "rejected" && (
                        <button
                          onClick={() => setStatus(item.id, "rejected")}
                          className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          {L("رفض","Reject")}
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(item)}
                        className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {L("حذف","Delete")}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
