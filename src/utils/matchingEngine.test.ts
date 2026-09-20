import { describe, it, expect } from "vitest";
import {
  parseNumeric,
  evaluateLocation,
  evaluateBudget,
  evaluatePropertyType,
  evaluateBedrooms,
  evaluatePurpose,
  evaluateUnit,
  matchProperties,
} from "./matchingEngine";
import { BuyerRequirement, PropertyUnit } from "../types";

function makeUnit(overrides: Partial<PropertyUnit> = {}): PropertyUnit {
  return {
    id: "unit_1",
    name: "Test Unit",
    type: "سكني",
    projectName: "Test Project",
    developerName: "Test Developer",
    address: "New Cairo & New Administrative Capital",
    area: "150",
    floor: "3",
    totalPrice: "4,500,000",
    pricePerMeter: "30,000",
    rooms: "3",
    bathrooms: "2",
    finishing: "تشطيب كامل",
    status: "متاح",
    images: [],
    videoUrl: "",
    notes: "",
    addedDate: new Date().toISOString(),
    ...overrides,
  };
}

function makeRequirement(overrides: Partial<BuyerRequirement> = {}): BuyerRequirement {
  return {
    id: "req_1",
    date: new Date().toISOString(),
    status: "new",
    purpose: "residential",
    propertyType: "apartment",
    locations: ["New Cairo & New Administrative Capital"],
    budgetMin: "4000000",
    budgetMax: "5000000",
    downPayment: "1000000",
    monthlyPayment: "30000",
    delivery: "ready",
    bedrooms: "3",
    bathrooms: "2",
    area: "150",
    furnishing: "no_preference",
    fullName: "Test Buyer",
    phone: "01012345678",
    email: "test@example.com",
    contactMethod: "phone",
    ...overrides,
  };
}

describe("parseNumeric", () => {
  it("extracts numeric value from formatted currency strings", () => {
    expect(parseNumeric("4,500,000")).toBe(4500000);
    expect(parseNumeric("EGP 4,500,000")).toBe(4500000);
  });

  it("returns null for empty or non-numeric input", () => {
    expect(parseNumeric("")).toBeNull();
    expect(parseNumeric(undefined)).toBeNull();
    expect(parseNumeric(null)).toBeNull();
    expect(parseNumeric("N/A")).toBeNull();
  });
});

describe("evaluateLocation", () => {
  it("matches when buyer location tokens overlap with unit address", () => {
    const result = evaluateLocation(["New Cairo & New Administrative Capital"], "New Cairo, Egypt");
    expect(result.available).toBe(true);
    expect(result.matched).toBe(true);
  });

  it("does not match unrelated locations", () => {
    const result = evaluateLocation(["Ras El Hekma"], "New Cairo, Egypt");
    expect(result.available).toBe(true);
    expect(result.matched).toBe(false);
  });

  it("is unavailable when buyer selected no locations", () => {
    const result = evaluateLocation([], "New Cairo, Egypt");
    expect(result.available).toBe(false);
  });

  it("is unavailable when unit has no address", () => {
    const result = evaluateLocation(["New Cairo"], "");
    expect(result.available).toBe(false);
  });
});

describe("evaluateBudget", () => {
  it("matches when unit price falls within buyer's budget range", () => {
    const result = evaluateBudget("4000000", "5000000", "4,500,000");
    expect(result.available).toBe(true);
    expect(result.matched).toBe(true);
  });

  it("does not match when unit price is outside the range", () => {
    const result = evaluateBudget("1000000", "2000000", "4,500,000");
    expect(result.available).toBe(true);
    expect(result.matched).toBe(false);
  });

  it("is unavailable when price data cannot be parsed", () => {
    const result = evaluateBudget("1000000", "2000000", "Contact for price");
    expect(result.available).toBe(false);
  });
});

