import { SellPropertySubmission } from "../types";
import { storeBlob, removeBlob, compressImage } from "./mediaDB";

/**
 * Isolated data-access layer for "Sell Your Property" owner submissions.
 *
 * This currently persists structured lead data to localStorage and property
 * photos to IndexedDB (no backend/CRM exists yet in this project). All
 * functions are async on purpose: when a real backend/CRM is introduced,
 * only the internals of these functions need to change (e.g. replace the
 * localStorage/IndexedDB calls with `fetch(...)` calls to an API) — no
 * calling component needs to be modified.
 *
 * No secrets or API keys are stored or referenced here.
 */

const STORAGE_KEY = "lavida_sell_property_leads";

function readAll(): SellPropertySubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SellPropertySubmission[]) : [];
  } catch (e) {
    console.error("Failed to parse sell-property leads from storage", e);
    return [];
  }
}

function writeAll(items: SellPropertySubmission[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

/**
 * Uploads a single property photo. Compresses the image and stores the
 * blob in IndexedDB (to avoid localStorage's ~5MB limit), returning a
 * stable reference key ("idb:<key>") to store on the lead record.
 *
 * Isolated on purpose: swapping this for a real cloud storage upload
 * (e.g. S3 / Azure Blob Storage) later only requires changing this
 * function's implementation.
 */
export async function uploadPropertyPhoto(file: File): Promise<string> {
  const base64 = await compressImage(file);
  const res = await fetch(base64);
  const blob = await res.blob();
  const key = await storeBlob(blob);
  return "idb:" + key;
}

/**
 * Uploads a property media file (image or video) as-is, without any
 * compression or size restriction, and stores the blob in IndexedDB.
 * Returns a stable reference key ("idb:<key>") to store on the lead record.
 */
export async function uploadPropertyMedia(file: File): Promise<string> {
  const key = await storeBlob(file);
  return "idb:" + key;
}

/** Removes a previously uploaded property photo from storage. */
export async function removePropertyPhoto(refKey: string): Promise<void> {
  if (refKey.startsWith("idb:")) {
    await removeBlob(refKey.slice(4)).catch(() => {});
  }
}

/** Persist a new "Sell Your Property" submission and return the stored record. */
export async function saveSellPropertySubmission(
  data: Omit<SellPropertySubmission, "id" | "date" | "status">
): Promise<SellPropertySubmission> {
  const submission: SellPropertySubmission = {
    ...data,
    id: "sell_" + Math.random().toString(36).substring(2, 9),
    date: new Date().toISOString(),
    status: "new",
  };

  const existing = readAll();
  writeAll([submission, ...existing]);

  return submission;
}

/** Retrieve all stored "Sell Your Property" submissions, newest first. */
export async function getSellPropertySubmissions(): Promise<SellPropertySubmission[]> {
  return readAll();
}

/** Update the workflow status of a specific submission. */
export async function updateSellPropertySubmissionStatus(
  id: string,
  status: SellPropertySubmission["status"]
): Promise<void> {
  const existing = readAll();
  writeAll(existing.map((r) => (r.id === id ? { ...r, status } : r)));
}

/** Permanently remove a submission record (and any associated photos). */
export async function deleteSellPropertySubmission(id: string): Promise<void> {
  const existing = readAll();
  const target = existing.find((r) => r.id === id);
  if (target) {
    await Promise.all(target.images.map((img) => removePropertyPhoto(img)));
  }
  writeAll(existing.filter((r) => r.id !== id));
}
