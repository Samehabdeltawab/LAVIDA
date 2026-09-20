export interface LeadSubmission {
  id: string;
  fullName: string;
  phone: string;
  message?: string;
  date: string;
  status: 'new' | 'contacted' | 'completed';
}

// ── Buyer Property Matching Intake ──────────────────────────────────────
export type BuyerPurpose = "residential" | "commercial" | "administrative" | "medical" | "coastal";

export type BuyerPropertyType =
  | "apartment"
  | "villa"
  | "townhouse"
  | "chalet"
  | "office"
  | "retail"
  | "medical"
  | "pharmacy"
  | "land"
  | "other";

export type DeliveryTimeline = "ready" | "1_year" | "2_years" | "3_years" | "flexible";

export type FurnishingPreference = "furnished" | "unfurnished" | "semi_furnished" | "no_preference";

export type ContactMethod = "phone" | "whatsapp" | "email";

export interface BuyerRequirement {
  id: string;
  date: string;
  status: "new" | "matched" | "contacted" | "closed";
  purpose: BuyerPurpose;
  propertyType: BuyerPropertyType;
  locations: string[];
  budgetMin: string;
  budgetMax: string;
  downPayment: string;
  monthlyPayment: string;
  delivery: DeliveryTimeline;
  bedrooms?: string;
  bathrooms?: string;
  area?: string;
  furnishing?: FurnishingPreference;
  fullName: string;
  phone: string;
  email: string;
  contactMethod: ContactMethod;
}

// ── Sell Your Property Lead Funnel ───────────────────────────────────────
export type SellPropertyType = BuyerPropertyType;

export type FinishingStatus = "fully_finished" | "semi_finished" | "core_shell" | "super_lux";

export type SellFurnishing = "furnished_with_ac" | "furnished_without_ac" | "unfurnished";

export type PropertyDeliveryStatus = "delivered" | "under_construction";

export type OwnershipStatus = "registered" | "contract_only";

export interface SellPropertySubmission {
  id: string;
  date: string;
  status: "new" | "reviewing" | "contacted" | "listed" | "rejected";

  // 1. Property Location
  governorate: string;
  district?: string;
  compound: string;
  address?: string;

  // 2. Property Details
  propertyType: SellPropertyType;
  area: string;
  bedrooms?: string;
  bathrooms?: string;
  floor?: string;
  finishing?: FinishingStatus;
  furnished?: SellFurnishing;

  // 3. Sales Information
  askingPrice: string;
  amountPaid?: string;
  remainingInstallments?: string;
  deliveryStatus: PropertyDeliveryStatus;
  ownershipStatus: OwnershipStatus;

  // 4. Description
  description?: string;

  // 5. Photos (IndexedDB blob keys, prefixed "idb:")
  images: string[];

  // 6. Owner Contact
  fullName: string;
  phone: string;
  whatsapp: string;
  email: string;
  contactMethod: ContactMethod;
}

// ── Developer Partnership Lead Form ──────────────────────────────────────
export type BusinessNeed =
  | "generate_leads"
  | "sell_inventory"
  | "resale_support"
  | "digital_marketing"
  | "sales_representation"
  | "other";

export interface DeveloperLead {
  id: string;
  date: string;
  status: "new" | "reviewing" | "contacted" | "partnered" | "rejected";

  // Company Information
  companyName: string;
  companyLogo: string;
  contactPerson: string;
  jobTitle: string;
  phone: string;
  email: string;
  whatsapp: string;
  website?: string;

  // Project Information
  projectName: string;
  location: string;
  propertyTypes: BuyerPropertyType[];
  unitsAvailable: string;
  startingPrice: string;
  paymentPlans?: string;
  deliveryTimeline: DeliveryTimeline;
  commissionInfo?: string;
  brochureRef?: string;

  // Business Need
  businessNeeds: BusinessNeed[];
  otherNeedDetails?: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  location: string;
  priceStart: string;
  details: string[];
  features: string[];
}

export interface Service {
  id: string;
  title: string;
  iconName: string;
  description: string;
  longDescription: string;
}

export interface PropertyUnit {
  id: string;
  name: string;
  type: 'سكني' | 'فندقي' | 'تجاري' | 'إداري' | 'طبي' | 'ساحلي';
  projectName: string;
  developerName: string;
  address: string;
  area: string;
  floor: string;
  totalPrice: string;
  pricePerMeter: string;
  rooms: string;
  bathrooms: string;
  finishing: 'تشطيب كامل' | 'نصف تشطيب' | 'بدون تشطيب' | 'سوبر لوكس';
  status: 'متاح' | 'محجوز' | 'مباع';
  images: string[];
  videoUrl: string;
  notes: string;
  addedDate: string;
}

// ── Property Matching Engine (Phase 5) ───────────────────────────────────
/**
 * One weighted criterion evaluated for a single buyer/unit pair.
 * `available` indicates whether the underlying data needed to evaluate this
 * criterion actually exists — if not, the criterion is excluded from the
 * score instead of being invented or penalized.
 */
export interface MatchCriterionResult {
  key:
    | "location"
    | "budget"
    | "downPayment"
    | "monthlyPayment"
    | "propertyType"
    | "bedrooms"
    | "delivery"
    | "purpose";
  available: boolean;
  matched: boolean;
  weight: number;
}

export interface PropertyMatch {
  unit: PropertyUnit;
  /** 0-100 compatibility score, based only on criteria with available data. */
  score: number;
  criteria: MatchCriterionResult[];
}
