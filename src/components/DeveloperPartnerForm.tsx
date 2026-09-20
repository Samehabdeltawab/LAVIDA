import { useState, useEffect, useRef, ChangeEvent } from "react";
import type { FormEvent, Key, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle2, Upload, Trash2 } from "lucide-react";
import { BuyerPropertyType, DeliveryTimeline, BusinessNeed, DeveloperLead } from "../types";
import { useLang } from "../LangContext";
import { t, TranslationKey } from "../i18n";
import { saveDeveloperLead, uploadBrochureFile, removeBrochureFile, uploadCompanyLogo, removeCompanyLogo } from "../utils/developerLeads";
import { trackDeveloperFormStarted, trackDeveloperFormCompleted } from "../utils/analytics";

interface DeveloperPartnerFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeveloperPartnerForm({ isOpen, onClose }: DeveloperPartnerFormProps) {
  const { lang } = useLang();
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const hasTrackedStart = useRef(false);

  useEffect(() => {
    if (isOpen && !hasTrackedStart.current) {
      trackDeveloperFormStarted();
      hasTrackedStart.current = true;
    }
    if (!isOpen) {
      hasTrackedStart.current = false;
    }
  }, [isOpen]);


  // Company Info
  const [companyName, setCompanyName] = useState("");
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [companyLogoPreview, setCompanyLogoPreview] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [contactPerson, setContactPerson] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [website, setWebsite] = useState("");

  // Project Info
  const [projectName, setProjectName] = useState("");
  const [location, setLocation] = useState("");
  const [propertyTypes, setPropertyTypes] = useState<BuyerPropertyType[]>([]);
  const [unitsAvailable, setUnitsAvailable] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [paymentPlans, setPaymentPlans] = useState("");
  const [deliveryTimeline, setDeliveryTimeline] = useState<DeliveryTimeline | null>(null);
  const [commissionInfo, setCommissionInfo] = useState("");
  const [brochureLink, setBrochureLink] = useState("");
  const [brochureRef, setBrochureRef] = useState<string | null>(null);

  // Business Need
  const [businessNeeds, setBusinessNeeds] = useState<BusinessNeed[]>([]);
  const [otherNeedDetails, setOtherNeedDetails] = useState("");

  const typeOptions: { value: BuyerPropertyType; labelKey: TranslationKey }[] = [
    { value: "apartment", labelKey: "intake_type_apartment" },
    { value: "villa", labelKey: "intake_type_villa" },
    { value: "townhouse", labelKey: "intake_type_townhouse" },
    { value: "chalet", labelKey: "intake_type_chalet" },
    { value: "office", labelKey: "intake_type_office" },
    { value: "retail", labelKey: "intake_type_retail" },
    { value: "medical", labelKey: "intake_type_medical" },
    { value: "other", labelKey: "intake_type_other" },
  ];

  const deliveryOptions: { value: DeliveryTimeline; labelKey: TranslationKey }[] = [
    { value: "ready", labelKey: "intake_delivery_ready" },
    { value: "1_year", labelKey: "intake_delivery_1_year" },
    { value: "2_years", labelKey: "intake_delivery_2_years" },
    { value: "3_years", labelKey: "intake_delivery_3_years" },
    { value: "flexible", labelKey: "intake_delivery_flexible" },
  ];

  const needOptions: { value: BusinessNeed; labelKey: TranslationKey }[] = [
    { value: "generate_leads", labelKey: "dev_need_generate_leads" },
    { value: "sell_inventory", labelKey: "dev_need_sell_inventory" },
    { value: "resale_support", labelKey: "dev_need_resale_support" },
    { value: "digital_marketing", labelKey: "dev_need_digital_marketing" },
    { value: "sales_representation", labelKey: "dev_need_sales_representation" },
    { value: "other", labelKey: "dev_need_other" },
  ];

  const togglePropertyType = (v: BuyerPropertyType) => {
    setPropertyTypes((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));
  };

  const toggleNeed = (v: BusinessNeed) => {
    setBusinessNeeds((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));
  };

