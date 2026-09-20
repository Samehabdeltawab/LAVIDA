// Country dialing codes used for the phone number field in the buyer
// intake form. Each entry includes a validation regex for the *local*
// number (the part the user types after selecting the country), so the
// phone number entered can be validated according to the selected
// country's mobile number format.
//
// Kept intentionally focused on the markets Lavida Properties actively
// serves/targets (Egypt + GCC + a few common expat regions), rather than
// an exhaustive list of every country in the world.

export interface CountryCode {
  iso: string; // ISO 3166-1 alpha-2
  nameAr: string;
  nameEn: string;
  dialCode: string; // e.g. "+20"
  flag: string; // emoji flag
  /** Validates the local number as typed by the user (without the dial code). */
  regex: RegExp;
  /** Example placeholder shown to the user, in local format. */
  example: string;
}

export const COUNTRY_CODES: CountryCode[] = [
  { iso: "EG", nameAr: "مصر", nameEn: "Egypt", dialCode: "+20", flag: "🇪🇬", regex: /^01[0125][0-9]{8}$/, example: "01012345678" },
  { iso: "SA", nameAr: "السعودية", nameEn: "Saudi Arabia", dialCode: "+966", flag: "🇸🇦", regex: /^0?5[0-9]{8}$/, example: "0512345678" },
  { iso: "AE", nameAr: "الإمارات", nameEn: "UAE", dialCode: "+971", flag: "🇦🇪", regex: /^0?5[0-9]{8}$/, example: "0501234567" },
  { iso: "KW", nameAr: "الكويت", nameEn: "Kuwait", dialCode: "+965", flag: "🇰🇼", regex: /^[569][0-9]{7}$/, example: "50123456" },
  { iso: "QA", nameAr: "قطر", nameEn: "Qatar", dialCode: "+974", flag: "🇶🇦", regex: /^[3567][0-9]{7}$/, example: "33123456" },
  { iso: "BH", nameAr: "البحرين", nameEn: "Bahrain", dialCode: "+973", flag: "🇧🇭", regex: /^[36][0-9]{7}$/, example: "36123456" },
  { iso: "OM", nameAr: "عمان", nameEn: "Oman", dialCode: "+968", flag: "🇴🇲", regex: /^[79][0-9]{7}$/, example: "91234567" },
  { iso: "JO", nameAr: "الأردن", nameEn: "Jordan", dialCode: "+962", flag: "🇯🇴", regex: /^0?7[789][0-9]{7}$/, example: "0791234567" },
  { iso: "LB", nameAr: "لبنان", nameEn: "Lebanon", dialCode: "+961", flag: "🇱🇧", regex: /^(0?3|70|71|76|78|79|81)[0-9]{6}$/, example: "71123456" },
  { iso: "IQ", nameAr: "العراق", nameEn: "Iraq", dialCode: "+964", flag: "🇮🇶", regex: /^0?7[0-9]{9}$/, example: "07712345678" },
  { iso: "LY", nameAr: "ليبيا", nameEn: "Libya", dialCode: "+218", flag: "🇱🇾", regex: /^0?9[0-9]{8}$/, example: "0912345678" },
  { iso: "SD", nameAr: "السودان", nameEn: "Sudan", dialCode: "+249", flag: "🇸🇩", regex: /^0?9[0-9]{8}$/, example: "0912345678" },
  { iso: "GB", nameAr: "المملكة المتحدة", nameEn: "United Kingdom", dialCode: "+44", flag: "🇬🇧", regex: /^0?7[0-9]{9}$/, example: "07123456789" },
  { iso: "US", nameAr: "الولايات المتحدة", nameEn: "United States", dialCode: "+1", flag: "🇺🇸", regex: /^[2-9][0-9]{9}$/, example: "2015550123" },
];

export const DEFAULT_COUNTRY_ISO = "EG";

export function getCountryByIso(iso: string): CountryCode {
  return COUNTRY_CODES.find((c) => c.iso === iso) ?? COUNTRY_CODES[0];
}

/** Builds a full E.164-ish phone string (dial code + local number, leading zero stripped). */
export function buildFullPhone(country: CountryCode, localNumber: string): string {
  const trimmed = localNumber.trim().replace(/^0+/, "");
  return `${country.dialCode}${trimmed}`;
}
