export const GA4_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA4_ID ?? "G-D7RMTTMQBE";

export const CLARITY_PROJECT_ID =
  process.env.NEXT_PUBLIC_CLARITY_ID ?? "x8gaxlw8c3";

export function isAnalyticsEnabled(): boolean {
  if (process.env.NEXT_PUBLIC_DISABLE_ANALYTICS === "true") return false;
  return process.env.NODE_ENV === "production";
}
