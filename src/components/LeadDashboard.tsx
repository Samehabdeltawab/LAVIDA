import { useState } from "react";
import { motion } from "motion/react";
import { Search, Phone, Trash2, Calendar, CheckSquare, MessageSquare, ToggleLeft, RefreshCw, X, SlidersHorizontal } from "lucide-react";
import { LeadSubmission } from "../types";

interface LeadDashboardProps {
  leads: LeadSubmission[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: LeadSubmission["status"]) => void;
  onDeleteLead: (id: string) => void;
  onClearAll: () => void;
}

export default function LeadDashboard({ leads, isOpen, onClose, onUpdateStatus, onDeleteLead, onClearAll }: LeadDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  if (!isOpen) return null;

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      (lead.message && lead.message.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl z-50 border-r border-outline-variant/30 flex flex-col text-right h-screen">
      
      {/* Header */}
      <div className="bg-primary text-white p-6 flex flex-row-reverse justify-between items-center border-b border-white/10 shrink-0">
        <div className="flex flex-row-reverse items-center gap-3">
          <div className="p-2 bg-secondary rounded-lg">
            <CheckSquare className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold">بوابة إدارة الطلبات العقارية</h3>
            <p className="text-xs text-secondary-fixed font-sans">مراجعة بيانات العملاء المهتمين والمستثمرين</p>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white p-2.5 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          aria-label="إغلاق"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Control Panel */}
      <div className="p-6 border-b border-outline-variant/20 shrink-0 space-y-4 bg-surface-container-low font-sans">
        
        {/* Search bar & Filter bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-outline-variant/50 rounded-lg pl-3 pr-10 py-2.5 text-xs text-on-surface focus:border-secondary outline-none transition-colors"
              placeholder="ابحث بالاسم، رقم الهاتف أو الرسالة..."
            />
            <Search className="absolute right-3.5 top-3 h-4 w-4 text-on-surface-variant/70" />
          </div>

          {/* Filter Status */}
          <div className="flex flex-row-reverse items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-secondary shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-white border border-outline-variant/50 rounded-lg p-2.5 text-xs text-on-surface focus:border-secondary outline-none transition-colors"
            >
              <option value="all">كل الحالات ({leads.length})</option>
              <option value="new">طلبات جديدة ({leads.filter(l => l.status === "new").length})</option>
              <option value="contacted">تم التواصل ({leads.filter(l => l.status === "contacted").length})</option>
              <option value="completed">مكتملة ({leads.filter(l => l.status === "completed").length})</option>
            </select>
          </div>

        </div>

        {/* Clear buttons or stats */}
        <div className="flex flex-row justify-between items-center text-xs">
          <span className="text-on-surface-variant font-medium">
            عدد العثورات: {filteredLeads.length} طلب
          </span>
          {leads.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm("هل أنت متأكد من رغبتك في حذف كافة طلبات العملاء من هذا المتصفح؟")) {
                  onClearAll();
                }
              }}
              className="text-red-500 font-semibold hover:text-red-700 hover:underline transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>مسح كافة الطلبات</span>
            </button>
          )}
        </div>

      </div>

      {/* Main Listing Panel */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {filteredLeads.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center space-y-3 py-16">
            <div className="p-4 rounded-full bg-surface-container text-on-surface-variant/40">
              <MessageSquare className="h-10 w-10" />
            </div>
            <h4 className="font-display text-base font-bold text-primary">لا توجد طلبات عملاء</h4>
            <p className="font-sans text-xs text-on-surface-variant text-center max-w-xs leading-relaxed">
              لم نجد أي طلبات تتطابق مع البحث الحالي. قم بتسجيل طلب جديد في النموذج بالصفحة واختبر ظهورها هنا!
            </p>
          </div>
        ) : (
          filteredLeads.map((lead) => (
            <motion.div
              layout
              key={lead.id}
              className="bg-white border border-outline-variant/30 rounded-xl p-5 shadow-sm space-y-4 text-right"
            >
              {/* Header Box info */}
              <div className="flex flex-row-reverse justify-between items-start gap-4">
                <div>
                  <h4 className="font-display text-base font-semibold text-primary">
                    {lead.fullName}
                  </h4>
                  <div className="flex flex-row-reverse items-center gap-2 mt-1 text-xs text-on-surface-variant font-sans select-all">
                    <Phone className="h-3.5 w-3.5 text-secondary" />
                    <span dir="ltr">{lead.phone}</span>
                  </div>
                </div>

                {/* Status Pills dropdown wrapper */}
                <div className="flex flex-row-reverse items-center gap-2 font-sans text-xs">
                  <span className={`px-2.5 py-1 rounded-full font-semibold ${
                    lead.status === "new"
                      ? "bg-red-50 text-red-600 border border-red-200"
                      : lead.status === "contacted"
                      ? "bg-amber-50 text-amber-600 border border-amber-200"
                      : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                  }`}>
                    {lead.status === "new" ? "جديد" : lead.status === "contacted" ? "تم التواصل" : "مكتمل"}
                  </span>
                  
                  {/* Toggle controls */}
                  <select
                    value={lead.status}
                    onChange={(e) => onUpdateStatus(lead.id, e.target.value as LeadSubmission["status"])}
                    className="border border-outline-variant/30 rounded px-1.5 py-0.5 outline-none font-semibold text-[10px] text-on-surface-variant bg-surface"
                  >
                    <option value="new">جديد</option>
                    <option value="contacted">تم الاتصال</option>
                    <option value="completed">مكتمل</option>
                  </select>
                </div>
              </div>

              {/* Message Details */}
              {lead.message && (
                <div className="bg-surface p-3.5 rounded-lg border border-outline-variant/10 text-on-surface text-xs font-sans leading-relaxed text-right whitespace-pre-wrap">
                  {lead.message}
                </div>
              )}

              {/* Footer row */}
              <div className="flex flex-row justify-between items-center pt-2 border-t border-outline-variant/10 text-[10px] text-on-surface-variant/80 font-sans">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{new Date(lead.date).toLocaleDateString("ar-EG", {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "numeric",
                    month: "long"
                  })}</span>
                </div>

                <button
                  onClick={() => onDeleteLead(lead.id)}
                  className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors cursor-pointer"
                  title="حذف هذا الطلب"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

            </motion.div>
          ))
        )}
      </div>

    </div>
  );
}
