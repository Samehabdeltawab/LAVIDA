import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  CheckCircle2,
  XCircle,
  Trash2,
  Home,
  Building2,
  Phone,
  RefreshCw,
} from "lucide-react";
import {
  SellPropertySubmission,
  DeveloperLead,
  PropertyUnit,
  FinishingStatus,
  SellPropertyType,
} from "../types";
import {
  getSellPropertySubmissions,
  updateSellPropertySubmissionStatus,
  deleteSellPropertySubmission,
} from "../utils/sellPropertyLeads";
import {
  getDeveloperLeads,
  updateDeveloperLeadStatus,
  deleteDeveloperLead,
} from "../utils/developerLeads";
import { getBlobUrl } from "../utils/mediaDB";

interface ApprovalsManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const UNITS_KEY = "lavida_units_list";

const TYPE_MAP: Record<SellPropertyType, PropertyUnit["type"]> = {
  apartment: "سكني",
  villa: "سكني",
  townhouse: "سكني",
  chalet: "ساحلي",
  office: "إداري",
  retail: "تجاري",
  medical: "طبي",
  pharmacy: "طبي",
  land: "سكني",
  other: "سكني",
};

const FINISHING_MAP: Record<FinishingStatus, PropertyUnit["finishing"]> = {
  fully_finished: "تشطيب كامل",
  semi_finished: "نصف تشطيب",
  core_shell: "بدون تشطيب",
  super_lux: "سوبر لوكس",
};

function mapSubmissionToUnit(sub: SellPropertySubmission): PropertyUnit {
  const addressParts = [sub.district, sub.governorate, sub.address].filter(Boolean);
  return {
    id: "unit_" + Math.random().toString(36).substring(2, 9),
    name: sub.compound || `عقار في ${sub.governorate}`,
    type: TYPE_MAP[sub.propertyType] || "سكني",
    projectName: sub.compound || "-",
    developerName: `مالك مباشر: ${sub.fullName}`,
    address: addressParts.join(" - ") || sub.governorate,
    area: sub.area,
    floor: sub.floor || "-",
    totalPrice: sub.askingPrice,
    pricePerMeter: "-",
    rooms: sub.bedrooms || "-",
    bathrooms: sub.bathrooms || "-",
    finishing: sub.finishing ? FINISHING_MAP[sub.finishing] : "بدون تشطيب",
    status: "متاح",
    images: sub.images,
    videoUrl: "",
    notes: sub.description || "",
    addedDate: new Date().toISOString(),
  };
}

function IdbThumb({ src }: { src: string; key?: string }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (src.startsWith("idb:")) {
      getBlobUrl(src.slice(4)).then((u) => setUrl(u));
    } else {
      setUrl(src);
    }
  }, [src]);
  if (!url) return <div className="w-14 h-14 rounded-lg bg-surface-container-low animate-pulse shrink-0" />;
  return <img src={url} alt="" className="w-14 h-14 rounded-lg object-cover border border-outline-variant/30 shrink-0" />;
}

const STATUS_LABELS_SELL: Record<SellPropertySubmission["status"], string> = {
  new: "جديد",
  reviewing: "قيد المراجعة",
  contacted: "تم التواصل",
  listed: "منشور",
  rejected: "مرفوض",
};

