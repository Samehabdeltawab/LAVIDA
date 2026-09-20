import { BuyerRequirement } from "../types";

/**
 * Isolated data-access layer for Buyer Property Matching requirements.
 *
 * This currently persists to localStorage (no backend exists yet in this
 * project). All functions are async on purpose: when a real backend/API is
 * introduced, only the internals of these functions need to change (e.g.
 * replace localStorage calls with `fetch(...)` calls to an endpoint) — no
 * calling component needs to be modified.
 *
 * No secrets or API keys are stored or referenced here.
 */

const STORAGE_KEY = "lavida_buyer_requirements";

function readAll(): BuyerRequirement[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BuyerRequirement[]) : [];
  } catch (e) {
    console.error("Failed to parse buyer requirements from storage", e);
    return [];
  }
}

function writeAll(items: BuyerRequirement[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

/** Persist a new buyer requirement submission and return the stored record. */
export async function saveBuyerRequirement(
  data: Omit<BuyerRequirement, "id" | "date" | "status">
): Promise<BuyerRequirement> {
  const requirement: BuyerRequirement = {
    ...data,
    id: "req_" + Math.random().toString(36).substring(2, 9),
    date: new Date().toISOString(),
    status: "new",
  };

  const existing = readAll();
  writeAll([requirement, ...existing]);

  return requirement;
}

/** Retrieve all stored buyer requirements, newest first. */
export async function getBuyerRequirements(): Promise<BuyerRequirement[]> {
  return readAll();
}

/** Update the workflow status of a specific buyer requirement. */
export async function updateBuyerRequirementStatus(
  id: string,
  status: BuyerRequirement["status"]
): Promise<void> {
  const existing = readAll();
  writeAll(existing.map((r) => (r.id === id ? { ...r, status } : r)));
}

/** Permanently remove a buyer requirement record. */
export async function deleteBuyerRequirement(id: string): Promise<void> {
  const existing = readAll();
  writeAll(existing.filter((r) => r.id !== id));
}
