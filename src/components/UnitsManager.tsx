import { useState, useEffect, useRef, FormEvent, ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X, Plus, Edit2, Trash2, Search, Save, Download,
  Home, Hotel, ShoppingBag, Briefcase, Stethoscope, Waves,
  BarChart3, LogOut, AlertCircle, ImageIcon, Film, Loader2, CheckCircle2,
} from "lucide-react";
import { PropertyUnit } from "../types";
import { storeBlob, getBlobUrl, removeBlob, compressImage } from "../utils/mediaDB";
import { useLang } from "../LangContext";

interface UnitsManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProjectApprovals?: () => void;
  pendingProjectsCount?: number;
}

const UNITS_KEY = "lavida_units_list";

// Published developer partners shown publicly in DeveloperPartners.tsx
export const DEV_PARTNERS_KEY = "lavida_dev_partners_list";
export interface PublishedDeveloperPartner {
  id: string;
  companyName: string;
  companyLogo: string;
  website?: string;
}

const UNIT_TYPES: PropertyUnit["type"][] = ["سكني", "فندقي", "تجاري", "إداري", "طبي", "ساحلي"];
const FINISHING_TYPES: PropertyUnit["finishing"][] = ["تشطيب كامل", "سوبر لوكس", "نصف تشطيب", "بدون تشطيب"];
const STATUS_TYPES: PropertyUnit["status"][] = ["متاح", "محجوز", "مباع"];

const TYPE_ICONS: Record<PropertyUnit["type"], typeof Home> = {
  "سكني":  Home,
  "فندقي": Hotel,
  "تجاري": ShoppingBag,
  "إداري": Briefcase,
  "طبي":   Stethoscope,
  "ساحلي": Waves,
};

const TYPE_COLORS: Record<PropertyUnit["type"], string> = {
  "سكني":  "bg-blue-100 text-blue-700",
  "فندقي": "bg-purple-100 text-purple-700",
  "تجاري": "bg-orange-100 text-orange-700",
  "إداري": "bg-gray-100 text-gray-700",
  "طبي":   "bg-green-100 text-green-700",
  "ساحلي": "bg-cyan-100 text-cyan-700",
};

const STATUS_COLORS: Record<PropertyUnit["status"], string> = {
  "متاح":  "bg-emerald-100 text-emerald-700 border-emerald-200",
  "محجوز": "bg-amber-100 text-amber-700 border-amber-200",
  "مباع":  "bg-red-100 text-red-700 border-red-200",
};

const EMPTY_FORM: Omit<PropertyUnit, "id" | "addedDate"> = {
  name: "",
  type: "سكني",
  projectName: "",
  developerName: "",
  address: "",
  area: "",
  floor: "",
  totalPrice: "",
  pricePerMeter: "",
  rooms: "",
  bathrooms: "",
  finishing: "تشطيب كامل",
  status: "متاح",
  images: [],
  videoUrl: "",
  notes: "",
};

// ── Bilingual display maps ───────────────────────────────────────────────────
const TYPE_DISPLAY: Record<string, {ar:string;en:string}> = {
  "سكني":  {ar:"سكني",  en:"Residential"},
  "فندقي": {ar:"فندقي", en:"Hotel"},
  "تجاري": {ar:"تجاري", en:"Commercial"},
  "إداري": {ar:"إداري", en:"Administrative"},
  "طبي":   {ar:"طبي",   en:"Medical"},
  "ساحلي": {ar:"ساحلي", en:"Coastal"},
};
const FINISHING_DISPLAY: Record<string, {ar:string;en:string}> = {
  "تشطيب كامل":  {ar:"تشطيب كامل",  en:"Full Finishing"},
  "سوبر لوكس":   {ar:"سوبر لوكس",   en:"Super Lux"},
  "نصف تشطيب":   {ar:"نصف تشطيب",   en:"Semi Finishing"},
  "بدون تشطيب": {ar:"بدون تشطيب", en:"No Finishing"},
};
const STATUS_DISPLAY: Record<string, {ar:string;en:string}> = {
  "متاح": {ar:"متاح", en:"Available"},
  "محجوز": {ar:"محجوز", en:"Reserved"},
  "مباع":  {ar:"مباع",  en:"Sold"},
};

