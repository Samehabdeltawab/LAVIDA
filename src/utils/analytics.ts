/**
 * Analytics-agnostic conversion tracking utility.
 *
 * This module defines a single, isolated place to record conversion events
 * across the site (buyer intake, seller leads, developer partnerships,
 * contact, WhatsApp clicks, property views).
 *
 * It intentionally contains NO real analytics provider IDs or credentials.
 * Each event is pushed to `window.dataLayer` (the standard GTM/GA4 data
 * layer array) if it exists, and always logged via `console.debug` in
 * development so the event stream can be verified without any external
 * service configured.
 *
 * When a real analytics provider (GA4, Meta Pixel, etc.) is ready to be
 * wired up, only this file needs to be updated — no component changes
 * are required.
 */

export type AnalyticsEventName =
  | "buyer_form_started"
  | "buyer_form_completed"
  | "seller_form_started"
  | "seller_form_completed"
  | "developer_form_started"
  | "developer_form_completed"
  | "contact_form_submitted"
  | "whatsapp_clicked"
  | "property_viewed";

export interface AnalyticsEventPayload {
  [key: string]: string | number | boolean | undefined;
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

/**
 * Records a conversion/analytics event.
 * Safe no-op if no analytics provider is present — never throws.
 */
export function trackEvent(name: AnalyticsEventName, payload: AnalyticsEventPayload = {}): void {
  try {
    const event = {
      event: name,
      timestamp: new Date().toISOString(),
      ...payload,
    };

    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(event);
    }

    if (typeof console !== "undefined" && typeof console.debug === "function") {
      console.debug("[analytics]", event);
    }
  } catch {
    // Never let analytics tracking break the user experience.
  }
}

// Convenience helpers for each conversion point defined in the SEO/CRO plan.
export const trackBuyerFormStarted = (payload?: AnalyticsEventPayload) =>
  trackEvent("buyer_form_started", payload);

export const trackBuyerFormCompleted = (payload?: AnalyticsEventPayload) =>
  trackEvent("buyer_form_completed", payload);

export const trackSellerFormStarted = (payload?: AnalyticsEventPayload) =>
  trackEvent("seller_form_started", payload);

export const trackSellerFormCompleted = (payload?: AnalyticsEventPayload) =>
  trackEvent("seller_form_completed", payload);

export const trackDeveloperFormStarted = (payload?: AnalyticsEventPayload) =>
  trackEvent("developer_form_started", payload);

export const trackDeveloperFormCompleted = (payload?: AnalyticsEventPayload) =>
  trackEvent("developer_form_completed", payload);

export const trackContactFormSubmitted = (payload?: AnalyticsEventPayload) =>
  trackEvent("contact_form_submitted", payload);

export const trackWhatsAppClicked = (payload?: AnalyticsEventPayload) =>
  trackEvent("whatsapp_clicked", payload);

export const trackPropertyViewed = (payload?: AnalyticsEventPayload) =>
  trackEvent("property_viewed", payload);
