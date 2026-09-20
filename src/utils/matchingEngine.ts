import { BuyerRequirement, PropertyUnit, PropertyMatch, MatchCriterionResult, BuyerPropertyType, BuyerPurpose } from "../types";

/**
 * Deterministic Property Matching Engine (Phase 5).
 *
 * This is intentionally simple and rule-based — no AI/ML involved yet.
 * It is kept isolated behind the `matchProperties` function so a smarter
 * (e.g. AI-powered) implementation can replace or wrap it later without
 * requiring changes to any calling component.
 *
 * Scoring rules:
 * - Each criterion has a fixed weight (see CRITERION_WEIGHTS).
 * - A criterion is only counted if the underlying data is actually
 *   available on both the buyer requirement and the property unit —
 *   missing data is never invented or guessed.
 * - The final score is: (sum of weights matched) / (sum of weights
 *   available) * 100, rounded to the nearest integer.
 * - Units with zero available/comparable criteria are excluded entirely,
 *   since no meaningful compatibility can be established.
 *
 * The resulting score is a relative compatibility indicator only and must
 * never be presented as a guarantee, valuation, or financial recommendation.
 */

const CRITERION_WEIGHTS: Record<MatchCriterionResult["key"], number> = {
  location: 25,
  budget: 25,
  propertyType: 15,
  bedrooms: 10,
  purpose: 5,
  delivery: 10,
  downPayment: 5,
  monthlyPayment: 5,
};

/** Maps a buyer's requested property type to compatible unit type categories. */
const PROPERTY_TYPE_MAP: Partial<Record<BuyerPropertyType, PropertyUnit["type"][]>> = {
  apartment: ["سكني"],
  villa: ["سكني"],
  townhouse: ["سكني"],
  chalet: ["ساحلي", "فندقي"],
  office: ["إداري"],
  retail: ["تجاري"],
  medical: ["طبي"],
  pharmacy: ["طبي"],
  // "other" intentionally omitted — cannot be reliably mapped, so this
  // criterion is treated as unavailable for that selection.
};

/** Maps a buyer's stated purpose to loosely compatible unit type categories. */
const PURPOSE_TYPE_MAP: Partial<Record<BuyerPurpose, PropertyUnit["type"][]>> = {
  residential: ["سكني"],
  commercial: ["تجاري"],
  administrative: ["إداري"],
  medical: ["طبي"],
  coastal: ["ساحلي", "فندقي"],
};

