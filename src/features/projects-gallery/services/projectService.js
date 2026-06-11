/**
 * Service layer for fetching projects.
 *
 * Currently reads from a static JSON file at /data/projects.json.
 * The architecture is designed so this can be swapped to a real API
 * endpoint without modifying any component or hook.
 *
 * React component → custom Hook → this service → API endpoint
 */

const API_URL = '/assets/data/projects-info.json';

/**
 * Fetch all projects from the data source.
 * @returns {Promise<{ site: object, projects: Array }>}
 */
export async function getProjects() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Failed to fetch projects: ${response.status} ${text}`);
  }

  const data = await response.json();
  return data;
}
