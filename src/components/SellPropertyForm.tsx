import { useState, useEffect, useRef, ChangeEvent } from "react";
import type { FormEvent, Key, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle2, Upload, Trash2, MessageCircle } from "lucide-react";
import {
  SellPropertyType,
  FinishingStatus,
  SellFurnishing,
  PropertyDeliveryStatus,
  OwnershipStatus,
  ContactMethod,
  SellPropertySubmission,
} from "../types";
import { useLang } from "../LangContext";
import { t, TranslationKey } from "../i18n";
import { saveSellPropertySubmission, uploadPropertyMedia, removePropertyPhoto } from "../utils/sellPropertyLeads";
import { trackSellerFormStarted, trackSellerFormCompleted, trackWhatsAppClicked } from "../utils/analytics";

interface SellPropertyFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const WA_NUMBER = "201003306688";
const RESIDENTIAL_TYPES: SellPropertyType[] = ["apartment", "villa", "townhouse", "chalet"];

const EGYPT_GOVERNORATES: { value: string; ar: string; en: string }[] = [
  { value: "cairo", ar: "القاهرة", en: "Cairo" },
  { value: "giza", ar: "الجيزة", en: "Giza" },
  { value: "alexandria", ar: "الإسكندرية", en: "Alexandria" },
  { value: "qalyubia", ar: "القليوبية", en: "Qalyubia" },
  { value: "dakahlia", ar: "الدقهلية", en: "Dakahlia" },
  { value: "sharqia", ar: "الشرقية", en: "Sharqia" },
  { value: "gharbia", ar: "الغربية", en: "Gharbia" },
  { value: "monufia", ar: "المنوفية", en: "Monufia" },
  { value: "beheira", ar: "البحيرة", en: "Beheira" },
  { value: "kafr_el_sheikh", ar: "كفر الشيخ", en: "Kafr El Sheikh" },
  { value: "damietta", ar: "دمياط", en: "Damietta" },
  { value: "port_said", ar: "بورسعيد", en: "Port Said" },
  { value: "ismailia", ar: "الإسماعيلية", en: "Ismailia" },
  { value: "suez", ar: "السويس", en: "Suez" },
  { value: "north_sinai", ar: "شمال سيناء", en: "North Sinai" },
  { value: "south_sinai", ar: "جنوب سيناء", en: "South Sinai" },
  { value: "beni_suef", ar: "بني سويف", en: "Beni Suef" },
  { value: "fayoum", ar: "الفيوم", en: "Fayoum" },
  { value: "minya", ar: "المنيا", en: "Minya" },
  { value: "assiut", ar: "أسيوط", en: "Assiut" },
  { value: "sohag", ar: "سوهاج", en: "Sohag" },
  { value: "qena", ar: "قنا", en: "Qena" },
  { value: "luxor", ar: "الأقصر", en: "Luxor" },
  { value: "aswan", ar: "أسوان", en: "Aswan" },
  { value: "red_sea", ar: "البحر الأحمر", en: "Red Sea" },
  { value: "new_valley", ar: "الوادي الجديد", en: "New Valley" },
  { value: "matrouh", ar: "مطروح", en: "Matrouh" },
];

