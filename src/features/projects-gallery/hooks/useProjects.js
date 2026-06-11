import { useEffect, useState, useCallback, useRef } from 'react';
import { getProjects } from '../services/projectService';
import { PROJECTS_PER_PAGE } from '../utils/galleryUtils';

/** Polling interval in milliseconds (30 seconds) */
const POLL_INTERVAL_MS = 30_000;

/**
 * Hook that fetches projects, manages pagination state,
 * and keeps data fresh via polling + visibility-change refresh.
 *
 * Returns { site, projects, page, totalPages, loading, error, goToPage }.
 */
export default function useProjects() {
  const [allProjects, setAllProjects] = useState([]);
  const [site, setSite] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /** Track whether the initial load has completed */
  const initialLoadDone = useRef(false);

  // ── Initial load ──
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getProjects();
        if (!cancelled) {
          setSite(data.site);
          setAllProjects(data.projects ?? []);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e.message || 'Error loading projects');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          initialLoadDone.current = true;
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Silent refresh: re-fetch data without showing a loading spinner.
   * Errors are swallowed so the UI keeps showing stale data.
   */
  const silentRefresh = useCallback(async () => {
    if (!initialLoadDone.current) return;
    try {
      const data = await getProjects();
      setSite(data.site);
      setAllProjects(data.projects ?? []);
    } catch {
      // Silent – keep showing existing data
    }
  }, []);

  // ── Polling: re-fetch every POLL_INTERVAL_MS ──
  useEffect(() => {
    const id = setInterval(silentRefresh, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [silentRefresh]);

  // ── Visibility change: refresh when user returns to tab ──
  useEffect(() => {
    function handleVisibility() {
      if (document.visibilityState === 'visible') {
        silentRefresh();
      }
    }

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [silentRefresh]);

  const totalPages = Math.ceil(allProjects.length / PROJECTS_PER_PAGE);
  const start = (page - 1) * PROJECTS_PER_PAGE;
  const projects = allProjects.slice(start, start + PROJECTS_PER_PAGE);

  const goToPage = useCallback(
    (p) => {
      if (p >= 1 && p <= totalPages) {
        setPage(p);
      }
    },
    [totalPages],
  );

  return { site, projects, page, totalPages, loading, error, goToPage };
}
