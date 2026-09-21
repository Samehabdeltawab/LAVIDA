import { useState, useEffect, useRef } from "react";
import type { Key } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronRight, ChevronLeft, CheckCircle2, MessageCircle } from "lucide-react";
import {
  BuyerPurpose,
  BuyerPropertyType,
  DeliveryTimeline,
  FurnishingPreference,
  ContactMethod,
  BuyerRequirement,
} from "../types";
import { useLang } from "../LangContext";
import { t, TranslationKey } from "../i18n";
import { saveBuyerRequirement } from "../utils/buyerRequirements";
import { trackBuyerFormStarted, trackBuyerFormCompleted, trackWhatsAppClicked } from "../utils/analytics";
import { COUNTRY_CODES, DEFAULT_COUNTRY_ISO, getCountryByIso, buildFullPhone } from "../utils/countryCodes";
import MatchResults from "./MatchResults";

interface BuyerIntakeProps {
  isOpen: boolean;
  onClose: () => void;
}

const TOTAL_STEPS = 5;
const WA_NUMBER = "201003306688";

// Property types that warrant bedroom/bathroom questions
const RESIDENTIAL_TYPES: BuyerPropertyType[] = ["apartment", "villa", "townhouse", "chalet"];

export default function BuyerIntake({ isOpen, onClose }: BuyerIntakeProps) {
  const { lang } = useLang();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [savedRequirement, setSavedRequirement] = useState<BuyerRequirement | null>(null);
  const hasTrackedStart = useRef(false);

  useEffect(() => {
    if (isOpen && !hasTrackedStart.current) {
      trackBuyerFormStarted();
      hasTrackedStart.current = true;
    }
    if (!isOpen) {
      hasTrackedStart.current = false;
    }
  }, [isOpen]);


  // Form state
  const [purpose, setPurpose] = useState<BuyerPurpose | null>(null);
  const [propertyType, setPropertyType] = useState<BuyerPropertyType | null>(null);
  const [locations, setLocations] = useState<string[]>([]);
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState("");
  const [delivery, setDelivery] = useState<DeliveryTimeline | null>(null);
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [area, setArea] = useState("");
  const [furnishing, setFurnishing] = useState<FurnishingPreference | null>(null);
  const [fullName, setFullName] = useState("");
  const [countryIso, setCountryIso] = useState(DEFAULT_COUNTRY_ISO);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [contactMethod, setContactMethod] = useState<ContactMethod | null>(null);

  // Existing project locations (reused, not invented)
  const availableLocations = [
    t(lang, "project1_location"),
    t(lang, "project2_location"),
    t(lang, "project3_location"),
  ];

  const purposeOptions: { value: BuyerPurpose; labelKey: TranslationKey }[] = [
    { value: "residential", labelKey: "intake_purpose_residential" },
    { value: "commercial", labelKey: "intake_purpose_commercial" },
    { value: "administrative", labelKey: "intake_purpose_administrative" },
    { value: "medical", labelKey: "intake_purpose_medical" },
    { value: "coastal", labelKey: "intake_purpose_coastal" },
  ];

  const typeOptions: { value: BuyerPropertyType; labelKey: TranslationKey }[] = [
    { value: "apartment", labelKey: "intake_type_apartment" },
    { value: "villa", labelKey: "intake_type_villa" },
    { value: "townhouse", labelKey: "intake_type_townhouse" },
    { value: "chalet", labelKey: "intake_type_chalet" },
    { value: "office", labelKey: "intake_type_office" },
    { value: "retail", labelKey: "intake_type_retail" },
    { value: "medical", labelKey: "intake_type_medical" },
    { value: "pharmacy", labelKey: "intake_type_pharmacy" },
    { value: "other", labelKey: "intake_type_other" },
  ];

  // Restricts step 2 property-type choices to the ones relevant to the
  // purpose selected in step 1. "other" is always kept available as a
  // fallback for cases that don't fit any predefined category.
  const PURPOSE_TYPE_OPTIONS: Record<BuyerPurpose, BuyerPropertyType[]> = {
    residential: ["apartment", "villa", "townhouse"],
    commercial: ["retail"],
    administrative: ["office"],
    coastal: ["villa", "chalet"],
    medical: ["medical", "pharmacy"],
  };

  const filteredTypeOptions = purpose
    ? typeOptions.filter((opt) => PURPOSE_TYPE_OPTIONS[purpose].includes(opt.value) || opt.value === "other")
    : typeOptions;

  const deliveryOptions: { value: DeliveryTimeline; labelKey: TranslationKey }[] = [
    { value: "ready", labelKey: "intake_delivery_ready" },
    { value: "1_year", labelKey: "intake_delivery_1_year" },
    { value: "2_years", labelKey: "intake_delivery_2_years" },
    { value: "3_years", labelKey: "intake_delivery_3_years" },
    { value: "flexible", labelKey: "intake_delivery_flexible" },
  ];

  const furnishingOptions: { value: FurnishingPreference; labelKey: TranslationKey }[] = [
    { value: "furnished", labelKey: "intake_furnishing_furnished" },
    { value: "unfurnished", labelKey: "intake_furnishing_unfurnished" },
    { value: "semi_furnished", labelKey: "intake_furnishing_semi_furnished" },
    { value: "no_preference", labelKey: "intake_furnishing_no_preference" },
  ];

  const contactMethodOptions: { value: ContactMethod; labelKey: TranslationKey }[] = [
    { value: "phone", labelKey: "intake_contact_method_phone" },
    { value: "whatsapp", labelKey: "intake_contact_method_whatsapp" },
  ];

  const toggleLocation = (loc: string) => {
    setLocations((prev) => (prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]));
  };

  // Prevents numeric fields from holding a literal "0" value (e.g. typing
  // "0" alone), while still allowing the field to be cleared/empty.
  const sanitizeNumeric = (value: string) => (value === "0" ? "" : value);

  const resetForm = () => {
    setStep(1);
    setSubmitted(false);
    setErrors({});
    setSavedRequirement(null);
    setPurpose(null);
    setPropertyType(null);
    setLocations([]);
    setBudgetMin("");
    setBudgetMax("");
    setDownPayment("");
    setMonthlyPayment("");
    setDelivery(null);
    setBedrooms("");
    setBathrooms("");
    setArea("");
    setFurnishing(null);
    setFullName("");
    setCountryIso(DEFAULT_COUNTRY_ISO);
    setPhone("");
    setEmail("");
    setContactMethod(null);
  };

  const handleClose = () => {
    onClose();
    // Reset after the close animation finishes
    setTimeout(resetForm, 300);
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!purpose) {
        newErrors.purpose = t(lang, "intake_err_purpose_required");
      }
      if (!propertyType) {
        newErrors.propertyType = t(lang, "intake_err_type_required");
      }
    }

    if (step === 2 && locations.length === 0) {
      newErrors.locations = t(lang, "intake_err_location_required");
    }

    if (step === 3) {
      const min = parseFloat(budgetMin);
      const max = parseFloat(budgetMax);
      if (!budgetMin.trim() || isNaN(min)) {
        newErrors.budgetMin = t(lang, "intake_err_amount_required");
      } else if (min <= 0) {
        newErrors.budgetMin = t(lang, "intake_err_amount_positive");
      }
      if (!budgetMax.trim() || isNaN(max)) {
        newErrors.budgetMax = t(lang, "intake_err_amount_required");
      } else if (max <= 0) {
        newErrors.budgetMax = t(lang, "intake_err_amount_positive");
      }
      if (!newErrors.budgetMin && !newErrors.budgetMax && max < min) {
        newErrors.budgetMax = t(lang, "intake_err_budget_range");
      }

      const downPaymentValue = parseFloat(downPayment);
      if (!downPayment.trim() || isNaN(downPaymentValue)) {
        newErrors.downPayment = t(lang, "intake_err_amount_required");
      } else if (downPaymentValue <= 0) {
        newErrors.downPayment = t(lang, "intake_err_amount_positive");
      }

      const monthlyPaymentValue = parseFloat(monthlyPayment);
      if (!monthlyPayment.trim() || isNaN(monthlyPaymentValue)) {
        newErrors.monthlyPayment = t(lang, "intake_err_amount_required");
      } else if (monthlyPaymentValue <= 0) {
        newErrors.monthlyPayment = t(lang, "intake_err_amount_positive");
      }
    }

    if (step === 4) {
      if (!delivery) {
        newErrors.delivery = t(lang, "intake_err_delivery_required");
      }
      if (!area.trim() || isNaN(parseFloat(area))) {
        newErrors.area = t(lang, "intake_err_area_required");
      }
    }

    if (step === 5) {
      const selectedCountry = getCountryByIso(countryIso);
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!fullName.trim()) {
        newErrors.fullName = t(lang, "contact_err_name_required");
      } else if (fullName.trim().length < 3) {
        newErrors.fullName = t(lang, "contact_err_name_short");
      }

      if (!phone.trim()) {
        newErrors.phone = t(lang, "contact_err_phone_required");
      } else if (!selectedCountry.regex.test(phone.trim())) {
        newErrors.phone = t(lang, "contact_err_phone_invalid");
      }

      if (!email.trim()) {
        newErrors.email = t(lang, "intake_err_email_required");
      } else if (!emailRegex.test(email.trim())) {
        newErrors.email = t(lang, "intake_err_email_invalid");
      }

      if (!contactMethod) {
        newErrors.contactMethod = t(lang, "intake_err_contact_method_required");
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep()) return;

    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
      return;
    }

    // Final step validated — persist the requirement
    const requirement: Omit<BuyerRequirement, "id" | "date" | "status"> = {
      purpose: purpose as BuyerPurpose,
      propertyType: propertyType as BuyerPropertyType,
      locations,
      budgetMin,
      budgetMax,
      downPayment,
      monthlyPayment,
      delivery: delivery as DeliveryTimeline,
      bedrooms: RESIDENTIAL_TYPES.includes(propertyType as BuyerPropertyType) ? bedrooms : undefined,
      bathrooms: RESIDENTIAL_TYPES.includes(propertyType as BuyerPropertyType) ? bathrooms : undefined,
      area,
      furnishing: furnishing ?? undefined,
      fullName: fullName.trim(),
      phone: buildFullPhone(getCountryByIso(countryIso), phone),
      email: email.trim(),
      contactMethod: contactMethod as ContactMethod,
    };

    await saveBuyerRequirement(requirement);
    trackBuyerFormCompleted({ propertyType: requirement.propertyType, purpose: requirement.purpose });
    setSavedRequirement({
      ...requirement,
      id: "req_preview",
      date: new Date().toISOString(),
      status: "new",
    });
    setSubmitted(true);

    // Auto-notify via WhatsApp on new submission
    const notifyParts = [
      lang === "ar" ? "طلب شراء جديد" : "New Buyer Request",
      ``,
      `${t(lang, "contact_wa_name")}: ${requirement.fullName}`,
      `${t(lang, "contact_wa_phone")}: ${requirement.phone}`,
      `${t(lang, "intake_summary_budget")}: ${requirement.budgetMin} - ${requirement.budgetMax}`,
    ];
    const notifyText = encodeURIComponent(notifyParts.join("\n"));
    window.open(`https://wa.me/${WA_NUMBER}?text=${notifyText}`, "_blank");
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const handleTalkToAdvisor = () => {
    const purposeLabel = purpose ? t(lang, purposeOptions.find((o) => o.value === purpose)!.labelKey) : "";
    const typeLabel = propertyType ? t(lang, typeOptions.find((o) => o.value === propertyType)!.labelKey) : "";
    const deliveryLabel = delivery ? t(lang, deliveryOptions.find((o) => o.value === delivery)!.labelKey) : "";

    const parts = [
      t(lang, "intake_summary_title"),
      ``,
      `${t(lang, "intake_summary_purpose")}: ${purposeLabel}`,
      `${t(lang, "intake_summary_type")}: ${typeLabel}`,
      `${t(lang, "intake_summary_locations")}: ${locations.join(", ")}`,
      `${t(lang, "intake_summary_budget")}: ${budgetMin} - ${budgetMax}`,
      `${t(lang, "intake_summary_downpayment")}: ${downPayment}`,
      `${t(lang, "intake_summary_monthly")}: ${monthlyPayment}`,
      `${t(lang, "intake_summary_delivery")}: ${deliveryLabel}`,
      `${t(lang, "contact_wa_name")}: ${fullName}`,
      `${t(lang, "contact_wa_phone")}: ${buildFullPhone(getCountryByIso(countryIso), phone)}`,
    ];
    const waText = encodeURIComponent(parts.join("\n"));
    trackWhatsAppClicked({ source: "buyer_intake" });
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
    className,
  }: {
    selected: boolean;
    label: string;
    onClick: () => void;
    key?: Key;
    className?: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-3 rounded-xl border font-sans text-sm font-semibold transition-all text-center ${
        selected
          ? "bg-primary text-secondary-fixed border-primary shadow-md"
          : "bg-surface-container-low border-outline-variant/40 text-on-surface hover:border-primary/50"
      } ${className ?? ""}`}
    >
      {label}
    </button>
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
          className={`relative bg-surface w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-6 md:p-10 ${
            lang === "ar" ? "text-right" : "text-left"
          }`}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            aria-label={t(lang, "intake_close")}
            className={`absolute top-5 ${lang === "ar" ? "left-5" : "right-5"} p-2 rounded-full hover:bg-surface-container transition-colors text-on-surface/60`}
          >
            <X className="h-5 w-5" />
          </button>

          {!submitted ? (
            <>
              {/* Header + progress */}
              <div className="mb-8 space-y-3">
                <h3 className="font-display text-xl md:text-2xl font-bold text-primary pe-8">
                  {t(lang, "intake_title")}
                </h3>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary rounded-full transition-all duration-300"
                      style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-sans font-semibold text-on-surface/60 whitespace-nowrap">
                    {t(lang, "intake_step_prefix")} {step} {t(lang, "intake_step_of")} {TOTAL_STEPS}
                  </span>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: lang === "ar" ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: lang === "ar" ? 20 : -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5 min-h-[220px]"
                >
                  {/* STEP 1 — PURPOSE + PROPERTY TYPE (revealed inline once purpose is chosen) */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h4 className="font-display text-lg font-bold text-on-surface">{t(lang, "intake_step1_title")}</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {purposeOptions.map((opt, idx) => (
                            <OptionButton
                              key={opt.value}
                              selected={purpose === opt.value}
                              label={t(lang, opt.labelKey)}
                              onClick={() => {
                                setPurpose(opt.value);
                                setPropertyType(null);
                              }}
                              className={idx === purposeOptions.length - 1 && purposeOptions.length % 2 === 1 ? "col-span-2 mx-auto w-1/2" : undefined}
                            />
                          ))}
                        </div>
                        {errors.purpose && <p className="text-red-500 text-xs font-sans font-semibold">{errors.purpose}</p>}
                      </div>

                      {purpose && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          transition={{ duration: 0.25 }}
                          className="space-y-4 border-t border-outline-variant/30 pt-5"
                        >
                          <h4 className="font-display text-lg font-bold text-on-surface">{t(lang, "intake_step2_title")}</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {filteredTypeOptions.map((opt) => (
                              <OptionButton
                                key={opt.value}
                                selected={propertyType === opt.value}
                                label={t(lang, opt.labelKey)}
                                onClick={() => setPropertyType(opt.value)}
                              />
                            ))}
                          </div>
                          {errors.propertyType && <p className="text-red-500 text-xs font-sans font-semibold">{errors.propertyType}</p>}
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* STEP 2 — LOCATION */}
                  {step === 2 && (
                    <div className="space-y-4">
                      <h4 className="font-display text-lg font-bold text-on-surface">{t(lang, "intake_step3_title")}</h4>
                      <p className="text-xs font-sans text-on-surface/60">{t(lang, "intake_step3_subtitle")}</p>
                      <div className="grid grid-cols-1 gap-3">
                        {availableLocations.map((loc) => (
                          <OptionButton
                            key={loc}
                            selected={locations.includes(loc)}
                            label={loc}
                            onClick={() => toggleLocation(loc)}
                          />
                        ))}
                      </div>
                      {errors.locations && <p className="text-red-500 text-xs font-sans font-semibold">{errors.locations}</p>}
                    </div>
                  )}

                  {/* STEP 3 — FINANCIAL DETAILS (budget, down payment, monthly payment) */}
                  {step === 3 && (
                    <div className="space-y-4">
                      <h4 className="font-display text-lg font-bold text-on-surface">{t(lang, "intake_step_financial_title")}</h4>
                      <div>
                        <label className="block font-display text-sm font-bold text-on-surface mb-2">
                          {t(lang, "intake_budget_min_label")}
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={budgetMin}
                          onChange={(e) => setBudgetMin(sanitizeNumeric(e.target.value))}
                          className={inputClass(!!errors.budgetMin)}
                        />
                        {errors.budgetMin && <p className="text-red-500 text-xs font-sans mt-1.5 font-semibold">{errors.budgetMin}</p>}
                      </div>
                      <div>
                        <label className="block font-display text-sm font-bold text-on-surface mb-2">
                          {t(lang, "intake_budget_max_label")}
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={budgetMax}
                          onChange={(e) => setBudgetMax(sanitizeNumeric(e.target.value))}
                          className={inputClass(!!errors.budgetMax)}
                        />
                        {errors.budgetMax && <p className="text-red-500 text-xs font-sans mt-1.5 font-semibold">{errors.budgetMax}</p>}
                      </div>
                      <div>
                        <label className="block font-display text-sm font-bold text-on-surface mb-2">
                          {t(lang, "intake_downpayment_label")}
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={downPayment}
                          onChange={(e) => setDownPayment(sanitizeNumeric(e.target.value))}
                          className={inputClass(!!errors.downPayment)}
                        />
                        {errors.downPayment && <p className="text-red-500 text-xs font-sans mt-1.5 font-semibold">{errors.downPayment}</p>}
                      </div>
                      <div>
                        <label className="block font-display text-sm font-bold text-on-surface mb-2">
                          {t(lang, "intake_monthly_label")}
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={monthlyPayment}
                          onChange={(e) => setMonthlyPayment(sanitizeNumeric(e.target.value))}
                          className={inputClass(!!errors.monthlyPayment)}
                        />
                        {errors.monthlyPayment && <p className="text-red-500 text-xs font-sans mt-1.5 font-semibold">{errors.monthlyPayment}</p>}
                      </div>
                    </div>
                  )}

                  {/* STEP 4 — DELIVERY + PROPERTY REQUIREMENTS */}
                  {step === 4 && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h4 className="font-display text-lg font-bold text-on-surface">{t(lang, "intake_step7_title")}</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {deliveryOptions.map((opt, idx) => (
                            <OptionButton
                              key={opt.value}
                              selected={delivery === opt.value}
                              label={t(lang, opt.labelKey)}
                              onClick={() => setDelivery(opt.value)}
                              className={idx === deliveryOptions.length - 1 && deliveryOptions.length % 2 === 1 ? "col-span-2 mx-auto w-1/2" : undefined}
                            />
                          ))}
                        </div>
                        {errors.delivery && <p className="text-red-500 text-xs font-sans font-semibold">{errors.delivery}</p>}
                      </div>

                      <div className="space-y-4 border-t border-outline-variant/30 pt-5">
                        <h4 className="font-display text-lg font-bold text-on-surface">{t(lang, "intake_step8_title")}</h4>

                        {propertyType && RESIDENTIAL_TYPES.includes(propertyType) && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block font-display text-sm font-bold text-on-surface mb-2">
                                {t(lang, "intake_bedrooms_label")}
                              </label>
                              <input
                                type="number"
                                value={bedrooms}
                                onChange={(e) => setBedrooms(e.target.value)}
                                className={inputClass()}
                              />
                            </div>
                            <div>
                              <label className="block font-display text-sm font-bold text-on-surface mb-2">
                                {t(lang, "intake_bathrooms_label")}
                              </label>
                              <input
                                type="number"
                                value={bathrooms}
                                onChange={(e) => setBathrooms(e.target.value)}
                                className={inputClass()}
                              />
                            </div>
                          </div>
                        )}

                        <div>
                          <label className="block font-display text-sm font-bold text-on-surface mb-2">
                            {t(lang, "intake_area_label")}
                          </label>
                          <input
                            type="number"
                            value={area}
                            onChange={(e) => setArea(e.target.value)}
                            className={inputClass(!!errors.area)}
                          />
                          {errors.area && <p className="text-red-500 text-xs font-sans mt-1.5 font-semibold">{errors.area}</p>}
                        </div>

                        <div>
                          <label className="block font-display text-sm font-bold text-on-surface mb-2">
                            {t(lang, "intake_furnishing_label")}
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            {furnishingOptions.map((opt) => (
                              <OptionButton
                                key={opt.value}
                                selected={furnishing === opt.value}
                                label={t(lang, opt.labelKey)}
                                onClick={() => setFurnishing(opt.value)}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 5 — CONTACT INFO */}
                  {step === 5 && (
                    <div className="space-y-4">
                      <h4 className="font-display text-lg font-bold text-on-surface">{t(lang, "intake_step9_title")}</h4>
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
                      <div>
                        <label className="block font-display text-sm font-bold text-on-surface mb-2">
                          {t(lang, "contact_phone_label")}
                        </label>
                        <div className="flex gap-2" dir="ltr">
                          <select
                            value={countryIso}
                            onChange={(e) => setCountryIso(e.target.value)}
                            className="basis-[105px] grow-0 shrink-0 bg-surface-container-low border border-outline-variant/50 rounded-xl px-2 py-3 font-sans text-sm text-on-surface focus:bg-white focus:border-secondary focus:ring-0 outline-none transition-all"
                            aria-label={t(lang, "intake_country_code_label")}
                          >
                            {COUNTRY_CODES.map((c) => (
                              <option key={c.iso} value={c.iso}>
                                {c.flag} {c.dialCode}
                              </option>
                            ))}
                          </select>
                          <input
                            type="tel"
                            dir="ltr"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder={getCountryByIso(countryIso).example}
                            className={`${inputClass(!!errors.phone)} basis-0 grow min-w-0`}
                          />
                        </div>
                        {errors.phone && <p className="text-red-500 text-xs font-sans mt-1.5 font-semibold">{errors.phone}</p>}
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
                        <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
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
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between gap-3 mt-8">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={step === 1}
                  className={`flex items-center gap-1.5 px-5 py-3 rounded-xl font-display text-sm font-bold transition-all ${
                    step === 1
                      ? "opacity-0 pointer-events-none"
                      : "border border-outline-variant/40 text-on-surface hover:bg-surface-container"
                  }`}
                >
                  {lang === "ar" ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                  {t(lang, "intake_back")}
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-1.5 bg-primary text-secondary-fixed hover:bg-primary/90 px-6 py-3 rounded-xl font-display text-sm font-bold shadow-md transition-all"
                >
                  {step === TOTAL_STEPS ? t(lang, "intake_submit") : t(lang, "intake_next")}
                  {step < TOTAL_STEPS && (lang === "ar" ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
                </button>
              </div>
            </>
          ) : (
            /* FINAL — THANK YOU + SUMMARY */
            <div className="space-y-6 text-center">
              <div className="p-4 rounded-full bg-emerald-50 text-emerald-600 w-16 h-16 mx-auto flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="font-display text-xl md:text-2xl font-bold text-primary">
                {t(lang, "intake_thank_you_title")}
              </h3>

              <div className={`bg-surface-container-low rounded-2xl p-5 space-y-3 ${lang === "ar" ? "text-right" : "text-left"}`}>
                <h4 className="font-display text-sm font-bold text-on-surface/80 uppercase tracking-wide">
                  {t(lang, "intake_summary_title")}
                </h4>
                <dl className="text-sm font-sans space-y-2">
                  <div className="flex justify-between gap-4">
                    <dt className="text-on-surface/60">{t(lang, "intake_summary_purpose")}</dt>
                    <dd className="font-semibold">{purpose && t(lang, purposeOptions.find((o) => o.value === purpose)!.labelKey)}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-on-surface/60">{t(lang, "intake_summary_type")}</dt>
                    <dd className="font-semibold">{propertyType && t(lang, typeOptions.find((o) => o.value === propertyType)!.labelKey)}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-on-surface/60">{t(lang, "intake_summary_locations")}</dt>
                    <dd className="font-semibold">{locations.join(", ")}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-on-surface/60">{t(lang, "intake_summary_budget")}</dt>
                    <dd className="font-semibold" dir="ltr">{budgetMin} - {budgetMax}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-on-surface/60">{t(lang, "intake_summary_downpayment")}</dt>
                    <dd className="font-semibold" dir="ltr">{downPayment}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-on-surface/60">{t(lang, "intake_summary_monthly")}</dt>
                    <dd className="font-semibold" dir="ltr">{monthlyPayment}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-on-surface/60">{t(lang, "intake_summary_delivery")}</dt>
                    <dd className="font-semibold">{delivery && t(lang, deliveryOptions.find((o) => o.value === delivery)!.labelKey)}</dd>
                  </div>
                  {area && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-on-surface/60">{t(lang, "intake_summary_area")}</dt>
                      <dd className="font-semibold" dir="ltr">{area}</dd>
                    </div>
                  )}
                  <div className="flex justify-between gap-4 border-t border-outline-variant/30 pt-2 mt-2">
                    <dt className="text-on-surface/60">{t(lang, "intake_summary_name")}</dt>
                    <dd className="font-semibold">{fullName}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-on-surface/60">{t(lang, "intake_summary_phone")}</dt>
                    <dd className="font-semibold" dir="ltr">{buildFullPhone(getCountryByIso(countryIso), phone)}</dd>
                  </div>
                </dl>
              </div>

              {savedRequirement && <MatchResults requirement={savedRequirement} />}

              <button
                type="button"
                onClick={handleTalkToAdvisor}
                className="w-full flex items-center justify-center gap-2 bg-primary text-secondary-fixed hover:bg-primary/90 px-6 py-4 rounded-xl font-display text-base font-bold shadow-lg transition-all"
              >
                <MessageCircle className="h-5 w-5" />
                {t(lang, "intake_advisor_cta")}
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="text-sm font-sans font-semibold text-on-surface/60 hover:text-on-surface transition-colors"
              >
                {t(lang, "intake_close")}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
