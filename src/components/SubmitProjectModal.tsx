import { useState, ChangeEvent, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, UploadCloud, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useLang } from "../LangContext";
import { DeveloperProjectSubmission } from "../types";
import { storeBlob, compressImage } from "../utils/mediaDB";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PROJECT_SUBMISSIONS_KEY = "lavida_project_submissions";

const CATEGORIES: DeveloperProjectSubmission["category"][] = ["سكني", "تجاري", "ساحلي"];
const CATEGORY_LABEL: Record<string, { ar: string; en: string }> = {
  "سكني": { ar: "سكني - فندقي", en: "Residential - Hotel" },
  "تجاري": { ar: "تجاري - إداري - طبي", en: "Commercial - Admin - Medical" },
  "ساحلي": { ar: "ساحلي", en: "Coastal" },
};

const EMPTY = {
  title: "",
  category: "سكني" as DeveloperProjectSubmission["category"],
  description: "",
  location: "",
  priceStart: "",
  developerName: "",
  phone: "",
};

export default function SubmitProjectModal({ isOpen, onClose }: Props) {
  const { lang } = useLang();
  const L = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const [form, setForm] = useState(EMPTY);
  const [imageKey, setImageKey] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const reset = () => {
    setForm(EMPTY);
    setImageKey("");
    setImagePreview("");
    setError("");
    setSuccess(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const b64 = await compressImage(file);
    const res = await fetch(b64);
    const blob = await res.blob();
    const key = await storeBlob(blob);
    setImageKey("idb:" + key);
    setImagePreview(b64);
    setIsUploading(false);
    e.target.value = "";
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.developerName.trim() || !form.phone.trim()) {
      setError(L("الرجاء ملء اسم المشروع، اسم المطور، ورقم الهاتف", "Please fill project name, developer name, and phone"));
      return;
    }
    const submission: DeveloperProjectSubmission = {
      id: "proj_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
      title: form.title.trim(),
      category: form.category,
      description: form.description.trim(),
      image: imageKey,
      location: form.location.trim(),
      priceStart: form.priceStart.trim(),
      developerName: form.developerName.trim(),
      phone: form.phone.trim(),
      status: "pending",
      submittedDate: new Date().toISOString(),
    };
    try {
      const raw = localStorage.getItem(PROJECT_SUBMISSIONS_KEY);
      const list: DeveloperProjectSubmission[] = raw ? JSON.parse(raw) : [];
      list.unshift(submission);
      localStorage.setItem(PROJECT_SUBMISSIONS_KEY, JSON.stringify(list));
      setSuccess(true);
    } catch {
      setError(L("حدث خطأ أثناء الإرسال، حاول مرة أخرى", "An error occurred while submitting, try again"));
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-primary/50 backdrop-blur-sm"
          onClick={handleClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          dir={lang === "ar" ? "rtl" : "ltr"}
          className="relative z-10 bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          <div className="bg-primary text-white p-6 relative">
            <button
              onClick={handleClose}
              className="absolute end-6 top-6 text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>
            <h3 className="font-display text-xl font-bold">
              {L("أضف مشروعك العقاري", "Submit Your Project")}
            </h3>
            <p className="text-xs text-white/70 mt-1">
              {L("سيتم مراجعة بيانات المشروع من فريقنا قبل نشره", "Your project will be reviewed by our team before publishing")}
            </p>
          </div>

          {success ? (
            <div className="p-8 flex flex-col items-center text-center gap-4">
              <CheckCircle2 className="h-14 w-14 text-emerald-500" />
              <h4 className="font-display text-lg font-bold text-primary">
                {L("تم إرسال بياناتك بنجاح", "Your submission was sent successfully")}
              </h4>
              <p className="text-sm text-on-surface-variant">
                {L("سيتم عرض مشروعك في قسم المشاريع بعد موافقة الإدارة.", "Your project will appear in the Projects section after admin approval.")}
              </p>
              <button
                onClick={handleClose}
                className="mt-2 bg-primary text-white px-6 py-2.5 rounded-xl font-display font-bold hover:bg-primary/90 transition-colors"
              >
                {L("إغلاق", "Close")}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">{L("اسم المشروع","Project Name")}</label>
                <input
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                  placeholder={L("مثال: لافيدا ريزيدنس","e.g. Lavida Residence")}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">{L("التصنيف","Category")}</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value as DeveloperProjectSubmission["category"] })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary bg-white"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{CATEGORY_LABEL[c][lang]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">{L("وصف مختصر","Short Description")}</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary resize-none"
                  placeholder={L("وصف موجز عن المشروع...","Brief description of the project...")}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">{L("الموقع","Location")}</label>
                  <input
                    value={form.location}
                    onChange={e => setForm({ ...form, location: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">{L("سعر البداية","Starting Price")}</label>
                  <input
                    value={form.priceStart}
                    onChange={e => setForm({ ...form, priceStart: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">{L("اسم المطور","Developer Name")}</label>
                  <input
                    value={form.developerName}
                    onChange={e => setForm({ ...form, developerName: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">{L("رقم الهاتف","Phone Number")}</label>
                  <input
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">{L("صورة المشروع","Project Image")}</label>
                <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-6 cursor-pointer hover:border-primary/40 transition-colors">
                  {isUploading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  ) : imagePreview ? (
                    <img src={imagePreview} alt="" className="h-20 rounded-lg object-cover" />
                  ) : (
                    <span className="flex items-center gap-2 text-gray-400 text-sm">
                      <UploadCloud className="h-5 w-5" />
                      {L("ارفع صورة","Upload image")}
                    </span>
                  )}
                  <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
                </label>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-xl font-display font-bold hover:bg-primary/90 transition-colors shadow-sm"
              >
                {L("إرسال للمراجعة","Submit for Review")}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
