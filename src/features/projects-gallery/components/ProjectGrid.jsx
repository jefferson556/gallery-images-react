import ProjectCard from './ProjectCard';
import './ProjectGrid.css';

/**
 * Responsive grid that shows up to 6 project cards per page.
 * Layout:
 *   Desktop: 3 columns
 *   Tablet:  2 columns
 *   Mobile:  1 column
 *
 * Pagination controls are rendered when totalPages > 1.
 * The triggerRef map is used to return focus after modal closes.
 */
export default function ProjectGrid({
  projects,
  page,
  totalPages,
  onViewProject,
  onPageChange,
  triggerRefs,
}) {
  return (
    <div>
      <div className="project-grid">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onView={onViewProject}
            viewButtonRef={(el) => {
              if (triggerRefs.current) {
                triggerRefs.current[project.id] = el;
              }
            }}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <nav className="pagination" aria-label="Project pages">
          <button
            type="button"
            className="pagination-btn"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            aria-label="Previous page"
          >
            ‹ Prev
          </button>
          <span className="pagination-info" aria-live="polite">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            className="pagination-btn"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            aria-label="Next page"
          >
            Next ›
          </button>
        </nav>
      )}
    </div>
  );
}