const STATUS_LABELS_DEV: Record<DeveloperLead["status"], string> = {
  new: "جديد",
  reviewing: "قيد المراجعة",
  contacted: "تم التواصل",
  partnered: "شريك معتمد",
  rejected: "مرفوض",
};

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  reviewing: "bg-amber-100 text-amber-700",
  contacted: "bg-purple-100 text-purple-700",
  listed: "bg-green-100 text-green-700",
  partnered: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default function ApprovalsManager({ isOpen, onClose }: ApprovalsManagerProps) {
  const [tab, setTab] = useState<"sell" | "developer">("sell");
  const [sellItems, setSellItems] = useState<SellPropertySubmission[]>([]);
  const [devItems, setDevItems] = useState<DeveloperLead[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [sells, devs] = await Promise.all([getSellPropertySubmissions(), getDeveloperLeads()]);
    setSellItems(sells);
    setDevItems(devs);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isOpen) refresh();
  }, [isOpen, refresh]);

  if (!isOpen) return null;

  const handleApproveSell = async (sub: SellPropertySubmission) => {
    if (!window.confirm("سيتم نشر هذا العقار على الموقع مباشرة. هل تريد المتابعة؟")) return;
    const unit = mapSubmissionToUnit(sub);
    try {
      const raw = localStorage.getItem(UNITS_KEY);
      const existing: PropertyUnit[] = raw ? JSON.parse(raw) : [];
      localStorage.setItem(UNITS_KEY, JSON.stringify([unit, ...existing]));
    } catch (e) {
      console.error("Failed to publish unit", e);
    }
    await updateSellPropertySubmissionStatus(sub.id, "listed");
    refresh();
  };

  const handleRejectSell = async (id: string) => {
    await updateSellPropertySubmissionStatus(id, "rejected");
    refresh();
  };

  const handleDeleteSell = async (id: string) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الطلب نهائيًا؟")) return;
    await deleteSellPropertySubmission(id);
    refresh();
  };

  const handleApproveDev = async (id: string) => {
    await updateDeveloperLeadStatus(id, "partnered");
    refresh();
  };

  const handleRejectDev = async (id: string) => {
    await updateDeveloperLeadStatus(id, "rejected");
    refresh();
  };

  const handleDeleteDev = async (id: string) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الطلب نهائيًا؟")) return;
    await deleteDeveloperLead(id);
    refresh();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] bg-black/50 flex justify-end"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.3 }}
          className="w-full max-w-3xl bg-surface h-screen flex flex-col text-right"
          onClick={(e) => e.stopPropagation()}
          dir="rtl"
        >
          {/* Header */}
          <div className="bg-primary text-white p-6 flex flex-row-reverse justify-between items-center border-b border-white/10 shrink-0">
            <div className="flex flex-row-reverse items-center gap-3">
              <div className="p-2 bg-secondary rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold">مراجعة واعتماد الطلبات</h3>
                <p className="text-xs text-secondary-fixed font-sans">طلبات بيع العقارات وشراكات المطورين</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={refresh}
                className="text-white/70 hover:text-white p-2.5 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                aria-label="تحديث"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </button>
              <button
                onClick={onClose}
                className="text-white/70 hover:text-white p-2.5 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                aria-label="إغلاق"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-row-reverse gap-2 p-4 border-b border-outline-variant/20 shrink-0 bg-surface-container-low">
            <button
              onClick={() => setTab("sell")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-sans font-semibold transition-colors ${
                tab === "sell" ? "bg-primary text-white" : "bg-white text-on-surface/70 border border-outline-variant/40"
              }`}
            >
              <Home className="h-4 w-4" />
              طلبات البيع ({sellItems.filter((s) => s.status === "new" || s.status === "reviewing").length})
            </button>
            <button
              onClick={() => setTab("developer")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-sans font-semibold transition-colors ${
                tab === "developer" ? "bg-primary text-white" : "bg-white text-on-surface/70 border border-outline-variant/40"
              }`}
            >
              <Building2 className="h-4 w-4" />
              طلبات المطورين ({devItems.filter((d) => d.status === "new" || d.status === "reviewing").length})
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 font-sans">
            {tab === "sell" && (
              sellItems.length === 0 ? (
                <p className="text-center text-on-surface/50 py-16">لا توجد طلبات بيع حتى الآن</p>
              ) : (
                sellItems.map((sub) => (
                  <div key={sub.id} className="bg-white border border-outline-variant/30 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[sub.status]}`}>
                        {STATUS_LABELS_SELL[sub.status]}
                      </span>
                      <span className="text-xs text-on-surface/40">{new Date(sub.date).toLocaleDateString("ar-EG")}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                      <div><b>الاسم:</b> {sub.fullName}</div>
                      <div className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {sub.phone}</div>
                      <div><b>المحافظة:</b> {sub.governorate}</div>
                      <div><b>الكمبوند:</b> {sub.compound}</div>
                      <div><b>السعر المطلوب:</b> {sub.askingPrice} ج.م</div>
                      <div><b>المساحة:</b> {sub.area} م²</div>
                    </div>
                    {sub.images.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {sub.images.map((img) => <IdbThumb key={img} src={img} />)}
                      </div>
                    )}
                    <div className="flex gap-2 pt-2 border-t border-outline-variant/20">
                      {(sub.status === "new" || sub.status === "reviewing") && (
                        <>
                          <button
                            onClick={() => handleApproveSell(sub)}
                            className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" /> اعتماد ونشر
                          </button>
                          <button
                            onClick={() => handleRejectSell(sub.id)}
                            className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-3 py-2 rounded-lg transition-colors"
                          >
                            <XCircle className="h-3.5 w-3.5" /> رفض
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDeleteSell(sub.id)}
                        className="flex items-center gap-1.5 text-on-surface/50 hover:text-red-600 text-xs font-bold px-3 py-2 rounded-lg transition-colors ms-auto"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> حذف
                      </button>
                    </div>
                  </div>
                ))
              )
            )}

            {tab === "developer" && (
              devItems.length === 0 ? (
                <p className="text-center text-on-surface/50 py-16">لا توجد طلبات مطورين حتى الآن</p>
              ) : (
                devItems.map((dev) => (
                  <div key={dev.id} className="bg-white border border-outline-variant/30 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[dev.status]}`}>
                        {STATUS_LABELS_DEV[dev.status]}
                      </span>
                      <span className="text-xs text-on-surface/40">{new Date(dev.date).toLocaleDateString("ar-EG")}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                      <div><b>الشركة:</b> {dev.companyName}</div>
                      <div><b>المسؤول:</b> {dev.contactPerson}</div>
                      <div className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {dev.phone}</div>
                      <div><b>المشروع:</b> {dev.projectName}</div>
                      <div><b>الموقع:</b> {dev.location}</div>
                      <div><b>عدد الوحدات:</b> {dev.unitsAvailable}</div>
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-outline-variant/20">
                      {(dev.status === "new" || dev.status === "reviewing") && (
                        <>
                          <button
                            onClick={() => handleApproveDev(dev.id)}
                            className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" /> اعتماد كشريك
                          </button>
                          <button
                            onClick={() => handleRejectDev(dev.id)}
                            className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-3 py-2 rounded-lg transition-colors"
                          >
                            <XCircle className="h-3.5 w-3.5" /> رفض
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDeleteDev(dev.id)}
                        className="flex items-center gap-1.5 text-on-surface/50 hover:text-red-600 text-xs font-bold px-3 py-2 rounded-lg transition-colors ms-auto"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> حذف
                      </button>
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
