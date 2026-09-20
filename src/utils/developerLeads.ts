import { DeveloperLead } from "../types";
import { storeBlob, removeBlob } from "./mediaDB";

/**
 * Isolated data-access layer for Developer Partnership leads.
 *
 * This currently persists structured lead data to localStorage and any
 * uploaded brochure file to IndexedDB (no backend/CRM exists yet in this
 * project). All functions are async on purpose: when a real backend/CRM
 * is introduced, only the internals of these functions need to change
 * (e.g. replace localStorage/IndexedDB calls with `fetch(...)` calls to
 * an API) — no calling component needs to be modified.
 *
 * No secrets or API keys are stored or referenced here.
 */

const STORAGE_KEY = "lavida_developer_leads";

function readAll(): DeveloperLead[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DeveloperLead[]) : [];
  } catch (e) {
    console.error("Failed to parse developer leads from storage", e);
    return [];
  }
}

function writeAll(items: DeveloperLead[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

/**
 * Uploads a project brochure file (e.g. PDF) and returns a stable
 * reference key ("idb:<key>") to store on the lead record.
 *
 * Isolated on purpose: swapping this for real cloud storage
 * (e.g. S3 / Azure Blob Storage) later only requires changing this
 * function's implementation.
 */
export async function uploadBrochureFile(file: File): Promise<string> {
  const key = await storeBlob(file);
  return "idb:" + key;
}

/** Removes a previously uploaded brochure file from storage. */
export async function removeBrochureFile(refKey: string): Promise<void> {
  if (refKey.startsWith("idb:")) {
    await removeBlob(refKey.slice(4)).catch(() => {});
  }
}

/**
 * Uploads the developer/company logo image and returns a stable
 * reference key ("idb:<key>") to store on the lead record. The logo
 * is required so approved developers can be displayed publicly on
 * the "Our Partners" section of the website.
 */
export async function uploadCompanyLogo(file: File): Promise<string> {
  const key = await storeBlob(file);
  return "idb:" + key;
}

/** Removes a previously uploaded company logo from storage. */
export async function removeCompanyLogo(refKey: string): Promise<void> {
  if (refKey.startsWith("idb:")) {
    await removeBlob(refKey.slice(4)).catch(() => {});
  }
}

/** Persist a new developer partnership lead and return the stored record. */
export async function saveDeveloperLead(
  data: Omit<DeveloperLead, "id" | "date" | "status">
): Promise<DeveloperLead> {
  const lead: DeveloperLead = {
    ...data,
    id: "dev_" + Math.random().toString(36).substring(2, 9),
    date: new Date().toISOString(),
    status: "new",
  };

  const existing = readAll();
  writeAll([lead, ...existing]);

  return lead;
}

/** Retrieve all stored developer leads, newest first. */
export async function getDeveloperLeads(): Promise<DeveloperLead[]> {
  return readAll();
}

/** Update the workflow status of a specific developer lead. */
export async function updateDeveloperLeadStatus(
  id: string,
  status: DeveloperLead["status"]
): Promise<void> {
  const existing = readAll();
  writeAll(existing.map((r) => (r.id === id ? { ...r, status } : r)));
}

/** Permanently remove a developer lead record (and any associated brochure). */
export async function deleteDeveloperLead(id: string): Promise<void> {
  const existing = readAll();
  const target = existing.find((r) => r.id === id);
  if (target?.brochureRef) {
    await removeBrochureFile(target.brochureRef);
  }
  writeAll(existing.filter((r) => r.id !== id));
}
