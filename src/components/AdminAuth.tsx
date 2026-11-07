import { useState, FormEvent } from "react";
import { motion } from "motion/react";
import { Lock, Eye, EyeOff, X, Shield } from "lucide-react";
import { useLang } from "../LangContext";

interface AdminAuthProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ADMIN_HASH = "0fdd8611b130558d5bd9f19e7b34b5838afbfd283b86705b2bc62be7ba954e0f";

export default function AdminAuth({ isOpen, onClose, onSuccess }: AdminAuthProps) {
  const { lang } = useLang();
  const L = (ar: string, en: string) => lang === "ar" ? ar : en;

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    if (hashHex === ADMIN_HASH) {
      sessionStorage.setItem("lavida_admin_auth", "true");
      onSuccess();
      setPassword("");
      setError("");
    } else {
      setError(L("كلمة المرور غير صحيحة", "Incorrect password"));
      setPassword("");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0, x: shake ? [-8, 8, -6, 6, -4, 4, 0] : 0 }}
        transition={{ duration: shake ? 0.4 : 0.25 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm"
        dir={lang === "ar" ? "rtl" : "ltr"}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <h2 className="font-display text-xl font-bold text-primary">
              {L("بوابة الإدارة", "Admin Portal")}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          {L("أدخل كلمة المرور للوصول للوحة إدارة الوحدات العقارية", "Enter your password to access the property units manager")}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              placeholder={L("كلمة المرور", "Password")}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 pe-11 font-sans focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-xl font-display font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Lock className="h-4 w-4" />
            {L("دخول", "Sign In")}
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-4">
          {L("هذه الصفحة مخصصة لموظفي لاڤيدا بروبيرتز فقط", "This page is for Lavida Properties staff only")}
        </p>
      </motion.div>
    </div>
  );
}