describe("evaluatePropertyType", () => {
  it("matches compatible types", () => {
    expect(evaluatePropertyType("apartment", "سكني").matched).toBe(true);
    expect(evaluatePropertyType("office", "إداري").matched).toBe(true);
    expect(evaluatePropertyType("medical", "طبي").matched).toBe(true);
  });

  it("does not match incompatible types", () => {
    expect(evaluatePropertyType("apartment", "تجاري").matched).toBe(false);
  });

  it("is unavailable for 'other' since it cannot be reliably mapped", () => {
    const result = evaluatePropertyType("other", "سكني");
    expect(result.available).toBe(false);
  });
});

describe("evaluateBedrooms", () => {
  it("matches exact bedroom counts", () => {
    expect(evaluateBedrooms("3", "3").matched).toBe(true);
  });

  it("matches within a tolerance of 1", () => {
    expect(evaluateBedrooms("3", "4").matched).toBe(true);
    expect(evaluateBedrooms("3", "2").matched).toBe(true);
  });

  it("does not match when the difference is too large", () => {
    expect(evaluateBedrooms("2", "5").matched).toBe(false);
  });

  it("is unavailable when buyer bedrooms is undefined (non-residential type)", () => {
    const result = evaluateBedrooms(undefined, "3");
    expect(result.available).toBe(false);
  });
});

describe("evaluatePurpose", () => {
  it("matches residential purpose to residential units", () => {
    expect(evaluatePurpose("residential", "سكني").matched).toBe(true);
  });

  it("matches coastal purpose to coastal/hotel units", () => {
    expect(evaluatePurpose("coastal", "ساحلي").matched).toBe(true);
    expect(evaluatePurpose("coastal", "فندقي").matched).toBe(true);
  });

  it("matches commercial, administrative and medical purposes", () => {
    expect(evaluatePurpose("commercial", "تجاري").matched).toBe(true);
    expect(evaluatePurpose("administrative", "إداري").matched).toBe(true);
    expect(evaluatePurpose("medical", "طبي").matched).toBe(true);
  });
});

describe("evaluateUnit", () => {
  it("computes a high score for a well-matching unit", () => {
    const requirement = makeRequirement();
    const unit = makeUnit();
    const result = evaluateUnit(requirement, unit);
    expect(result.score).toBeGreaterThan(50);
  });

  it("computes a low score for a poorly-matching unit", () => {
    const requirement = makeRequirement({
      locations: ["Ras El Hekma"],
      budgetMin: "1000000",
      budgetMax: "1500000",
      propertyType: "retail",
      bedrooms: undefined,
    });
    const unit = makeUnit();
    const result = evaluateUnit(requirement, unit);
    expect(result.score).toBeLessThan(50);
  });

  it("never invents unavailable criteria (delivery/downPayment/monthlyPayment always unavailable)", () => {
    const requirement = makeRequirement();
    const unit = makeUnit();
    const result = evaluateUnit(requirement, unit);
    const unavailableKeys = ["delivery", "downPayment", "monthlyPayment"];
    for (const c of result.criteria) {
      if (unavailableKeys.includes(c.key)) {
        expect(c.available).toBe(false);
      }
    }
  });
});

describe("matchProperties", () => {
  it("sorts results by descending score", () => {
    const requirement = makeRequirement();
    const goodUnit = makeUnit({ id: "good" });
    const badUnit = makeUnit({
      id: "bad",
      address: "Ras El Hekma",
      totalPrice: "20,000,000",
      type: "تجاري",
      rooms: "10",
    });
    const results = matchProperties(requirement, [badUnit, goodUnit]);
    expect(results[0].unit.id).toBe("good");
  });

  it("excludes non-available units by default", () => {
    const requirement = makeRequirement();
    const soldUnit = makeUnit({ id: "sold", status: "مباع" });
    const results = matchProperties(requirement, [soldUnit]);
    expect(results.length).toBe(0);
  });

  it("respects the limit option", () => {
    const requirement = makeRequirement();
    const units = Array.from({ length: 20 }, (_, i) => makeUnit({ id: `unit_${i}` }));
    const results = matchProperties(requirement, units, { limit: 5 });
    expect(results.length).toBe(5);
  });

  it("returns an empty array when no units are provided", () => {
    const requirement = makeRequirement();
    expect(matchProperties(requirement, [])).toEqual([]);
  });
});
