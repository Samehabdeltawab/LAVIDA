import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Layers, Coins, MessageCircle, ChevronDown } from "lucide-react";
import { BuyerRequirement, PropertyUnit } from "../types";
import { matchProperties } from "../utils/matchingEngine";
import { useLang } from "../LangContext";
import { t } from "../i18n";
import { trackWhatsAppClicked } from "../utils/analytics";

interface MatchResultsProps {
  requirement: BuyerRequirement;
}

const WA_NUMBER = "201003306688";

const TYPE_LABELS: Record<PropertyUnit["type"], { ar: string; en: string }> = {
  "سكني": { ar: "سكني", en: "Residential" },
  "فندقي": { ar: "فندقي", en: "Hotel" },
  "تجاري": { ar: "تجاري", en: "Commercial" },
  "إداري": { ar: "إداري", en: "Administrative" },
  "طبي": { ar: "طبي", en: "Medical" },
  "ساحلي": { ar: "ساحلي", en: "Coastal" },
};

export default function MatchResults({ requirement }: MatchResultsProps) {
  const { lang } = useLang();
  const [units, setUnits] = useState<PropertyUnit[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("lavida_units_list");
    if (saved) {
      try {
        setUnits(JSON.parse(saved));
      } catch {
        /* ignore */
      }
    }
  }, []);

  const matches = matchProperties(requirement, units);

  const handleTalkToAdvisor = (unit: PropertyUnit) => {
    const parts = [
      t(lang, "match_talk_advisor"),
      ``,
      `${t(lang, "match_project_label")}: ${unit.projectName}`,
      `${t(lang, "match_location_label")}: ${unit.address}`,
      `${t(lang, "match_price_label")}: ${unit.totalPrice}`,
      ``,
      `${t(lang, "contact_wa_name")}: ${requirement.fullName}`,
      `${t(lang, "contact_wa_phone")}: ${requirement.phone}`,
    ];
    const waText = encodeURIComponent(parts.join("\n"));
    trackWhatsAppClicked({ source: "match_results", project: unit.projectName });
    window.open(`https://wa.me/${WA_NUMBER}?text=${waText}`, "_blank");
  };

  return (
    <div className={`space-y-5 ${lang === "ar" ? "text-right" : "text-left"}`}>
      <div className="space-y-1">
        <h4 className="font-display text-lg font-bold text-primary">{t(lang, "match_results_title")}</h4>
        <p className="text-xs font-sans text-on-surface/60">{t(lang, "match_results_subtitle")}</p>
      </div>

      {matches.length === 0 ? (
        <div className="bg-surface-container-low rounded-2xl p-6 text-center space-y-2">
          <p className="font-display text-sm font-bold text-on-surface">{t(lang, "match_no_results_title")}</p>
          <p className="text-xs font-sans text-on-surface/60">{t(lang, "match_no_results_desc")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map(({ unit, score }) => {
            const typeLabel = TYPE_LABELS[unit.type] ? TYPE_LABELS[unit.type][lang] : unit.type;
            const isExpanded = expandedId === unit.id;

            return (
              <motion.div
                key={unit.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/20"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h5 className="font-display text-base font-bold text-on-surface">{unit.projectName || unit.name}</h5>
                    <p className="text-xs font-sans text-on-surface/60 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> {unit.address || t(lang, "match_contact_for_details")}
                    </p>
                  </div>
                  <div className="shrink-0 bg-primary text-secondary-fixed rounded-xl px-3 py-1.5 text-center">
                    <div className="font-display text-sm font-extrabold leading-none">{score}%</div>
                    <div className="text-[9px] font-sans opacity-80">{t(lang, "match_score_label")}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs font-sans">
                  <div>
                    <div className="text-on-surface/50">{t(lang, "match_type_label")}</div>
                    <div className="font-semibold text-on-surface">{typeLabel}</div>
                  </div>
                  <div>
                    <div className="text-on-surface/50">{t(lang, "match_area_label")}</div>
                    <div className="font-semibold text-on-surface">{unit.area || t(lang, "match_contact_for_details")}</div>
                  </div>
                  <div>
                    <div className="text-on-surface/50">{t(lang, "match_price_label")}</div>
                    <div className="font-semibold text-on-surface flex items-center gap-1">
                      <Coins className="h-3 w-3" /> {unit.totalPrice || t(lang, "match_contact_for_details")}
                    </div>
                  </div>
                  <div>
                    <div className="text-on-surface/50">{t(lang, "match_downpayment_label")}</div>
                    <div className="font-semibold text-on-surface">{t(lang, "match_contact_for_details")}</div>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-outline-variant/20 text-xs font-sans">
                        <div>
                          <div className="text-on-surface/50">{t(lang, "match_paymentplan_label")}</div>
                          <div className="font-semibold text-on-surface">{t(lang, "match_contact_for_details")}</div>
                        </div>
                        <div>
                          <div className="text-on-surface/50">{t(lang, "match_delivery_label")}</div>
                          <div className="font-semibold text-on-surface flex items-center gap-1">
                            <Layers className="h-3 w-3" /> {t(lang, "match_contact_for_details")}
                          </div>
                        </div>
                        <div>
                          <div className="text-on-surface/50">{t(lang, "sell_form_bathrooms_label")}</div>
                          <div className="font-semibold text-on-surface">{unit.bathrooms || t(lang, "match_contact_for_details")}</div>
                        </div>
                        <div>
                          <div className="text-on-surface/50">{t(lang, "sell_form_finishing_label")}</div>
                          <div className="font-semibold text-on-surface">{unit.finishing || t(lang, "match_contact_for_details")}</div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : unit.id)}
                    className="flex items-center gap-1 text-xs font-sans font-semibold text-primary hover:text-secondary transition-colors"
                  >
                    {t(lang, "match_view_details")}
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTalkToAdvisor(unit)}
                    className="ms-auto flex items-center gap-1.5 bg-primary text-secondary-fixed hover:bg-primary/90 px-4 py-2 rounded-lg text-xs font-display font-bold shadow-sm transition-all"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    {t(lang, "match_talk_advisor")}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
