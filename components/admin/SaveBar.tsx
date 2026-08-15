"use client";

const ERROR_MESSAGES: Record<string, string> = {
  validation: "Some fields aren't valid — check the highlighted errors below.",
  cross_reference: "This references something that doesn't exist in the menu.",
  github_auth: "The GitHub token is invalid or expired — content can't be saved right now.",
  github_error: "GitHub couldn't be reached — try again in a moment.",
  network_error: "Couldn't reach the server — check your connection and try again.",
  save_failed: "Save failed for an unknown reason — try again.",
};

export default function SaveBar({
  dirty,
  saving,
  error,
  conflict,
  onSave,
  onReload,
}: {
  dirty: boolean;
  saving: boolean;
  error: string | null;
  conflict: boolean;
  onSave: () => void;
  onReload: () => void;
}) {
  return (
    <div className="sticky top-0 z-10 flex flex-col gap-2 border-b border-neutral-200 bg-white/95 px-4 py-3 backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-neutral-500">
          {dirty ? "Unsaved changes." : "No changes."} Saving publishes live (~1–2 min rebuild).
        </p>
        <button
          type="button"
          onClick={onSave}
          disabled={!dirty || saving}
          className="min-h-10 rounded-full bg-emerald-800 px-6 text-sm font-semibold text-white disabled:opacity-40"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
      {conflict && (
        <div className="flex items-center justify-between gap-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
          <span>This changed elsewhere since you loaded it. Reload to see the latest before saving again.</span>
          <button type="button" onClick={onReload} className="font-semibold underline">
            Reload latest
          </button>
        </div>
      )}
      {error && !conflict && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
          {ERROR_MESSAGES[error] ?? error}
        </div>
      )}
    </div>
  );
}
