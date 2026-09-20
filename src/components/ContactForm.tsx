import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Phone, Mail, MapPin, Send, CheckCircle, Facebook, Instagram, Linkedin } from "lucide-react";
import { LeadSubmission } from "../types";
import { useLang } from "../LangContext";
import { t } from "../i18n";
import { trackContactFormSubmitted, trackWhatsAppClicked } from "../utils/analytics";

interface ContactFormProps {
  onLeadSubmit: (lead: Omit<LeadSubmission, "id" | "date" | "status">) => void;
}

export default function ContactForm({ onLeadSubmit }: ContactFormProps) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const { lang } = useLang();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) {
      newErrors.fullName = t(lang, "contact_err_name_required");
    } else if (fullName.trim().length < 3) {
      newErrors.fullName = t(lang, "contact_err_name_short");
    }

    const phoneRegex = /^01[0125][0-9]{8}$/;
    if (!phone.trim()) {
      newErrors.phone = t(lang, "contact_err_phone_required");
    } else if (!phoneRegex.test(phone.trim())) {
      newErrors.phone = t(lang, "contact_err_phone_invalid");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onLeadSubmit({
        fullName: fullName.trim(),
        phone: phone.trim(),
        message: message.trim() || undefined
      });

      // إرسال البيانات على واتساب لافيدا
      const waNumber = "201003306688";
      const msgParts = [
        t(lang, "contact_wa_greeting"),
        ``,
        `${t(lang, "contact_wa_name")}: ${fullName.trim()}`,
        `${t(lang, "contact_wa_phone")}: ${phone.trim()}`,
      ];
      if (message.trim()) {
        msgParts.push(`${t(lang, "contact_wa_message")}: ${message.trim()}`);
      }
      const waText = encodeURIComponent(msgParts.join("\n"));
      window.open(`https://wa.me/${waNumber}?text=${waText}`, "_blank");

      trackContactFormSubmitted();
      trackWhatsAppClicked({ source: "contact_form" });

      setIsSuccess(true);
      setFullName("");
      setPhone("");
      setMessage("");
      setErrors({});

      // Hide success notification after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    }
  };

  return (
    <section id="contact" className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl overflow-hidden shadow-card border border-outline-variant/30">
          
          <div className="grid grid-cols-1 md:grid-cols-5">
            
            {/* Left Side: Dark Info Panel (col-span-2) */}
            <div className={`md:col-span-2 bg-primary p-8 md:p-10 text-white flex flex-col justify-between ${lang === "ar" ? "text-right" : "text-left"}`}>
              
              <div className="space-y-3">
                <h3 className="font-display text-2xl md:text-3xl font-extrabold text-secondary-fixed">
                  {t(lang, "contact_title")}
                </h3>
                <p className="font-sans text-sm text-surface-variant/90 leading-relaxed">
                  {t(lang, "contact_subtitle")}
                </p>
              </div>

              {/* Contact Listing */}
              <ul className="space-y-5 my-8 font-sans">
                <li className="flex items-center gap-4 group">
                  <div className="p-2.5 rounded-lg bg-white/10 text-secondary-fixed group-hover:bg-secondary-fixed group-hover:text-primary transition-colors shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <a href="tel:+201003306688" className="text-sm font-semibold hover:text-secondary-fixed transition-colors" dir="ltr">
                    +20 100 330 6688
                  </a>
                </li>

                <li className="flex items-center gap-4 group">
                  <div className="p-2.5 rounded-lg bg-white/10 text-secondary-fixed group-hover:bg-secondary-fixed group-hover:text-primary transition-colors shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <a href="mailto:Lavidapropertieseg@gmail.com" className="text-sm font-semibold hover:text-secondary-fixed transition-colors break-all">
                    Lavidapropertieseg@gmail.com
                  </a>
                </li>

                <li className="flex items-center gap-4 group cursor-pointer" onClick={() => window.open("https://maps.app.goo.gl/E88bPCA9ywm7pepu6", "_blank")}>
                  <div className="p-2.5 rounded-lg bg-white/10 text-secondary-fixed group-hover:bg-secondary-fixed group-hover:text-primary transition-colors shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-semibold hover:text-secondary-fixed transition-colors">
                    {t(lang, "contact_address")}
                  </span>
                </li>
              </ul>

              {/* Social Media Icons - aligned to the right */}
              <div className="flex flex-row gap-3 justify-start mb-5">
                <a
                  href="https://www.facebook.com/lavidapropertieseg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-white/10 text-secondary-fixed hover:bg-secondary-fixed hover:text-primary transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://www.instagram.com/lavidapropertieseg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-white/10 text-secondary-fixed hover:bg-secondary-fixed hover:text-primary transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://www.linkedin.com/company/lavidapropertieseg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-white/10 text-secondary-fixed hover:bg-secondary-fixed hover:text-primary transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="https://wa.me/201003306688"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClicked({ source: "contact_social_icons" })}
                  className="p-2.5 rounded-lg bg-white/10 text-secondary-fixed hover:bg-secondary-fixed hover:text-primary transition-colors"
                  aria-label="WhatsApp"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
              </div>

              {/* Little Footer note */}
              <div className="text-[11px] text-surface-variant/70 border-t border-white/10 pt-4 font-sans text-center">
                {t(lang, "contact_hours")}
              </div>

            </div>

            {/* Right Side: Interactive Input Fields Form (col-span-3) */}
            <div className={`md:col-span-3 p-8 md:p-10 ${lang === "ar" ? "text-right" : "text-left"}`}>
              
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center space-y-4 py-12"
                  >
                    <div className="p-4 rounded-full bg-emerald-50 text-emerald-600">
                      <CheckCircle className="h-16 w-16" />
                    </div>
                    <h4 className="font-display text-2xl font-bold text-primary">
                      {t(lang, "contact_success_title")}
                    </h4>
                    <p className="font-sans text-sm text-on-surface-variant text-center max-w-sm">
                      {t(lang, "contact_success_desc")}
                    </p>
                    <button
                      onClick={() => setIsSuccess(false)}
                      className="mt-6 border border-primary/20 hover:bg-primary/5 text-primary px-5 py-2 rounded-lg font-display text-xs font-semibold transition-all cursor-pointer"
                    >
                      {t(lang, "contact_new_request")}
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Full Name field */}
                    <div>
                      <label className="block font-display text-sm font-bold text-on-surface mb-2">
                        {t(lang, "contact_name_label")}
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className={`w-full bg-surface-container-low border rounded-xl px-4 py-3 font-sans text-sm text-on-surface focus:bg-white focus:border-secondary focus:ring-0 outline-none transition-all ${
                          errors.fullName ? "border-red-500" : "border-outline-variant/50"
                        }`}
                        placeholder={t(lang, "contact_name_placeholder")}
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-xs font-sans mt-1.5 font-semibold">
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    {/* Phone Number Field */}
                    <div>
                      <label className="block font-display text-sm font-bold text-on-surface mb-2">
                        {t(lang, "contact_phone_label")}
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={`w-full bg-surface-container-low border rounded-xl px-4 py-3 font-sans text-sm text-on-surface focus:bg-white focus:border-secondary focus:ring-0 outline-none transition-all LTR`}
                        placeholder="01XXXXXXXXX"
                        dir="ltr"
                      />
                      {errors.phone ? (
                        <p className="text-red-500 text-xs font-sans mt-1.5 font-semibold">
                          {errors.phone}
                        </p>
                      ) : (
                        <p className="text-[11px] text-on-surface-variant/70 font-sans mt-1">
                          {t(lang, "contact_phone_hint")}
                        </p>
                      )}
                    </div>

                    {/* Message (Optional) */}
                    <div>
                      <label className="block font-display text-sm font-bold text-on-surface mb-2">
                        {t(lang, "contact_message_label")}
                      </label>
                      <textarea
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 font-sans text-sm text-on-surface focus:bg-white focus:border-secondary focus:ring-0 outline-none transition-all resize-none"
                        placeholder={t(lang, "contact_message_placeholder")}
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full bg-primary text-white hover:bg-secondary hover:text-white font-display text-base font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>{t(lang, "contact_submit")}</span>
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                )}
              </AnimatePresence>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
