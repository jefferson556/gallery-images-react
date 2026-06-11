import { useRef, useState } from 'react';
import useProjects from '../features/projects-gallery/hooks/useProjects';
import ProjectGrid from '../features/projects-gallery/components/ProjectGrid';
import GalleryModal from '../features/projects-gallery/components/GalleryModal';

/**
 * ProjectsPage is a page-level component that fetches construction projects
 * from the service layer, renders a responsive grid, and handles viewing
 * project details in a modal overlay.
 */
export default function ProjectsPage() {
  const { site, projects, page, totalPages, loading, error, goToPage } = useProjects();
  const [selectedProject, setSelectedProject] = useState(null);
  
  // Ref map to store trigger buttons for keyboard focus return
  const triggerRefs = useRef({});

  const handleViewProject = (project) => {
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  return (
    <main className="sec">
      {/* Dynamic SEO/Header metadata from JSON */}
      <header className="gallery-header">
        <span className="sec-label">
          {site?.label || ''}
        </span>
        <h1 className="sec-title">
          {site?.title ? (
            <>
              {site.title.split(' ').slice(0, -1).join(' ')}{' '}
              <span>{site.title.split(' ').slice(-1)}</span>
            </>
          ) : (
            <>
              Project <span>Gallery</span>
            </>
          )}
        </h1>
        <p className="sec-desc">
          {site?.subtitle || 'Explore some of our projects and construction processes.'}
        </p>
      </header>

      {/* Loading State */}
      {loading && (
        <div className="gallery-loading" aria-live="polite">
          <div className="spinner" />
          <p className="gallery-loading-text">Loading projects...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="gallery-error" role="alert">
          <h2 className="gallery-error-title">Unable to load projects</h2>
          <p className="gallery-error-msg">{error}</p>
          <button
            type="button"
            className="gallery-retry-btn"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}

      {/* Main projects grid */}
      {!loading && !error && projects.length > 0 && (
        <ProjectGrid
          projects={projects}
          page={page}
          totalPages={totalPages}
          onViewProject={handleViewProject}
          onPageChange={goToPage}
          triggerRefs={triggerRefs}
        />
      )}

      {/* Empty State */}
      {!loading && !error && projects.length === 0 && (
        <div className="gallery-empty">
          <h2 className="gallery-empty-title">No projects found</h2>
          <p className="gallery-empty-msg">Please check back later.</p>
        </div>
      )}

      {/* Detail Gallery Modal */}
      {selectedProject && (
        <GalleryModal
          project={selectedProject}
          onClose={handleCloseModal}
        />
      )}
    </main>
  );
}
