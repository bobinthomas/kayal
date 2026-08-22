"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { popup } from "@/data/popup";
import { prefersReducedMotion } from "@/lib/motion";

const SEEN_KEY = "kayal-popup-seen";
const CURTAIN_SEEN_KEY = "kayal-curtain-seen";

/**
 * Homepage announcement modal — image and/or text, admin-editable via
 * content/popup.json (see /admin, "Homepage popup" tab). Shows once per
 * browser session, timed to appear after LoadCurtain's intro animation
 * rather than stacking on top of it.
 */
export default function PromoPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!popup.enabled || (!popup.image && !popup.text)) return;
    if (sessionStorage.getItem(SEEN_KEY)) return;

    const curtainPending = !sessionStorage.getItem(CURTAIN_SEEN_KEY) && !prefersReducedMotion();
    const timer = setTimeout(() => setOpen(true), curtainPending ? 2200 : 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    sessionStorage.setItem(SEEN_KEY, "1");
    document.body.classList.add("overflow-hidden");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("overflow-hidden");
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!open) return null;

  const { image, text, linkUrl } = popup;
  const isExternal = linkUrl?.startsWith("http");

  const body = (
    <>
      {image && (
        <div className="w-full overflow-hidden rounded-t-3xl bg-hf-bg">
          {/* eslint-disable-next-line @next/next/no-img-element -- intrinsic
              size, unknown ahead of time (admin-uploaded); must never crop */}
          <img
            src={image}
            alt={text || "Kayal Foods promotion"}
            className="block w-full object-contain"
          />
        </div>
      )}
      {text && (
        <p className="px-6 py-5 text-center font-hf-body text-base leading-relaxed text-hf-ink">
          {text}
        </p>
      )}
    </>
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Announcement"
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4 py-8 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative flex w-full max-w-[504px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
        style={{ maxHeight: "calc(100vh - 4rem)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={() => setOpen(false)}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="overflow-y-auto">
          {linkUrl ? (
            isExternal ? (
              <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="block">
                {body}
              </a>
            ) : (
              <Link href={linkUrl} className="block">
                {body}
              </Link>
            )
          ) : (
            body
          )}
        </div>
      </div>
    </div>
  );
}
