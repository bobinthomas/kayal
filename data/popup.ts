/**
 * Homepage announcement popup — image and/or text, optionally linked.
 * Content lives in content/popup.json — edit via /admin ("Homepage popup"
 * tab) or the file directly.
 */
import popupJson from "@/content/popup.json";
import type { PopupFile } from "@/lib/content/schemas";

export const popup: PopupFile = popupJson as PopupFile;
