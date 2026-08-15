"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchContent, saveContent, AdminUnauthorizedError } from "./adminApi";

export interface UseAdminContentResult<T> {
  data: T | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  dirty: boolean;
  conflict: boolean;
  setData: (data: T) => void;
  reload: () => Promise<void>;
  save: () => Promise<void>;
}

interface LoadedState<T> {
  data: T | null;
  sha: string | null;
  original: string;
}

/**
 * Loads and saves one content/*.json file. Save is explicit (never
 * autosaves) — every save is a real GitHub commit, which triggers a full
 * Cloudflare Pages rebuild, so batching edits into one deliberate Save
 * matters here more than in a typical form.
 */
export function useAdminContent<T>(
  key: string,
  password: string,
  onUnauthorized: () => void,
): UseAdminContentResult<T> {
  const [state, setState] = useState<LoadedState<T>>({ data: null, sha: null, original: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conflict, setConflict] = useState(false);

  const load = useCallback(async (ignore = false) => {
    try {
      const result = await fetchContent<T>(key, password);
      if (ignore) return;
      if (!result.ok) {
        setError(result.error ?? "load_failed");
        return;
      }
      setState({ data: result.data, sha: result.sha, original: JSON.stringify(result.data) });
      setError(null);
      setConflict(false);
    } catch (err) {
      if (ignore) return;
      if (err instanceof AdminUnauthorizedError) {
        onUnauthorized();
        return;
      }
      setError("network_error");
    } finally {
      if (!ignore) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, password]);

  useEffect(() => {
    let ignore = false;
    async function run() {
      await load(ignore);
    }
    run();
    return () => {
      ignore = true;
    };
  }, [load]);

  const setData = useCallback((next: T) => {
    setState((prev) => ({ ...prev, data: next }));
    setConflict(false);
  }, []);

  const save = useCallback(async () => {
    if (state.data === null) return;
    setSaving(true);
    setError(null);
    try {
      const result = await saveContent(key, password, state.data, state.sha);
      if (result.ok) {
        setState((prev) => ({ ...prev, sha: result.sha ?? null, original: JSON.stringify(prev.data) }));
      } else if (result.error === "conflict") {
        setConflict(true);
      } else {
        setError(result.error ?? "save_failed");
      }
    } catch (err) {
      if (err instanceof AdminUnauthorizedError) {
        onUnauthorized();
        return;
      }
      setError("network_error");
    } finally {
      setSaving(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, password, state.data, state.sha]);

  const reload = useCallback(async () => {
    setLoading(true);
    await load();
  }, [load]);

  const dirty = state.data !== null && JSON.stringify(state.data) !== state.original;

  return { data: state.data, loading, saving, error, dirty, conflict, setData, reload, save };
}