export default function SellPropertyForm({ isOpen, onClose }: SellPropertyFormProps) {
  const { lang } = useLang();
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const hasTrackedStart = useRef(false);

  useEffect(() => {
    if (isOpen && !hasTrackedStart.current) {
      trackSellerFormStarted();
      hasTrackedStart.current = true;
    }
    if (!isOpen) {
      hasTrackedStart.current = false;
    }
  }, [isOpen]);


  // Section 1: Location
  const [governorate, setGovernorate] = useState("");
  const [district, setDistrict] = useState("");
  const [compound, setCompound] = useState("");
  const [address, setAddress] = useState("");

  // Section 2: Details
  const [propertyType, setPropertyType] = useState<SellPropertyType | null>(null);
  const [area, setArea] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [floor, setFloor] = useState("");
  const [finishing, setFinishing] = useState<FinishingStatus | null>(null);
  const [furnished, setFurnished] = useState<SellFurnishing | null>(null);

  // Section 3: Sales Info
  const [askingPrice, setAskingPrice] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [remainingInstallments, setRemainingInstallments] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState<PropertyDeliveryStatus | null>(null);
  const [ownershipStatus, setOwnershipStatus] = useState<OwnershipStatus | null>(null);

  // Section 4: Description
  const [description, setDescription] = useState("");

  // Section 5: Photos
  const [images, setImages] = useState<string[]>([]);

  // Section 6: Contact
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [email, setEmail] = useState("");
  const [contactMethod, setContactMethod] = useState<ContactMethod | null>(null);

  const typeOptions: { value: SellPropertyType; labelKey: TranslationKey }[] = [
    { value: "apartment", labelKey: "intake_type_apartment" },
    { value: "villa", labelKey: "intake_type_villa" },
    { value: "townhouse", labelKey: "intake_type_townhouse" },
    { value: "chalet", labelKey: "intake_type_chalet" },
    { value: "office", labelKey: "intake_type_office" },
    { value: "retail", labelKey: "intake_type_retail" },
    { value: "medical", labelKey: "intake_type_medical" },
    { value: "pharmacy", labelKey: "intake_type_pharmacy" },
    { value: "land", labelKey: "intake_type_land" },
  ];

  const finishingOptions: { value: FinishingStatus; labelKey: TranslationKey }[] = [
    { value: "fully_finished", labelKey: "sell_form_finishing_fully_finished" },
    { value: "semi_finished", labelKey: "sell_form_finishing_semi_finished" },
    { value: "core_shell", labelKey: "sell_form_finishing_core_shell" },
    { value: "super_lux", labelKey: "sell_form_finishing_super_lux" },
  ];

  const furnishedOptions: { value: SellFurnishing; labelKey: TranslationKey }[] = [
    { value: "furnished_with_ac", labelKey: "sell_form_furnished_with_ac" },
    { value: "furnished_without_ac", labelKey: "sell_form_furnished_without_ac" },
    { value: "unfurnished", labelKey: "sell_form_unfurnished" },
  ];

  const deliveryStatusOptions: { value: PropertyDeliveryStatus; labelKey: TranslationKey }[] = [
    { value: "delivered", labelKey: "sell_form_delivery_delivered" },
    { value: "under_construction", labelKey: "sell_form_delivery_under_construction" },
  ];

  const ownershipStatusOptions: { value: OwnershipStatus; labelKey: TranslationKey }[] = [
    { value: "registered", labelKey: "sell_form_ownership_registered" },
    { value: "contract_only", labelKey: "sell_form_ownership_contract_only" },
  ];

  const contactMethodOptions: { value: ContactMethod; labelKey: TranslationKey }[] = [
    { value: "phone", labelKey: "intake_contact_method_phone" },
    { value: "whatsapp", labelKey: "intake_contact_method_whatsapp" },
  ];

  const resetForm = () => {
    setSubmitted(false);
    setErrors({});
    setGovernorate("");
    setDistrict("");
    setCompound("");
    setAddress("");
    setPropertyType(null);
    setArea("");
    setBedrooms("");
    setBathrooms("");
    setFloor("");
    setFinishing(null);
    setFurnished(null);
    setAskingPrice("");
    setAmountPaid("");
    setRemainingInstallments("");
    setDeliveryStatus(null);
    setOwnershipStatus(null);
    setDescription("");
    setImages([]);
    setFullName("");
    setPhone("");
    setWhatsapp("");
    setSameAsPhone(true);
    setEmail("");
    setContactMethod(null);
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetForm, 300);
  };

  const handlePhotoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (!files.length) return;
    setIsUploading(true);
    const keys: string[] = [];
    for (const file of files) {
      const key = await uploadPropertyMedia(file);
      keys.push(key);
    }
    setImages((prev) => [...prev, ...keys]);
    setIsUploading(false);
    e.target.value = "";
  };

  const handleRemovePhoto = async (key: string) => {
    await removePropertyPhoto(key);
    setImages((prev) => prev.filter((k) => k !== key));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const req = t(lang, "sell_form_err_required");
    const invalidAmount = t(lang, "sell_form_err_invalid_amount");

    if (!governorate.trim()) newErrors.governorate = req;
    if (!compound.trim()) newErrors.compound = req;

    if (!propertyType) newErrors.propertyType = req;
    if (!area.trim() || isNaN(parseFloat(area))) newErrors.area = invalidAmount;
    if (propertyType !== "land") {
      if (!finishing) newErrors.finishing = req;
      if (!furnished) newErrors.furnished = req;
    }

    if (!askingPrice.trim() || isNaN(parseFloat(askingPrice))) newErrors.askingPrice = invalidAmount;
    if (!deliveryStatus) newErrors.deliveryStatus = req;
    if (!ownershipStatus) newErrors.ownershipStatus = req;

    const phoneRegex = /^01[0125][0-9]{8}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fullName.trim()) {
      newErrors.fullName = t(lang, "contact_err_name_required");
    } else if (fullName.trim().length < 3) {
      newErrors.fullName = t(lang, "contact_err_name_short");
    }

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

    if (!contactMethod) newErrors.contactMethod = t(lang, "intake_err_contact_method_required");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const submission: Omit<SellPropertySubmission, "id" | "date" | "status"> = {
      governorate: governorate.trim(),
      district: district.trim() || undefined,
      compound: compound.trim(),
      address: address.trim() || undefined,
      propertyType: propertyType as SellPropertyType,
      area,
      bedrooms: propertyType && RESIDENTIAL_TYPES.includes(propertyType) ? bedrooms : undefined,
      bathrooms: propertyType && RESIDENTIAL_TYPES.includes(propertyType) ? bathrooms : undefined,
      floor: floor || undefined,
      finishing: finishing || undefined,
      furnished: furnished || undefined,
      askingPrice,
      amountPaid: amountPaid || undefined,
      remainingInstallments: remainingInstallments || undefined,
      deliveryStatus: deliveryStatus as PropertyDeliveryStatus,
      ownershipStatus: ownershipStatus as OwnershipStatus,
      description: description.trim() || undefined,
      images,
      fullName: fullName.trim(),
      phone: phone.trim(),
      whatsapp: (sameAsPhone ? phone : whatsapp).trim(),
      email: email.trim(),
      contactMethod: contactMethod as ContactMethod,
    };

    await saveSellPropertySubmission(submission);
    trackSellerFormCompleted({ propertyType: submission.propertyType, governorate: submission.governorate });
    setSubmitted(true);
  };

  const handleTalkToAdvisor = () => {
    const parts = [
      t(lang, "sell_form_title"),
      ``,
      `${t(lang, "sell_form_governorate_label")}: ${governorate}`,
      `${t(lang, "sell_form_compound_label")}: ${compound}`,
      `${t(lang, "sell_form_asking_price_label")}: ${askingPrice}`,
      `${t(lang, "contact_wa_name")}: ${fullName}`,
      `${t(lang, "contact_wa_phone")}: ${phone}`,
    ];
    const waText = encodeURIComponent(parts.join("\n"));
    trackWhatsAppClicked({ source: "sell_property_form" });
    window.open(`https://wa.me/${WA_NUMBER}?text=${waText}`, "_blank");
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
                  {t(lang, "sell_form_title")}
                </h3>
                <p className="text-sm font-sans text-on-surface/70">{t(lang, "sell_form_subtitle")}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                {/* SECTION 1: LOCATION */}
                <section>
                  <SectionTitle>{t(lang, "sell_form_section_location")}</SectionTitle>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-display text-sm font-bold text-on-surface mb-2">
                        {t(lang, "sell_form_governorate_label")}
                      </label>
                      <select
                        value={governorate}
                        onChange={(e) => setGovernorate(e.target.value)}
                        className={inputClass(!!errors.governorate)}
                      >
                        <option value="">{t(lang, "sell_form_governorate_placeholder")}</option>
                        {EGYPT_GOVERNORATES.map((gov) => (
                          <option key={gov.value} value={gov.value}>
                            {lang === "ar" ? gov.ar : gov.en}
                          </option>
                        ))}
                      </select>
                      {errors.governorate && <p className="text-red-500 text-xs font-sans mt-1.5 font-semibold">{errors.governorate}</p>}
                    </div>
                    <div>
                      <label className="block font-display text-sm font-bold text-on-surface mb-2">
                        {t(lang, "sell_form_district_label")}
                      </label>
                      <input
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className={inputClass()}
                      />
                    </div>
                    <div>
                      <label className="block font-display text-sm font-bold text-on-surface mb-2">
                        {t(lang, "sell_form_compound_label")}
                      </label>
                      <input
                        type="text"
                        value={compound}
                        onChange={(e) => setCompound(e.target.value)}
                        className={inputClass(!!errors.compound)}
                      />
                      {errors.compound && <p className="text-red-500 text-xs font-sans mt-1.5 font-semibold">{errors.compound}</p>}
                    </div>
                    <div>
                      <label className="block font-display text-sm font-bold text-on-surface mb-2">
                        {t(lang, "sell_form_address_label")}
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className={inputClass()}
                      />
                    </div>
                  </div>
                </section>

                {/* SECTION 2: PROPERTY DETAILS */}
                <section>
                  <SectionTitle>{t(lang, "sell_form_section_details")}</SectionTitle>
                  <div className="space-y-4">
                    <div>
                      <label className="block font-display text-sm font-bold text-on-surface mb-2">
                        {t(lang, "sell_form_property_type_label")}
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {typeOptions.map((opt) => (
                          <OptionButton
                            key={opt.value}
                            selected={propertyType === opt.value}
                            label={t(lang, opt.labelKey)}
                            onClick={() => setPropertyType(opt.value)}
                          />
                        ))}
                      </div>
                      {errors.propertyType && <p className="text-red-500 text-xs font-sans mt-1.5 font-semibold">{errors.propertyType}</p>}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="block font-display text-sm font-bold text-on-surface mb-2">
                          {t(lang, "sell_form_area_label")}
                        </label>
                        <input type="number" value={area} onChange={(e) => setArea(e.target.value)} className={inputClass(!!errors.area)} />
                        {errors.area && <p className="text-red-500 text-xs font-sans mt-1.5 font-semibold">{errors.area}</p>}
                      </div>
                      {propertyType && RESIDENTIAL_TYPES.includes(propertyType) && (
                        <>
                          <div>
                            <label className="block font-display text-sm font-bold text-on-surface mb-2">
                              {t(lang, "sell_form_bedrooms_label")}
                            </label>
                            <input type="number" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className={inputClass()} />
                          </div>
                          <div>
                            <label className="block font-display text-sm font-bold text-on-surface mb-2">
                              {t(lang, "sell_form_bathrooms_label")}
                            </label>
                            <input type="number" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} className={inputClass()} />
                          </div>
                        </>
                      )}
                      <div>
                        <label className="block font-display text-sm font-bold text-on-surface mb-2">
                          {t(lang, "sell_form_floor_label")}
                        </label>
                        <input type="text" value={floor} onChange={(e) => setFloor(e.target.value)} className={inputClass()} />
                      </div>
                    </div>

                    {propertyType !== "land" && (
                      <>
                        <div>
                          <label className="block font-display text-sm font-bold text-on-surface mb-2">
                            {t(lang, "sell_form_finishing_label")}
                          </label>
                          <div className="grid grid-cols-2 gap-2.5">
                            {finishingOptions.map((opt) => (
                              <OptionButton
                                key={opt.value}
                                selected={finishing === opt.value}
                                label={t(lang, opt.labelKey)}
                                onClick={() => setFinishing(opt.value)}
                              />
                            ))}
                          </div>
                          {errors.finishing && <p className="text-red-500 text-xs font-sans mt-1.5 font-semibold">{errors.finishing}</p>}
                        </div>

                        <div>
                          <label className="block font-display text-sm font-bold text-on-surface mb-2">
                            {t(lang, "sell_form_furnished_label")}
                          </label>
                          <div className="grid grid-cols-3 gap-2.5">
                            {furnishedOptions.map((opt) => (
                              <OptionButton
                                key={opt.value}
                                selected={furnished === opt.value}
                                label={t(lang, opt.labelKey)}
                                onClick={() => setFurnished(opt.value)}
                              />
                            ))}
                          </div>
                          {errors.furnished && <p className="text-red-500 text-xs font-sans mt-1.5 font-semibold">{errors.furnished}</p>}
                        </div>
                      </>
                    )}
                  </div>
                </section>

                {/* SECTION 3: SALES INFORMATION */}
                <section>
                  <SectionTitle>{t(lang, "sell_form_section_sales")}</SectionTitle>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                      <div>
                        <label className="block font-display text-sm font-bold text-on-surface mb-2 min-h-[2.5em] sm:min-h-[2.5em]">
                          {t(lang, "sell_form_asking_price_label")}
                        </label>
                        <input type="number" value={askingPrice} onChange={(e) => setAskingPrice(e.target.value)} className={inputClass(!!errors.askingPrice)} />
                        {errors.askingPrice && <p className="text-red-500 text-xs font-sans mt-1.5 font-semibold">{errors.askingPrice}</p>}
                      </div>
                      <div>
                        <label className="block font-display text-sm font-bold text-on-surface mb-2 min-h-[2.5em] sm:min-h-[2.5em]">
                          {t(lang, "sell_form_amount_paid_label")}
                        </label>
                        <input type="number" value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} className={inputClass()} />
                      </div>
                      <div>
                        <label className="block font-display text-sm font-bold text-on-surface mb-2 min-h-[2.5em] sm:min-h-[2.5em]">
                          {t(lang, "sell_form_remaining_installments_label")}
                        </label>
                        <input type="number" value={remainingInstallments} onChange={(e) => setRemainingInstallments(e.target.value)} className={inputClass()} />
                      </div>
                    </div>

                    <div>
                      <label className="block font-display text-sm font-bold text-on-surface mb-2">
                        {t(lang, "sell_form_delivery_status_label")}
                      </label>
                      <div className="grid grid-cols-3 gap-2.5">
                        {deliveryStatusOptions.map((opt) => (
                          <OptionButton
                            key={opt.value}
                            selected={deliveryStatus === opt.value}
                            label={t(lang, opt.labelKey)}
                            onClick={() => setDeliveryStatus(opt.value)}
                          />
                        ))}
                      </div>
                      {errors.deliveryStatus && <p className="text-red-500 text-xs font-sans mt-1.5 font-semibold">{errors.deliveryStatus}</p>}
                    </div>

                    <div>
                      <label className="block font-display text-sm font-bold text-on-surface mb-2">
                        {t(lang, "sell_form_ownership_status_label")}
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {ownershipStatusOptions.map((opt) => (
                          <OptionButton
                            key={opt.value}
                            selected={ownershipStatus === opt.value}
                            label={t(lang, opt.labelKey)}
                            onClick={() => setOwnershipStatus(opt.value)}
                          />
                        ))}
                      </div>
                      {errors.ownershipStatus && <p className="text-red-500 text-xs font-sans mt-1.5 font-semibold">{errors.ownershipStatus}</p>}
                    </div>
                  </div>
                </section>

                {/* SECTION 4: DESCRIPTION */}
                <section>
                  <SectionTitle>{t(lang, "sell_form_section_description")}</SectionTitle>
                  <div>
                    <label className="block font-display text-sm font-bold text-on-surface mb-2">
                      {t(lang, "sell_form_description_label")}
                    </label>
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={t(lang, "sell_form_description_placeholder")}
                      className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 font-sans text-sm text-on-surface focus:bg-white focus:border-secondary focus:ring-0 outline-none transition-all resize-none"
                    />
                  </div>
                </section>

                {/* SECTION 5: PHOTOS */}
                <section>
                  <SectionTitle>{t(lang, "sell_form_section_photos")}</SectionTitle>
                  <p className="text-xs font-sans text-on-surface/60 mb-3">{t(lang, "sell_form_photos_hint")}</p>

                  <div className="flex flex-wrap gap-3 mb-3">
                    {images.map((key) => (
                      <div key={key} className="relative w-20 h-20 rounded-lg overflow-hidden border border-outline-variant/30 bg-surface-container-low flex items-center justify-center">
                        <span className="text-[10px] text-on-surface/40 font-sans px-1 text-center">IMG</span>
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(key)}
                          className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          aria-label="Remove"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <label className="inline-flex items-center gap-2 cursor-pointer border border-dashed border-outline-variant/50 hover:border-primary/50 rounded-xl px-4 py-3 text-sm font-sans font-semibold text-on-surface/70 transition-colors">
                    <Upload className="h-4 w-4" />
                    <span>{isUploading ? t(lang, "sell_form_photos_uploading") : t(lang, "sell_form_photos_upload")}</span>
                    <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={handlePhotoUpload} disabled={isUploading} />
                  </label>
                </section>

                {/* SECTION 6: OWNER CONTACT */}
                <section>
                  <SectionTitle>{t(lang, "sell_form_section_contact")}</SectionTitle>
                  <div className="space-y-4">
                    <div>
                      <label className="block font-display text-sm font-bold text-on-surface mb-2">
                        {t(lang, "contact_name_label")}
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={t(lang, "contact_name_placeholder")}
                        className={inputClass(!!errors.fullName)}
                      />
                      {errors.fullName && <p className="text-red-500 text-xs font-sans mt-1.5 font-semibold">{errors.fullName}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-display text-sm font-bold text-on-surface mb-2">
                          {t(lang, "contact_phone_label")}
                        </label>
                        <input
                          type="tel"
                          dir="ltr"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="01XXXXXXXXX"
                          className={inputClass(!!errors.phone)}
                        />
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
                          <input
                            type="checkbox"
                            checked={sameAsPhone}
                            onChange={(e) => setSameAsPhone(e.target.checked)}
                          />
                          {t(lang, "sell_form_whatsapp_same_as_phone")}
                        </label>
                        {errors.whatsapp && <p className="text-red-500 text-xs font-sans mt-1.5 font-semibold">{errors.whatsapp}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block font-display text-sm font-bold text-on-surface mb-2">
                        {t(lang, "intake_email_label")}
                      </label>
                      <input
                        type="email"
                        dir="ltr"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t(lang, "intake_email_placeholder")}
                        className={inputClass(!!errors.email)}
                      />
                      {errors.email && <p className="text-red-500 text-xs font-sans mt-1.5 font-semibold">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block font-display text-sm font-bold text-on-surface mb-2">
                        {t(lang, "intake_contact_method_label")}
                      </label>
                      <div className="grid grid-cols-3 gap-2.5">
                        {contactMethodOptions.map((opt) => (
                          <OptionButton
                            key={opt.value}
                            selected={contactMethod === opt.value}
                            label={t(lang, opt.labelKey)}
                            onClick={() => setContactMethod(opt.value)}
                          />
                        ))}
                      </div>
                      {errors.contactMethod && <p className="text-red-500 text-xs font-sans mt-1.5 font-semibold">{errors.contactMethod}</p>}
                    </div>
                  </div>
                </section>

                <button
                  type="submit"
                  className="w-full bg-primary text-secondary-fixed hover:bg-primary/90 font-display text-base font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {t(lang, "sell_form_submit")}
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
                {t(lang, "sell_form_thankyou_title")}
              </h3>
              <p className="font-sans text-sm text-on-surface/70 max-w-md mx-auto">
                {t(lang, "sell_form_thankyou_desc")}
              </p>

              <button
                type="button"
                onClick={handleTalkToAdvisor}
                className="w-full flex items-center justify-center gap-2 bg-primary text-secondary-fixed hover:bg-primary/90 px-6 py-4 rounded-xl font-display text-base font-bold shadow-lg transition-all"
              >
                <MessageCircle className="h-5 w-5" />
                {t(lang, "intake_advisor_cta")}
              </button>

              <div className="flex items-center justify-center gap-6 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-sm font-sans font-semibold text-on-surface/60 hover:text-on-surface transition-colors"
                >
                  {t(lang, "sell_form_new_submission")}
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