  const resetForm = () => {
    setSubmitted(false);
    setErrors({});
    setCompanyName("");
    setContactPerson("");
    setJobTitle("");
    setPhone("");
    setEmail("");
    setWhatsapp("");
    setSameAsPhone(true);
    setWebsite("");
    setProjectName("");
    setLocation("");
    setPropertyTypes([]);
    setUnitsAvailable("");
    setStartingPrice("");
    setPaymentPlans("");
    setDeliveryTimeline(null);
    setCommissionInfo("");
    setBrochureLink("");
    setBrochureRef(null);
    setCompanyLogo(null);
    setCompanyLogoPreview(null);
    setBusinessNeeds([]);
    setOtherNeedDetails("");
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetForm, 300);
  };

  const handleLogoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingLogo(true);
    if (companyLogo) await removeCompanyLogo(companyLogo).catch(() => {});
    const key = await uploadCompanyLogo(file);
    setCompanyLogo(key);
    setCompanyLogoPreview(URL.createObjectURL(file));
    setIsUploadingLogo(false);
    if (errors.companyLogo) setErrors((prev) => { const { companyLogo: _, ...rest } = prev; return rest; });
    e.target.value = "";
  };

  const handleRemoveLogo = async () => {
    if (companyLogo) {
      await removeCompanyLogo(companyLogo);
      setCompanyLogo(null);
      setCompanyLogoPreview(null);
    }
  };

  const handleBrochureUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    if (brochureRef) await removeBrochureFile(brochureRef).catch(() => {});
    const key = await uploadBrochureFile(file);
    setBrochureRef(key);
    setIsUploading(false);
    e.target.value = "";
  };

  const handleRemoveBrochure = async () => {
    if (brochureRef) {
      await removeBrochureFile(brochureRef);
      setBrochureRef(null);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const req = t(lang, "sell_form_err_required");
    const invalidAmount = t(lang, "sell_form_err_invalid_amount");
    const phoneRegex = /^01[0125][0-9]{8}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!companyName.trim()) newErrors.companyName = req;
    if (!companyLogo) newErrors.companyLogo = lang === "ar" ? "شعار الشركة مطلوب" : "Company logo is required";
    if (!contactPerson.trim()) newErrors.contactPerson = req;
    if (!jobTitle.trim()) newErrors.jobTitle = req;

    if (!phone.trim()) {
      newErrors.phone = t(lang, "contact_err_phone_required");
    } else if (!phoneRegex.test(phone.trim())) {
      newErrors.phone = t(lang, "contact_err_phone_invalid");
    }

    const effectiveWhatsapp = sameAsPhone ? phone : whatsapp;
    if (!effectiveWhatsapp.trim()) {
      newErrors.whatsapp = t(lang, "contact_err_phone_required");
    } else if (!phoneRegex.test(effectiveWhatsapp.trim())) {
      newErrors.whatsapp = t(lang, "contact_err_phone_invalid");
    }

    if (!email.trim()) {
      newErrors.email = t(lang, "intake_err_email_required");
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = t(lang, "intake_err_email_invalid");
    }

    if (!projectName.trim()) newErrors.projectName = req;
    if (!location.trim()) newErrors.location = req;
    if (propertyTypes.length === 0) newErrors.propertyTypes = req;
    if (!unitsAvailable.trim() || isNaN(parseFloat(unitsAvailable))) newErrors.unitsAvailable = invalidAmount;
    if (!startingPrice.trim() || isNaN(parseFloat(startingPrice))) newErrors.startingPrice = invalidAmount;
    if (!deliveryTimeline) newErrors.deliveryTimeline = req;

    if (businessNeeds.length === 0) {
      newErrors.businessNeeds = t(lang, "dev_form_err_need_required");
    } else if (businessNeeds.includes("other") && !otherNeedDetails.trim()) {
      newErrors.otherNeedDetails = t(lang, "dev_form_err_other_need_required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const lead: Omit<DeveloperLead, "id" | "date" | "status"> = {
      companyName: companyName.trim(),
      companyLogo: companyLogo as string,
      contactPerson: contactPerson.trim(),
      jobTitle: jobTitle.trim(),
      phone: phone.trim(),
      email: email.trim(),
      whatsapp: (sameAsPhone ? phone : whatsapp).trim(),
      website: website.trim() || undefined,
      projectName: projectName.trim(),
      location: location.trim(),
      propertyTypes,
      unitsAvailable,
      startingPrice,
      paymentPlans: paymentPlans.trim() || undefined,
      deliveryTimeline: deliveryTimeline as DeliveryTimeline,
      commissionInfo: commissionInfo.trim() || undefined,
      brochureRef: brochureRef || (brochureLink.trim() ? brochureLink.trim() : undefined),
      businessNeeds,
      otherNeedDetails: businessNeeds.includes("other") ? otherNeedDetails.trim() : undefined,
    };

    await saveDeveloperLead(lead);
    trackDeveloperFormCompleted({ projectName: lead.projectName, companyName: lead.companyName });
    setSubmitted(true);
  };

  if (!isOpen) return null;

  const inputClass = (hasError?: boolean) =>
    `w-full bg-surface-container-low border rounded-xl px-4 py-3 font-sans text-sm text-on-surface focus:bg-white focus:border-secondary focus:ring-0 outline-none transition-all ${
      hasError ? "border-red-500" : "border-outline-variant/50"
    }`;

  const OptionButton = ({
    selected,
    label,
    onClick,
  }: {
    selected: boolean;
    label: string;
    onClick: () => void;
    key?: Key;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2.5 rounded-xl border font-sans text-sm font-semibold transition-all text-center ${
        selected
          ? "bg-primary text-secondary-fixed border-primary shadow-md"
          : "bg-surface-container-low border-outline-variant/40 text-on-surface hover:border-primary/50"
      }`}
    >
      {label}
    </button>
  );

  const SectionTitle = ({ children }: { children: ReactNode }) => (
    <h4 className="font-display text-base md:text-lg font-bold text-primary border-b border-outline-variant/20 pb-2 mb-4">
      {children}
    </h4>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          className={`relative bg-surface w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-6 md:p-10 ${
            lang === "ar" ? "text-right" : "text-left"
          }`}
        >
          <button
            type="button"
            onClick={handleClose}
            aria-label={t(lang, "intake_close")}
            className={`absolute top-5 ${lang === "ar" ? "left-5" : "right-5"} p-2 rounded-full hover:bg-surface-container transition-colors text-on-surface/60 z-10`}
          >
            <X className="h-5 w-5" />
          </button>

          {!submitted ? (
            <>
              <div className="mb-8 space-y-2 pe-8">
                <h3 className="font-display text-xl md:text-2xl font-bold text-primary">
                  {t(lang, "dev_form_headline")}
                </h3>
                <p className="text-sm font-sans text-on-surface/70">{t(lang, "dev_form_subtitle")}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                {/* COMPANY INFO */}
                <section>
                  <SectionTitle>{t(lang, "dev_form_section_company")}</SectionTitle>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-display text-sm font-bold text-on-surface mb-2">
                          {t(lang, "dev_form_company_name_label")}
                        </label>
                        <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className={inputClass(!!errors.companyName)} />
                        {errors.companyName && <p className="text-red-500 text-xs font-sans mt-1.5 font-semibold">{errors.companyName}</p>}
                      </div>
                      <div>
                        <label className="block font-display text-sm font-bold text-on-surface mb-2">
                          {lang === "ar" ? "شعار الشركة" : "Company Logo"} <span className="text-red-500">*</span>
                        </label>
                        {companyLogoPreview ? (
                          <div className="flex items-center gap-3">
                            <img src={companyLogoPreview} alt="logo" className="w-16 h-16 rounded-xl object-cover border border-outline-variant/40" />
                            <button
                              type="button"
                              onClick={handleRemoveLogo}
                              className="inline-flex items-center gap-2 border border-outline-variant/50 rounded-xl px-3 py-2 text-xs font-sans font-semibold text-on-surface/70 hover:border-red-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              {lang === "ar" ? "إزالة" : "Remove"}
                            </button>
                          </div>
                        ) : (
                          <label className={`inline-flex items-center gap-2 cursor-pointer border border-dashed rounded-xl px-4 py-3 text-sm font-sans font-semibold text-on-surface/70 transition-colors ${errors.companyLogo ? "border-red-400" : "border-outline-variant/50 hover:border-primary/50"}`}>
                            <Upload className="h-4 w-4" />
                            <span>{isUploadingLogo ? (lang === "ar" ? "جاري الرفع..." : "Uploading...") : (lang === "ar" ? "رفع شعار الشركة" : "Upload Company Logo")}</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={isUploadingLogo} />
                          </label>
                        )}
                        {errors.companyLogo && <p className="text-red-500 text-xs font-sans mt-1.5 font-semibold">{errors.companyLogo}</p>}
                      </div>
                      <div>
                        <label className="block font-display text-sm font-bold text-on-surface mb-2">
                          {t(lang, "dev_form_contact_person_label")}
                        </label>
                        <input type="text" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} className={inputClass(!!errors.contactPerson)} />
                        {errors.contactPerson && <p className="text-red-500 text-xs font-sans mt-1.5 font-semibold">{errors.contactPerson}</p>}
                      </div>
                      <div>
                        <label className="block font-display text-sm font-bold text-on-surface mb-2">
                          {t(lang, "dev_form_job_title_label")}
                        </label>
                        <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className={inputClass(!!errors.jobTitle)} />
                        {errors.jobTitle && <p className="text-red-500 text-xs font-sans mt-1.5 font-semibold">{errors.jobTitle}</p>}
                      </div>
                      <div>
                        <label className="block font-display text-sm font-bold text-on-surface mb-2">
                          {t(lang, "dev_form_website_label")}
                        </label>
                        <input type="text" dir="ltr" value={website} onChange={(e) => setWebsite(e.target.value)} className={inputClass()} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-display text-sm font-bold text-on-surface mb-2">
                          {t(lang, "contact_phone_label")}
                        </label>
                        <input type="tel" dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01XXXXXXXXX" className={inputClass(!!errors.phone)} />
                        {errors.phone && <p className="text-red-500 text-xs font-sans mt-1.5 font-semibold">{errors.phone}</p>}
                      </div>
                      <div>
                        <label className="block font-display text-sm font-bold text-on-surface mb-2">
                          {t(lang, "sell_form_whatsapp_label")}
                        </label>
                        <input
                          type="tel"
                          dir="ltr"
                          value={sameAsPhone ? phone : whatsapp}
                          onChange={(e) => setWhatsapp(e.target.value)}
                          disabled={sameAsPhone}
                          placeholder="01XXXXXXXXX"
                          className={`${inputClass(!!errors.whatsapp)} ${sameAsPhone ? "opacity-60" : ""}`}
                        />
                        <label className="flex items-center gap-2 mt-2 text-xs font-sans text-on-surface/60 cursor-pointer">
                          <input type="checkbox" checked={sameAsPhone} onChange={(e) => setSameAsPhone(e.target.checked)} />
                          {t(lang, "sell_form_whatsapp_same_as_phone")}
                        </label>
                        {errors.whatsapp && <p className="text-red-500 text-xs font-sans mt-1.5 font-semibold">{errors.whatsapp}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block font-display text-sm font-bold text-on-surface mb-2">
                        {t(lang, "intake_email_label")}
                      </label>
                      <input type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t(lang, "intake_email_placeholder")} className={inputClass(!!errors.email)} />
                      {errors.email && <p className="text-red-500 text-xs font-sans mt-1.5 font-semibold">{errors.email}</p>}
                    </div>
                  </div>
                </section>

                {/* PROJECT INFO */}
                <section>
                  <SectionTitle>{t(lang, "dev_form_section_project")}</SectionTitle>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-display text-sm font-bold text-on-surface mb-2">
                          {t(lang, "dev_form_project_name_label")}
                        </label>
                        <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} className={inputClass(!!errors.projectName)} />
                        {errors.projectName && <p className="text-red-500 text-xs font-sans mt-1.5 font-semibold">{errors.projectName}</p>}
                      </div>
                      <div>
                        <label className="block font-display text-sm font-bold text-on-surface mb-2">
                          {t(lang, "dev_form_location_label")}
                        </label>
                        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass(!!errors.location)} />
                        {errors.location && <p className="text-red-500 text-xs font-sans mt-1.5 font-semibold">{errors.location}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block font-display text-sm font-bold text-on-surface mb-2">
                        {t(lang, "dev_form_property_types_label")}
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {typeOptions.map((opt) => (
                          <OptionButton key={opt.value} selected={propertyTypes.includes(opt.value)} label={t(lang, opt.labelKey)} onClick={() => togglePropertyType(opt.value)} />
                        ))}
                      </div>
                      {errors.propertyTypes && <p className="text-red-500 text-xs font-sans mt-1.5 font-semibold">{errors.propertyTypes}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-display text-sm font-bold text-on-surface mb-2">
                          {t(lang, "dev_form_units_available_label")}
                        </label>
                        <input type="number" value={unitsAvailable} onChange={(e) => setUnitsAvailable(e.target.value)} className={inputClass(!!errors.unitsAvailable)} />
                        {errors.unitsAvailable && <p className="text-red-500 text-xs font-sans mt-1.5 font-semibold">{errors.unitsAvailable}</p>}
                      </div>
                      <div>
                        <label className="block font-display text-sm font-bold text-on-surface mb-2">
                          {t(lang, "dev_form_starting_price_label")}
                        </label>
                        <input type="number" value={startingPrice} onChange={(e) => setStartingPrice(e.target.value)} className={inputClass(!!errors.startingPrice)} />
                        {errors.startingPrice && <p className="text-red-500 text-xs font-sans mt-1.5 font-semibold">{errors.startingPrice}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block font-display text-sm font-bold text-on-surface mb-2">
                        {t(lang, "dev_form_payment_plans_label")}
                      </label>
                      <textarea rows={2} value={paymentPlans} onChange={(e) => setPaymentPlans(e.target.value)} className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 font-sans text-sm text-on-surface focus:bg-white focus:border-secondary focus:ring-0 outline-none transition-all resize-none" />
                    </div>

                    <div>
                      <label className="block font-display text-sm font-bold text-on-surface mb-2">
                        {t(lang, "dev_form_delivery_timeline_label")}
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                        {deliveryOptions.map((opt) => (
                          <OptionButton key={opt.value} selected={deliveryTimeline === opt.value} label={t(lang, opt.labelKey)} onClick={() => setDeliveryTimeline(opt.value)} />
                        ))}
                      </div>
                      {errors.deliveryTimeline && <p className="text-red-500 text-xs font-sans mt-1.5 font-semibold">{errors.deliveryTimeline}</p>}
                    </div>

                    <div>
                      <label className="block font-display text-sm font-bold text-on-surface mb-2">
                        {t(lang, "dev_form_commission_info_label")}
                      </label>
                      <textarea rows={2} value={commissionInfo} onChange={(e) => setCommissionInfo(e.target.value)} className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 font-sans text-sm text-on-surface focus:bg-white focus:border-secondary focus:ring-0 outline-none transition-all resize-none" />
                    </div>

                    <div>
                      <label className="block font-display text-sm font-bold text-on-surface mb-2">
                        {t(lang, "dev_form_brochure_label")}
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={brochureLink}
                        onChange={(e) => setBrochureLink(e.target.value)}
                        placeholder={t(lang, "dev_form_brochure_link_label")}
                        disabled={!!brochureRef}
                        className={`${inputClass()} mb-3 ${brochureRef ? "opacity-60" : ""}`}
                      />
                      {brochureRef ? (
                        <button
                          type="button"
                          onClick={handleRemoveBrochure}
                          className="inline-flex items-center gap-2 border border-outline-variant/50 rounded-xl px-4 py-2.5 text-sm font-sans font-semibold text-on-surface/70 hover:border-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                          {t(lang, "dev_form_brochure_remove")}
                        </button>
                      ) : (
                        <label className="inline-flex items-center gap-2 cursor-pointer border border-dashed border-outline-variant/50 hover:border-primary/50 rounded-xl px-4 py-3 text-sm font-sans font-semibold text-on-surface/70 transition-colors">
                          <Upload className="h-4 w-4" />
                          <span>{isUploading ? t(lang, "dev_form_brochure_uploading") : t(lang, "dev_form_brochure_upload")}</span>
                          <input type="file" accept=".pdf,.doc,.docx,image/*" className="hidden" onChange={handleBrochureUpload} disabled={isUploading} />
                        </label>
                      )}
                    </div>
                  </div>
                </section>

                {/* BUSINESS NEED */}
                <section>
                  <SectionTitle>{t(lang, "dev_form_section_need")}</SectionTitle>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {needOptions.map((opt) => (
                      <OptionButton key={opt.value} selected={businessNeeds.includes(opt.value)} label={t(lang, opt.labelKey)} onClick={() => toggleNeed(opt.value)} />
                    ))}
                  </div>
                  {errors.businessNeeds && <p className="text-red-500 text-xs font-sans mt-1.5 font-semibold">{errors.businessNeeds}</p>}

                  {businessNeeds.includes("other") && (
                    <div className="mt-4">
                      <label className="block font-display text-sm font-bold text-on-surface mb-2">
                        {t(lang, "dev_form_other_need_label")}
                      </label>
                      <input type="text" value={otherNeedDetails} onChange={(e) => setOtherNeedDetails(e.target.value)} className={inputClass(!!errors.otherNeedDetails)} />
                      {errors.otherNeedDetails && <p className="text-red-500 text-xs font-sans mt-1.5 font-semibold">{errors.otherNeedDetails}</p>}
                    </div>
                  )}
                </section>

                <button
                  type="submit"
                  className="w-full bg-primary text-secondary-fixed hover:bg-primary/90 font-display text-base font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {t(lang, "dev_form_submit")}
                </button>
              </form>
            </>
          ) : (
            /* THANK YOU SCREEN */
            <div className="space-y-6 text-center py-6">
              <div className="p-4 rounded-full bg-emerald-50 text-emerald-600 w-16 h-16 mx-auto flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="font-display text-xl md:text-2xl font-bold text-primary">
                {t(lang, "dev_form_thankyou_title")}
              </h3>
              <p className="font-sans text-sm text-on-surface/70 max-w-md mx-auto">
                {t(lang, "dev_form_thankyou_desc")}
              </p>

              <div className="flex items-center justify-center gap-6 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-sm font-sans font-semibold text-on-surface/60 hover:text-on-surface transition-colors"
                >
                  {t(lang, "dev_form_new_submission")}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-sm font-sans font-semibold text-on-surface/60 hover:text-on-surface transition-colors"
                >
                  {t(lang, "intake_close")}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