// ── IdbImage: loads image from IndexedDB or uses src directly ────────────────
function IdbImage({ src, isMain, mainLabel, onRemove }: {
  src: string;
  isMain: boolean;
  mainLabel: string;
  onRemove: () => void;
}) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (src.startsWith("idb:")) {
      getBlobUrl(src.slice(4)).then(u => setUrl(u));
    } else {
      setUrl(src);
    }
  }, [src]);
  if (!url) return <div className="aspect-square rounded-xl bg-gray-100 animate-pulse" />;
  return (
    <div className="relative group aspect-square">
      <img src={url} alt="" className="w-full h-full object-cover rounded-xl border border-gray-100" />
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="h-3 w-3" />
      </button>
      {isMain && (
        <span className="absolute bottom-1 left-1 bg-black/50 text-white text-[9px] px-1 rounded">{mainLabel}</span>
      )}
    </div>
  );
}

export default function UnitsManager({ isOpen, onClose, onOpenProjectApprovals, pendingProjectsCount }: UnitsManagerProps) {
  const { lang } = useLang();
  const L = (ar: string, en: string) => lang === "ar" ? ar : en;
  const [units, setUnits] = useState<PropertyUnit[]>([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("الكل");
  const [filterStatus, setFilterStatus] = useState<string>("الكل");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formError, setFormError] = useState("");
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // ── Idle Auto-logout ─────────────────────────────────────
  const [idleCountdown, setIdleCountdown] = useState<number | null>(null);
  const idleTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem(UNITS_KEY);
      if (saved) {
        try { setUnits(JSON.parse(saved)); } catch { /* ignore */ }
      }
    }
  }, [isOpen]);

  const persist = (updated: PropertyUnit[]) => {
    setUnits(updated);
    localStorage.setItem(UNITS_KEY, JSON.stringify(updated));
  };

  // ── Image Upload ──────────────────────────────────────────
  const handleImageFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (!files.length) return;
    const remaining = 15 - formData.images.length;
    const toProcess = files.slice(0, remaining);
    setIsUploadingImages(true);
    const keys: string[] = [];
    for (const file of toProcess) {
      const b64 = await compressImage(file);
      // store in IndexedDB to avoid localStorage 5MB limit
      const res = await fetch(b64);
      const blob = await res.blob();
      const key = await storeBlob(blob);
      keys.push("idb:" + key);
    }
    setFormData(prev => ({ ...prev, images: [...prev.images, ...keys] }));
    setIsUploadingImages(false);
    e.target.value = "";
  };

  // ── Video Upload ──────────────────────────────────────────
  const handleVideoFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingVideo(true);
    // Remove old video blob if exists
    if (formData.videoUrl.startsWith("idb:")) {
      await removeBlob(formData.videoUrl.slice(4)).catch(() => {});
    }
    const key = await storeBlob(file);
    const previewUrl = URL.createObjectURL(file);
    setVideoPreviewUrl(previewUrl);
    setFormData(prev => ({ ...prev, videoUrl: "idb:" + key }));
    setIsUploadingVideo(false);
    e.target.value = "";
  };

  // Load video preview when editing a unit with a local video
  useEffect(() => {
    if (showForm && formData.videoUrl.startsWith("idb:")) {
      getBlobUrl(formData.videoUrl.slice(4)).then(url => {
        if (url) setVideoPreviewUrl(url);
      });
    } else {
      setVideoPreviewUrl(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showForm]);

  const handleOpenAdd = () => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setFormError("");
    setShowForm(true);
  };

  const handleOpenEdit = (unit: PropertyUnit) => {
    const { id, addedDate, ...rest } = unit;
    setFormData(rest);
    setEditingId(id);
    setFormError("");
    setShowForm(true);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) { setFormError(L("اسم الوحدة مطلوب", "Unit name is required")); return; }
    if (!formData.projectName.trim()) { setFormError(L("اسم المشروع مطلوب", "Project name is required")); return; }

    if (editingId) {
      persist(units.map(u =>
        u.id === editingId ? { ...formData, id: editingId, addedDate: u.addedDate } : u
      ));
    } else {
      const newUnit: PropertyUnit = {
        ...formData,
        id: "unit_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
        addedDate: new Date().toISOString(),
      };
      persist([newUnit, ...units]);
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    persist(units.filter(u => u.id !== id));
    setDeleteId(null);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("lavida_admin_auth");
    if (idleTimerRef.current)  clearTimeout(idleTimerRef.current);
    if (countdownRef.current)  clearInterval(countdownRef.current);
    onClose();
  };

  // ── Idle timer effect ─────────────────────────────────────
  useEffect(() => {
    if (!isOpen) {
      if (idleTimerRef.current)  clearTimeout(idleTimerRef.current);
      if (countdownRef.current)  clearInterval(countdownRef.current);
      setIdleCountdown(null);
      return;
    }

    const startTimer = () => {
      if (idleTimerRef.current)  clearTimeout(idleTimerRef.current);
      if (countdownRef.current)  clearInterval(countdownRef.current);
      setIdleCountdown(null);

      // After 50s of idle → start 10s visible countdown then logout
      idleTimerRef.current = setTimeout(() => {
        let n = 10;
        setIdleCountdown(n);
        countdownRef.current = setInterval(() => {
          n -= 1;
          if (n <= 0) {
            if (countdownRef.current) clearInterval(countdownRef.current);
            sessionStorage.removeItem("lavida_admin_auth");
            onCloseRef.current();
          } else {
            setIdleCountdown(n);
          }
        }, 1000);
      }, 50_000);
    };

    startTimer();
    window.addEventListener("mousemove",  startTimer);
    window.addEventListener("keydown",    startTimer);
    window.addEventListener("click",      startTimer);
    window.addEventListener("touchstart", startTimer);

    return () => {
      window.removeEventListener("mousemove",  startTimer);
      window.removeEventListener("keydown",    startTimer);
      window.removeEventListener("click",      startTimer);
      window.removeEventListener("touchstart", startTimer);
      if (idleTimerRef.current)  clearTimeout(idleTimerRef.current);
      if (countdownRef.current)  clearInterval(countdownRef.current);
    };
  }, [isOpen]);

  const handleExport = () => {
    const headers = [L("الاسم","Name"),L("النوع","Type"),L("المشروع","Project"),L("العنوان","Address"),L("المساحة م²","Area m²"),L("الدور","Floor"),L("السعر الإجمالي","Total Price"),L("سعر المتر","Price/m²"),L("الغرف","Rooms"),L("الحمامات","Bathrooms"),L("التشطيب","Finishing"),L("الحالة","Status"),L("ملاحظات","Notes"),L("تاريخ الإضافة","Date Added")];
    const rows = units.map(u => [
      u.name, u.type, u.projectName, u.address, u.area, u.floor,
      u.totalPrice, u.pricePerMeter, u.rooms, u.bathrooms,
      u.finishing, u.status, u.notes,
      new Date(u.addedDate).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US"),
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lavida_units_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = units.filter(u => {
    const q = search.trim().toLowerCase();
    const matchSearch = !q || u.name.includes(q) || u.projectName.includes(q) || u.notes.includes(q);
    const matchType   = filterType === "الكل"   || u.type === filterType;
    const matchStatus = filterStatus === "الكل" || u.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const stats = {
    total:    units.length,
    available: units.filter(u => u.status === "متاح").length,
    reserved:  units.filter(u => u.status === "محجوز").length,
    sold:      units.filter(u => u.status === "مباع").length,
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="relative z-10 bg-gray-50 w-full max-w-6xl mx-auto my-4 rounded-2xl shadow-2xl overflow-hidden flex flex-col font-sans"
        dir={lang === "ar" ? "rtl" : "ltr"}
        style={{ maxHeight: "calc(100vh - 2rem)" }}
        onClick={e => e.stopPropagation()}
      >

        {/* ====== Header ====== */}
        <div className="bg-primary text-white px-6 py-4 flex items-center justify-between shrink-0">
          {/* Start: Icon + Title + Add */}
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-secondary rounded-xl">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">{L("إدارة الوحدات العقارية","Property Units Manager")}</h2>
              <p className="text-xs text-white/60">{L("إضافة · تعديل · تتبع الحالة · تصدير","Add · Edit · Track · Export")}</p>
            </div>
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-5 py-2.5 rounded-xl font-display font-bold transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4" />
              {L("إضافة وحدة","Add Unit")}
            </button>
          </div>
          {/* End: Export + Logout + Close */}
          <div className="flex items-center gap-3">
            {onOpenProjectApprovals && (
              <button
                onClick={onOpenProjectApprovals}
                className="relative flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-sm transition-colors"
              >
                {L("طلبات المشاريع","Project Requests")}
                {!!pendingProjectsCount && pendingProjectsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] leading-none rounded-full h-4 w-4 flex items-center justify-center">
                    {pendingProjectsCount}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={handleExport}
              disabled={units.length === 0}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 disabled:opacity-40 px-3 py-1.5 rounded-lg text-sm transition-colors"
            >
              <Download className="h-4 w-4" />
              {L("تصدير CSV","Export CSV")}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-red-500/80 px-3 py-1.5 rounded-lg text-sm transition-colors"
              title={L("تسجيل الخروج","Logout")}
            >
              <LogOut className="h-4 w-4" />
              {L("خروج","Logout")}
            </button>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              title={L("إغلاق","Close")}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* ====== Stats Bar ====== */}
        <div className="grid grid-cols-4 gap-3 px-6 py-3 bg-white border-b border-gray-200 shrink-0">
          {[
            { label: L("إجمالي الوحدات","Total Units"), value: stats.total,    color: "text-primary" },
            { label: L("متاحة","Available"),          value: stats.available, color: "text-emerald-600" },
            { label: L("محجوزة","Reserved"),         value: stats.reserved,  color: "text-amber-600" },
            { label: L("مباعة","Sold"),          value: stats.sold,      color: "text-red-600" },
          ].map((s, i) => (
            <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
              <div className={`text-2xl font-display font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ====== Filters ====== */}
        <div className="px-6 py-3 flex gap-3 items-center flex-wrap bg-white border-b border-gray-200 shrink-0">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={L("بحث باسم الوحدة أو المشروع...","Search unit or project...")}
              className="w-full border border-gray-200 rounded-xl py-2.5 ps-10 pe-4 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className={`border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-primary text-start bg-white`}
          >
            <option value="الكل">{L("كل الأنواع","All Types")}</option>
            {UNIT_TYPES.map(t => <option key={t} value={t}>{TYPE_DISPLAY[t]?.[lang] ?? t}</option>)}
          </select>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className={`border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-primary text-start bg-white`}
          >
            <option value="الكل">{L("كل الحالات","All Statuses")}</option>
            {STATUS_TYPES.map(s => <option key={s} value={s}>{STATUS_DISPLAY[s]?.[lang] ?? s}</option>)}
          </select>
          {(search || filterType !== "الكل" || filterStatus !== "الكل") && (
            <button
              onClick={() => { setSearch(""); setFilterType("الكل"); setFilterStatus("الكل"); }}
              className="text-xs text-gray-500 hover:text-red-500 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
            >{L("مسح الفلاتر ×","Clear Filters ×")}</button>
          )}
          <span className="text-xs text-gray-400 ms-auto">
            {filtered.length} {L("وحدة","unit(s)")}
          </span>
        </div>

        {/* ====== Units List ====== */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-60 text-gray-400 gap-3">
              <Home className="h-12 w-12 opacity-20" />
              <p className="font-display text-lg">
                {units.length === 0 ? L("لا توجد وحدات بعد","No units yet") : L("لا توجد نتائج للفلتر الحالي","No results")}
              </p>
              {units.length === 0 && (
                <button
                  onClick={handleOpenAdd}
                  className="mt-2 bg-primary text-white px-6 py-2.5 rounded-xl font-display font-bold text-sm hover:bg-primary/90 transition-colors"
                >{L("إضافة أول وحدة","Add First Unit")}</button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence>
                {filtered.map(unit => {
                  const TypeIcon = TYPE_ICONS[unit.type];
                  return (
                    <motion.div
                      key={unit.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      className="bg-white border border-gray-200 rounded-xl px-5 py-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between gap-4">

                        {/* Unit Info */}
                        <div className="flex items-center gap-3 flex-1 justify-start flex-wrap text-start">
                          <div className="p-2 bg-gray-100 rounded-lg shrink-0">
                            <TypeIcon className="h-4 w-4 text-gray-600" />
                          </div>
                          <span className={`text-xs px-2.5 py-1.5 rounded-full font-medium ${TYPE_COLORS[unit.type]}`}>
                            {unit.type}
                          </span>
                          <div>
                            <div className="font-bold text-gray-800 text-sm">{unit.name}</div>
                            <div className="text-xs text-gray-400 mt-0.5">
                              {unit.projectName}{unit.floor ? ` · ${L("الدور","Fl.")} ${unit.floor}` : ""}{unit.address ? ` · ${unit.address}` : ""}
                            </div>
                          </div>
                          <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${STATUS_COLORS[unit.status]}`}>
                            {unit.status}
                          </span>
                          {unit.totalPrice && (
                            <span className="text-sm font-bold text-primary">{unit.totalPrice} ج.م</span>
                          )}
                          {unit.area && (
                            <span className="text-xs text-gray-500">{unit.area} م²</span>
                          )}
                          {unit.rooms && (
                            <span className="text-xs text-gray-500">{unit.rooms} {L("غرف","rms")}</span>
                          )}
                          {unit.finishing && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg">
                              {unit.finishing}
                            </span>
                          )}
                          {unit.notes && (
                            <span className="text-xs text-gray-400 max-w-[140px] truncate hidden sm:block" title={unit.notes}>
                              {unit.notes}
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          {deleteId === unit.id ? (
                            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-1.5">
                              <button
                                onClick={() => setDeleteId(null)}
                                className="text-xs text-gray-500 hover:text-gray-700"
                              >{L("لا","No")}</button>
                              <span className="text-xs text-red-600 font-medium">{L("حذف؟","Delete?")}</span>
                              <button
                                onClick={() => handleDelete(unit.id)}
                                className="text-xs bg-red-500 text-white px-2.5 py-1 rounded-lg hover:bg-red-600"
                              >{L("نعم","Yes")}</button>
                            </div>
                          ) : (
                            <>
                              <button
                                onClick={() => handleOpenEdit(unit)}
                                className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                title={L("تعديل","Edit")}
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setDeleteId(unit.id)}
                                className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                                title={L("حذف","Delete")}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>

                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* ── Idle countdown warning ── */}
        {idleCountdown !== null && (
          <div className="bg-amber-500 text-white text-center text-sm py-2.5 px-4 shrink-0 font-display font-bold">
            {L(`سيتم تسجيل الخروج تلقائياً خلال ${idleCountdown} ثانية`, `Auto-logout in ${idleCountdown}s due to inactivity`)}
          </div>
        )}
      </motion.div>

      {/* ====== Add / Edit Form Modal ====== */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto font-sans"
              dir={lang === "ar" ? "rtl" : "ltr"}
              onClick={e => e.stopPropagation()}
            >
              {/* Form Header */}
              <div className="bg-primary text-white p-5 rounded-t-2xl flex justify-between items-center sticky top-0 z-10">
                <h3 className="font-display text-lg font-bold">
                  {editingId ? L("تعديل بيانات الوحدة","Edit Unit") : L("إضافة وحدة عقارية جديدة","Add New Unit")}
                </h3>
                <button onClick={() => setShowForm(false)} className="text-white/70 hover:text-white p-1 rounded-lg">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-5">

                {/* Row 1: Name + Project */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1.5">{L("اسم الوحدة","Unit Name")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder={L("مثال: شقة A-301","e.g. Apt A-301")}
                      className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-start focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20`}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1.5">{L("اسم المشروع","Project Name")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.projectName}
                      onChange={e => setFormData({ ...formData, projectName: e.target.value })}
                      placeholder={L("مثال: كمبوند لاڤيدا ريزيدنس","e.g. Lavida Residence")}
                      className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-start focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20`}
                    />
                  </div>
                </div>

                {/* Row 1b: Developer + Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1.5">{L("اسم المطور","Developer Name")}</label>
                    <input
                      type="text"
                      value={formData.developerName}
                      onChange={e => setFormData({ ...formData, developerName: e.target.value })}
                      placeholder={L("مثال: شركة تطوير مصر","e.g. Developer Co.")}
                      className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-start focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20`}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1.5">{L("العنوان","Address")}</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      placeholder={L("مثال: التجمع الخامس، القاهرة الجديدة","e.g. New Cairo")}
                      className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-start focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20`}
                    />
                  </div>
                </div>

                {/* Row 2: Type + Status + Finishing */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1.5">{L("النوع","Type")}</label>
                    <select
                      value={formData.type}
                      onChange={e => setFormData({ ...formData, type: e.target.value as PropertyUnit["type"] })}
                      className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-start focus:outline-none focus:border-primary bg-white`}
                    >
                      {UNIT_TYPES.map(t => <option key={t} value={t}>{TYPE_DISPLAY[t]?.[lang] ?? t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1.5">{L("الحالة","Status")}</label>
                    <select
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value as PropertyUnit["status"] })}
                      className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-start focus:outline-none focus:border-primary bg-white`}
                    >
                      {STATUS_TYPES.map(s => <option key={s} value={s}>{STATUS_DISPLAY[s]?.[lang] ?? s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1.5">{L("التشطيب","Finishing")}</label>
                    <select
                      value={formData.finishing}
                      onChange={e => setFormData({ ...formData, finishing: e.target.value as PropertyUnit["finishing"] })}
                      className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-start focus:outline-none focus:border-primary bg-white`}
                    >
                      {FINISHING_TYPES.map(f => <option key={f} value={f}>{FINISHING_DISPLAY[f]?.[lang] ?? f}</option>)}
                    </select>
                  </div>
                </div>

                {/* Row 3: Area + Floor + Rooms + Bathrooms */}
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1.5">{L("المساحة (م²)","Area (m²)")}</label>
                    <input
                      type="text"
                      value={formData.area}
                      onChange={e => setFormData({ ...formData, area: e.target.value })}
                      placeholder="120"
                      className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-start focus:outline-none focus:border-primary`}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1.5">{L("الدور","Floor")}</label>
                    <input
                      type="text"
                      value={formData.floor}
                      onChange={e => setFormData({ ...formData, floor: e.target.value })}
                      placeholder={L("الثالث","3rd")}
                      className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-start focus:outline-none focus:border-primary`}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1.5">{L("الغرف","Rooms")}</label>
                    <input
                      type="text"
                      value={formData.rooms}
                      onChange={e => setFormData({ ...formData, rooms: e.target.value })}
                      placeholder="3"
                      className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-start focus:outline-none focus:border-primary`}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1.5">{L("الحمامات","Bathrooms")}</label>
                    <input
                      type="text"
                      value={formData.bathrooms}
                      onChange={e => setFormData({ ...formData, bathrooms: e.target.value })}
                      placeholder="2"
                      className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-start focus:outline-none focus:border-primary`}
                    />
                  </div>
                </div>

                {/* Row 4: Total Price + Price per Meter */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1.5">{L("السعر الإجمالي (ج.م)","Total Price (EGP)")}</label>
                    <input
                      type="text"
                      value={formData.totalPrice}
                      onChange={e => setFormData({ ...formData, totalPrice: e.target.value })}
                      placeholder="2,500,000"
                      className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-start focus:outline-none focus:border-primary`}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1.5">{L("سعر المتر (ج.م)","Price/m² (EGP)")}</label>
                    <input
                      type="text"
                      value={formData.pricePerMeter}
                      onChange={e => setFormData({ ...formData, pricePerMeter: e.target.value })}
                      placeholder="20,833"
                      className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-start focus:outline-none focus:border-primary`}
                    />
                  </div>
                </div>

                {/* ── Images Upload ── */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-gray-700">{L("صور الوحدة","Unit Photos")}</label>
                    <span className="text-xs text-gray-400">{formData.images.length}/15 {L("صورة","photo(s)")}</span>
                  </div>

                  {/* Drop zone */}
                  <div
                    className="border-2 border-dashed border-gray-200 hover:border-primary/50 rounded-xl p-5 text-center cursor-pointer transition-colors"
                    onClick={() => !isUploadingImages && formData.images.length < 15 && imageInputRef.current?.click()}
                  >
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageFiles}
                    />
                    {isUploadingImages ? (
                      <div className="flex items-center justify-center gap-2 text-primary">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="text-sm">{L("جاري ضغط الصور...","Compressing...")}</span>
                      </div>
                    ) : formData.images.length >= 15 ? (
                      <p className="text-xs text-gray-400">{L("وصلت الحد الأقصى (15 صورة)", "Max 15 photos reached")}</p>
                    ) : (
                      <>
                        <ImageIcon className="h-7 w-7 text-gray-300 mx-auto mb-1.5" />
                        <p className="text-sm text-gray-500 font-medium">{L("اضغط لاختيار الصور من جهازك","Click to choose photos")}</p>
                        <p className="text-xs text-gray-400 mt-1">JPG · PNG · WebP · {L("تُضغط تلقائياً","auto-compressed")}</p>
                      </>
                    )}
                  </div>

                  {/* Thumbnails grid */}
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-5 gap-2 mt-3">
                      {formData.images.map((src, idx) => (
                        <div key={src}>
                        <IdbImage
                          src={src}
                          isMain={idx === 0}
                          mainLabel={L("رئيسية","Main")}
                          onRemove={() => {
                            if (src.startsWith("idb:")) removeBlob(src.slice(4)).catch(() => {});
                            setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
                          }}
                        />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ── Video Upload ── */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">{L("فيديو الوحدة","Unit Video")}</label>

                  {formData.videoUrl ? (
                    /* Video already selected */
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                      {formData.videoUrl.startsWith("idb:") ? (
                        /* Local video preview */
                        videoPreviewUrl ? (
                          <video
                            src={videoPreviewUrl}
                            controls
                            className="w-full max-h-48 bg-black"
                          />
                        ) : (
                          <div className="flex items-center gap-2 p-4 text-gray-500">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">{L("جاري تحميل الفيديو...","Loading video...")}</span>
                          </div>
                        )
                      ) : (
                        /* External URL (YouTube/Vimeo) */
                        <div className="flex items-center gap-3 p-4">
                          <Film className="h-5 w-5 text-primary shrink-0" />
                          <span className="text-sm text-gray-600 truncate flex-1 dir-ltr">{formData.videoUrl}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() => {
                            if (formData.videoUrl.startsWith("idb:")) {
                              removeBlob(formData.videoUrl.slice(4)).catch(() => {});
                            }
                            setFormData({ ...formData, videoUrl: "" });
                            setVideoPreviewUrl(null);
                          }}
                          className="text-xs text-red-500 hover:text-red-700 transition-colors"
                        >{L("× حذف الفيديو","× Remove video")}</button>
                        <div className="flex items-center gap-1 text-xs text-emerald-600">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {formData.videoUrl.startsWith("idb:") ? L("فيديو مرفوع من الجهاز","Local video") : L("رابط خارجي","External link")}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* No video yet – show two options */
                    <div className="grid grid-cols-2 gap-3">
                      {/* Upload from device */}
                      <div
                        className="border-2 border-dashed border-gray-200 hover:border-primary/50 rounded-xl p-4 text-center cursor-pointer transition-colors"
                        onClick={() => !isUploadingVideo && videoInputRef.current?.click()}
                      >
                        <input
                          ref={videoInputRef}
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={handleVideoFile}
                        />
                        {isUploadingVideo ? (
                          <div className="flex items-center justify-center gap-1.5 text-primary">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-xs">{L("جاري الرفع...","Uploading...")}</span>
                          </div>
                        ) : (
                          <>
                            <Film className="h-6 w-6 text-gray-300 mx-auto mb-1" />
                            <p className="text-xs text-gray-500 font-medium">{L("رفع من الجهاز","Upload from device")}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">MP4 · MOV · AVI</p>
                          </>
                        )}
                      </div>

                      {/* YouTube / Vimeo URL */}
                      <div className="flex flex-col gap-1.5">
                        <p className="text-xs text-gray-500 font-medium">{L("أو رابط YouTube / Vimeo","or YouTube / Vimeo URL")}</p>
                        <input
                          type="url"
                          placeholder="https://youtube.com/watch?v=..."
                          onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                          className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
                          dir="ltr"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">{L("ملاحظات","Notes")}</label>
                  <textarea
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    placeholder={L("أي ملاحظات إضافية عن الوحدة، الموقع، المميزات الخاصة...","Additional notes...")}
                    className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-start focus:outline-none focus:border-primary resize-none`}
                  />
                </div>

                {/* Error */}
                {formError && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span className="text-sm">{formError}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-display font-bold hover:bg-gray-50 transition-colors"
                  >{L("إلغاء","Cancel")}</button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-white py-3 rounded-xl font-display font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Save className="h-4 w-4" />
                    {editingId ? L("حفظ التعديلات","Save Changes") : L("إضافة الوحدة","Add Unit")}
                  </button>
                </div>

              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

