/**
 * Gallery utility functions.
 * Sorting, pagination, and image filtering helpers.
 */

/** Maximum number of projects shown per page */
export const PROJECTS_PER_PAGE = 6;

/** Maximum number of images shown per phase */
export const IMAGES_PER_PHASE = 6;

/** Default phase when opening a project modal */
export const DEFAULT_PHASE = 'before';

/** Ordered list of phase keys */
export const PHASE_ORDER = ['before', 'during', 'after'];

/**
 * Returns images for a phase sorted by `order`, capped at IMAGES_PER_PHASE.
 */
export function getPhaseImages(project, phaseKey) {
  const phase = project?.phases?.[phaseKey];
  if (!phase || !Array.isArray(phase.images)) {
    return [];
  }
  return [...phase.images]
    .sort((a, b) => a.order - b.order)
    .slice(0, IMAGES_PER_PHASE);
}

/**
 * Paginate an array.
 * @param {Array} items
 * @param {number} page - 1-indexed
 * @param {number} pageSize
 * @returns {{ data: Array, total: number, totalPages: number, page: number }}
 */
export function paginate(items, page = 1, pageSize = PROJECTS_PER_PAGE) {
  const total = items.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const data = items.slice(start, start + pageSize);
  return { data, total, totalPages, page };
}
