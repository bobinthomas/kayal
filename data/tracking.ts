/**
 * Third-party tracking/verification tags, editable at /admin without a
 * code change. Empty fields render nothing — see components/TrackingScripts.tsx
 * for where each id actually gets turned into a script/meta tag.
 */
import trackingJson from "@/content/tracking.json";
import type { TrackingFile } from "@/lib/content/schemas";

export const tracking: TrackingFile = trackingJson;