/** Extracts the first numeric value from a free-text string, or null if none. */
export function parseNumeric(value: string | undefined | null): number | null {
  if (!value) return null;
  const cleaned = value.replace(/[^\d.]/g, "");
  if (!cleaned) return null;
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

/** Normalizes text for loose comparison (case-insensitive, trimmed). */
function normalize(value: string): string {
  return value.trim().toLowerCase();
}

/** Tokenizes a string into comparable words (Arabic + Latin safe). */
function tokenize(value: string): string[] {
  return normalize(value)
    .split(/[^\p{L}\p{N}]+/u)
    .filter((t) => t.length >= 3);
}

export function evaluateLocation(
  buyerLocations: string[],
  unitAddress: string
): MatchCriterionResult {
  const available = buyerLocations.length > 0 && !!unitAddress?.trim();
  if (!available) {
    return { key: "location", available: false, matched: false, weight: CRITERION_WEIGHTS.location };
  }
  const addressTokens = tokenize(unitAddress);
  const matched = buyerLocations.some((loc) =>
    tokenize(loc).some((locToken) => addressTokens.some((addrToken) => addrToken.includes(locToken) || locToken.includes(addrToken)))
  );
  return { key: "location", available: true, matched, weight: CRITERION_WEIGHTS.location };
}

export function evaluateBudget(
  budgetMin: string,
  budgetMax: string,
  unitTotalPrice: string
): MatchCriterionResult {
  const min = parseNumeric(budgetMin);
  const max = parseNumeric(budgetMax);
  const price = parseNumeric(unitTotalPrice);
  const available = min !== null && max !== null && price !== null;
  if (!available) {
    return { key: "budget", available: false, matched: false, weight: CRITERION_WEIGHTS.budget };
  }
  const matched = price! >= min! && price! <= max!;
  return { key: "budget", available: true, matched, weight: CRITERION_WEIGHTS.budget };
}

export function evaluatePropertyType(
  buyerType: BuyerPropertyType,
  unitType: PropertyUnit["type"]
): MatchCriterionResult {
  const compatible = PROPERTY_TYPE_MAP[buyerType];
  const available = !!compatible;
  const matched = available ? compatible!.includes(unitType) : false;
  return { key: "propertyType", available, matched, weight: CRITERION_WEIGHTS.propertyType };
}

export function evaluateBedrooms(
  buyerBedrooms: string | undefined,
  unitRooms: string
): MatchCriterionResult {
  const buyerVal = parseNumeric(buyerBedrooms);
  const unitVal = parseNumeric(unitRooms);
  const available = buyerVal !== null && unitVal !== null;
  if (!available) {
    return { key: "bedrooms", available: false, matched: false, weight: CRITERION_WEIGHTS.bedrooms };
  }
  const matched = Math.abs(buyerVal! - unitVal!) <= 1;
  return { key: "bedrooms", available: true, matched, weight: CRITERION_WEIGHTS.bedrooms };
}

export function evaluatePurpose(
  purpose: BuyerPurpose,
  unitType: PropertyUnit["type"]
): MatchCriterionResult {
  const compatible = PURPOSE_TYPE_MAP[purpose];
  const available = !!compatible;
  const matched = available ? compatible!.includes(unitType) : false;
  return { key: "purpose", available, matched, weight: CRITERION_WEIGHTS.purpose };
}

/**
 * Delivery timeline, down payment, and monthly payment cannot currently be
 * evaluated because `PropertyUnit` does not store this data (only the
 * buyer side collects it). These criteria are always reported as
 * unavailable rather than guessed, so the UI can honestly display
 * "Contact Lavida for details" for these fields.
 */
function unavailableCriterion(key: MatchCriterionResult["key"]): MatchCriterionResult {
  return { key, available: false, matched: false, weight: CRITERION_WEIGHTS[key] };
}

/** Computes a single unit's match result against a buyer requirement. */
export function evaluateUnit(requirement: BuyerRequirement, unit: PropertyUnit): PropertyMatch {
  const criteria: MatchCriterionResult[] = [
    evaluateLocation(requirement.locations, unit.address),
    evaluateBudget(requirement.budgetMin, requirement.budgetMax, unit.totalPrice),
    evaluatePropertyType(requirement.propertyType, unit.type),
    evaluateBedrooms(requirement.bedrooms, unit.rooms),
    evaluatePurpose(requirement.purpose, unit.type),
    unavailableCriterion("delivery"),
    unavailableCriterion("downPayment"),
    unavailableCriterion("monthlyPayment"),
  ];

  const availableWeight = criteria.filter((c) => c.available).reduce((sum, c) => sum + c.weight, 0);
  const matchedWeight = criteria.filter((c) => c.available && c.matched).reduce((sum, c) => sum + c.weight, 0);

  const score = availableWeight > 0 ? Math.round((matchedWeight / availableWeight) * 100) : 0;

  return { unit, score, criteria };
}

export interface MatchOptions {
  /** Only include units with status "متاح" (available). Defaults to true. */
  availableOnly?: boolean;
  /** Maximum number of results to return. Defaults to 12. */
  limit?: number;
}

/**
 * Matches a buyer requirement against a list of property units and returns
 * results sorted by descending compatibility score. Units for which no
 * criteria could be evaluated at all are excluded, since no meaningful
 * comparison exists for them.
 */
export function matchProperties(
  requirement: BuyerRequirement,
  units: PropertyUnit[],
  options: MatchOptions = {}
): PropertyMatch[] {
  const { availableOnly = true, limit = 12 } = options;

  const pool = availableOnly ? units.filter((u) => u.status === "متاح") : units;

  return pool
    .map((unit) => evaluateUnit(requirement, unit))
    .filter((m) => m.criteria.some((c) => c.available))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
